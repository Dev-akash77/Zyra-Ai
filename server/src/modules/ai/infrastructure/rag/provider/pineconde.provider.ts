import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MyLoggerService } from "../../../../../common/services/logger/logger.service";
import { Pinecone } from "@pinecone-database/pinecone/dist/pinecone";

type PineconeType = {
  api_key: string;
  index_name: string;
};

export const PINECONE_PORT = Symbol('PINECONE_PORT');


export const PineconeProvider : Provider = {

    provide: PINECONE_PORT,
    inject: [ConfigService, MyLoggerService],
    useFactory: (configService: ConfigService, loggerService: MyLoggerService) => {
        const config = configService.get<PineconeType>('pinecone-database');

        if(!config){
            loggerService.error('Pinecone config missing', '', 'Pinecone');
            throw new Error('Pinecone config missing');
        }

        const pineconeData = new Pinecone({
            apiKey: config.api_key,
        });

        loggerService.log('Pinecone configured successfully', 'Pinecone');
        return {
            pinecone: pineconeData,
            indexName: config.index_name,
        };
    }
}


