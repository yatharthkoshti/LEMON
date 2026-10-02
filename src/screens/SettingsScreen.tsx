import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Globe, Bell, Shield, LogOut, ArrowLeft, Download, 
  Volume2, Info, ChevronRight, Check
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Language } from '../types';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { 
    language, setLanguage, logout, showToast, 
    speechEnabled, toggleSpeechEnabled 
  } = useAppStore();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [langDialogOpen, setLangDialogOpen] = useState(false);

  const handleSelectLang = (lang: Language) => {
    setLanguage(lang);
    setLangDialogOpen(false);
    showToast('ભાષા બદલાઈ ગઈ છે!', 'success');
  };

  const handleInstallApp = () => {
    alert('તમારા બ્રાઉઝર મેનૂ (⋮) માંથી "Add to Home screen" પસંદ કરો.');
  };

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    logout();
    showToast('તમે લોગઆઉટ થયા છો.', 'info');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight font-heading">
            {t('settings.title')}
          </h2>
          <p className="text-xs font-semibold text-secondary">
            એપ્લિકેશન પસંદગીઓ
          </p>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-card rounded-4xl border border-gray-100 shadow-soft divide-y divide-gray-100 overflow-hidden">
        {/* Language Changer */}
        <div
          onClick={() => setLangDialogOpen(true)}
          className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-accent/25 flex items-center justify-center text-primary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                {t('settings.language')}
              </h4>
              <p className="text-xs text-secondary font-medium">
                {language === 'gu' ? 'ગુજરાતી' : language === 'hi' ? 'हिन्दी' : 'English'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* Audio Assistant Toggle */}
        <div
          onClick={toggleSpeechEnabled}
          className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-yellow-100 text-amber-900 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                {t('settings.audio_assistant')}
              </h4>
              <p className="text-xs text-secondary font-medium">
                {t('settings.audio_desc')}
              </p>
            </div>
          </div>
          <div
            className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
              speechEnabled ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                speechEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* PWA Install Button */}
        <div
          onClick={handleInstallApp}
          className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                {t('settings.install_app')}
              </h4>
              <p className="text-xs text-secondary font-medium">
                {t('settings.install_desc')}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* Privacy & Safety */}
        <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                {t('settings.privacy')}
              </h4>
              <p className="text-xs text-secondary font-medium">
                તમારો ડેટા સુરક્ષિત અને ગુપ્ત છે
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* About App */}
        <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                {t('settings.about')}
              </h4>
              <p className="text-xs text-secondary font-medium">
                {t('settings.version')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400">PWA v1.0</span>
        </div>

        {/* Logout */}
        <div
          onClick={() => setLogoutDialogOpen(true)}
          className="p-4 flex items-center justify-between hover:bg-red-50/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-lemonRed flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-lemonRed">
                {t('settings.logout')}
              </h4>
              <p className="text-xs text-secondary font-medium">
                ખાતામાંથી બહાર નીકળો
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-300" />
        </div>
      </div>

      {/* Language Selection Modal */}
      <Dialog
        isOpen={langDialogOpen}
        onClose={() => setLangDialogOpen(false)}
        title={t('settings.language')}
      >
        <div className="space-y-3 py-2">
          {[
            { id: 'gu', title: 'ગુજરાતી (Default)' },
            { id: 'hi', title: 'हिन्दी' },
            { id: 'en', title: 'English' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => handleSelectLang(l.id as Language)}
              className={`w-full p-4 rounded-2xl font-bold text-base flex items-center justify-between border-2 transition-all ${
                language === l.id
                  ? 'bg-amber-50 border-primary text-primary'
                  : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              <span>{l.title}</span>
              {language === l.id && <Check className="w-5 h-5 text-primary stroke-[3]" />}
            </button>
          ))}
        </div>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog
        isOpen={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        title={t('settings.logout')}
        confirmText={t('settings.logout_yes')}
        cancelText={t('settings.cancel')}
        confirmVariant="danger"
        onConfirm={handleConfirmLogout}
      >
        <p className="font-semibold text-gray-800">
          {t('settings.confirm_logout')}
        </p>
      </Dialog>
    </div>
  );
};
