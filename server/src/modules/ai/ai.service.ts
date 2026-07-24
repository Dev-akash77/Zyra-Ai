import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ConfigService } from '@nestjs/config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class AiService {
  private readonly llm: ChatGoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    this.llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: this.configService.get<string>('GOOGLE_API_KEY'),
      temperature: 0.3,
    });
  }

  //  ! test templete
  async testLLM(question: string): Promise<string> {
    try {
      const prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          'You are a highly professional and technical AI assistant name ZYRA AI. Answer all questions directly, accurately, and without unnecessary conversational filler. Keep it concise.',
        ],
        ['human', '{input}'],
      ]);

      const chain = prompt.pipe(this.llm);

      const answer = await chain.invoke({ input: question });

      return answer.content.toString();
    } catch (error) {
      console.error('LLM Error:', error);
      throw new InternalServerErrorException(
        'LLM se response fetch karne mein error aayi.',
      );
    }
  }


  // ! upload file
  async parseAndChunkPdf(fileBuffer:Buffer){
    try {
     const blob = new Blob([new Uint8Array(fileBuffer)], { type: 'application/pdf' });  
     
     const loader = new PDFLoader(blob);
      const docs = await loader.load();

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const chunk = await splitter.splitDocuments(docs);

      return chunk;

    } catch (error) {
      console.error('PDF Chunking Error:', error);
      throw new InternalServerErrorException(
        'PDF parse ya chunk karne mein error aayi.');
    }
  }
}
