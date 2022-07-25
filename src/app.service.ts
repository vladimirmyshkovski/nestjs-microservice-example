import {
  HttpException,
  HttpStatus,
  Injectable,
  ConsoleLogger as Logger,
} from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './types';
import { policy } from './policy';
import * as crypto from 'crypto';
import { FRONTEND_BASE_URL } from './common/constants';
import { logger } from './common';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;

  constructor(private readonly minio: MinioService) {
    this.client.setBucketPolicy(
      process.env.MINIO_BUCKET_NAME,
      JSON.stringify(policy),
      function (err) {
        if (err) throw err;
      },
    );
    this.logger = logger;
  }

  public get client() {
    return this.minio.client;
  }

  public async upload(
    file: BufferedFile,
    bucketName: string = this.bucketName,
  ) {
    this.logger.log('upload call', { file, bucketName });
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      this.logger.error('File type not supported', file);
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );

    // We need to append the extension at the end otherwise Minio will save it as a generic file
    const fileName = hashedFileName + extension;

    this.client.putObject(bucketName, fileName, file.buffer, function (err) {
      if (err) {
        this.logger.console.error(err);
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      }
    });

    const url = `${FRONTEND_BASE_URL}${process.env.MINIO_BUCKET_NAME}/${fileName}`;

    this.logger.log('url', url);
    return { url };
  }

  async delete(objectName: string, bucketName: string = this.bucketName) {
    const callback = (data) => {
      this.logger.log('delete call', { objectName, bucketName, data });
    };
    this.client.removeObject(bucketName, objectName, callback);
  }
}
