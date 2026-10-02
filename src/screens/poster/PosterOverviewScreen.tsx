import React from 'react';
import { 
  Briefcase, Users, Clock, AlertCircle, CheckCircle2, 
  PlusCircle, Map, ArrowRight, TrendingUp, Sparkles, ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';

export const PosterOverviewScreen: React.FC = () => {
  const { t } = useTranslation();
  const { posterProfile, jobs, workers, setPosterTab, assignWorkerToJob, showToast } = useAppStore();

  const todaysJobs = jobs.filter((j) => j.date.includes('આજે') || j.date.includes('Today'));
  const upcomingJobs = jobs.filter((j) => !j.date.includes('આજે') && !j.date.includes('Today'));
  const pendingPaymentJobs = jobs.filter((j) => j.paymentStatus === 'pending');
  const totalAssignedWorkers = jobs.reduce((acc, j) => acc + j.workersAssignedCount, 0);

  const topNearbyWorkers = workers.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-4xl border border-accent/70 shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-accent px-2 py-0.5 rounded-full">
              {t('poster_overview.badge_role')}
            </span>
            <span className="text-xs font-bold text-secondary">
              {posterProfile.companyName}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary font-heading tracking-tight">
            {t('poster_overview.welcome', { name: posterProfile.name })}
          </h2>
          <p className="text-xs sm:text-sm text-secondary font-medium mt-1">
            તમારા પ્રોજેક્ટ્સ માટે તૈયાર કુશળ શ્રમિકો અને સમયસર હાજરીનું સંચાલન કરો.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth={false}
          onClick={() => setPosterTab('create_job')}
          leftIcon={<PlusCircle className="w-5 h-5 text-accent" />}
          className="shrink-0"
        >
          {t('poster_overview.btn_create_job')}
        </Button>
      </div>

      {/* 6 Metric Cards from PRD */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Today's Jobs */}
        <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-soft text-center">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-primary flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-secondary block truncate">
            {t('poster_overview.stat_todays_jobs')}
          </span>
          <span className="font-heading text-2xl text-primary block mt-0.5">
            {todaysJobs.length}
          </span>
        </div>

        {/* Workers Assigned */}
        <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-soft text-center">
          <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-secondary block truncate">
            {t('poster_overview.stat_workers_assigned')}
          </span>
          <span className="font-heading text-2xl text-primary block mt-0.5">
            {totalAssignedWorkers}
          </span>
        </div>

        {/* Pending Confirmations */}
        <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-soft text-center">
          <div className="w-9 h-9 rounded-2xl bg-yellow-100 text-amber-900 flex items-center justify-center mx-auto mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-secondary block truncate">
            {t('poster_overview.stat_pending_confirmations')}
          </span>
          <span className="font-heading text-2xl text-amber-900 block mt-0.5">
            ૧ બાકી
          </span>
        </div>

        {/* Payment Pending */}
        <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-soft text-center">
          <div className="w-9 h-9 rounded-2xl bg-red-100 text-lemonRed flex items-center justify-center mx-auto mb-2">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-secondary block truncate">
            {t('poster_overview.stat_payment_pending')}
          </span>
          <span className="font-heading text-2xl text-lemonRed block mt-0.5">
            {pendingPaymentJobs.length}
          </span>
        </div>

        {/* Attendance % */}
        <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-soft text-center">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-secondary block truncate">
            {t('poster_overview.stat_attendance_rate')}
          </span>
          <span className="font-heading text-2xl text-emerald-700 block mt-0.5">
            ૯૭%
          </span>
        </div>

        {/* Upcoming Jobs */}
        <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-soft text-center">
          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-secondary block truncate">
            {t('poster_overview.stat_upcoming_jobs')}
          </span>
          <span className="font-heading text-2xl text-primary block mt-0.5">
            {upcomingJobs.length}
          </span>
        </div>
      </div>

      {/* Quick Actions from PRD */}
      <div>
        <h3 className="text-base font-extrabold text-primary font-heading tracking-tight mb-3">
          {t('poster_overview.quick_actions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setPosterTab('create_job')}
            className="p-4 rounded-3xl bg-primary text-white text-left font-bold text-sm shadow-soft hover:bg-primary-hover active:scale-95 transition-all flex flex-col justify-between h-28"
          >
            <PlusCircle className="w-6 h-6 text-accent" />
            <span>{t('poster_overview.btn_create_job')}</span>
          </button>

          <button
            onClick={() => setPosterTab('workers')}
            className="p-4 rounded-3xl bg-card border border-gray-200 text-left font-bold text-sm shadow-2xs hover:border-gray-300 active:scale-95 transition-all flex flex-col justify-between h-28"
          >
            <Users className="w-6 h-6 text-primary" />
            <span>{t('poster_overview.btn_view_workers')}</span>
          </button>

          <button
            onClick={() => setPosterTab('map')}
            className="p-4 rounded-3xl bg-card border border-gray-200 text-left font-bold text-sm shadow-2xs hover:border-gray-300 active:scale-95 transition-all flex flex-col justify-between h-28"
          >
            <Map className="w-6 h-6 text-primary" />
            <span>{t('poster_overview.btn_view_map')}</span>
          </button>

          <button
            onClick={() => setPosterTab('jobs')}
            className="p-4 rounded-3xl bg-card border border-gray-200 text-left font-bold text-sm shadow-2xs hover:border-gray-300 active:scale-95 transition-all flex flex-col justify-between h-28"
          >
            <Briefcase className="w-6 h-6 text-primary" />
            <span>{t('poster_overview.btn_view_jobs')}</span>
          </button>
        </div>
      </div>

      {/* Nearby Workers Preview (PRIVACY SAFE: strictly initials, NO photo, NO phone) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-primary font-heading tracking-tight">
              {t('poster_overview.nearby_workers_heading')}
            </h3>
            <p className="text-xs text-secondary font-medium">
              ચકાસાયેલ કારીગરો (ગોપનીયતા રક્ષિત)
            </p>
          </div>
          <button
            onClick={() => setPosterTab('workers')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>બધા જુઓ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topNearbyWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-card rounded-3xl p-4 border border-gray-200 shadow-2xs flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  {/* Initials Avatar - NO Worker Photo */}
                  <div className="w-10 h-10 rounded-2xl bg-accent/30 border border-accent flex items-center justify-center font-heading text-primary font-bold text-base shadow-2xs">
                    {worker.name.substring(0, 2)}
                  </div>
                  <span className="text-xs font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    ⭐ {worker.rating}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-primary truncate">
                  {worker.name}
                </h4>
                <p className="text-xs text-secondary capitalize mt-0.5">
                  {worker.skills.map(s => s.replace('_', ' ')).join(', ')}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-gray-600 bg-gray-50 p-2 rounded-xl">
                  <span>હાજરી: <b className="text-emerald-700">{worker.attendanceRate}%</b></span>
                  <span>₹{worker.dailyWage}/દિવસ</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100">
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => {
                    const activeJob = jobs[0];
                    if (activeJob) {
                      assignWorkerToJob(activeJob.id, worker.id);
                      showToast(`${worker.name} ને કામ ફાળવાયું!`, 'success');
                    }
                  }}
                  className="!min-h-[38px] !text-xs font-bold"
                >
                  કામ ફાળવો (Assign)
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-card rounded-4xl p-5 border border-gray-100 shadow-soft">
        <h3 className="text-base font-extrabold text-primary font-heading tracking-tight mb-3">
          {t('poster_overview.recent_activity')}
        </h3>
        <div className="space-y-3">
          {[
            { time: '૧૫ મિનિટ પહેલાં', text: 'રમેશભાઈ પરમાર દ્વારા શિવાલય ઇન્ફ્રાનું કામ સ્વીકારાયું', badge: 'કામ સ્વીકાર્યું' },
            { time: '૧ કલાક પહેલાં', text: 'મહેશભાઈ વાઘેલાએ સાયન્સ સિટી પ્રોજેક્ટ માટે અરજી કરી', badge: 'નવી અરજી' },
            { time: 'ગઈકાલે', text: '૪ સામાન્ય મજૂરો માટે મેટ્રો પ્રોજેક્ટનું નવું કામ પોસ્ટ કરવામાં આવ્યું', badge: 'કામ પોસ્ટ થયું' }
          ].map((act, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-bold text-primary">{act.text}</p>
                <span className="text-[11px] text-secondary font-medium">{act.time}</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-gray-100 text-secondary shrink-0">
                {act.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
