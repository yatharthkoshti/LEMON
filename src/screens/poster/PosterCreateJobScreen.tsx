import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Calendar, Clock, Users, IndianRupee, 
  MapPin, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, 
  CreditCard, Sparkles, AlertCircle 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { SkillCategory, Job } from '../../types';
import { Button } from '../../components/ui/Button';
import { SKILLS_CATALOG } from '../../data/skillsCatalog';

export const PosterCreateJobScreen: React.FC = () => {
  const { t } = useTranslation();
  const { createJob, setPosterTab, showToast, posterProfile } = useAppStore();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Step 1: Basic Details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SkillCategory>('construction');
  const [role, setRole] = useState('રાજ મિસ્ત્રી (Raj Mistri)');
  const [location, setLocation] = useState('એસ.જી. હાઇવે, પ્રહલાદ નગર, અમદાવાદ');

  // Step 2: Work Details
  const [date, setDate] = useState('આજે (Today)');
  const [time, setTime] = useState('૦૮:૩૦ સવારે - ૦૫:૩૦ સાંજે');
  const [workersNeeded, setWorkersNeeded] = useState<number>(2);
  const [dailyWageOffer, setDailyWageOffer] = useState<number>(1200);
  const [description, setDescription] = useState('૩ માળના રહેણાંક પ્રોજેક્ટ માટે કડિયા અને પ્લાસ્ટર કામ.');
  const [instructions, setInstructions] = useState('પોતાના સાધનો સાથે લાવવા, સેફ્ટી હેલ્મેટ જરૂરી.');

  // Fee calculations (PRD: "We take 10%", "Worker receives ₹X after fee")
  const totalWorkerPayout = workersNeeded * dailyWageOffer;
  const platformFee = Math.round(totalWorkerPayout * 0.10); // 10% Lemon Fee
  const totalPayable = totalWorkerPayout + platformFee;

  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    if (step === 1 && !title.trim()) {
      showToast('કૃપા કરીને કામનું શીર્ષક દાખલ કરો', 'error');
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit with Payment (Razorpay Placeholder)
  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      createJob({
        title,
        category,
        location,
        date,
        time,
        dailyWage: dailyWageOffer,
        workersRequired: workersNeeded,
        description,
        instructions: instructions.split(',').map(s => s.trim()).filter(Boolean),
        paymentStatus: 'paid'
      });
      setIsProcessing(false);
      showToast('Razorpay દ્વારા ચુકવણી સફળ! જોબ પોસ્ટ થઈ ગઈ છે.', 'success');
      setPosterTab('jobs');
    }, 700);
  };

  // Submit with "Skip for now" (marked Payment Pending)
  const handleSkipPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      createJob({
        title,
        category,
        location,
        date,
        time,
        dailyWage: dailyWageOffer,
        workersRequired: workersNeeded,
        description,
        instructions: instructions.split(',').map(s => s.trim()).filter(Boolean),
        paymentStatus: 'pending'
      });
      setIsProcessing(false);
      showToast('જોબ સફળતાપૂર્વક પોસ્ટ થઈ (ચુકવણી બાકી).', 'info');
      setPosterTab('jobs');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header & Step Indicator */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
              {t('create_job.heading')}
            </h2>
            <p className="text-xs sm:text-sm text-secondary font-medium">
              {t('create_job.subheading')}
            </p>
          </div>

          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-accent text-primary">
            પગલું {step} / {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-card rounded-4xl p-6 sm:p-8 border border-gray-100 shadow-soft">
        <AnimatePresence mode="wait">
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-primary font-heading">
                {t('create_job.step1')}
              </h3>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1.5">
                  {t('create_job.job_title_label')} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('create_job.job_title_placeholder')}
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-base font-bold text-primary focus:bg-white focus:border-primary focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1.5">
                  {t('create_job.category_label')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SkillCategory)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-primary focus:bg-white focus:outline-none"
                >
                  <option value="construction">🏗️ બાંધકામ કારીગર (Construction)</option>
                  <option value="general_labour">👷 સામાન્ય મજૂરી (General Labour)</option>
                  <option value="household">🧹 ઘર સેવાઓ (Household)</option>
                  <option value="loading">📦 લોડિંગ & શિફ્ટિંગ (Loading)</option>
                  <option value="other">🛠️ અન્ય કુશળ કામ (Other)</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1.5">
                  {t('create_job.location_label')} *
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-lemonRed absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t('create_job.location_placeholder')}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-primary focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Work Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-primary font-heading">
                {t('create_job.step2')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-1">
                    {t('create_job.date_label')}
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-primary focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-1">
                    {t('create_job.time_label')}
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-primary focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Workers Needed */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-1">
                    {t('create_job.workers_needed_label')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={workersNeeded}
                    onChange={(e) => setWorkersNeeded(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-primary focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Wage Offer */}
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-1">
                    {t('create_job.daily_wage_label')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      value={dailyWageOffer}
                      onChange={(e) => setDailyWageOffer(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-primary focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1">
                  {t('create_job.description_label')}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-primary focus:bg-white focus:outline-none"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1">
                  {t('create_job.instructions_label')}
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-primary focus:bg-white focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3: Fee Preview (PRD: "We take 10%", "Worker receives ₹X after fee") */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-xl font-bold text-primary font-heading">
                  {t('create_job.fee_preview_title')}
                </h3>
                <p className="text-xs text-secondary font-medium mt-0.5">
                  પારદર્શક ભાવ નિર્ધારણ - કોઈ છૂપી ફી નહીં
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-yellow-50/70 rounded-3xl p-5 border border-accent/70 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-700">
                    {t('create_job.worker_payout_total')}
                  </span>
                  <span className="font-bold text-primary text-base">
                    ₹{totalWorkerPayout} ({workersNeeded} શ્રમિક × ₹{dailyWageOffer})
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-700">
                    {t('create_job.platform_fee_label')}
                  </span>
                  <span className="font-bold text-amber-950 text-base">
                    + ₹{platformFee}
                  </span>
                </div>

                <p className="text-xs text-secondary-dark italic bg-white/60 p-2 rounded-xl">
                  ℹ️ {t('create_job.platform_fee_note')}
                </p>

                <div className="pt-3 border-t border-accent/60 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm text-primary block">
                      {t('create_job.total_cost_label')}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {t('create_job.worker_guarantee_note', { wage: dailyWageOffer })}
                    </span>
                  </div>
                  <span className="font-heading text-3xl text-primary">
                    ₹{totalPayable}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Payment Step (Razorpay Placeholder from PRD) */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-xl font-bold text-primary font-heading">
                  {t('create_job.payment_step_title')}
                </h3>
                <p className="text-xs text-secondary font-medium mt-0.5">
                  {t('create_job.payment_step_desc')}
                </p>
              </div>

              {/* Razorpay Integration Mock Card */}
              <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-primary p-6 rounded-3xl text-white shadow-soft-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-accent" />
                    <span className="font-heading text-lg tracking-wider text-accent">
                      RAZORPAY
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                    Sandbox Ready
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-300 block">ચુકવણી યોગ્ય રકમ:</span>
                  <span className="font-heading text-4xl text-white">
                    ₹{totalPayable}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/20 text-xs text-gray-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>UPI, ડેબિટ કાર્ડ, નેટ બેંકિંગ દ્વારા સુરક્ષિત એસ્ક્રો ચુકવણી</span>
                </div>
              </div>

              {/* Actions: Pay Now vs Skip for Now */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  size="xl"
                  onClick={handlePayNow}
                  isLoading={isProcessing}
                  leftIcon={<CreditCard className="w-5 h-5 text-accent" />}
                >
                  {t('create_job.pay_now_btn', { amount: totalPayable })}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSkipPayment}
                    disabled={isProcessing}
                    className="text-xs font-bold text-gray-600 hover:text-primary underline p-2"
                  >
                    {t('create_job.skip_payment_btn')}
                  </button>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {t('create_job.skip_payment_note')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Step Buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6 gap-3">
            {step > 1 ? (
              <Button
                variant="secondary"
                size="lg"
                fullWidth={false}
                onClick={handlePrev}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="px-6"
              >
                {t('create_job.prev_step')}
              </Button>
            ) : <div />}

            <Button
              variant="primary"
              size="lg"
              fullWidth={false}
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4 text-accent stroke-[3]" />}
              className="px-8 ml-auto"
            >
              {t('create_job.next_step')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
