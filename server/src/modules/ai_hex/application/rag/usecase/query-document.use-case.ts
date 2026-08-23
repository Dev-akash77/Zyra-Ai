import { Inject, Injectable } from '@nestjs/common';
import {
  VECTOR_STORE_TOKEN,
  type VectorStorePort,
} from '../port/outbound/vector-store.port';
import { type LlmPort } from '../port/outbound/llm.port';
import {
  QueryDocumentCommand,
  QueryDocumentResult,
} from '../contract/query-document.contract';
import { LLM_TOKEN } from '../../../infrastructure/rag/service/gemini/gemini-llm.adapter';

@Injectable()
export class QueryDocumentUseCase {
  constructor(
    @Inject(VECTOR_STORE_TOKEN) private readonly vectorStore: VectorStorePort,
    @Inject(LLM_TOKEN) private readonly llm: LlmPort,
  ) {}

  async execute(command: QueryDocumentCommand): Promise<QueryDocumentResult> {

    try {
        const limit = command.limit ?? 3;

    const sources = await this.vectorStore.search(command.query, limit);

    const context = sources.map((source) => source.content).join('\n\n---\n\n');

    const prompt = `
                You are a highly professional and technical AI assistant name ZYRA AI. Answer all questions directly, accurately, and without unnecessary conversational filler. Keep it concise.

                Answer the user's question using the provided context.

                Context:
                ${context}

                Question:
                ${command.query}

                Answer directly and concisely. `;

    const answer = await this.llm.generate(prompt);

    return {
      answer,
      sources,
    };
    } catch (error) {
      console.error('Error executing QueryDocumentUseCase:', error);
      throw error;
    }
    
  }
}
