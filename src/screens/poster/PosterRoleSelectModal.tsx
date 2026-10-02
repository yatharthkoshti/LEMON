import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Briefcase, User, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PosterType } from '../../types';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';

interface PosterRoleSelectModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const PosterRoleSelectModal: React.FC<PosterRoleSelectModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  const { posterProfile, setPosterType, showToast } = useAppStore();

  const [selectedType, setSelectedType] = useState<PosterType>(posterProfile.posterType || 'business');

  if (!isOpen) return null;

  const roleOptions: {
    id: PosterType;
    icon: React.ReactNode;
    titleKey: string;
    descKey: string;
    tag: string;
  }[] = [
    {
      id: 'staffing_agency',
      icon: <Building2 className="w-8 h-8 text-primary" />,
      titleKey: 'poster_role_select.staffing_agency',
      descKey: 'poster_role_select.staffing_agency_desc',
      tag: 'કોન્ટ્રાક્ટર્સ / એજન્સીઓ'
    },
    {
      id: 'business',
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      titleKey: 'poster_role_select.business',
      descKey: 'poster_role_select.business_desc',
      tag: 'કન્સ્ટ્રક્શન & ફેક્ટરી'
    },
    {
      id: 'individual',
      icon: <User className="w-8 h-8 text-primary" />,
      titleKey: 'poster_role_select.individual',
      descKey: 'poster_role_select.individual_desc',
      tag: 'ઘર વપરાશ & રિનોવેશન'
    }
  ];

  const handleConfirm = () => {
    setPosterType(selectedType);
    showToast('જોબ પોસ્ટર પ્રોફાઇલ સેટ થઈ ગઈ છે!', 'success');
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-card rounded-4xl shadow-soft-lg border border-gray-100 p-6 sm:p-8 z-10 font-body"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center mx-auto mb-3 shadow-soft">
              <span className="text-3xl">🏢</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary font-heading tracking-tight">
              {t('poster_role_select.modal_title')}
            </h2>
            <p className="text-xs sm:text-sm text-secondary mt-1 font-semibold">
              {t('poster_role_select.modal_subtitle')}
            </p>
          </div>

          {/* 3 Large Role Cards */}
          <div className="space-y-3.5 mb-6">
            {roleOptions.map((opt) => {
              const isSelected = selectedType === opt.id;
              return (
                <motion.div
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType(opt.id)}
                  className={`p-4 sm:p-5 rounded-3xl border-2 cursor-pointer transition-all duration-150 flex items-start gap-4 select-none ${
                    isSelected
                      ? 'bg-amber-50/90 border-primary shadow-soft ring-2 ring-accent/30'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-3 rounded-2xl shrink-0 ${isSelected ? 'bg-accent shadow-xs' : 'bg-gray-100'}`}>
                    {opt.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-base sm:text-lg font-bold text-primary">
                        {t(opt.titleKey)}
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100 text-secondary">
                        {opt.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-snug">
                      {t(opt.descKey)}
                    </p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 mt-1 ${
                      isSelected
                        ? 'bg-primary border-primary text-accent'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Button
            variant="primary"
            size="xl"
            onClick={handleConfirm}
            rightIcon={<ArrowRight className="w-6 h-6 text-accent stroke-[3]" />}
          >
            {t('poster_role_select.confirm_role')}
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
