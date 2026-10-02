import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Briefcase, Calendar, CheckCircle2, AlertTriangle, CheckCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SpeechButton } from '../components/ui/SpeechButton';

export const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { notifications, markNotificationRead, markAllNotificationsRead, jobs, openJobDetails } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_job':
        return <Briefcase className="w-5 h-5 text-primary" />;
      case 'tomorrow_reminder':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'job_accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'job_cancelled':
        return <AlertTriangle className="w-5 h-5 text-lemonRed" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const handleCardClick = (n: any) => {
    markNotificationRead(n.id);
    if (n.jobId) {
      const targetJob = jobs.find((j) => j.id === n.jobId);
      if (targetJob) {
        openJobDetails(targetJob);
      }
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title & Mark All Read */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight font-heading">
            {t('notifications.title')}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-secondary">
            તમામ મહત્વપૂર્ણ અપડેટ્સ અને યાદી
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline p-1"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('notifications.mark_all_read')}</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const title = t(n.titleKey);
            const message = t(n.messageKey);

            return (
              <div
                key={n.id}
                onClick={() => handleCardClick(n)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer select-none flex items-start gap-3.5 relative shadow-soft ${
                  !n.read
                    ? 'bg-amber-50/50 border-accent/80 ring-2 ring-accent/30'
                    : 'bg-card border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-gray-200 flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>

                {/* Message Body */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-base font-bold text-primary leading-tight">
                      {title}
                    </h4>
                    <span className="text-[11px] font-semibold text-secondary shrink-0">
                      {n.timeAgoKey}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-snug">
                    {message}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <SpeechButton textToSpeak={`${title}. ${message}`} size="sm" />
                    {n.jobId && (
                      <span className="text-[11px] font-bold text-primary hover:underline">
                        વિગત જુઓ →
                      </span>
                    )}
                  </div>
                </div>

                {/* Unread Dot */}
                {!n.read && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-lemonRed" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-card rounded-4xl border border-dashed border-gray-200 my-6">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-gray-700">
            {t('notifications.empty')}
          </h4>
        </div>
      )}
    </div>
  );
};
