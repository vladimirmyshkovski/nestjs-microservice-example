import { Transport } from '@nestjs/microservices';

export const transport =
  process.env.NODE_ENV === 'production' ? Transport.NATS : Transport.TCP;
