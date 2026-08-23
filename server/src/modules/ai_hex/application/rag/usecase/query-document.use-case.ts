import { Inject, Injectable } from '@nestjs/common';
import {
  VECTOR_STORE_TOKEN,
  type VectorStorePort,
} from '../port/vector-store.port';
import { type LlmPort } from '../port/llm.port';
import {
  QueryDocumentCommand,
  QueryDocumentResult,
} from '../contract/query-document.contract';
import { LLM_TOKEN } from '../../../infrastructure/rag/adapter/gemini/gemini-llm.adapter';
import { MyLoggerService } from '../../../../../common/services/logger/logger.service';

@Injectable()
export class QueryDocumentUseCase {
  constructor(
    @Inject(VECTOR_STORE_TOKEN) private readonly vectorStore: VectorStorePort,
    @Inject(LLM_TOKEN) private readonly llm: LlmPort,
    private readonly logger: MyLoggerService
  ) {}

  async execute(command: QueryDocumentCommand): Promise<QueryDocumentResult> {
    try {
      const limit = command.limit ?? 3;

      const sources = await this.vectorStore.search(command.query, limit);
      this.logger.log(`Retrieved ${sources.length} sources from vector store`, 'QueryDocumentUseCase');

      this.logger.log('Generating response using LLM...', 'QueryDocumentUseCase');

      const context = sources
        .map((source) => source.content)
        .join('\n\n---\n\n');

      const prompt = `
                You are a highly professional and technical AI assistant name ZYRA AI. Answer all questions directly, accurately, and without unnecessary conversational filler. Keep it concise.

                Answer the user's question using the provided context.

                Context:
                ${context}

                Question:
                ${command.query}

                Answer directly and concisely. `;

      const answer = await this.llm.generate(prompt);
      this.logger.log('Response generated successfully', 'QueryDocumentUseCase');

      return {
        answer,
        sources,
      };
    } catch (error) {
      this.logger.error('Error executing QueryDocumentUseCase:', 'QueryDocumentUseCase');
      throw error;
    }
  }
}
