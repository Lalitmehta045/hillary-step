import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ParseUuidPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isUUID(value)) {
      throw new BadRequestException(
        `Validation failed: ${metadata.data} must be a valid UUID`,
      );
    }
    return value;
  }
}
