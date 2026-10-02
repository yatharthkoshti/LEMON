import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';

export const AuthScreen: React.FC = () => {
  const { t } = useTranslation();
  const { login, verifyOtp, showToast } = useAppStore();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('કૃપા કરીને ૧૦ આંકડાનો સાચો મોબાઈલ નંબર દાખલ કરો', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(cleanPhone);
      setIsLoading(false);
      setStep('otp');
      setOtpCode('1234'); // Simulated prefill for ultra easy worker experience
      showToast('OTP મોકલાયો છે: 1234', 'info');
    }, 450);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpCode.length < 4) {
      showToast('કૃપા કરીને ૪ અંકનો સાચો OTP દાખલ કરો', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = verifyOtp(otpCode);
      setIsLoading(false);
      if (success) {
        showToast('લૉગિન સફળ થયું!', 'success');
      }
    }, 400);
  };

  const handleQuickDemo = (phone: string, demoOtp: string) => {
    setPhoneNumber(phone);
    setIsLoading(true);
    setTimeout(() => {
      login(phone);
      setIsLoading(false);
      setStep('otp');
      setOtpCode(demoOtp);
      showToast(`ડેમો ખાતું તૈયાર છે: OTP ${demoOtp}`, 'info');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 max-w-lg mx-auto">
      {/* Top Brand Banner */}
      <div className="pt-8 pb-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary shadow-soft-lg mb-3"
        >
          <span className="text-4xl">🍋</span>
        </motion.div>
        
        <h1 className="font-heading text-4xl text-primary tracking-wider">
          {t('app.name')}
        </h1>
        <p className="text-lg font-bold text-primary mt-1">
          {t('app.tagline')}
        </p>
        <p className="text-sm font-semibold text-secondary">
          {t('app.subtagline')}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-card rounded-4xl p-6 sm:p-8 border border-gray-100 shadow-soft-lg my-auto">
        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form
              key="phone-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                  {t('auth.phone_title')}
                </h2>
                <p className="text-sm font-semibold text-secondary mt-1">
                  {t('auth.phone_subtitle')}
                </p>
              </div>

              {/* Phone Input Box */}
              <div>
                <label className="block text-xs font-bold uppercase text-secondary tracking-wider mb-2">
                  {t('onboarding.phone_label')}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-extrabold text-base text-gray-500 border-r border-gray-300 pr-3">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98250 12345"
                    className="w-full pl-20 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-200 text-xl font-bold tracking-widest text-primary focus:bg-white focus:border-primary focus:outline-none transition-all placeholder:text-gray-300"
                    autoFocus
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                variant="accent"
                size="xl"
                type="submit"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-6 h-6 stroke-[3]" />}
              >
                {t('auth.get_otp')}
              </Button>

              {/* Quick Demo Accounts */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-secondary mb-2 text-center">
                  {t('auth.quick_demo')}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('9825011223', '1234')}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-bold text-primary flex items-center justify-between border border-gray-200 transition-colors"
                  >
                    <span>🧱 {t('auth.demo_raj_mistri')}</span>
                    <span className="text-gray-400">98250 11223</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('9879544332', '1234')}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-bold text-primary flex items-center justify-between border border-gray-200 transition-colors"
                  >
                    <span>🪨 {t('auth.demo_tile_karigar')}</span>
                    <span className="text-gray-400">98795 44332</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('9426099887', '1234')}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-bold text-primary flex items-center justify-between border border-gray-200 transition-colors"
                  >
                    <span>👥 {t('auth.demo_labour_leader')}</span>
                    <span className="text-gray-400">94260 99887</span>
                  </button>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                  {t('auth.otp_title')}
                </h2>
                <p className="text-sm font-semibold text-secondary mt-1">
                  {t('auth.otp_sent_to')}{' '}
                  <span className="font-extrabold text-primary">+91 {phoneNumber}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="• • • •"
                  className="w-full text-center py-4 rounded-2xl bg-gray-50 border-2 border-primary text-3xl font-heading tracking-[0.5em] text-primary focus:bg-white focus:outline-none"
                  autoFocus
                />
                <p className="text-xs text-center text-emerald-700 font-bold mt-2">
                  ડેમો કોડ: 1234 આપોઆપ ભરેલ છે
                </p>
              </div>

              {/* Verify Button */}
              <Button
                variant="primary"
                size="xl"
                type="submit"
                isLoading={isLoading}
                rightIcon={<CheckCircle2 className="w-6 h-6 text-accent" />}
              >
                {t('auth.verify_otp')}
              </Button>

              {/* Resend & Back */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs font-bold text-secondary hover:text-primary underline"
                >
                  નંબર બદલો (Change Number)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('OTP ફરી મોકલવામાં આવ્યો: 1234', 'info');
                    setOtpCode('1234');
                  }}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t('auth.resend_otp')}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Security Note Footer */}
      <div className="text-center py-4 text-xs font-medium text-secondary flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>{t('auth.terms_note')}</span>
      </div>
    </div>
  );
};
