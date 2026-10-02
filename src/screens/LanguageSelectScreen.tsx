import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Language } from '../types';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { speakText } from '../utils/speech';

export const LanguageSelectScreen: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage, completeLanguageSelection } = useAppStore();

  const languageOptions: {
    id: Language;
    nativeName: string;
    englishName: string;
    tagline: string;
    samplePhrase: string;
    badge: string;
  }[] = [
    {
      id: 'gu',
      nativeName: 'ગુજરાતી',
      englishName: 'Gujarati',
      tagline: 'મુખ્ય ભાષા (Default)',
      samplePhrase: 'લેમન પર તમારું સ્વાગત છે',
      badge: 'મૂળ પસંદગી'
    },
    {
      id: 'hi',
      nativeName: 'हिन्दी',
      englishName: 'Hindi',
      tagline: 'सरल और आसान हिन्दी',
      samplePhrase: 'लेमन में आपका स्वागत है',
      badge: 'राष्ट्रीय भाषा'
    },
    {
      id: 'en',
      nativeName: 'English',
      englishName: 'English',
      tagline: 'Simple Everyday English',
      samplePhrase: 'Welcome to Lemon Worker App',
      badge: 'Universal'
    }
  ];

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    const selected = languageOptions.find(o => o.id === lang);
    if (selected) {
      speakText(selected.samplePhrase, lang);
    }
  };

  const handleContinue = () => {
    completeLanguageSelection();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="pt-6 pb-2 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-accent shadow-soft mb-2">
          <span className="text-3xl">🌐</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          {t('language_select.title')}
        </h1>
        <p className="text-sm font-semibold text-secondary mt-1">
          {t('language_select.subtitle')}
        </p>
      </div>

      {/* Language Options Grid */}
      <div className="space-y-4 my-auto py-4">
        {languageOptions.map((opt) => {
          const isSelected = language === opt.id;
          return (
            <motion.div
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(opt.id)}
              className={`p-5 rounded-3xl border-3 cursor-pointer transition-all duration-150 relative shadow-soft select-none ${
                isSelected
                  ? 'bg-card border-primary shadow-soft-lg ring-4 ring-accent/30'
                  : 'bg-white/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-primary font-heading tracking-wide">
                      {opt.nativeName}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      ({opt.englishName})
                    </span>
                    {isSelected && (
                      <span className="bg-accent text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-secondary">
                    {opt.tagline}
                  </p>
                </div>

                {/* Selection Radio / Checkbox */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(opt.samplePhrase, opt.id);
                    }}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Audio Preview"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected
                        ? 'bg-primary border-primary text-accent'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    {isSelected && <Check className="w-5 h-5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Continue Button */}
      <div className="pb-6">
        <Button
          variant="primary"
          size="xl"
          onClick={handleContinue}
          rightIcon={<ArrowRight className="w-6 h-6 text-accent stroke-[3]" />}
        >
          {t('language_select.continue')}
        </Button>
      </div>
    </div>
  );
};
