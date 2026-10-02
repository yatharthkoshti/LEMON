import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Users, CheckCircle2, IndianRupee, PieChart, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const PosterAnalyticsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { posterProfile, jobs } = useAppStore();

  const totalSpent = jobs.reduce((sum, j) => sum + (j.totalJobCost || 0), 0);
  const totalWorkersHired = jobs.reduce((sum, j) => sum + j.workersAssignedCount, 0);

  const categoryStats = [
    { name: 'બાંધકામ (Construction)', percent: 55, color: 'bg-primary' },
    { name: 'સામાન્ય મજૂરી (General Labour)', percent: 25, color: 'bg-accent' },
    { name: 'કલરકામ (Painting)', percent: 12, color: 'bg-blue-600' },
    { name: 'ઇલેક્ટ્રિકલ & પ્લમ્બિંગ', percent: 8, color: 'bg-emerald-600' }
  ];

  return (
    <div className="space-y-6 pb-20 font-body">
      <div>
        <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
          {t('poster_analytics.title')}
        </h2>
        <p className="text-xs sm:text-sm text-secondary font-medium">
          {t('poster_analytics.subtitle')}
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-card p-5 rounded-3xl border border-gray-100 shadow-soft">
          <span className="text-xs font-bold text-secondary block">
            {t('poster_analytics.total_spent')}
          </span>
          <span className="font-heading text-3xl text-primary block mt-1">
            ₹{totalSpent}
          </span>
          <span className="text-[11px] text-emerald-700 font-bold block mt-1">
            +૧૨% આ મહિને
          </span>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-gray-100 shadow-soft">
          <span className="text-xs font-bold text-secondary block">
            કુલ શ્રમિકો ફાળવ્યા
          </span>
          <span className="font-heading text-3xl text-primary block mt-1">
            {totalWorkersHired} જણા
          </span>
          <span className="text-[11px] text-secondary font-medium block mt-1">
            ૯૮% સમયસર રિપોર્ટ
          </span>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-gray-100 shadow-soft">
          <span className="text-xs font-bold text-secondary block">
            {t('poster_analytics.fulfillment_rate')}
          </span>
          <span className="font-heading text-3xl text-emerald-700 block mt-1">
            ૯૪%
          </span>
          <span className="text-[11px] text-secondary font-medium block mt-1">
            સરેરાશ ૪૫ મિનિટમાં શ્રમિક મળ્યો
          </span>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-gray-100 shadow-soft">
          <span className="text-xs font-bold text-secondary block">
            {t('poster_analytics.attendance_score')}
          </span>
          <span className="font-heading text-3xl text-amber-900 block mt-1">
            ૯૭.૫%
          </span>
          <span className="text-[11px] text-emerald-700 font-bold block mt-1">
            સેલ્ફી + GPS દ્વારા વેરિફાઇડ
          </span>
        </div>
      </div>

      {/* Trade Distribution Bar */}
      <div className="bg-card rounded-4xl p-6 border border-gray-100 shadow-soft space-y-4">
        <h3 className="text-base font-extrabold text-primary font-heading tracking-tight">
          {t('poster_analytics.category_breakdown')}
        </h3>

        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
          {categoryStats.map((c, i) => (
            <div
              key={i}
              className={`${c.color} h-full`}
              style={{ width: `${c.percent}%` }}
              title={`${c.name}: ${c.percent}%`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {categoryStats.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${c.color} shrink-0`} />
              <div>
                <span className="text-xs font-bold text-primary block leading-tight truncate">
                  {c.name.split(' ')[0]}
                </span>
                <span className="text-[11px] text-secondary font-semibold">
                  {c.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
