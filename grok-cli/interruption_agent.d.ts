/**
 * Analyzes conversation history to detect if the agent is going in circles.
 * Takes an OpenAI-format JSON string of messages (ending with assistant message)
 * and returns analysis of whether the conversation is circular.
 */
export declare function checkForCircularity(conversationJsonString: string): Promise<number>;
