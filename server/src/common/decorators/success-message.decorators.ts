import { SetMetadata } from '@nestjs/common';

export const SUCCESS_MESSAGE_KEY = 'success_message';

export const success_message = (message: string) =>
  SetMetadata(SUCCESS_MESSAGE_KEY, message);