import { 
  Body, 
  Controller, 
  HttpCode, 
  HttpStatus, 
  Post, 
  UploadedFile, 
  UseInterceptors // Yeh missing tha
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express"; // Yeh bhi missing tha
import { AiService } from './ai.service';
import type { Express } from "express";

@Controller('ai')
export class AiController {

  constructor(
    private readonly aiService: AiService
  ) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  async testLlmEndpoint(@Body('prompt') prompt: string) {
    const answer = await this.aiService.testLLM(prompt);
    return { success: true, data: answer };
  }

  // Yahan se route class ke ANDAR hai
  @Post('pdf/chunk')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdfAndViewChunks(@UploadedFile() file: Express.Multer.File) {
    // Check agar user ne file attach nahi ki
    if (!file) {
      return { success: false, message: 'Koi PDF file upload nahi ki gayi.' };
    }

    const result = await this.aiService.processAndStorePdf(file.buffer);
    return { success: true, ...result };
  }

  @Post('pdf/query')
  @HttpCode(HttpStatus.OK)
  async queryPdf(@Body('query') query: string) {
    const result = await this.aiService.queryPdf(query);
    return { success: true, data: result };
  }
} 

 