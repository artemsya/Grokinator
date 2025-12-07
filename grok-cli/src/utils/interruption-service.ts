import { EventEmitter } from "events";
import { exec } from "child_process";

export interface InterruptionOptions {
  score: number;
  reason: string;
  relevantMessages?: any[];
}

export interface InterruptionResult {
  shouldContinue: boolean;
  skipFuturePrompts?: boolean;
}

export class InterruptionService extends EventEmitter {
  private static instance: InterruptionService;
  private pendingInterruption: Promise<InterruptionResult> | null = null;
  private resolveInterruption: ((result: InterruptionResult) => void) | null = null;
  private skipFutureInterruptions = false;

  static getInstance(): InterruptionService {
    if (!InterruptionService.instance) {
      InterruptionService.instance = new InterruptionService();
    }
    return InterruptionService.instance;
  }

  constructor() {
    super();
  }

  async requestInterruption(options: InterruptionOptions): Promise<InterruptionResult> {
    // Check if user has disabled future interruption prompts
    if (this.skipFutureInterruptions) {
      return { shouldContinue: true, skipFuturePrompts: true };
    }

    // Create a promise that will be resolved by the UI component
    this.pendingInterruption = new Promise<InterruptionResult>((resolve) => {
      this.resolveInterruption = resolve;
    });

    // Emit custom event that the UI can listen to
    setImmediate(() => {
      this.emit("interruption-requested", options);
    });

    // Send interrupt notification to Slack via localhost:5001
    // Map: message -> reason, score -> username
    const curlCommand = `curl -X POST http://localhost:5001/trigger-ping -H "Content-Type: application/json" -d '{"message": ${JSON.stringify(options.reason)}, "score": ${JSON.stringify(options.score.toString())}}'`;

    console.log("[InterruptionService] Executing:", curlCommand);
    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        console.warn("[InterruptionService] Failed to send interrupt notification:", error.message);
        return;
      }
      if (stdout) {
        console.log("[InterruptionService] Slack response:", stdout);
      }
      if (stderr) {
        console.warn("[InterruptionService] Slack stderr:", stderr);
      }
    });

    const result = await this.pendingInterruption;

    if (result.skipFuturePrompts) {
      this.skipFutureInterruptions = true;
    }

    return result;
  }

  respondToInterruption(shouldContinue: boolean, skipFuturePrompts?: boolean): void {
    if (this.resolveInterruption) {
      this.resolveInterruption({ shouldContinue, skipFuturePrompts });
      this.resolveInterruption = null;
      this.pendingInterruption = null;
    }
  }

  isPending(): boolean {
    return this.pendingInterruption !== null;
  }

  resetSession(): void {
    this.skipFutureInterruptions = false;
  }

  getSkipFutureInterruptions(): boolean {
    return this.skipFutureInterruptions;
  }
}
