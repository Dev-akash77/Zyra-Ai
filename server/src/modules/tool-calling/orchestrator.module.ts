// src/modules/tool-calling/orchestrator.module.ts
import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';

@Module({
  controllers: [OrchestratorController],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorModule {}