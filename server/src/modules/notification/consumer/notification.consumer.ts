import { Controller } from '@nestjs/common';
import { NotificationService } from './../notification.service';
import { MyLoggerService } from '../../../common/services/logger/logger.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EVENTS } from '../../../common/constants/queue/event.constant';

@Controller()
export class MailConsumer {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: MyLoggerService,
  ) {}

  //   ! SENDING EMAIL AFTER REGISTRATION
  @EventPattern(EVENTS.AUTH_USER_REGISTERED)
  async handleUserRegister(
    @Payload() data: { name: String; email: string },
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef();
    const message = ctx.getMessage();

    try {
      const info = await this.notificationService.sendWelcomeEmail(
        data.name as string,
        data.email as string,
      );
      this.logger.log(
        `Welcome email sent to ${data.email} | MessageId: ${info.messageId}`,
        'MailConsumer',
      );

      //! ACK message after success
      channel.ack(message);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${data.email}`,
        'MailConsumer',
      );

      //! no ack = message stays in queue / retry possible
    }
  }
}
