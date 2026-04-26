import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailProvider } from '../../common/providers/mail.provider';

@Module({
  providers: [NotificationService,MailProvider],
  exports:[NotificationService]
})
export class NotificationModule {}
