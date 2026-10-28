import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, MapPin,
  Users, User, Home, Heart, Combine,
  Car, Footprints, Mic, FileText, Upload,
  AlertCircle, Copy, CheckCircle2, Plus, Trash2,
  IndianRupee
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { RequestedUnitType, WorkerRoleSlot } from '../../types';
import { usePosterMenu } from '../../components/poster/PosterLayout';
import { VoiceRecorder } from '../../components/ui/VoiceRecorder';
import { uploadMediaToS3 } from '../../utils/s3Upload';
import paymentQr from '../../assets/payment-qr.jpg';

const UNIT_TYPES: { id: RequestedUnitType; icon: any; label: string }[] = [
  { id: 'individual', icon: User, label: 'Individuals Only' },
  { id: 'group', icon: Users, label: 'Groups' },
  { id: 'family', icon: Home, label: 'Families' },
  { id: 'friends', icon: Heart, label: 'Friends' },
  { id: 'mixed', icon: Combine, label: 'Any/Mixed' },
];

const COMMON_ROLES = [
  'Majdoor (મજૂર)',
  'Karigar (કારીગર)',
  'Mistri (મિસ્ત્રી)',
  'Helper (હેલ્પર)',
  'Tile Worker (ટાઇલ)',
  'Plumber (પ્લમ્બર)',
  'Electrician (ઇ.)',
  'Painter (પેઇન્ટર)',
  'Driver (ડ્રાઇવર)',
  'Loader (લોડર)',
  'Cleaner (ક્લીનર)',
];

const UPI_ID = 'koshtiyatharth7777-1@okicici';

