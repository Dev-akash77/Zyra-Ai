import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ConfigService } from '@nestjs/config';
import { ChatPromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class AiService{
  private readonly llm: ChatGoogleGenerativeAI;

 constructor(private readonly configService: ConfigService){
  this.llm = new ChatGoogleGenerativeAI({
    model:"gemini-2.5-flash",
    apiKey:this.configService.get<string>('GOOGLE_API_KEY'),
    temperature:0.3,
  });
 }


//  ! test templete
async testLLM(question:string):Promise<string>{
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      [
          'system', 
          'You are a highly professional and technical AI assistant name ZYRA AI. Answer all questions directly, accurately, and without unnecessary conversational filler. Keep it concise.'
        ],
        ['human', '{input}']
    ]);

    const chain = prompt.pipe(this.llm);
    
    const answer = await chain.invoke({input:question});

    return answer.content.toString();
    
  } catch (error) {
    console.error('LLM Error:', error);
      throw new InternalServerErrorException('LLM se response fetch karne mein error aayi.');
  }  
}

  
}