import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Mail, Phone, MapPin, ShieldCheck, LogOut, Edit3, ArrowLeftRight, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';

interface PosterProfileScreenProps {
  onOpenRoleModal: () => void;
}

export const PosterProfileScreen: React.FC<PosterProfileScreenProps> = ({ onOpenRoleModal }) => {
  const { t } = useTranslation();
  const { posterProfile, updatePosterProfile, setPortal, logout, showToast } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(posterProfile.name);
  const [companyName, setCompanyName] = useState(posterProfile.companyName);
  const [email, setEmail] = useState(posterProfile.email);
  const [city, setCity] = useState(posterProfile.city);

  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleSave = () => {
    updatePosterProfile({ name, companyName, email, city });
    setIsEditing(false);
    showToast('પ્રોફાઇલ સાચવવામાં આવી!', 'success');
  };

  return (
    <div className="space-y-5 pb-20 font-body max-w-xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
          કંપની પ્રોફાઇલ (Poster Profile)
        </h2>
        <p className="text-xs sm:text-sm text-secondary font-medium">
          તમારી વ્યાવસાયિક વિગતો અને સેટિંગ્સ
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-card rounded-4xl p-6 border border-gray-100 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-heading text-2xl shadow-soft">
              🍋
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">
                {posterProfile.companyName}
              </h3>
              <span className="text-xs font-semibold text-secondary">
                સંપર્ક વ્યક્તિ: {posterProfile.name}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-primary transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'રદ કરો' : 'સુધારો'}</span>
          </button>
        </div>

        {/* Poster Role Badge with change button */}
        <div className="p-3.5 bg-yellow-50 rounded-2xl border border-accent/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-900 block">
              પ્રોફાઇલ પ્રકાર (Poster Type)
            </span>
            <span className="text-xs font-bold text-primary capitalize">
              {posterProfile.posterType === 'staffing_agency' 
                ? 'સ્ટાફિંગ એજન્સી (Staffing Agency)' 
                : posterProfile.posterType === 'individual' 
                ? 'વ્યક્તિગત ક્લાયન્ટ (Individual)' 
                : 'બિઝનેસ / બિલ્ડર (Business)'}
            </span>
          </div>

          <button
            onClick={onOpenRoleModal}
            className="text-xs font-extrabold text-primary underline hover:text-accent-dark"
          >
            બદલો
          </button>
        </div>

        {/* Contact info list or Edit fields */}
        {isEditing ? (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">કંપનીનું નામ</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">સંપર્ક વ્યક્તિ</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">ઈમેઇલ</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border text-sm font-bold"
              />
            </div>
            <Button variant="primary" size="lg" onClick={handleSave}>
              સાચવો (Save Changes)
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5 pt-2 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
              <Mail className="w-4 h-4 text-secondary" />
              <span>{posterProfile.email}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
              <Phone className="w-4 h-4 text-secondary" />
              <span>+91 {posterProfile.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
              <MapPin className="w-4 h-4 text-lemonRed" />
              <span>{posterProfile.city}</span>
            </div>
          </div>
        )}
      </div>

      {/* Switch to Worker Portal card */}
      <div className="bg-card rounded-3xl p-5 border border-gray-100 shadow-soft flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-primary">શ્રમિક એપ્લિકેશન પર જાઓ</h4>
          <p className="text-xs text-secondary mt-0.5">કામ શોધવા માટે શ્રમિક મોડમાં સ્વિચ કરો</p>
        </div>
        <Button
          size="md"
          variant="accent"
          fullWidth={false}
          onClick={() => setPortal('worker')}
          leftIcon={<ArrowLeftRight className="w-4 h-4" />}
          className="px-4 text-xs font-bold"
        >
          સ્વિચ કરો
        </Button>
      </div>

      {/* Logout button */}
      <div className="pt-2">
        <Button
          variant="danger"
          size="lg"
          onClick={() => setLogoutOpen(true)}
          leftIcon={<LogOut className="w-5 h-5" />}
        >
          {t('settings.logout')}
        </Button>
      </div>

      {/* Logout Confirmation */}
      <Dialog
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="લોગઆઉટ કરવું છે?"
        confirmText="હા, લોગઆઉટ"
        cancelText="રદ કરો"
        confirmVariant="danger"
        onConfirm={() => {
          setLogoutOpen(false);
          logout();
        }}
      >
        <p className="text-sm font-semibold text-gray-800">
          શું તમે ખરેખર જોબ પોસ્ટર ખાતામાંથી બહાર નીકળવા માંગો છો?
        </p>
      </Dialog>
    </div>
  );
};
