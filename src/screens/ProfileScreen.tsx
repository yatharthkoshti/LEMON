import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, Phone, MapPin, Award, CheckCircle2, Clock, 
  IndianRupee, Briefcase, Settings, Edit3, Users, Star, Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Avatar } from '../components/ui/Avatar';
import { SpeechButton } from '../components/ui/SpeechButton';
import { SKILLS_CATALOG } from '../data/skillsCatalog';

interface ProfileScreenProps {
  onOpenSettings: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenSettings }) => {
  const { t } = useTranslation();
  const { profile, language, showToast } = useAppStore();

  const getSkillObject = (id: string) => {
    return SKILLS_CATALOG.find((s) => s.id === id);
  };

  const profileSpeechSummary = `શ્રમિક પ્રોફાઇલ: ${profile.name}। ફોન: ${profile.phone}। શહેર: ${profile.city}। દૈનિક વેતન: ₹${profile.dailyWage}। હાજરી: ${profile.attendanceRate} ટકા। પૂરા થયેલ કામ: ${profile.completedJobsCount}।`;

  return (
    <div className="space-y-4 pb-24">
      {/* Top Bar with Settings Link */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight font-heading">
            {t('profile.title')}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-secondary">
            તમારું લેમન ડિજિટલ ઓળખ પત્ર
          </p>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-primary transition-colors flex items-center gap-1.5 font-bold text-xs shadow-2xs"
        >
          <Settings className="w-4 h-4" />
          <span>{t('settings.title')}</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-card rounded-4xl p-6 border border-gray-100 shadow-soft text-center relative overflow-hidden">
        {/* Yellow Header accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-accent" />

        <div className="flex justify-center mb-3">
          <Avatar
            src={profile.photoUrl}
            name={profile.name}
            size="xl"
            verified={true}
          />
        </div>

        <h3 className="text-2xl font-extrabold text-primary tracking-tight">
          {profile.name}
        </h3>

        <div className="flex items-center justify-center gap-1.5 text-secondary text-sm font-semibold mt-1">
          <Phone className="w-3.5 h-3.5 text-primary" />
          <span>+91 {profile.phone}</span>
          <span className="text-gray-300">•</span>
          <MapPin className="w-3.5 h-3.5 text-lemonRed" />
          <span>{profile.city}</span>
        </div>

        {/* Verification badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-black">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t('profile.verified_worker')} (LEMON ID: {profile.id})</span>
        </div>

        <div className="mt-3 flex justify-center">
          <SpeechButton textToSpeak={profileSpeechSummary} size="sm" />
        </div>
      </div>

      {/* Key Metrics: Attendance & Completed Jobs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-3xl p-4 border border-gray-100 shadow-soft text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-secondary block">
            {t('profile.attendance')}
          </span>
          <span className="font-heading text-3xl text-emerald-700 block mt-0.5">
            {profile.attendanceRate}%
          </span>
          <span className="text-[11px] font-semibold text-gray-500">
            સમયસર હાજરી
          </span>
        </div>

        <div className="bg-card rounded-3xl p-4 border border-gray-100 shadow-soft text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-secondary block">
            {t('profile.completed_jobs')}
          </span>
          <span className="font-heading text-3xl text-primary block mt-0.5">
            {profile.completedJobsCount}
          </span>
          <span className="text-[11px] font-semibold text-gray-500">
            સફળ કામો
          </span>
        </div>
      </div>

      {/* Daily Wage Card */}
      <div className="bg-card rounded-3xl p-4 border border-gray-100 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-50 border border-accent/60 flex items-center justify-center">
            <span className="font-heading text-2xl text-primary">₹</span>
          </div>
          <div>
            <span className="text-xs font-bold text-secondary block">
              {t('profile.daily_wage')}
            </span>
            <span className="font-heading text-2xl text-primary">
              ₹{profile.dailyWage} / દિવસ
            </span>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          ફિક્સ દૈનિક દર
        </span>
      </div>

      {/* Work Team Details (if group) */}
      {profile.groupDetails?.isGroup && (
        <div className="bg-amber-50/70 rounded-3xl p-4 border border-accent/60 shadow-soft space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h4 className="text-sm font-extrabold text-primary">
              {profile.groupDetails.teamName || 'શ્રમિક ટીમ'}
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-800">
            <div>
              <span className="text-secondary">{t('profile.team_member_count')} </span>
              <span className="font-bold">{profile.groupDetails.memberCount} સભ્યો</span>
            </div>
            <div>
              <span className="text-secondary">{t('profile.team_total_wage')} </span>
              <span className="font-bold">₹{profile.groupDetails.totalDailyWage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Skills Section */}
      <div className="bg-card rounded-3xl p-5 border border-gray-100 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-extrabold text-primary">
              {t('profile.skills')}
            </h4>
          </div>
          <span className="text-xs font-bold text-secondary">
            {profile.skills.length} પસંદ કરેલ
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skillId) => {
            const skill = getSkillObject(skillId);
            return (
              <span
                key={skillId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-primary"
              >
                <span>{skill?.icon || '👷'}</span>
                <span>{skill ? t(skill.titleKey) : skillId}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Experience & Availability Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-card rounded-3xl p-4 border border-gray-100 shadow-soft">
          <span className="text-xs font-bold text-secondary block mb-1">
            {t('profile.experience')}
          </span>
          <span className="text-base font-extrabold text-primary">
            {t(`experience.${profile.experience.replace('-', '_').replace('+', '_plus')}`)}
          </span>
        </div>

        <div className="bg-card rounded-3xl p-4 border border-gray-100 shadow-soft">
          <span className="text-xs font-bold text-secondary block mb-1">
            {t('profile.availability')}
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.availability.map((slot) => (
              <span
                key={slot}
                className="text-[11px] font-bold bg-gray-100 px-2 py-0.5 rounded-md text-gray-700"
              >
                {t(`availability.${slot}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
