import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { QueryPdfDto } from '../dto/query-pdf.dto';
import { IngestDocumentUseCase } from '../../../application/rag/usecase/ingest-document.use-case';
import { QueryDocumentUseCase } from '../../../application/rag/usecase/query-document.use-case';

@Controller('ai/rag')
export class RagController {
  constructor(
    private readonly ingestDocument: IngestDocumentUseCase,
    private readonly queryDocument: QueryDocumentUseCase,
  ) {}

  @Post('pdf/chunk')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf( @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        success: false,
        message: 'PDF file is required.'
      };
    }

    return await this.ingestDocument.execute({
      file: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
    });
    
  }

  @Post('pdf/query')
  @HttpCode(HttpStatus.OK)
  async queryPdf(@Body() dto: QueryPdfDto) {
    
    return await this.queryDocument.execute({
      query: dto.query,
      limit: 3,
    });
  }
}
