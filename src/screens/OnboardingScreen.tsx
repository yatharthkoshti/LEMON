import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, MapPin, Check, ArrowRight, ArrowLeft, Users, 
  Sparkles, CheckCircle2, ShieldCheck, IndianRupee, Clock, Briefcase, Plus, Minus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { SkillCard } from '../components/onboarding/SkillCard';
import { SpeechButton } from '../components/ui/SpeechButton';
import { useAppStore } from '../store/useAppStore';
import { 
  ExperienceLevel, AvailabilitySlot, WorkerProfile, SkillCategory 
} from '../types';
import { SKILLS_CATALOG, CATEGORY_ORDER, GUJARAT_CITIES, PRESET_WAGES } from '../data/skillsCatalog';

export const OnboardingScreen: React.FC = () => {
  const { t } = useTranslation();
  const { phone, completeOnboarding, showToast } = useAppStore();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Step 1: Basic Info
  const [name, setName] = useState('રમેશભાઈ પરમાર');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [city, setCity] = useState(GUJARAT_CITIES[0]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationDetecting, setLocationDetecting] = useState(false);

  // Step 2: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['raj_mistri', 'tile_karigar']);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');

  // Step 3: Experience
  const [experience, setExperience] = useState<ExperienceLevel>('3-5');

  // Step 4: Availability
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    'morning',
    'afternoon',
    'weekdays'
  ]);

  // Step 5: Wage & Group Registration
  const [dailyWage, setDailyWage] = useState<number>(1200);
  const [customWageInput, setCustomWageInput] = useState<string>('');
  const [isCustomWage, setIsCustomWage] = useState<boolean>(false);

  // Group / Team state
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>('રાજ મિસ્ત્રી + ૨ હેલ્પર ટીમ');
  const [memberCount, setMemberCount] = useState<number>(3);
  const [wagePerMember, setWagePerMember] = useState<number>(1000);

  // Profile photo upload simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
        showToast('પ્રોફાઇલ ફોટો ઉમેરાયો!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // GPS Location detection simulation
  const handleEnableLocation = () => {
    setLocationDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationDetecting(false);
          setLocationEnabled(true);
          showToast('GPS લોકેશન સફળતાપૂર્વક મેળવાયું', 'success');
        },
        () => {
          // Fallback simulation for desktop or permission denied
          setTimeout(() => {
            setLocationDetecting(false);
            setLocationEnabled(true);
            showToast('GPS સક્રિય: અમદાવાદ કેન્દ્ર', 'info');
          }, 600);
        }
      );
    } else {
      setTimeout(() => {
        setLocationDetecting(false);
        setLocationEnabled(true);
        showToast('GPS સ્થાન નિર્ધારિત થયું', 'info');
      }, 500);
    }
  };

  // Skill toggle
  const handleToggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      if (selectedSkills.length === 1) {
        showToast('ઓછામાં ઓછું ૧ કામ પસંદ કરવું જરૂરી છે', 'info');
        return;
      }
      setSelectedSkills(selectedSkills.filter((s) => s !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  // Availability slot toggle
  const handleToggleAvailability = (slot: AvailabilitySlot) => {
    if (slot === 'anytime') {
      setAvailability(['anytime']);
      return;
    }
    const filtered = availability.filter((a) => a !== 'anytime');
    if (filtered.includes(slot)) {
      setAvailability(filtered.filter((s) => s !== slot));
    } else {
      setAvailability([...filtered, slot]);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim()) {
        showToast('કૃપા કરીને તમારું નામ દાખલ કરો', 'error');
        return;
      }
    }
    if (step === 2) {
      if (selectedSkills.length === 0) {
        showToast('કૃપા કરીને તમારું કામ પસંદ કરો', 'error');
        return;
      }
    }
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finalize Onboarding
      const finalProfile: WorkerProfile = {
        id: `worker-${Date.now()}`,
        name: name.trim(),
        phone: phone || '98250 11223',
        photoUrl: photoUrl || '',
        city,
        locationCoords: { lat: 23.0225, lng: 72.5714 },
        skills: selectedSkills,
        experience,
        availability,
        dailyWage: isCustomWage ? Number(customWageInput) || 1200 : dailyWage,
        groupDetails: {
          isGroup,
          teamName: isGroup ? teamName : '',
          leaderName: name,
          memberCount: isGroup ? memberCount : 1,
          memberSkills: selectedSkills,
          wagePerMember: isGroup ? wagePerMember : dailyWage,
          totalDailyWage: isGroup ? memberCount * wagePerMember : dailyWage
        },
        attendanceRate: 100,
        completedJobsCount: 0,
        joinedDate: 'આજે',
        rating: 5.0,
        languages: ['gu', 'hi']
      };

      completeOnboarding(finalProfile);
      showToast('સ્વાગત છે! તમારી પ્રોફાઇલ તૈયાર થઈ ગઈ છે.', 'success');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredSkills = activeCategory === 'all'
    ? SKILLS_CATALOG
    : SKILLS_CATALOG.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-28 pt-4 px-4 max-w-lg mx-auto flex flex-col justify-between">
      {/* Step Header & Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl text-primary">LEMON</span>
            <span className="text-xs font-bold text-secondary bg-gray-200/80 px-2 py-0.5 rounded-full">
              {t('onboarding.step_counter', { current: step, total: totalSteps })}
            </span>
          </div>

          {step > 1 && (
            <button
              onClick={handlePrevStep}
              className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('onboarding.back')}</span>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-accent h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Dynamic Step Content */}
      <div className="flex-1">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                  {t('onboarding.step1_title')}
                </h2>
                <SpeechButton
                  textToSpeak={`${t('onboarding.step1_title')}. ${t('onboarding.step1_subtitle')}`}
                  size="sm"
                />
              </div>
              <p className="text-sm font-semibold text-secondary mt-0.5">
                {t('onboarding.step1_subtitle')}
              </p>
            </div>

            {/* Photo Upload Box */}
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-4xl border-2 border-dashed border-gray-200 text-center relative shadow-2xs">
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Worker" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-10 h-10 text-primary/70" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white cursor-pointer shadow-md active:scale-95 transition-transform">
                  <Camera className="w-4 h-4 text-accent" />
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
              <label className="cursor-pointer text-sm font-bold text-primary hover:underline">
                {photoUrl ? t('onboarding.change_photo') : t('onboarding.take_photo')}
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            {/* Name Input */}
            <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-2xs">
              <label className="block text-xs font-bold uppercase text-secondary tracking-wider mb-2">
                {t('onboarding.name_label')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('onboarding.name_placeholder')}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-lg font-bold text-primary focus:bg-white focus:border-primary focus:outline-none"
              />
            </div>

            {/* Verified Phone display */}
            <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-secondary">
                  {t('onboarding.phone_label')}
                </span>
                <span className="text-base font-extrabold text-primary">
                  +91 {phone || '98250 11223'}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t('onboarding.phone_verified')}
              </span>
            </div>

            {/* City Selector & GPS Location */}
            <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-2xs space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-secondary tracking-wider mb-2">
                  {t('onboarding.city_label')}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-base font-bold text-primary focus:outline-none focus:border-primary"
                >
                  {GUJARAT_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enable GPS Button */}
              <button
                type="button"
                onClick={handleEnableLocation}
                className={`w-full py-3 px-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  locationEnabled
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-gray-50 border-gray-200 text-primary hover:bg-gray-100'
                }`}
              >
                <MapPin className={`w-4 h-4 ${locationEnabled ? 'text-emerald-600' : 'text-primary'}`} />
                <span>
                  {locationDetecting
                    ? t('onboarding.location_detecting')
                    : locationEnabled
                    ? t('onboarding.location_enabled')
                    : t('onboarding.enable_location')}
                </span>
                {locationEnabled && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Select Your Work (Cards with Illustrations & Categories) */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                  {t('onboarding.step2_title')}
                </h2>
                <SpeechButton
                  textToSpeak={`${t('onboarding.step2_title')}. ${t('onboarding.step2_subtitle')}`}
                  size="sm"
                />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-secondary mt-0.5">
                {t('onboarding.step2_subtitle')}
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 text-secondary-dark'
                }`}
              >
                બધા (All {SKILLS_CATALOG.length})
              </button>
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-secondary-dark'
                  }`}
                >
                  {t(`categories.${cat}`)}
                </button>
              ))}
            </div>

            {/* Skill Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  isSelected={selectedSkills.includes(skill.id)}
                  onToggle={handleToggleSkill}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3: Experience */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                  {t('onboarding.step3_title')}
                </h2>
                <SpeechButton
                  textToSpeak={`${t('onboarding.step3_title')}. ${t('onboarding.step3_subtitle')}`}
                  size="sm"
                />
              </div>
              <p className="text-sm font-semibold text-secondary mt-0.5">
                {t('onboarding.step3_subtitle')}
              </p>
            </div>

            {/* Experience Options */}
            <div className="space-y-3.5">
              {[
                { id: '0-1', labelKey: 'experience.0_1', icon: '🌱', badge: 'શરૂઆતી' },
                { id: '1-3', labelKey: 'experience.1_3', icon: '🔨', badge: 'કુશળ' },
                { id: '3-5', labelKey: 'experience.3_5', icon: '⭐', badge: 'અનુભવી' },
                { id: '5+', labelKey: 'experience.5_plus', icon: '👑', badge: 'માસ્ટર કારીગર' }
              ].map((item) => {
                const isSelected = experience === item.id;
                return (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setExperience(item.id as ExperienceLevel)}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between select-none ${
                      isSelected
                        ? 'bg-amber-50/90 border-primary shadow-soft'
                        : 'bg-card border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl p-2 rounded-2xl bg-white shadow-2xs border border-gray-100">
                        {item.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-primary">
                            {t(item.labelKey)}
                          </h4>
                        </div>
                        <span className="text-xs font-semibold text-secondary">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                        isSelected
                          ? 'bg-primary border-primary text-accent'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 4: Availability */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                  {t('onboarding.step4_title')}
                </h2>
                <SpeechButton
                  textToSpeak={`${t('onboarding.step4_title')}. ${t('onboarding.step4_subtitle')}`}
                  size="sm"
                />
              </div>
              <p className="text-sm font-semibold text-secondary mt-0.5">
                {t('onboarding.step4_subtitle')}
              </p>
            </div>

            {/* Availability Slots Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'morning', labelKey: 'availability.morning', icon: '🌅' },
                { id: 'afternoon', labelKey: 'availability.afternoon', icon: '☀️' },
                { id: 'evening', labelKey: 'availability.evening', icon: '🌆' },
                { id: 'night', labelKey: 'availability.night', icon: '🌙' },
                { id: 'weekdays', labelKey: 'availability.weekdays', icon: '📅' },
                { id: 'weekends', labelKey: 'availability.weekends', icon: '🏖️' }
              ].map((slot) => {
                const isSelected = availability.includes(slot.id as AvailabilitySlot);
                return (
                  <motion.div
                    key={slot.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleAvailability(slot.id as AvailabilitySlot)}
                    className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                      isSelected
                        ? 'bg-amber-50/90 border-primary shadow-soft'
                        : 'bg-card border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{slot.icon}</span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                          isSelected
                            ? 'bg-primary border-primary text-accent'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {t(slot.labelKey)}
                    </span>
                  </motion.div>
                );
              })}

              {/* Special Full-width "Available Anytime" Card */}
              <div
                onClick={() => handleToggleAvailability('anytime')}
                className={`col-span-2 p-4 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between select-none ${
                  availability.includes('anytime')
                    ? 'bg-accent/30 border-primary shadow-soft'
                    : 'bg-card border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="text-base font-extrabold text-primary">
                      {t('availability.anytime')}
                    </h4>
                    <p className="text-xs text-secondary font-medium">
                      સૌથી વધુ કામની ઓફર મેળવવા માટે શ્રેષ્ઠ
                    </p>
                  </div>
                </div>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                    availability.includes('anytime')
                      ? 'bg-primary border-primary text-accent'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {availability.includes('anytime') && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: Daily Wage & Group Registration */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-primary tracking-tight">
                  {t('onboarding.step5_title')}
                </h2>
                <SpeechButton
                  textToSpeak={`${t('onboarding.step5_title')}. ${t('onboarding.step5_subtitle')}`}
                  size="sm"
                />
              </div>
              <p className="text-sm font-semibold text-secondary mt-0.5">
                {t('onboarding.step5_subtitle')}
              </p>
            </div>

            {/* Current Wage Display Card */}
            <div className="bg-card rounded-4xl p-6 border-2 border-accent shadow-soft text-center">
              <span className="text-xs font-bold uppercase text-secondary tracking-wider block mb-1">
                તમારું દૈનિક વેતન
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-bold text-primary">₹</span>
                <span className="font-heading text-5xl text-primary leading-none">
                  {isCustomWage ? (customWageInput || '0') : dailyWage}
                </span>
                <span className="text-base font-bold text-secondary">/ દિવસ</span>
              </div>
            </div>

            {/* Preset Wage Buttons */}
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-2">
                ઝડપી પસંદગી (Presets)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {PRESET_WAGES.map((amount) => {
                  const isSelected = !isCustomWage && dailyWage === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setIsCustomWage(false);
                        setDailyWage(amount);
                      }}
                      className={`py-3.5 px-3 rounded-2xl font-heading text-xl transition-all border-2 ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-soft'
                          : 'bg-white border-gray-200 text-primary hover:border-gray-300'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsCustomWage(true)}
                  className={`py-3.5 px-3 rounded-2xl font-bold text-sm transition-all border-2 ${
                    isCustomWage
                      ? 'bg-primary text-white border-primary shadow-soft'
                      : 'bg-white border-gray-200 text-primary hover:border-gray-300'
                  }`}
                >
                  અન્ય રકમ
                </button>
              </div>

              {isCustomWage && (
                <div className="mt-3">
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-lg font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      value={customWageInput}
                      onChange={(e) => setCustomWageInput(e.target.value)}
                      placeholder="દા.ત. ૧૬૦૦"
                      className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white border-2 border-primary text-lg font-bold text-primary focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Group Registration Feature Card */}
            <div className="bg-card rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent/30 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-primary">
                      {t('onboarding.group_registration_toggle')}
                    </h4>
                    <p className="text-xs text-secondary mt-0.5 leading-snug">
                      {t('onboarding.group_registration_desc')}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={isGroup}
                    onChange={(e) => setIsGroup(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-13 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Group Fields when toggle is active */}
              {isGroup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-3 border-t border-gray-100 space-y-4"
                >
                  {/* Team Name */}
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1">
                      {t('onboarding.group_name_label')}
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder={t('onboarding.group_name_placeholder')}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-primary focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Member Counter */}
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1">
                      {t('onboarding.group_members_count')}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setMemberCount(Math.max(2, memberCount - 1))}
                        className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-xl hover:bg-gray-200 active:scale-95"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="flex-1 py-3 bg-gray-50 rounded-2xl text-center font-heading text-2xl border border-gray-200">
                        {memberCount} સભ્યો
                      </div>
                      <button
                        type="button"
                        onClick={() => setMemberCount(Math.min(25, memberCount + 1))}
                        className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl hover:bg-primary-hover active:scale-95"
                      >
                        <Plus className="w-5 h-5 text-accent" />
                      </button>
                    </div>
                  </div>

                  {/* Wage per Member */}
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1">
                      {t('onboarding.group_wage_per_member')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-sm font-bold text-gray-400">₹</span>
                      <input
                        type="number"
                        value={wagePerMember}
                        onChange={(e) => setWagePerMember(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-base font-bold text-primary focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Total Group Price Summary */}
                  <div className="p-4 bg-yellow-50 rounded-2xl border border-accent/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-amber-950 block">
                        {t('onboarding.group_total_wage')}
                      </span>
                      <span className="text-xs text-secondary-dark">
                        ({memberCount} શ્રમિક × ₹{wagePerMember})
                      </span>
                    </div>
                    <span className="font-heading text-3xl text-primary">
                      ₹{memberCount * wagePerMember}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 font-medium">
                    ℹ️ ટીમ લીડર તરીકે કામના તમામ ઓર્ડર તમારા ફોન પર આવશે અને તમે આખી ટીમ માટે સ્વીકારી શકશો.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Persistent Bottom Bar with Next Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 max-w-lg mx-auto z-40">
        <Button
          variant="primary"
          size="xl"
          onClick={handleNextStep}
          rightIcon={
            step === totalSteps ? (
              <Check className="w-6 h-6 text-accent stroke-[3]" />
            ) : (
              <ArrowRight className="w-6 h-6 text-accent stroke-[3]" />
            )
          }
        >
          {step === totalSteps ? t('onboarding.finish') : t('onboarding.next')}
        </Button>
      </div>
    </div>
  );
};
