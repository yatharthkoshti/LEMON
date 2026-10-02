import { SkillItem } from '../types';

export const SKILLS_CATALOG: SkillItem[] = [
  // GENERAL LABOUR
  {
    id: 'general_labour',
    category: 'general_labour',
    icon: '👷',
    titleKey: 'skills.general_labour',
    descKey: 'skills.general_labour_desc'
  },
  // CONSTRUCTION KARIGAR
  {
    id: 'raj_mistri',
    category: 'construction',
    icon: '🧱',
    titleKey: 'skills.raj_mistri',
    descKey: 'skills.raj_mistri_desc'
  },
  {
    id: 'tile_karigar',
    category: 'construction',
    icon: '🪨',
    titleKey: 'skills.tile_karigar',
    descKey: 'skills.tile_karigar_desc'
  },
  {
    id: 'sariya_karigar',
    category: 'construction',
    icon: '🏗️',
    titleKey: 'skills.sariya_karigar',
    descKey: 'skills.sariya_karigar_desc'
  },
  {
    id: 'shuttering_carpenter',
    category: 'construction',
    icon: '🪚',
    titleKey: 'skills.shuttering_carpenter',
    descKey: 'skills.shuttering_carpenter_desc'
  },
  {
    id: 'painter',
    category: 'construction',
    icon: '🎨',
    titleKey: 'skills.painter',
    descKey: 'skills.painter_desc'
  },
  {
    id: 'electrician',
    category: 'construction',
    icon: '⚡',
    titleKey: 'skills.electrician',
    descKey: 'skills.electrician_desc'
  },
  {
    id: 'plumber',
    category: 'construction',
    icon: '🚰',
    titleKey: 'skills.plumber',
    descKey: 'skills.plumber_desc'
  },
  {
    id: 'pop_worker',
    category: 'construction',
    icon: '🏠',
    titleKey: 'skills.pop_worker',
    descKey: 'skills.pop_worker_desc'
  },
  {
    id: 'aluminium_worker',
    category: 'construction',
    icon: '🪟',
    titleKey: 'skills.aluminium_worker',
    descKey: 'skills.aluminium_worker_desc'
  },
  {
    id: 'marble_granite',
    category: 'construction',
    icon: '🪨',
    titleKey: 'skills.marble_granite',
    descKey: 'skills.marble_granite_desc'
  },
  {
    id: 'welder',
    category: 'construction',
    icon: '🔥',
    titleKey: 'skills.welder',
    descKey: 'skills.welder_desc'
  },
  {
    id: 'fabricator',
    category: 'construction',
    icon: '🛠',
    titleKey: 'skills.fabricator',
    descKey: 'skills.fabricator_desc'
  },
  // HOUSEHOLD SERVICES
  {
    id: 'cleaner',
    category: 'household',
    icon: '🧹',
    titleKey: 'skills.cleaner',
    descKey: 'skills.cleaner_desc'
  },
  {
    id: 'maid',
    category: 'household',
    icon: '👩',
    titleKey: 'skills.maid',
    descKey: 'skills.maid_desc'
  },
  {
    id: 'cook',
    category: 'household',
    icon: '👨',
    titleKey: 'skills.cook',
    descKey: 'skills.cook_desc'
  },
  {
    id: 'driver',
    category: 'household',
    icon: '🚗',
    titleKey: 'skills.driver',
    descKey: 'skills.driver_desc'
  },
  {
    id: 'gardener',
    category: 'household',
    icon: '🌿',
    titleKey: 'skills.gardener',
    descKey: 'skills.gardener_desc'
  },
  {
    id: 'babysitter',
    category: 'household',
    icon: '👶',
    titleKey: 'skills.babysitter',
    descKey: 'skills.babysitter_desc'
  },
  // LOADING
  {
    id: 'loader',
    category: 'loading',
    icon: '📦',
    titleKey: 'skills.loader',
    descKey: 'skills.loader_desc'
  },
  {
    id: 'unloader',
    category: 'loading',
    icon: '🚚',
    titleKey: 'skills.unloader',
    descKey: 'skills.unloader_desc'
  },
  // OTHER
  {
    id: 'other_skilled',
    category: 'other',
    icon: '👷‍♂️',
    titleKey: 'skills.other_skilled',
    descKey: 'skills.other_skilled_desc'
  }
];

export const CATEGORY_ORDER = [
  'general_labour',
  'construction',
  'household',
  'loading',
  'other'
] as const;

export const GUJARAT_CITIES = [
  'અમદાવાદ (Ahmedabad)',
  'સુરત (Surat)',
  'વડોદરા (Vadodara)',
  'રાજકોટ (Rajkot)',
  'ભાવનગર (Bhavnagar)',
  'જામનગર (Jamnagar)',
  'ગાંધીનગર (Gandhinagar)',
  'જૂનાગઢ (Junagadh)',
  'આણંદ (Anand)',
  'નવસારી (Navsari)',
  'મહેસાણા (Mehsana)',
  'મોરબી (Morbi)',
  'ભરૂચ (Bharuch)',
  'વાપી (Vapi)',
  'ભુજ (Bhuj)'
];

export const PRESET_WAGES = [600, 800, 1000, 1200, 1500];
