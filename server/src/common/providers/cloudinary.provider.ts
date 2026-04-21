import { couldinaryConfig } from '../config/cloudinary.config';
import { Provider } from '@nestjs/common';

export const CloudnirayProvider: Provider = {
  provide: 'Cloudinary',
  useFactory: () => couldinaryConfig(),
}