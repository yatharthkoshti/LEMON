import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw, Camera, X, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { sendOtp, verifyOtpCode, getStoredOtp } from '../services/otpService';

type AuthStep = 'phone' | 'otp' | 'photo';

export const AuthScreen: React.FC = () => {
  const { t } = useTranslation();
  const { login, showToast, updateProfile, verifyOtp } = useAppStore();

  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── OTP FLOW ──────────────────────────────────────────────────────────────

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('કૃપા કરીને 10 અંકનો ફોન નંબર દાખલ કરો', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOtp(cleanPhone);
      login(cleanPhone);
      setStep('otp');

      // Show dev hint if SNS fails (local fallback OTP)
      const hint = getStoredOtp(cleanPhone);
      if (hint) {
        setDevOtpHint(hint);
        showToast(`OTP મોકલ્યો (Dev hint: ${hint})`, 'info');
      } else {
        showToast('OTP SMS મોકલ્યો', 'success');
      }

      // Start 30s resend timer
      setResendTimer(30);
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      showToast('OTP મોકલવામાં ભૂલ થઈ, ફરી પ્રયાસ કરો', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (otpCode.length < 6) {
      showToast('6 અંકનો OTP દાખલ કરો', 'error');
      return;
    }

    setIsLoading(true);
    const isValid = verifyOtpCode(cleanPhone, otpCode);
    setIsLoading(false);

    if (isValid) {
      showToast('✓ OTP verified! હવે ફોટો લો', 'success');
      setDevOtpHint(null);
      setStep('photo');
    } else {
      showToast('ખોટો OTP. ફરી પ્રયાસ કરો.', 'error');
    }
  };

  const handleResend = async () => {
    setOtpCode('');
    await handleSendOtp();
  };

  // ── CAMERA FLOW ───────────────────────────────────────────────────────────

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 640 }, height: { ideal: 640 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      showToast('કૅમેરા ખોલવામાં ભૂલ. ગ્રંથ ત્વ (permission) આપો.', 'error');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const flipCamera = useCallback(async () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    stopCamera();
    setTimeout(() => startCamera(), 100);
  }, [startCamera, stopCamera]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror the image for selfie (front camera)
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    stopCamera();
  }, [facingMode, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const handleFinishWithPhoto = async () => {
    setIsLoading(true);
    try {
      if (capturedPhoto) {
        updateProfile({ photoUrl: capturedPhoto });
      }
      // Mark as authenticated — App.tsx will route to onboarding/home
      verifyOtp('authenticated');
      showToast('✓ પ્રોફાઇલ ફોટો સાચવ્યો!', 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipPhoto = () => {
    stopCamera();
    verifyOtp('authenticated');
  };

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 max-w-lg mx-auto">
      {/* Brand */}
      <div className="pt-8 pb-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary shadow-soft-lg mb-3"
        >
          <span className="text-4xl">🍋</span>
        </motion.div>
        <h1 className="font-heading text-4xl text-primary tracking-wider">{t('app.name')}</h1>
        <p className="text-lg font-bold text-primary mt-1">{t('app.tagline')}</p>
      </div>

      {/* Main Card */}
      <div className="bg-card rounded-4xl p-6 sm:p-8 border border-gray-100 shadow-soft-lg my-auto">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Phone ── */}
          {step === 'phone' && (
            <motion.form
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-primary">{t('auth.phone_title')}</h2>
                <p className="text-sm font-semibold text-secondary mt-1">{t('auth.phone_subtitle')}</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-secondary tracking-wider mb-2">
                  {t('onboarding.phone_label')}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-extrabold text-base text-gray-500 border-r border-gray-300 pr-3">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="98250 12345"
                    className="w-full pl-20 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-200 text-xl font-bold tracking-wider text-primary focus:border-primary focus:bg-white focus:outline-none transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                variant="primary" size="xl" type="submit"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-6 h-6" />}
              >
                OTP મોકલો (Send OTP)
              </Button>
            </motion.form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 'otp' && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-primary">{t('auth.otp_title')}</h2>
                <p className="text-sm font-semibold text-secondary mt-1">
                  {t('auth.otp_sent_to')} <span className="font-extrabold text-primary">+91 {phoneNumber}</span>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="● ● ● ● ● ●"
                  className="w-full text-center py-4 rounded-2xl bg-gray-50 border-2 border-primary text-3xl font-heading tracking-[0.5em] text-primary focus:bg-white focus:outline-none"
                  autoFocus
                />
                {devOtpHint && (
                  <p className="text-xs text-center text-emerald-700 font-bold mt-2 bg-emerald-50 rounded-xl py-1">
                    💡 Dev Mode OTP: <strong>{devOtpHint}</strong>
                  </p>
                )}
              </div>

              <Button
                variant="primary" size="xl" type="submit"
                isLoading={isLoading}
                rightIcon={<CheckCircle2 className="w-6 h-6 text-accent" />}
              >
                {t('auth.verify_otp')}
              </Button>

              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setStep('phone')}
                  className="text-xs font-bold text-secondary hover:text-primary underline">
                  નંબર બદલો (Change Number)
                </button>
                <button type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-40">
                  <RotateCcw className="w-3.5 h-3.5" />
                  {resendTimer > 0 ? `ફરી મોકલો (${resendTimer}s)` : t('auth.resend_otp')}
                </button>
              </div>
            </motion.form>
          )}

          {/* ── STEP 3: Live Photo ── */}
          {step === 'photo' && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-primary">📸 તમારો ફોટો લો</h2>
                <p className="text-sm font-semibold text-secondary mt-1">
                  એક સ્પષ્ટ સેલ્ફી લો — ID ચકાસણી માટે જરૂરી છે
                </p>
              </div>

              <div className="relative bg-gray-900 rounded-3xl overflow-hidden aspect-square w-full max-w-xs mx-auto">
                {!cameraActive && !capturedPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <button
                      onClick={startCamera}
                      className="flex flex-col items-center gap-3 text-white"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                      <span className="font-bold text-sm">કૅમેરા ચાલુ કરો</span>
                    </button>
                  </div>
                )}

                {cameraActive && !capturedPhoto && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                    {/* Face guide oval */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-60 border-4 border-white/60 rounded-full" />
                    </div>
                    <button
                      onClick={flipCamera}
                      className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </>
                )}

                {capturedPhoto && (
                  <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Controls */}
              {cameraActive && !capturedPhoto && (
                <button
                  onClick={capturePhoto}
                  className="w-20 h-20 mx-auto flex items-center justify-center bg-white border-4 border-primary rounded-full shadow-lg active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 bg-primary rounded-full" />
                </button>
              )}

              {capturedPhoto && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={retakePhoto} leftIcon={<RefreshCw className="w-4 h-4" />}>
                    ફરીથી લો
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={handleFinishWithPhoto} isLoading={isLoading} rightIcon={<CheckCircle2 className="w-5 h-5" />}>
                    ✓ આ ઠીક છે
                  </Button>
                </div>
              )}

              <button onClick={handleSkipPhoto} className="w-full text-center text-xs font-medium text-gray-400 underline">
                હમણાં છોડો, પછી ઉમેરો (Skip for now)
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs font-medium text-secondary flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>{t('auth.terms_note')}</span>
      </div>
    </div>
  );
};
