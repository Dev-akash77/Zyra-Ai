import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailProvider } from '../../common/providers/mail.provider';
import { MailConsumer } from './consumer/notification.consumer';

@Module({
  providers: [NotificationService, MailProvider],
  exports: [NotificationService],
  controllers: [MailConsumer],
})
export class NotificationModule {}
