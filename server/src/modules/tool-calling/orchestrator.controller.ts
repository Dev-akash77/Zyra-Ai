// src/modules/tool-calling/orchestrator.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { ChatRequestDto } from './dto/chat.dto';
import { pineconeLtm } from '../../common/services/ltm/pinecone.service';

@Controller('tool-calling')
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post('chat')
  async chat(@Body() dto: ChatRequestDto) {
    const threadId = dto.threadId || `thread-${Date.now()}`;
    const userId = dto.userId;
    return await this.orchestratorService.executeQuery(dto.message, threadId,userId);
  }

  @Post('memory/learn')
  async learnMemory(@Body() body: { userId?: string; fact: string }) {
  const userId = body.userId || 'user-1';
  await pineconeLtm.saveMemory(userId, body.fact);
  return { success: true, message: `Saved to Pinecone: "${body.fact}"` };
}
}

