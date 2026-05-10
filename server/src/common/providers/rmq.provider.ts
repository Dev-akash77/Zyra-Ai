import { Provider } from '@nestjs/common';
import { injection_token } from '../constants/injection/injection.token';
import { ConfigService } from '@nestjs/config';
import { MyLoggerService } from '../services/logger/logger.service';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';

export const RmqProvider: Provider = {
  provide: injection_token.RMQ_CONNECTION,
  inject: [ConfigService, MyLoggerService],

  useFactory: async (config: ConfigService, logger: MyLoggerService) => {
    const rmq = config.get('rmq');

    if (!rmq) {
      throw new Error('RMQ config missing');
    }
    logger.log('RabbitMQ config loaded', 'RMQ');

    return (queue: string) => {
      logger.log(`Creating RMQ client for queue: ${queue}`, 'RMQ');

      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [rmq.url],
          queue,
          queueOptions: { durable: true },
        },
      });
    };
  },
};
