import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MinioClientModule as AppModule } from './app.module';
import { logger, transport, options } from './common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport,
      logger,
      options,
    },
  );
  await app.listen();
}
bootstrap();
