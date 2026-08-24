import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MyLoggerService } from "../../../../../common/services/logger/logger.service";
import { injection_token } from "../../../../../common/constants/injection/injection.token";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

type GeminiEmbeddingType = {
  model: string;
  api_key: string;
};

export const EMBEDDING_PORT = Symbol('EMBEDDING_PORT');


export const GeminiEmbeddingProvider : Provider = {

    provide: EMBEDDING_PORT,
    inject: [ConfigService, MyLoggerService],
    useFactory: (configService: ConfigService, loggerService: MyLoggerService) => {
        const config = configService.get<GeminiEmbeddingType>('gemini-embedding');

        if(!config){
            loggerService.error('Gemini Embedding config missing', '', 'Gemini Embedding');
            throw new Error('Gemini Embedding config missing');
        }

        const geminiEmbeddingData = new GoogleGenerativeAIEmbeddings({
            model: config.model,
            apiKey: config.api_key,
        }); 

        loggerService.log('Gemini Embedding configured successfully', 'Gemini Embedding');
        return geminiEmbeddingData;
    }
}


