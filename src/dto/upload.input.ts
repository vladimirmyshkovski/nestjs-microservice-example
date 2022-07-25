import { BufferedFile } from '../types';

export class UploadInputDto {
  file: BufferedFile;
  bucketName: string;
}
