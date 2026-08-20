const { S3Client, ListBucketsCommand, GetBucketLocationCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

async function run() {
  try {
    const s3 = new S3Client({ region: 'us-east-1' });
    const { Buckets } = await s3.send(new ListBucketsCommand({}));
    
    console.log("Buckets:");
    for (const bucket of Buckets) {
      try {
        const loc = await s3.send(new GetBucketLocationCommand({ Bucket: bucket.Name }));
        console.log(`- ${bucket.Name} (Region: ${loc.LocationConstraint || 'us-east-1'})`);
      } catch (e) {
        console.log(`- ${bucket.Name} (Region: Unknown - ${e.message})`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

run();
