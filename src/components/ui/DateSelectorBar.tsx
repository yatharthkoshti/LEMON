import React, { useMemo } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { generateDateStrip, formatDateToIso, DateItem } from '../../utils/dateUtils';

interface DateSelectorBarProps {
  selectedDate: string; // 'all' or 'YYYY-MM-DD'
  onSelectDate: (dateStr: string) => void;
  showAllOption?: boolean;
  className?: string;
  jobCountByDate?: Record<string, number>;
  compact?: boolean;
}

export const DateSelectorBar: React.FC<DateSelectorBarProps> = ({
  selectedDate,
  onSelectDate,
  showAllOption = true,
  className = '',
  jobCountByDate = {},
  compact = false,
}) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || 'gu';

  const dateItems = useMemo(() => {
    return generateDateStrip(14, currentLang);
  }, [currentLang]);

  const todayIso = useMemo(() => formatDateToIso(new Date()), []);

  const getLabel = (item: DateItem) => {
    if (item.isToday) {
      if (currentLang === 'gu') return 'આજે';
      if (currentLang === 'hi') return 'आज';
      return 'Today';
    }
    if (item.isTomorrow) {
      if (currentLang === 'gu') return 'આવતીકાલે';
      if (currentLang === 'hi') return 'कल';
      return 'Tomorrow';
    }
    return item.dayOfWeek;
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth">
        {/* 'All' Date pill */}
        {showAllOption && (
          <button
            type="button"
            onClick={() => onSelectDate('all')}
            className={`shrink-0 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 select-none ${
              compact ? 'px-3 py-1.5 min-w-[56px]' : 'px-3.5 py-2 min-w-[62px]'
            } ${
              selectedDate === 'all'
                ? 'bg-primary text-white shadow-md scale-102 font-bold ring-2 ring-primary/30'
                : 'bg-white/95 text-gray-700 hover:bg-gray-100 border border-gray-200/80 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px] font-black uppercase tracking-wider">
                {currentLang === 'gu' ? 'બધું' : currentLang === 'hi' ? 'सभी' : 'All'}
              </span>
            </div>
            <span className={`text-[9px] mt-0.5 font-medium ${selectedDate === 'all' ? 'text-accent' : 'text-gray-400'}`}>
              {currentLang === 'gu' ? 'તમામ દિવસ' : currentLang === 'hi' ? 'सभी दिन' : 'Any day'}
            </span>
          </button>
        )}

        {/* Date Tiles - Hotel booking style */}
        {dateItems.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          const label = getLabel(item);
          const count = jobCountByDate[item.dateStr];

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectDate(item.dateStr)}
              className={`shrink-0 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 select-none relative ${
                compact ? 'px-3 py-1.5 min-w-[58px]' : 'px-3.5 py-2 min-w-[66px]'
              } ${
                isSelected
                  ? 'bg-primary text-white shadow-md scale-102 ring-2 ring-primary/30'
                  : item.isToday
                  ? 'bg-white text-primary border-2 border-primary/40 shadow-2xs hover:bg-yellow-50/50'
                  : 'bg-white/95 text-gray-700 hover:bg-gray-100 border border-gray-200/80 shadow-2xs'
              }`}
            >
              {/* Job count badge if available */}
              {count !== undefined && count > 0 && (
                <span
                  className={`absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 text-[9px] font-black rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-accent text-primary' : 'bg-primary text-white shadow-sm'
                  }`}
                >
                  {count}
                </span>
              )}

              {/* Day label: 'Today', 'Tomorrow', 'Som', 'Mangal' */}
              <span
                className={`text-[10px] font-bold uppercase tracking-tight ${
                  isSelected
                    ? 'text-accent font-black'
                    : item.isToday
                    ? 'text-primary font-black'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </span>

              {/* Date Number: '18', '19', '20' */}
              <span
                className={`text-base font-black leading-tight my-0.5 ${
                  isSelected ? 'text-white' : 'text-primary'
                }`}
              >
                {item.dayNumber}
              </span>

              {/* Month: 'Nov', 'નવે' */}
              <span
                className={`text-[9px] font-semibold leading-none ${
                  isSelected ? 'text-white/80' : 'text-gray-400'
                }`}
              >
                {item.monthName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
