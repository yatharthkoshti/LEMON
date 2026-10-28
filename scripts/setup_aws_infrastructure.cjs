const { 
  S3Client, 
  CreateBucketCommand, 
  PutBucketLifecycleConfigurationCommand,
  PutBucketPolicyCommand,
  PutBucketWebsiteCommand,
  PutPublicAccessBlockCommand,
  PutBucketCorsCommand,
  PutObjectCommand
} = require('@aws-sdk/client-s3');
const { 
  DynamoDBClient, 
  CreateTableCommand, 
  DescribeTableCommand 
} = require('@aws-sdk/client-dynamodb');
const { 
  SESClient, 
  VerifyEmailIdentityCommand 
} = require('@aws-sdk/client-ses');
const fs = require('fs');
const path = require('path');

// Load .env if present
try {
  const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const [k, ...v] = line.trim().split('=');
    if (k && v.length) process.env[k] = v.join('=');
  });
} catch (e) {}

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
};

const region = 'ap-south-1';
const MEDIA_BUCKET = `lemon-media-storage-${Date.now()}`;
const WEB_BUCKET = `lemon-web-app-${Date.now()}`;

const s3 = new S3Client({ region, credentials });
const ddb = new DynamoDBClient({ region, credentials });
const ses = new SESClient({ region, credentials });

