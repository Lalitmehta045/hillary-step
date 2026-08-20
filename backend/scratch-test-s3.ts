import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { S3Service } from './src/resume/s3.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const s3Service = app.get(S3Service);
  
  const testKey = `test-upload-${Date.now()}.txt`;
  const testBuffer = Buffer.from('Integration test file for Hillary Step', 'utf-8');

  console.log('Testing S3 upload...');
  try {
    await s3Service.upload(testKey, testBuffer, 'text/plain');
    console.log('Upload PASS');

    console.log('Testing S3 head object...');
    const exists = await s3Service.headObject(testKey);
    console.log(exists ? 'Object verification PASS' : 'Object verification FAIL');

    console.log('Testing presigned URL...');
    const url = await s3Service.getPresignedUrl(testKey, 60);
    if (url.includes('amazonaws.com') || url.includes('ap-south-1')) {
      console.log('Presigned URL PASS: ' + url);
    } else {
      console.log('Presigned URL FAIL: ' + url);
    }

    console.log('Testing S3 delete...');
    await s3Service.delete(testKey);
    console.log('Cleanup PASS');

  } catch (error) {
    console.error('Test FAILED:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
