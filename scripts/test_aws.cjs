const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { SESClient, ListIdentitiesCommand } = require('@aws-sdk/client-ses');

const path = require('path');
const fs = require('fs');

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

async function testAWS() {
  console.log('Testing AWS credentials with region:', region);

  try {
    const s3 = new S3Client({ region, credentials });
    const s3Res = await s3.send(new ListBucketsCommand({}));
    console.log('S3 Connection SUCCESS!');
    console.log('Existing buckets:', s3Res.Buckets ? s3Res.Buckets.map(b => b.Name) : 'None');
  } catch (err) {
    console.error('S3 Connection Failed:', err.message);
  }

  try {
    const ddb = new DynamoDBClient({ region, credentials });
    const ddbRes = await ddb.send(new ListTablesCommand({}));
    console.log('DynamoDB Connection SUCCESS!');
    console.log('Existing tables:', ddbRes.TableNames || []);
  } catch (err) {
    console.error('DynamoDB Connection Failed:', err.message);
  }

  try {
    const ses = new SESClient({ region, credentials });
    const sesRes = await ses.send(new ListIdentitiesCommand({}));
    console.log('SES Connection SUCCESS!');
    console.log('SES Identities:', sesRes.Identities || []);
  } catch (err) {
    console.error('SES Connection Failed:', err.message);
  }
}

testAWS();
