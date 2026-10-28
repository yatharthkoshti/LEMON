// AWS Production Configuration for LEMON
export const AWS_CONFIG = {
  region: (import.meta as any).env?.VITE_AWS_REGION || 'ap-south-1',
  accessKeyId: (import.meta as any).env?.VITE_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: (import.meta as any).env?.VITE_AWS_SECRET_ACCESS_KEY || '',
  mediaBucket: (import.meta as any).env?.VITE_AWS_MEDIA_BUCKET || 'lemon-media-storage-1791565982304',
  webBucket: (import.meta as any).env?.VITE_AWS_WEB_BUCKET || 'lemon-web-app-1791565982304',
  liveUrl: 'http://lemon-web-app-1791565982304.s3-website.ap-south-1.amazonaws.com',
  disputeEmail: (import.meta as any).env?.VITE_DISPUTE_EMAIL || 'lemonabuses@gmail.com',
  tables: {
    jobs: 'lemon_jobs',
    disputes: 'lemon_disputes',
    chats: 'lemon_chats'
  }
};
