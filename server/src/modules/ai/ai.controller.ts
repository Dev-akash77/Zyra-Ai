import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AiService } from './ai.service';

@Controller('ai')
export class AiController{

  constructor(
    private readonly aiService:AiService
  ){}

@Post('test')
  @HttpCode(HttpStatus.OK)
  async testLlmEndpoint(@Body('prompt') prompt: string) {
    const answer = await this.aiService.testLLM(prompt);
    return { success: true, data: answer };
  }
}