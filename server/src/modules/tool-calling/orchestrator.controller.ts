// src/modules/tool-calling/orchestrator.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { ChatRequestDto } from './dto/chat.dto';

@Controller('tool-calling')
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post('chat')
  async chat(@Body() dto: ChatRequestDto) {
    const threadId = dto.threadId || `thread-${Date.now()}`;
    return await this.orchestratorService.executeQuery(dto.message, threadId);
  }
}