async function setup() {
  console.log('=== STARTING AWS PROVISIONING FOR LEMON ===');

  // 1. Create Media Storage Bucket with 1-Day Lifecycle
  console.log(`\n1. Creating Media Bucket: ${MEDIA_BUCKET}...`);
  try {
    await s3.send(new CreateBucketCommand({
      Bucket: MEDIA_BUCKET,
      CreateBucketConfiguration: { LocationConstraint: region }
    }));
    console.log(`Media Bucket ${MEDIA_BUCKET} created!`);

    // Disable block public access for media bucket
    await s3.send(new PutPublicAccessBlockCommand({
      Bucket: MEDIA_BUCKET,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false
      }
    }));

    // Add CORS so browser can upload audio/video blobs
    await s3.send(new PutBucketCorsCommand({
      Bucket: MEDIA_BUCKET,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD'],
            AllowedOrigins: ['*'],
            MaxAgeSeconds: 3000
          }
        ]
      }
    }));
    console.log('CORS configured on Media Bucket.');

    // Add 1-Day Auto-delete Lifecycle Rule
    await s3.send(new PutBucketLifecycleConfigurationCommand({
      Bucket: MEDIA_BUCKET,
      LifecycleConfiguration: {
        Rules: [
          {
            ID: 'AutoDeleteAfter1Day',
            Status: 'Enabled',
            Filter: { Prefix: '' },
            Expiration: { Days: 1 }
          }
        ]
      }
    }));
    console.log('Lifecycle rule configured: ALL media files will automatically expire & delete after 1 DAY!');
  } catch (err) {
    console.error('Error creating media bucket:', err.message);
  }

  // 2. Create DynamoDB Tables
  console.log('\n2. Creating DynamoDB Tables...');
  const tables = [
    {
      name: 'lemon_jobs',
      key: 'id'
    },
    {
      name: 'lemon_disputes',
      key: 'id'
    },
    {
      name: 'lemon_chats',
      key: 'id'
    }
  ];

  for (const tbl of tables) {
    try {
      await ddb.send(new CreateTableCommand({
        TableName: tbl.name,
        AttributeDefinitions: [
          { AttributeName: tbl.key, AttributeType: 'S' }
        ],
        KeySchema: [
          { AttributeName: tbl.key, KeyType: 'HASH' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      }));
      console.log(`Table ${tbl.name} created!`);
    } catch (err) {
      if (err.name === 'ResourceInUseException') {
        console.log(`Table ${tbl.name} already exists.`);
      } else {
        console.error(`Error creating table ${tbl.name}:`, err.message);
      }
    }
  }

  // 3. Initiate SES Identity Verification for lemonabuses@gmail.com
  console.log('\n3. Setting up SES verification for lemonabuses@gmail.com...');
  try {
    await ses.send(new VerifyEmailIdentityCommand({
      EmailAddress: 'lemonabuses@gmail.com'
    }));
    console.log('Verification email sent to lemonabuses@gmail.com! (Check inbox to verify)');
  } catch (err) {
    console.error('SES verification error:', err.message);
  }

  // 4. Create Web Hosting S3 Bucket for Standalone Web App
  console.log(`\n4. Setting up Standalone Web Hosting Bucket: ${WEB_BUCKET}...`);
  try {
    await s3.send(new CreateBucketCommand({
      Bucket: WEB_BUCKET,
      CreateBucketConfiguration: { LocationConstraint: region }
    }));

    await s3.send(new PutPublicAccessBlockCommand({
      Bucket: WEB_BUCKET,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false
      }
    }));

    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${WEB_BUCKET}/*`
        }
      ]
    };

    await s3.send(new PutBucketPolicyCommand({
      Bucket: WEB_BUCKET,
      Policy: JSON.stringify(bucketPolicy)
    }));

    await s3.send(new PutBucketWebsiteCommand({
      Bucket: WEB_BUCKET,
      WebsiteConfiguration: {
        IndexDocument: { Suffix: 'index.html' },
        ErrorDocument: { Key: 'index.html' }
      }
    }));

    console.log(`Web bucket ${WEB_BUCKET} configured for static website hosting!`);
  } catch (err) {
    console.error('Error configuring web bucket:', err.message);
  }

  // 5. Deploy Built Dist Files to S3 Web Bucket
  console.log(`\n5. Uploading dist files to ${WEB_BUCKET}...`);
  const distDir = path.resolve('dist');

  function getContentType(filePath) {
    if (filePath.endsWith('.html')) return 'text/html';
    if (filePath.endsWith('.css')) return 'text/css';
    if (filePath.endsWith('.js')) return 'application/javascript';
    if (filePath.endsWith('.json') || filePath.endsWith('.webmanifest')) return 'application/json';
    if (filePath.endsWith('.png')) return 'image/png';
    if (filePath.endsWith('.svg')) return 'image/svg+xml';
    if (filePath.endsWith('.ico')) return 'image/x-icon';
    return 'application/octet-stream';
  }

  async function uploadDirectory(dir, s3Prefix = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        await uploadDirectory(fullPath, path.join(s3Prefix, file).replace(/\\/g, '/'));
      } else {
        const s3Key = path.join(s3Prefix, file).replace(/\\/g, '/');
        const fileContent = fs.readFileSync(fullPath);
        await s3.send(new PutObjectCommand({
          Bucket: WEB_BUCKET,
          Key: s3Key,
          Body: fileContent,
          ContentType: getContentType(fullPath)
        }));
        console.log(`Uploaded: ${s3Key}`);
      }
    }
  }

  if (fs.existsSync(distDir)) {
    await uploadDirectory(distDir);
    console.log('\nAll files successfully uploaded to AWS S3!');
    const webUrl = `http://${WEB_BUCKET}.s3-website.${region}.amazonaws.com`;
    console.log(`\n🎉 YOUR STANDALONE LIVE APP URL: ${webUrl}`);
  } else {
    console.error('dist/ directory not found! Run npm run build first.');
  }

  // Save the AWS configuration to src/config/aws.ts
  const configContent = `// AWS Production Configuration for LEMON
export const AWS_CONFIG = {
  region: '${region}',
  accessKeyId: '${credentials.accessKeyId}',
  secretAccessKey: '${credentials.secretAccessKey}',
  mediaBucket: '${MEDIA_BUCKET}',
  webBucket: '${WEB_BUCKET}',
  liveUrl: 'http://${WEB_BUCKET}.s3-website.${region}.amazonaws.com',
  disputeEmail: 'lemonabuses@gmail.com',
  tables: {
    jobs: 'lemon_jobs',
    disputes: 'lemon_disputes',
    chats: 'lemon_chats'
  }
};
`;

  fs.mkdirSync('src/config', { recursive: true });
  fs.writeFileSync('src/config/aws.ts', configContent);
  console.log('\nGenerated src/config/aws.ts with all live AWS resources!');

  console.log('\n=== AWS PROVISIONING COMPLETE ===');
}

setup().catch(console.error);
