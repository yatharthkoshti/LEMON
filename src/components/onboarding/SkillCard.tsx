import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SkillItem } from '../../types';
import { SpeechButton } from '../ui/SpeechButton';

interface SkillCardProps {
  skill: SkillItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, isSelected, onToggle }) => {
  const { t } = useTranslation();

  const title = t(skill.titleKey);
  const desc = t(skill.descKey);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(skill.id)}
      className={`relative p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
        isSelected
          ? 'bg-amber-50/90 border-primary shadow-soft'
          : 'bg-card border-gray-100 hover:border-gray-300 shadow-2xs'
      }`}
    >
      {/* Top Row: Icon & Checkbox */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white shadow-2xs border border-gray-100">
          {skill.icon}
        </span>

        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
            isSelected
              ? 'bg-primary border-primary text-white shadow-xs'
              : 'border-gray-300 bg-white'
          }`}
        >
          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
        </div>
      </div>

      {/* Title & Desc */}
      <div className="mt-1">
        <h4 className="text-base sm:text-lg font-bold text-primary leading-tight">
          {title}
        </h4>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
          {desc}
        </p>
      </div>

      {/* Audio speech icon for low-literacy workers */}
      <div className="mt-3 pt-2 border-t border-gray-100/80 flex items-center justify-between">
        <span className="text-[11px] font-bold text-secondary">
          {isSelected ? '✓ પસંદ થયેલ છે' : '+ પસંદ કરો'}
        </span>
        <SpeechButton textToSpeak={`${title}. ${desc}`} size="sm" />
      </div>
    </motion.div>
  );
};
