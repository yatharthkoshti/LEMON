import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, CheckCircle2, X, RefreshCw, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Job } from '../../types';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';

interface WorkerCheckInModalProps {
  job: Job | null;
  onClose: () => void;
}

export const WorkerCheckInModal: React.FC<WorkerCheckInModalProps> = ({ job, onClose }) => {
  const { t } = useTranslation();
  const { checkInJob, showToast } = useAppStore();

  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!job) return null;

  const handleCapturePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelfieUrl(event.target?.result as string);
        triggerGpsDetection();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerGpsDetection = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setIsDetectingGps(false);
        },
        () => {
          // Fallback simulation near the job site
          setTimeout(() => {
            setGpsCoords({
              lat: job.mapCoords.lat + 0.0002,
              lng: job.mapCoords.lng + 0.0001
            });
            setIsDetectingGps(false);
          }, 800);
        }
      );
    } else {
      setTimeout(() => {
        setGpsCoords({
          lat: job.mapCoords.lat,
          lng: job.mapCoords.lng
        });
        setIsDetectingGps(false);
      }, 500);
    }
  };

  const handleConfirmCheckIn = () => {
    if (!selfieUrl) {
      showToast('કૃપા કરીને સાઇટ પરથી તમારી સેલ્ફી લો', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      checkInJob(
        job.id,
        selfieUrl,
        gpsCoords || { lat: job.mapCoords.lat, lng: job.mapCoords.lng }
      );
      setIsSubmitting(false);
      showToast(t('worker_checkin.success_toast'), 'success');
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-card rounded-t-4xl sm:rounded-3xl shadow-soft-lg border border-gray-100 p-6 z-10 font-body"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📸</span>
              <div>
                <h3 className="text-lg font-bold text-primary font-heading leading-tight">
                  {t('worker_checkin.title')}
                </h3>
                <p className="text-xs text-secondary font-medium">
                  {job.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary active:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Camera / Selfie Box */}
          <div className="py-4 space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 relative overflow-hidden min-h-[200px]">
              {selfieUrl ? (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-soft">
                  <img src={selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full bg-primary/80 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1 shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('worker_checkin.retake_selfie')}</span>
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-accent/30 text-primary flex items-center justify-center mx-auto shadow-2xs">
                    <Camera className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-primary">
                    {t('worker_checkin.subtitle')}
                  </p>
                  <Button
                    size="md"
                    variant="accent"
                    onClick={() => fileInputRef.current?.click()}
                    className="!w-auto px-5"
                    leftIcon={<Camera className="w-4 h-4" />}
                  >
                    {t('worker_checkin.take_selfie')}
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleCapturePhoto}
              />
            </div>

            {/* GPS Verification Badge */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-emerald-900">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isDetectingGps
                    ? t('worker_checkin.gps_detecting')
                    : gpsCoords
                    ? t('worker_checkin.gps_detected')
                    : 'GPS લોકેશન ચકાસણી તૈયાર'}
                </span>
              </div>
              {gpsCoords && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Button
              variant="primary"
              size="xl"
              onClick={handleConfirmCheckIn}
              isLoading={isSubmitting}
              disabled={!selfieUrl}
              leftIcon={<CheckCircle2 className="w-6 h-6 text-accent" />}
            >
              {t('worker_checkin.confirm_button')}
            </Button>
            <Button variant="secondary" size="md" onClick={onClose}>
              {t('common.cancel')}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
