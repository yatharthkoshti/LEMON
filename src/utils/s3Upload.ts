import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AWS_CONFIG } from '../config/aws';

const s3Client = new S3Client({
  region: AWS_CONFIG.region,
  credentials: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey
  }
});

/**
 * Uploads media (voice notes, dispute recordings, job audio descriptions)
 * directly to AWS S3. The bucket has a 1-day lifecycle rule that automatically
 * purges files after 24 hours.
 */
export async function uploadMediaToS3(
  blob: Blob, 
  folder: 'voice_jds' | 'disputes' | 'chats' = 'voice_jds'
): Promise<string> {
  try {
    const extension = blob.type.includes('audio') ? 'webm' : 'bin';
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;
    
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    await s3Client.send(new PutObjectCommand({
      Bucket: AWS_CONFIG.mediaBucket,
      Key: key,
      Body: bytes,
      ContentType: blob.type || 'audio/webm'
    }));

    return `https://${AWS_CONFIG.mediaBucket}.s3.${AWS_CONFIG.region}.amazonaws.com/${key}`;
  } catch (err) {
    console.warn('Failed to upload to S3, falling back to local object URL:', err);
    return URL.createObjectURL(blob);
  }
}
