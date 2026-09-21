export interface LlmPort {
  generate(prompt: string): Promise<string>;
}

export const LLM_PORT = Symbol('LLM_PORT');