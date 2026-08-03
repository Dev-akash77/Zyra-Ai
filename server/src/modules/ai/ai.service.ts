import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ConfigService } from '@nestjs/config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

@Injectable()
export class AiService {
  private readonly llm: ChatGoogleGenerativeAI;
  private readonly embeddings: GoogleGenerativeAIEmbeddings;
  private pinecone: Pinecone;
  private pineconeIndexName: string;

  constructor(private readonly configService: ConfigService) {
    const googleApikey = this.configService.get<string>('GOOGLE_API_KEY')
    const pineconeApiKey = this.configService.get<string>('PINECONE_API_KEY') || '';
    this.pineconeIndexName = this.configService.get<string>('PINECONE_INDEX_NAME')!;


    this.llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: googleApikey,
      temperature: 0.3,
    });

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'text-embedding-004',
      apiKey: googleApikey,
    });

    this.pinecone = new Pinecone({ apiKey: pineconeApiKey });

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
  async parseAndChunkPdf(fileBuffer: Buffer) {
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


  // ! strore in vector db
  async processAndStorePdf(fileBuffer: Buffer) {
    try {
      const chunk = await this.parseAndChunkPdf(fileBuffer);
      const pineconeIndex = this.pinecone.Index(this.pineconeIndexName);

      await PineconeStore.fromDocuments(chunk, this.embeddings, {
        pineconeIndex,
        maxConcurrency: 5
      });

      return { message: 'PDF successfully processed aur Pinecone DB mein save ho gayi!' };
    } catch (error) {
      console.error('Pinecone Store Error:', error);
      throw new InternalServerErrorException('pinecone store error');
    }
  }

  //!query pdf
  async queryPdf(query: string) {
    try {
      const pineconeIndex = this.pinecone.Index(this.pineconeIndexName);
      const vectorStore = await PineconeStore.fromExistingIndex(this.embeddings, {
        pineconeIndex,
        textKey: 'text',
      });

      const relevantDocs = await vectorStore.similaritySearch(query, 3);
      const context = relevantDocs.map((doc) => doc.pageContent).join('\n\n---\n\n');
      const prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          'You are a highly professional and technical AI assistant name ZYRA AI. Answer all questions directly, accurately, and without unnecessary conversational filler. Keep it concise.',
        ],
        ['human', `Context:
        ${context}\n\nQuestion: {input}`],
      ]);

      const chain = prompt.pipe(this.llm);

      //send context and query to llm
      const answer = await chain.invoke({ input: query ,context: context});
      return answer.content.toString();
   } catch (error) {
      console.error('Query PDF Error:', error);
      throw new InternalServerErrorException('PDF query karne mein error aayi.');
    }
  }
}

