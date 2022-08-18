import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MinioClientService } from './app.service';
import { UploadInputDto, DeleteInputDto } from './dto';

@Controller('MinioClient')
export class MinioClientController {
  constructor(private readonly minioClientService: MinioClientService) {}

  @MessagePattern('upload')
  async validatePassword(@Payload() data: UploadInputDto) {
    return await this.minioClientService.upload(data.file, data.bucketName);
  }

  @MessagePattern('delete')
  async hashPassword(@Payload() data: DeleteInputDto) {
    return await this.minioClientService.delete(
      data.objectName,
      data.bucketName,
    );
  }
}
