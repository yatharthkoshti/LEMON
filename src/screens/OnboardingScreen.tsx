import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Users, Home, Heart, ArrowRight, ArrowLeft, 
  CheckCircle2, Plus, Link, Trash2 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { WorkUnitType, SkillCategory, GroupMember } from '../types';
import { SKILLS_CATALOG } from '../data/skillsCatalog';

const ACCOUNT_TYPES: { id: WorkUnitType; icon: any; labelKey: string; color: string }[] = [
  { id: 'individual', icon: User, labelKey: 'onboarding.type_individual', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'group', icon: Users, labelKey: 'onboarding.type_group', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { id: 'family', icon: Home, labelKey: 'onboarding.type_family', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'friends', icon: Heart, labelKey: 'onboarding.type_friends', color: 'bg-pink-50 text-pink-600 border-pink-200' }
];

export const OnboardingScreen: React.FC = () => {
  const { t } = useTranslation();
  const { profile, setWorkUnitType, updateProfile, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(1);
  const [unitType, setUnitType] = useState<WorkUnitType>('individual');
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [members, setMembers] = useState<GroupMember[]>([]);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleSkill = (skillId: string) => {
    setSkills(prev => prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]);
  };

  const addMember = () => {
    const newMember: GroupMember = {
      id: `member-${Date.now()}`,
      name: `Member ${members.length + 1}`,
      role: 'Helper',
      wage: 500
    };
    setMembers([...members, newMember]);
  };

  const updateMember = (id: string, updates: Partial<GroupMember>) => {
    setMembers(members.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const finishOnboarding = () => {
    setWorkUnitType(unitType);
    updateProfile({
      skills,
      members,
      workUnitType: unitType
    });
    completeOnboarding(profile);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Header Progress */}
        <div className="p-6 bg-primary text-white">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-accent' : 'bg-white/20'}`} />
            ))}
          </div>
          <h1 className="text-2xl font-bold font-heading">
            {step === 1 && 'How will you work?'}
            {step === 2 && 'What is your work?'}
            {step === 3 && (unitType === 'individual' ? 'Ready to Work!' : 'Add Your Team')}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-gray-600 mb-6 font-medium">Choose how you want to join Lemon.</p>
                <div className="grid grid-cols-2 gap-4">
                  {ACCOUNT_TYPES.map((type) => {
                    const isSelected = unitType === type.id;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setUnitType(type.id)}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                          isSelected ? type.color + ' border-current scale-105 shadow-md' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <Icon className={`w-10 h-10 ${isSelected ? '' : 'text-gray-400'}`} />
                        <span className="font-bold text-sm">{type.id.charAt(0).toUpperCase() + type.id.slice(1)}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <p className="text-gray-600 font-medium">Select all the skills you can do.</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_CATALOG.map((skill) => {
                    const isSelected = skills.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={`px-4 py-2.5 rounded-full border-2 text-sm font-bold flex items-center gap-2 transition-all ${
                          isSelected 
                            ? 'bg-accent border-accent text-primary' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span>{skill.icon}</span>
                        {/* Fake translation for now, normally use t(skill.titleKey) */}
                        {skill.id.split('_').join(' ').toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && unitType !== 'individual' && (
              <motion.div
                key="step3-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 font-medium">Add members to your {unitType}.</p>
                  <Button variant="secondary"  onClick={addMember} leftIcon={<Plus className="w-4 h-4"/>}>
                    Add
                  </Button>
                </div>

                <div className="space-y-3">
                  {members.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      Tap 'Add' to add team members
                    </div>
                  ) : (
                    members.map(member => (
                      <div key={member.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-3 relative">
                        <button onClick={() => removeMember(member.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-10 h-10 bg-primary text-accent rounded-full flex items-center justify-center font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" 
                            value={member.name}
                            onChange={(e) => updateMember(member.id, { name: e.target.value })}
                            className="bg-transparent font-bold text-primary w-full outline-none"
                            placeholder="Name"
                          />
                          <div className="flex gap-2">
                            <select 
                              value={member.role}
                              onChange={(e) => updateMember(member.id, { role: e.target.value })}
                              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold"
                            >
                              <option>Mistri</option>
                              <option>Karigar</option>
                              <option>Helper</option>
                            </select>
                            <div className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold flex items-center gap-1">
                              ₹<input 
                                type="number" 
                                value={member.wage}
                                onChange={(e) => updateMember(member.id, { wage: parseInt(e.target.value) || 0 })}
                                className="w-12 outline-none"
                              />/day
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <Button variant="outline" className="w-full" leftIcon={<Link className="w-4 h-4"/>}>
                  Invite via Link
                </Button>
              </motion.div>
            )}

            {step === 3 && unitType === 'individual' && (
              <motion.div
                key="step3-indiv"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">You're all set!</h2>
                <p className="text-gray-500">Ready to find jobs near you.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          {step > 1 && (
            <Button variant="secondary" onClick={handleBack} className="px-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Button 
            variant="primary" 
            className="flex-1" 
            onClick={step === 3 ? finishOnboarding : handleNext}
            rightIcon={step < 3 ? <ArrowRight className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
            disabled={step === 2 && skills.length === 0}
          >
            {step === 3 ? 'Start Finding Jobs' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};
