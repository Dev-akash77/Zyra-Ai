import { Inject, Injectable } from '@nestjs/common';
import { injection_token } from '../../constants/injection/injection.token';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class RmqService {
  private clients = new Map<string, any>();

  constructor(
    @Inject(injection_token.RMQ_CONNECTION)
    private readonly clientFactory: (queue: string) => any,
    private readonly logger: MyLoggerService,
  ) {}

  //! GET THE CLIENT QUEUE
  getClient(queue: string) {
    if (!this.clients.has(queue)) {
      this.logger.log(`Initializing RMQ client: ${queue}`, 'RMQ');
      this.clients.set(queue, this.clientFactory(queue));
    }
    return this.clients.get(queue);
  }

  
}
