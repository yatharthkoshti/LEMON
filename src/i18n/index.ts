import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import gu from './locales/gu.json';
import hi from './locales/hi.json';
import en from './locales/en.json';

const storedLang = localStorage.getItem('lemon_language') || 'gu';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      gu: { translation: gu },
      hi: { translation: hi },
      en: { translation: en }
    },
    lng: storedLang,
    fallbackLng: 'gu',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'lemon_language',
      caches: ['localStorage']
    }
  });

export default i18n;
