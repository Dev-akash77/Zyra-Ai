import { Provider } from "@nestjs/common";
import { injection_token } from "../constants/injection/injection.token";
import { MyLoggerService } from "../services/logger/logger.service";
import { ConfigService } from "@nestjs/config";
import { GeminiLlmConfigTypes } from "../types/gemini-llm.type";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const GeminiLlmProvider : Provider = {

    provide: injection_token.LLM_TOKEN,
    inject: [ConfigService, MyLoggerService],
    useFactory: (configService: ConfigService, loggerService: MyLoggerService) => {
        const config = configService.get<GeminiLlmConfigTypes>('gemini-llm');

        if(!config){
            loggerService.error('Gemini LLM config missing', '', 'Gemini LLM');
            throw new Error('Gemini LLM config missing');
        }

        const geminiLlmData = new ChatGoogleGenerativeAI({
            model: config.model,
            apiKey: config.api_key,
            temperature: config.temperature,
        }); 

        loggerService.log('Gemini LLM configured successfully', 'Gemini LLM');
        return geminiLlmData;
    }
}