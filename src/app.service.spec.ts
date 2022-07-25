import { Test, TestingModule } from '@nestjs/testing';
import { MinioClientService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { BufferedFile } from './types';

describe('MinioClientService', () => {
  let service: MinioClientService;

  beforeEach(async () => {
    const minioTestModule = MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log('configService', configService);
        return {
          endPoint: configService.get('MINIO_ENDPOINT'),
          port: parseInt(configService.get('MINIO_PORT')),
          useSSL: process.env.NODE_ENV === 'production',
          accessKey: configService.get('MINIO_ACCESS_KEY'),
          secretKey: configService.get('MINIO_SECRET_KEY'),
        };
      },
      inject: [ConfigService],
    });
    // (method) Client.putObject(bucketName: string, objectName: string, stream: string | internal.Readable | Buffer, callback: ResultCallback<UploadedObjectInfo>): void (+4 overloads)

    // Here's the key part ... you could replace that "awesome" with something appropriate
    // jest.spyOn(minioTestModule, 'putObject').mockImplementation(
    // (bucketName: string, objectName: string, stream: string | internal.Readable | Buffer, callback: ResultCallback<UploadedObjectInfo>) => ()
    // );

    const app: TestingModule = await Test.createTestingModule({
      providers: [MinioClientService],
      imports: [
        minioTestModule,
        /*
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
        */
      ],
      exports: [MinioClientService],
    }).compile();

    service = app.get<MinioClientService>(MinioClientService);
  });

  describe('upload', () => {
    it('Hello World!', () => {
      const file = JSON.parse('{"name": "fakeFile.json"}') as BufferedFile;
      expect(service.upload(file, 'fakeBucket')).toBe('Hello World!');
    });
  });
});
