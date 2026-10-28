import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertOctagon, X, Send, ShieldAlert, 
  IndianRupee, Phone, Building, CheckCircle2, Mic
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Job } from '../../types';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { VoiceRecorder } from '../ui/VoiceRecorder';
import { uploadMediaToS3 } from '../../utils/s3Upload';

interface DisputeModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ job, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { profile, showToast } = useAppStore();
  const [reason, setReason] = useState('unpaid_wage');
  const [disputedAmount, setDisputedAmount] = useState<number>(job?.dailyWage || 0);
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!job) return null;

  const reasons = [
    { id: 'unpaid_wage', label: 'મજૂરી ના આપી (Wages Not Paid)' },
    { id: 'underpaid', label: 'ઓછા રૂપિયા આપ્યા (Underpaid / Partial Payment)' },
    { id: 'unsafe_site', label: 'અસુરક્ષિત સાઇટ (Unsafe Working Conditions)' },
    { id: 'harassment', label: 'દુર્વ્યવહાર / શોષણ (Mistreatment / Harassment)' },
    { id: 'other', label: 'અન્ય ફરિયાદ (Other Issue)' }
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const selectedReasonLabel = reasons.find(r => r.id === reason)?.label || reason;
    const ticketId = `TICKET-${Date.now().toString().slice(-6)}`;
    
    // Construct dispute email
    const subject = encodeURIComponent(`[LEMON DISPUTE ${ticketId}] Job: ${job.title} - ${job.company}`);
    const emailBody = encodeURIComponent(
      `LEMON LABOR DISPUTE REPORT\n` +
      `Ticket ID: ${ticketId}\n` +
      `Date: ${new Date().toLocaleString()}\n` +
      `-----------------------------------------\n` +
      `JOB DETAILS:\n` +
      `Job ID: ${job.id}\n` +
      `Title: ${job.title}\n` +
      `Employer / Company: ${job.company}\n` +
      `Location: ${job.location}\n` +
      `Daily Wage: Rs. ${job.dailyWage}\n` +
      `Job Status: ${job.status}\n` +
      `-----------------------------------------\n` +
      `WORKER DETAILS (Complainant):\n` +
      `Name: ${profile.name}\n` +
      `Phone: ${profile.phone}\n` +
      `Worker ID: ${profile.id}\n` +
      `-----------------------------------------\n` +
      `DISPUTE ISSUE:\n` +
      `Category: ${selectedReasonLabel}\n` +
      `Disputed Amount: Rs. ${disputedAmount}\n` +
      `Worker Statement:\n${description || 'No additional written statement'}\n` +
      `Voice Note Attached: ${audioUrl ? 'Yes (Local Media URL recorded)' : 'No'}\n` +
      `-----------------------------------------\n` +
      `Sent via Lemon Digital Labour Chowk Platform to lemonabuses@gmail.com`
    );

    // Trigger standard mail client to lemonabuses@gmail.com
    window.open(`mailto:lemonabuses@gmail.com?subject=${subject}&body=${emailBody}`, '_blank');

    setIsSubmitted(true);
    showToast(`ફરિયાદ સફળતાપૂર્વક મોકલાઈ (Ticket ${ticketId})`, 'success');
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDescription('');
    setAudioUrl('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-card rounded-3xl shadow-soft-lg border border-gray-100 z-10 max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 pb-3 border-b border-gray-100 bg-red-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-700 tracking-tight font-heading">
                    Report Payment Dispute (ફરિયાદ કરો)
                  </h3>
                  <p className="text-xs text-red-600/80 font-medium">To: lemonabuses@gmail.com</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4 overflow-y-auto flex-1 space-y-4">
              {isSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading text-xl text-primary font-bold">
                    ફરિયાદ નોંધાઈ ગઈ છે (Dispute Filed)
                  </h4>
                  <p className="text-sm text-gray-600 max-w-xs mx-auto">
                    Your dispute has been logged and sent to <strong>lemonabuses@gmail.com</strong>. Our dispute resolution team will review within 24 hours.
                  </p>
                  <Button variant="primary" size="lg" onClick={handleClose}>
                    Close (બંધ કરો)
                  </Button>
                </div>
              ) : (
                <>
                  {/* Job Summary Banner */}
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 space-y-1">
                    <p className="text-xs font-bold text-gray-500 uppercase">{job.company}</p>
                    <p className="font-bold text-primary text-sm">{job.title}</p>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-600 pt-1">
                      <span>સ્થળ: {job.location}</span>
                      <span className="text-primary font-bold">વેતન: ₹{job.dailyWage}/day</span>
                    </div>
                  </div>

                  {/* Reason Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      ફરિયાદનો પ્રકાર (Issue Category)
                    </label>
                    <div className="space-y-1.5">
                      {reasons.map((r) => (
                        <label
                          key={r.id}
                          className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                            reason === r.id
                              ? 'bg-red-50 border-red-500 text-red-900 font-bold'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="dispute_reason"
                            value={r.id}
                            checked={reason === r.id}
                            onChange={() => setReason(r.id)}
                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-xs sm:text-sm">{r.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Disputed Amount */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                      બાકી / વિવાદિત રકમ (Disputed Amount)
                    </label>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200">
                      <span className="font-heading text-lg text-primary pl-2">₹</span>
                      <input
                        type="number"
                        value={disputedAmount || ''}
                        onChange={(e) => setDisputedAmount(parseInt(e.target.value) || 0)}
                        placeholder="Amount in Rupees"
                        className="w-full bg-transparent font-heading text-lg font-bold text-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Voice Note Option for dispute */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Mic className="w-4 h-4 text-accent-dark" />
                      <label className="text-xs font-bold text-gray-700 uppercase">
                        બોલીને ફરિયાદ નોંધાવો (Voice Explanation)
                      </label>
                    </div>
                    <VoiceRecorder 
                      onRecordingComplete={async (blob, localUrl) => {
                        if (blob && blob.size > 0) {
                          const s3Url = await uploadMediaToS3(blob, 'disputes');
                          setAudioUrl(s3Url);
                        } else {
                          setAudioUrl(localUrl);
                        }
                      }}
                      initialAudioUrl={audioUrl}
                    />
                  </div>

                  {/* Written Explanation */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                      વિગતવાર વર્ણન (Written Details)
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="શું બન્યું હતું? શેઠે શું કહ્યું? વિગત જણાવો..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs sm:text-sm text-primary focus:ring-2 focus:ring-red-400 outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer Actions */}
            {!isSubmitted && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-2 shrink-0">
                <Button variant="secondary" size="lg" onClick={handleClose} className="flex-1">
                  Cancel (રદ કરો)
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => handleSubmit()}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="flex-1"
                >
                  Send to lemonabuses@gmail.com
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
