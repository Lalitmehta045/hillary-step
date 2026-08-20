import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PRESIGNED_URL_EXPIRY_SECONDS } from '../common/constants';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client?: S3Client;
  private readonly bucketName: string;
  private readonly mockMode: boolean;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('aws.accessKeyId');
    const secretAccessKey = this.configService.get<string>(
      'aws.secretAccessKey',
    );
    const region = this.configService.get<string>('aws.region');
    this.bucketName =
      this.configService.get<string>('aws.s3BucketName') || 'dummy-bucket';
    const mockModeConfig = this.configService.get<boolean>('aws.mockMode');

    const hasRealAwsConfig = !!(
      accessKeyId &&
      secretAccessKey &&
      region &&
      this.bucketName !== 'dummy-bucket'
    );

    if (hasRealAwsConfig) {
      this.mockMode = false;
      this.s3Client = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
    } else {
      if (
        mockModeConfig ||
        this.bucketName === 'dummy-bucket' ||
        process.env.NODE_ENV === 'test'
      ) {
        this.mockMode = true;
        this.logger.warn('AWS S3 initialized in MOCK MODE.');
      } else {
        throw new Error(
          'AWS credentials, region, or bucket name missing. Configure them or enable AWS_S3_MOCK_MODE=true.',
        );
      }
    }
  }

  /** Upload a file to S3 with server-side encryption */
  async upload(key: string, body: Buffer, contentType: string): Promise<void> {
    if (this.mockMode || !this.s3Client) {
      this.logger.log(`[MOCK] File "uploaded" to S3: ${key}`);
      return;
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
        ServerSideEncryption: 'AES256',
      }),
    );
    this.logger.log(`File uploaded to S3: ${key}`);
  }

  /** Generate a short-lived presigned download URL */
  async getPresignedUrl(key: string, expiresIn?: number): Promise<string> {
    if (this.mockMode || !this.s3Client) {
      return `http://localhost:3001/mock-s3/${key}`;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, {
      expiresIn: expiresIn || PRESIGNED_URL_EXPIRY_SECONDS,
    });
  }

  /** Delete an object from S3 */
  async delete(key: string): Promise<void> {
    if (this.mockMode || !this.s3Client) {
      this.logger.log(`[MOCK] File deleted from S3: ${key}`);
      return;
    }

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
    this.logger.log(`File deleted from S3: ${key}`);
  }

  /** Check if an object exists in S3 */
  async headObject(key: string): Promise<boolean> {
    if (this.mockMode || !this.s3Client) {
      return true;
    }

    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }
}
