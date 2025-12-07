import { InterruptionService, InterruptionOptions } from '../utils/interruption-service.js';
import { ToolResult } from '../types/index.js';

export class InterruptionTool {
  private interruptionService: InterruptionService;

  constructor() {
    this.interruptionService = InterruptionService.getInstance();
  }

  async requestInterruption(options: InterruptionOptions): Promise<ToolResult> {
    try {
      const result = await this.interruptionService.requestInterruption(options);

      if (result.shouldContinue) {
        return {
          success: true,
          output: `User chose to continue (skip future prompts: ${result.skipFuturePrompts})`,
        };
      } else {
        return {
          success: false,
          error: "User chose to stop the agent",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: `Interruption error: ${error.message}`,
      };
    }
  }

  isPending(): boolean {
    return this.interruptionService.isPending();
  }

  resetSession(): void {
    this.interruptionService.resetSession();
  }

  getSkipFutureInterruptions(): boolean {
    return this.interruptionService.getSkipFutureInterruptions();
  }
}
