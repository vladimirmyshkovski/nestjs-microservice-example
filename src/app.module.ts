import { Module } from '@nestjs/common';
import { MinioClientService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { config } from './common';

@Module({
  providers: [MinioClientService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get('MINIO_ENDPOINT'),
        port: parseInt(configService.get('MINIO_PORT')),
        useSSL: process.env.NODE_ENV === 'production',
        accessKey: configService.get('MINIO_ACCESS_KEY'),
        secretKey: configService.get('MINIO_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MinioClientService],
})
export class MinioClientModule {}