export const PosterCreateJobScreen: React.FC = () => {
  const { t } = useTranslation();
  const { createJob, setPosterTab, showToast } = useAppStore();
  const { openMenu } = usePosterMenu();
  const [step, setStep] = useState(1);

  // ── Step 1: Job basics ─────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [unitTypes, setUnitTypes] = useState<RequestedUnitType[]>(['any']);
  const [transportProvided, setTransportProvided] = useState<boolean>(true);

  // ── Step 2: Workers & Roles ────────────────────────────────────────────
  // Each slot = { role, count, dailyWage }
  const [workerSlots, setWorkerSlots] = useState<WorkerRoleSlot[]>([
    { role: 'Majdoor (મજૂર)', count: 1, dailyWage: 600 },
  ]);

  const totalWorkers = workerSlots.reduce((sum, s) => sum + s.count, 0);
  const platformPostingFee = totalWorkers * 20;
  const blendedDailyWage = totalWorkers > 0
    ? Math.round(workerSlots.reduce((sum, s) => sum + s.count * s.dailyWage, 0) / totalWorkers)
    : 0;

  const addSlot = () => setWorkerSlots(prev => [...prev, { role: 'Helper (હેલ્પર)', count: 1, dailyWage: 500 }]);
  const removeSlot = (i: number) => setWorkerSlots(prev => prev.filter((_, idx) => idx !== i));
  const updateSlot = (i: number, update: Partial<WorkerRoleSlot>) =>
    setWorkerSlots(prev => prev.map((s, idx) => idx === i ? { ...s, ...update } : s));

  // ── Step 3: Description ────────────────────────────────────────────────
  const [voiceUrl, setVoiceUrl] = useState('');
  const [textDescription, setTextDescription] = useState('');

  // ── Step 4: Payment ────────────────────────────────────────────────────
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('');
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => {
    if (step === 1) setPosterTab('overview');
    else setStep(s => s - 1);
  };

  const toggleUnitType = (id: RequestedUnitType) => {
    setUnitTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(UPI_ID);
    setCopiedUpi(true);
    showToast(`UPI ID copied: ${UPI_ID}`, 'info');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleScreenshotSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingScreenshot(true);
    try {
      const s3Url = await uploadMediaToS3(file, 'payment_proofs' as any);
      setPaymentScreenshotUrl(s3Url);
      showToast('✓ Payment screenshot uploaded!', 'success');
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentScreenshotUrl(reader.result as string);
        showToast('✓ Payment screenshot saved!', 'success');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const publishJob = () => {
    if (!paymentScreenshotUrl) {
      showToast(`₹${platformPostingFee} ની ચુકવણીનો screenshot અપલોડ કરો`, 'error');
      return;
    }
    if (!title.trim()) {
      showToast('Job નું નામ ભૂલ્યા?', 'error');
      return;
    }

    createJob({
      title: title || 'General Labour Required',
      dailyWage: blendedDailyWage,
      workersRequired: totalWorkers,
      requestedUnitTypes: unitTypes.length ? unitTypes : ['any'],
      transportProvided,
      voiceDescriptionUrl: voiceUrl || undefined,
      description: textDescription || 'Job description not provided.',
      paymentStatus: 'pending_verification',
      paymentScreenshotUrl,
      platformPostingFee,
      adminApproved: false,
      workerRoles: workerSlots,
      location: location || 'Location TBD',
    });

    showToast(`✓ Job posted! Admin reviewing ₹${platformPostingFee} payment.`, 'success');
    setPosterTab('jobs');
  };

  const TOTAL_STEPS = 4;

  return (
    <div className="absolute inset-0 bg-gray-50 z-40 overflow-y-auto pb-28">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={handleBack} className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <div className="flex-1">
          <h1 className="font-heading text-lg font-bold text-primary">Job Post કરો</h1>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i + 1 <= step ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
        <span className="text-xs font-bold text-secondary bg-gray-100 px-2 py-1 rounded-lg">
          {step}/{TOTAL_STEPS}
        </span>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Job Basics ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-heading font-bold text-xl text-primary">📋 Job Details</h2>

                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Job નું નામ *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Raj Mistri for Construction"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white font-semibold text-primary outline-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">📍 Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Bopal, Ahmedabad"
                      className="w-full pl-9 pr-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white font-semibold text-primary outline-none"
                    />
                  </div>
                </div>

                {/* Transport */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">🚌 Transport</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: true, icon: Car, label: 'Transport Included', sub: 'Employer arranges', color: 'emerald' },
                      { val: false, icon: Footprints, label: 'Worker Arranges', sub: 'Worker comes own', color: 'red' },
                    ].map(opt => (
                      <button
                        key={String(opt.val)}
                        onClick={() => setTransportProvided(opt.val)}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 text-center transition-all ${
                          transportProvided === opt.val
                            ? opt.color === 'emerald'
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <opt.icon className={`w-6 h-6 ${transportProvided === opt.val ? (opt.color === 'emerald' ? 'text-emerald-600' : 'text-red-600') : 'text-gray-400'}`} />
                        <span className={`text-xs font-bold ${transportProvided === opt.val ? (opt.color === 'emerald' ? 'text-emerald-700' : 'text-red-700') : 'text-gray-500'}`}>{opt.label}</span>
                        <span className="text-[10px] text-gray-400">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Unit types */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">👥 Worker Type Accepted</label>
                  <div className="flex flex-wrap gap-2">
                    {UNIT_TYPES.map(u => (
                      <button
                        key={u.id}
                        onClick={() => toggleUnitType(u.id)}
                        className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
                          unitTypes.includes(u.id) ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 bg-white text-gray-500'
                        }`}
                      >
                        <u.icon className="w-3.5 h-3.5" />
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Workers & Per-Role Wages ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-bold text-xl text-primary">👷 Workers & Wages</h2>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{totalWorkers}</p>
                    <p className="text-xs text-gray-400">Total Workers</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  દરેક role ની સંખ્યા અને wages અલગ-અલગ set કરો.
                </p>

                {/* Role Slots */}
                <div className="space-y-3">
                  {workerSlots.map((slot, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase">Role {i + 1}</span>
                        {workerSlots.length > 1 && (
                          <button onClick={() => removeSlot(i)} className="text-red-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Role selector */}
                      <div>
                        <label className="text-xs font-semibold text-gray-400 mb-1 block">Role / Skill</label>
                        <select
                          value={slot.role}
                          onChange={e => updateSlot(i, { role: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-gray-200 focus:border-primary font-semibold text-primary outline-none text-sm"
                        >
                          {COMMON_ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>

                      {/* Count + Wage row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-400 mb-1 block">Count (સંખ્યા)</label>
                          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-3 py-2">
                            <button
                              onClick={() => updateSlot(i, { count: Math.max(1, slot.count - 1) })}
                              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-primary text-lg leading-none"
                            >−</button>
                            <span className="flex-1 text-center font-bold text-xl text-primary">{slot.count}</span>
                            <button
                              onClick={() => updateSlot(i, { count: slot.count + 1 })}
                              className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-lg leading-none"
                            >+</button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-400 mb-1 block">Daily Wage (₹/day)</label>
                          <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl px-3 py-2 gap-1">
                            <IndianRupee className="w-4 h-4 text-gray-400" />
                            <input
                              type="number"
                              value={slot.dailyWage}
                              onChange={e => updateSlot(i, { dailyWage: parseInt(e.target.value) || 0 })}
                              className="flex-1 outline-none font-bold text-primary text-lg bg-transparent min-w-0"
                              min={0}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="bg-primary/5 rounded-xl px-3 py-2 text-xs font-bold text-primary flex justify-between">
                        <span>{slot.role} × {slot.count}</span>
                        <span>₹{(slot.count * slot.dailyWage).toLocaleString('en-IN')}/day</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full" onClick={addSlot} leftIcon={<Plus className="w-4 h-4" />}>
                  બીજો Role ઉમેરો (Add Another Role)
                </Button>

                {/* Summary */}
                <div className="bg-primary/10 rounded-2xl p-4 space-y-2">
                  <h3 className="font-bold text-primary text-sm">Summary</h3>
                  {workerSlots.map((s, i) => (
                    <div key={i} className="flex justify-between text-xs font-semibold text-gray-700">
                      <span>{s.role} × {s.count}</span>
                      <span>₹{(s.count * s.dailyWage).toLocaleString('en-IN')}/day</span>
                    </div>
                  ))}
                  <div className="border-t border-primary/20 pt-2 flex justify-between font-bold text-primary">
                    <span>Total: {totalWorkers} workers</span>
                    <span>₹{(workerSlots.reduce((sum, s) => sum + s.count * s.dailyWage, 0)).toLocaleString('en-IN')}/day</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Description ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                <h2 className="font-heading font-bold text-xl text-primary">📝 Job Description</h2>

                {/* Voice recording */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5" /> Voice Description (Voice JD)
                  </label>
                  <VoiceRecorder onRecordingComplete={(_, url) => setVoiceUrl(url)} />
                  {voiceUrl && (
                    <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <audio src={voiceUrl} controls className="w-full h-8" />
                    </div>
                  )}
                </div>

                {/* Text description */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Text Description (Optional)
                  </label>
                  <textarea
                    value={textDescription}
                    onChange={e => setTextDescription(e.target.value)}
                    rows={4}
                    placeholder="Job ની વિગત અહીં લખો..."
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white font-medium text-primary outline-none resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Payment ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-5">
                <h2 className="font-heading font-bold text-xl text-primary">💳 Platform Fee Payment</h2>

                {/* Fee summary */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <p className="text-xs text-amber-700 font-bold uppercase tracking-wide mb-1">
                    Advance Platform Fee
                  </p>
                  <p className="text-4xl font-black text-primary">₹{platformPostingFee}</p>
                  <p className="text-xs text-amber-700 mt-1">
                    {totalWorkers} worker{totalWorkers !== 1 ? 's' : ''} × ₹20 = ₹{platformPostingFee}
                  </p>
                </div>

                {/* Real QR Code */}
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-3 shadow-sm">
                    <img src={paymentQr} alt="Payment QR - Yatharth Koshti" className="w-56 h-auto mx-auto" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium text-center">
                    Google Pay / PhonePe / Paytm — Scan to pay
                  </p>
                </div>

                {/* UPI ID copy */}
                <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3">
                  <span className="flex-1 font-bold text-primary text-sm">{UPI_ID}</span>
                  <button
                    onClick={handleCopyUpi}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${copiedUpi ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700 hover:bg-primary/20'}`}
                  >
                    {copiedUpi ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUpi ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  ₹{platformPostingFee} ભર્યા પછી screenshot અપલોડ કરો 👇
                </p>

                {/* Screenshot upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotSelect}
                  className="hidden"
                />

                {paymentScreenshotUrl ? (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-emerald-50/30 p-2">
                      <img src={paymentScreenshotUrl} alt="Payment Screenshot" className="w-full max-h-56 object-contain rounded-xl" />
                      <div className="absolute top-4 right-4 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded ✓
                      </div>
                    </div>
                    <Button variant="outline" size="md" onClick={() => fileInputRef.current?.click()} isLoading={isUploadingScreenshot} className="w-full text-xs">
                      Screenshot બદલો (Change)
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingScreenshot}
                    className="w-full border-2 border-dashed border-gray-300 hover:border-primary p-6 rounded-2xl flex flex-col items-center gap-2 transition-all bg-gray-50/50 hover:bg-yellow-50/30 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-yellow-100 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-primary">
                      {isUploadingScreenshot ? 'Uploading...' : 'Payment Screenshot અપલોડ કરો'}
                    </span>
                    <span className="text-[11px] text-gray-400">PNG, JPG (Max 10MB)</span>
                  </button>
                )}

                {/* Notice */}
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-900 font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>નોંધ:</strong> Admin screenshot verify કરશે. ખોટો screenshot મળ્યે job cancel થઈ જશે અને post નહીં થાય.
                  </span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-4 border-t border-gray-100 z-30">
        <div className="max-w-md mx-auto flex gap-3">
          {step < 4 ? (
            <Button
              variant="primary"
              className="w-full h-14 text-lg font-bold"
              onClick={handleNext}
              rightIcon={<ArrowRight />}
              disabled={step === 1 && !title.trim()}
            >
              {step === 3 ? `ચુકવણી કરવા આગળ વધો (Pay ₹${platformPostingFee})` : 'આગળ (Next)'}
            </Button>
          ) : (
            <Button
              variant="primary"
              className={`w-full h-14 text-lg font-bold transition-all ${!paymentScreenshotUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={publishJob}
              disabled={!paymentScreenshotUrl || isUploadingScreenshot}
              leftIcon={<Check className="w-5 h-5" />}
            >
              {paymentScreenshotUrl ? `✓ Job Post કરો (₹${platformPostingFee} paid)` : 'Screenshot અપલોડ કરો'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
