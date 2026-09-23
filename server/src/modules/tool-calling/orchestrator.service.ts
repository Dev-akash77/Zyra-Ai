// src/modules/tool-calling/orchestrator.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HumanMessage } from '@langchain/core/messages';
import { zyraApp } from './orchestrator/orchestrator.graph';

@Injectable()
export class OrchestratorService {
  async executeQuery(userQuery: string, threadId: string = 'session-default') {
    try {
      const config = {
        configurable: { thread_id: threadId },
      };

      // Invoke the LangGraph multi-agent system
      const result = await zyraApp.invoke(
        {
          messages: [new HumanMessage(userQuery)],
        },
        config
      );

      return {
        success: true,
        answer: result.finalResponse,
        plan: result.plan,
        tasks: result.completedTasks,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'Error executing multi-agent workflow'
      );
    }
  }
}