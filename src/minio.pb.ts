/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'minio';

export interface File {
  offset?: number | undefined;
  data?: Uint8Array | undefined;
}

export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: string;
  file: File | undefined;
}

export interface UploadRequest {
  bucketName: string;
  file: BufferedFile | undefined;
}

export interface UploadResponse {
  uri: string;
}

export interface DeleteRequest {
  fileName: string;
  bucketName: string;
}

export interface DeleteResponse {
  status: string;
  message: string;
}

export const MINIO_PACKAGE_NAME = 'minio';

export interface MinioServiceClient {
  upload(request: UploadRequest): Observable<UploadResponse>;

  delete(request: DeleteRequest): Observable<DeleteResponse>;
}

export interface MinioServiceController {
  upload(
    request: UploadRequest,
  ): Promise<UploadResponse> | Observable<UploadResponse> | UploadResponse;

  delete(
    request: DeleteRequest,
  ): Promise<DeleteResponse> | Observable<DeleteResponse> | DeleteResponse;
}

export function MinioServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['upload', 'delete'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('MinioService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('MinioService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const MINIO_SERVICE_NAME = 'MinioService';
