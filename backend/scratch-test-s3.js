require('dotenv').config();
const { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

async function run() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || 'dummy-bucket';
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });

  const testKey = `test-upload-${Date.now()}.txt`;
  const testBuffer = Buffer.from('Integration test file for Hillary Step', 'utf-8');

  console.log('Testing S3 upload...');
  try {
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: testKey,
      Body: testBuffer,
      ContentType: 'text/plain',
      ServerSideEncryption: 'AES256'
    }));
    console.log('Upload PASS');

    console.log('Testing S3 head object...');
    try {
      await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: testKey }));
      console.log('Object verification PASS');
    } catch (e) {
      console.log('Object verification FAIL', e.message);
    }

    console.log('Testing presigned URL...');
    const command = new GetObjectCommand({ Bucket: bucketName, Key: testKey });
    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    if (url.includes('amazonaws.com') || url.includes('ap-south-1')) {
      console.log('Presigned URL PASS');
    } else {
      console.log('Presigned URL FAIL: ' + url);
    }

    console.log('Testing S3 delete...');
    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: testKey }));
    console.log('Cleanup PASS');

  } catch (error) {
    console.error('Test FAILED:', error);
  }
}

run();
