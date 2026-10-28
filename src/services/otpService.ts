/**
 * OTP Service - Real SMS via AWS SNS
 * In-memory OTP store for dev/fallback
 */

// In-memory OTP store (session only)
const otpStore: Record<string, { code: string; expiresAt: number }> = {};

const AWS_REGION = (import.meta as any).env?.VITE_AWS_REGION || 'ap-south-1';
const AWS_ACCESS_KEY_ID = (import.meta as any).env?.VITE_AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = (import.meta as any).env?.VITE_AWS_SECRET_ACCESS_KEY || '';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  const e164Phone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Always store OTP locally (for dev fallback)
  otpStore[phone] = { code: otp, expiresAt };

  try {
    // Dynamically import AWS SNS to avoid SSR/module issues
    const { SNSClient, PublishCommand } = await import('@aws-sdk/client-sns');

    const client = new SNSClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const message = `Your LEMON (${String.fromCodePoint(0x1F34B)}) verification code is: ${otp}\n\nValid for 5 minutes. Do not share.\n- Team Lemon`;

    await client.send(new PublishCommand({
      Message: message,
      PhoneNumber: e164Phone,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
      },
    }));

    console.log(`[OTP] Sent via SNS to ${e164Phone}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[OTP] SNS failed, using local store. Error:', message);
    // OTP is still stored locally — works for dev/demo
    return { success: true, error: message };
  }
}

export function verifyOtpCode(phone: string, code: string): boolean {
  const entry = otpStore[phone];
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    delete otpStore[phone];
    return false;
  }
  if (entry.code === code.trim()) {
    delete otpStore[phone];
    return true;
  }
  return false;
}

/** Returns the OTP stored locally (for dev hint display). Returns null if none. */
export function getStoredOtp(phone: string): string | null {
  return otpStore[phone]?.code ?? null;
}
