const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
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
const WEB_BUCKET = 'lemon-web-app-1791565982304';
const distDir = path.resolve('dist');

const s3 = new S3Client({ region, credentials });

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
      console.log(`Uploaded to AWS: ${s3Key}`);
    }
  }
}

async function main() {
  console.log(`Deploying fresh build to AWS S3 bucket: ${WEB_BUCKET}...`);
  await uploadDirectory(distDir);
  console.log(`\nDeployment SUCCESS!`);
  console.log(`Live URL: http://${WEB_BUCKET}.s3-website.${region}.amazonaws.com`);
}

main().catch(console.error);
