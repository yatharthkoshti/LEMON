import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, Moon, Sunset, Briefcase, Calendar, TrendingUp, 
  CheckCircle2, Clock, Sparkles, Users, Award, ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { JobCard } from '../components/jobs/JobCard';
import { SpeechButton } from '../components/ui/SpeechButton';
import { InstallPrompt } from '../components/ui/InstallPrompt';

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { 
    profile, isAvailableToday, toggleAvailability, jobs, 
    showToast, setActiveTab, openJobDetails 
  } = useAppStore();

  // Dynamic greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting_morning');
    if (hour < 17) return t('home.greeting_afternoon');
    return t('home.greeting_evening');
  };

  const todaysJobs = jobs.filter((j) => j.date.includes('આજે') || j.date.includes('Today'));
  const upcomingJobs = jobs.filter((j) => !j.date.includes('આજે') && !j.date.includes('Today'));

  const handleStatusToggle = () => {
    toggleAvailability();
    const nextStatus = !isAvailableToday;
    if (nextStatus) {
      showToast('તમે હવે ઓનલાઇન છો! નવી કામની ઓફર મળશે.', 'success');
    } else {
      showToast('તમે હવે રજા પર છો. નવી ઓફર નહીં મળે.', 'info');
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* PWA Install Prompt Banner */}
      <InstallPrompt />

      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-secondary text-xs font-bold uppercase tracking-wider">
            <Sun className="w-4 h-4 text-accent-dark" />
            <span>{getGreeting()}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight mt-0.5">
            {profile.name}
          </h2>
        </div>

        {/* Group / Individual Badge */}
        {profile.groupDetails?.isGroup ? (
          <div className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-2xl flex items-center gap-1.5 text-xs font-black shadow-2xs">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{profile.groupDetails.memberCount} ટીમ લીડર</span>
          </div>
        ) : (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-2xl flex items-center gap-1.5 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('profile.verified_worker')}</span>
          </div>
        )}
      </div>

      {/* LARGE STATUS CARD: "Available Today" / "Unavailable Today" Toggle */}
      <motion.div
        whileTap={{ scale: 0.99 }}
        onClick={handleStatusToggle}
        className={`p-6 rounded-4xl border-3 cursor-pointer transition-all duration-300 relative shadow-soft select-none ${
          isAvailableToday
            ? 'bg-primary text-white border-primary shadow-soft-lg'
            : 'bg-card text-primary border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  isAvailableToday ? 'bg-accent animate-ping' : 'bg-gray-400'
                }`}
              />
              <span
                className={`text-xs font-black tracking-widest uppercase ${
                  isAvailableToday ? 'text-accent' : 'text-secondary'
                }`}
              >
                {t('home.status_card_title')}
              </span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl leading-tight">
              {isAvailableToday
                ? t('home.status_available')
                : t('home.status_unavailable')}
            </h3>

            <p
              className={`text-xs sm:text-sm mt-1 font-medium ${
                isAvailableToday ? 'text-gray-300' : 'text-secondary'
              }`}
            >
              {isAvailableToday
                ? t('home.status_available_desc')
                : t('home.status_unavailable_desc')}
            </p>
          </div>

          {/* Huge Uber-like Toggle Switch */}
          <div className="shrink-0">
            <div
              className={`w-16 h-9 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                isAvailableToday ? 'bg-accent' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                  isAvailableToday ? 'translate-x-7 bg-primary' : 'translate-x-0'
                }`}
              >
                {isAvailableToday ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* TODAY'S JOBS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-primary font-heading tracking-tight">
              {t('home.todays_jobs_heading')}
            </h3>
            <span className="text-xs font-semibold text-secondary">
              {t('home.todays_jobs_count', { count: todaysJobs.length })}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('jobs')}
            className="text-xs font-bold text-primary hover:underline px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            બધા જુઓ (All)
          </button>
        </div>

        {todaysJobs.length > 0 ? (
          <div className="space-y-4">
            {todaysJobs.map((job) => (
              <JobCard key={job.id} job={job} onOpenDetails={openJobDetails} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-card rounded-3xl border border-dashed border-gray-200 text-gray-500">
            <Briefcase className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold">{t('home.no_jobs_today')}</p>
          </div>
        )}
      </div>

      {/* UPCOMING JOBS SECTION */}
      {upcomingJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-primary font-heading tracking-tight">
              {t('home.upcoming_jobs_heading')}
            </h3>
            <span className="text-xs font-bold text-secondary">
              {upcomingJobs.length} કામ બાકી
            </span>
          </div>

          <div className="space-y-4">
            {upcomingJobs.map((job) => (
              <JobCard key={job.id} job={job} onOpenDetails={openJobDetails} />
            ))}
          </div>
        </div>
      )}

      {/* RECENT ACTIVITY & EARNINGS SUMMARY */}
      <div className="bg-card rounded-4xl p-5 border border-gray-100 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h4 className="text-base font-bold text-primary font-heading">
              {t('home.recent_activity_heading')}
            </h4>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            સક્રિય શ્રમિક
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs font-bold text-secondary block">
              {t('home.days_worked')}
            </span>
            <span className="font-heading text-2xl text-primary mt-1 block">
              ૨૨ દિવસ
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs font-bold text-secondary block">
              {t('home.completed_jobs')}
            </span>
            <span className="font-heading text-2xl text-primary mt-1 block">
              {profile.completedJobsCount} કામ
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs font-bold text-secondary block">
              {t('home.rating_label')}
            </span>
            <span className="font-heading text-2xl text-amber-900 mt-1 block">
              ⭐ {profile.rating}
            </span>
          </div>
        </div>

        {/* Estimated Earnings Bar */}
        <div className="p-4 bg-yellow-50/80 rounded-2xl border border-accent/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-950 block">
              {t('home.earnings_summary_title')}
            </span>
            <span className="text-[11px] text-secondary-dark">
              સીધા બેંક ખાતામાં / રોકડ ચુકવણી
            </span>
          </div>
          <span className="font-heading text-3xl text-primary">
            ₹{profile.completedJobsCount * profile.dailyWage}
          </span>
        </div>
      </div>
    </div>
  );
};
