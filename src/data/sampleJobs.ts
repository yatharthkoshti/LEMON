import { Job, NotificationItem } from '../types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-101',
    title: 'રાજ મિસ્ત્રી અને પ્લાસ્ટર કામ (Raj Mistri Construction)',
    company: 'શિવાલય ઇન્ફ્રાસ્ટ્રક્ચર (Shivalay Infra)',
    posterId: 'poster-01',
    posterType: 'business',
    category: 'construction',
    location: 'એસ.જી. હાઇવે, પ્રહલાદ નગર સામે, અમદાવાદ',
    distanceKm: 2.8,
    date: 'આજે (Today)',
    time: '૦૮:૩૦ સવારે - ૦૫:૩૦ સાંજે',
    dailyWage: 1200,
    workersRequired: 2,
    workersAssignedCount: 1,
    status: 'assigned',
    paymentStatus: 'paid',
    totalJobCost: 2640,
    platformFee: 240,
    netWorkerPayout: 2400,
    description: '૩ માળના રહેણાંક પ્રોજેક્ટમાં બાહ્ય દીવાલનું ઈંટ ચણતર અને સેકન્ડ કોટ પ્લાસ્ટર કામ કરવાનું છે. તમામ માલ-સામાન સાઇટ પર હાજર છે.',
    instructions: [
      'પોતાના ઓજારો (લેલું, ઓળંબો, પાટીયું) સાથે લાવવાના રહેશે.',
      'સાઇટ પર સુરક્ષા હેલ્મેટ અને સેફ્ટી શૂઝ પહેરવા ફરજિયાત છે.',
      'સવારે ૮:૩૦ કલાકે સાઇટ ઇજનેર પાસે સેલ્ફી + GPS ચેક-ઇન કરવું.',
      'બપોરે ૧:૦૦ થી ૨:૦૦ ભોજનનો વિરામ રહેશે (સાઇટ પર પીવાનું શુદ્ધ પાણી ઉપલબ્ધ છે).'
    ],
    mapCoords: {
      lat: 23.0135,
      lng: 72.5085,
      address: 'Prahlad Nagar, S.G. Highway, Ahmedabad, Gujarat'
    },
    assignedWorkers: [
      {
        workerId: 'worker-001',
        workerName: 'રમેશભાઈ પરમાર (Ramesh P.)',
        skills: ['raj_mistri'],
        status: 'accepted'
      }
    ],
    timeline: [
      { timestamp: '૦૮:૦૦ સવારે', event: 'કામ પોસ્ટ કરવામાં આવ્યું' },
      { timestamp: '૦૮:૧૫ સવારે', event: 'રમેશભાઈ પરમાર દ્વારા કામ સ્વીકારવામાં આવ્યું' }
    ],
    urgent: true
  },
  {
    id: 'job-102',
    title: 'ઇટાલિયન માર્બલ & ટાઇલ્સ ફિટિંગ (Tiles Karigar)',
    company: 'પટેલ એન્ડ સન્સ કન્સ્ટ્રક્શન (Patel & Sons)',
    posterId: 'poster-02',
    posterType: 'staffing_agency',
    category: 'construction',
    location: 'સાયન્સ સિટી રોડ, સોલા, અમદાવાદ',
    distanceKm: 4.5,
    date: 'આજે (Today)',
    time: '૦૯:૦૦ સવારે - ૦૬:૦૦ સાંજે',
    dailyWage: 1400,
    workersRequired: 2,
    workersAssignedCount: 1,
    status: 'assigned',
    paymentStatus: 'pending',
    totalJobCost: 3080,
    platformFee: 280,
    netWorkerPayout: 2800,
    description: 'લક્ઝુરિયસ બંગલાના હોલ અને બેડરૂમમાં ૪x૨ ફીટની વિટ્રિફાઇડ ટાઇલ્સ લેવલિંગ સાથે બેસાડવાની છે. કટીંગ મશીન હાજર છે.',
    instructions: [
      'લેવલ પાઇપ અને ટાઇલ સ્પેસર પોતાની સાથે રાખવા.',
      'કામમાં ફિનિશિંગ ઉત્તમ હોવું જરૂરી છે.',
      'સાઇટ પહોંચીને Lemon ઍપમાં સેલ્ફી ચેક-ઇન કરવું.'
    ],
    mapCoords: {
      lat: 23.0805,
      lng: 72.5185,
      address: 'Science City Road, Sola, Ahmedabad, Gujarat'
    },
    assignedWorkers: [
      {
        workerId: 'worker-102',
        workerName: 'મહેશભાઈ વાઘેલા (Mahesh V.)',
        skills: ['tile_karigar'],
        status: 'applied',
        appliedAt: '૧ કલાક પહેલાં'
      }
    ],
    timeline: [
      { timestamp: 'ગઈકાલે સાંજે', event: 'જોબ રજીસ્ટર થઈ' },
      { timestamp: 'આજે સવારે', event: '૧ અરજી મળી' }
    ],
    urgent: false
  },
  {
    id: 'job-103',
    title: 'સામાન્ય કન્સ્ટ્રક્શન મજૂરી અને સાઇટ હેલ્પ (General Labour)',
    company: 'અમદાવાદ મેટ્રો ફેઝ-૨ પ્રોજેક્ટ',
    posterId: 'poster-01',
    posterType: 'business',
    category: 'general_labour',
    location: 'ગાંધીનગર હાઇવે, મોટેરા સ્ટેડિયમ પાસે, અમદાવાદ',
    distanceKm: 6.2,
    date: 'આવતીકાલે (Tomorrow)',
    time: '૦૮:૦૦ સવારે - ૦૫:૦૦ સાંજે',
    dailyWage: 800,
    workersRequired: 4,
    workersAssignedCount: 2,
    status: 'upcoming',
    paymentStatus: 'paid',
    totalJobCost: 3520,
    platformFee: 320,
    netWorkerPayout: 3200,
    description: 'રેતી, કપચી અને સિમેન્ટ બેગ સાઇટ પર શિફ્ટિંગ કરવાની છે. સરળ અને નિશ્ચિત ચુકવણી વાળું સરકારી પ્રોજેક્ટનું કામ.',
    instructions: [
      'આધાર કાર્ડ અથવા ઓળખ પત્ર સાથે લાવવું ફરજિયાત છે.',
      'સાઇટ ગેટ નંબર ૩ પર પ્રવેશ મળશે.',
      'બપોરે ભોજન સાઇટ મેસમાં મળશે.'
    ],
    mapCoords: {
      lat: 23.0915,
      lng: 72.5975,
      address: 'Near Narendra Modi Stadium, Motera, Ahmedabad'
    },
    assignedWorkers: [],
    timeline: [
      { timestamp: 'આજે ૧૧:૦૦ સવારે', event: '૪ વર્કર્સ માટે જોબ પોસ્ટ થઈ' }
    ],
    urgent: false
  },
  {
    id: 'job-104',
    title: 'ઘર કલરકામ અને પુટ્ટી વર્ક (Painter)',
    company: 'શ્રીજી હોમ ડેકોર (Shreeji Decor)',
    posterId: 'poster-03',
    posterType: 'individual',
    category: 'construction',
    location: 'બોપલ-ઘુમા રોડ, સાઉથ બોપલ, અમદાવાદ',
    distanceKm: 3.9,
    date: 'આવતીકાલે (Tomorrow)',
    time: '૦૯:૦૦ સવારે - ૦૬:૦૦ સાંજે',
    dailyWage: 1100,
    workersRequired: 1,
    workersAssignedCount: 1,
    status: 'upcoming',
    paymentStatus: 'paid',
    totalJobCost: 1210,
    platformFee: 110,
    netWorkerPayout: 1100,
    description: 'નવા 3BHK ફ્લેટમાં અંદરની દીવાલો પર ૧ કોટ પ્રાઈમર અને ૨ કોટ રોયલ ઇમલ્શન પેઇન્ટ રોલરથી કરવાનો છે.',
    instructions: [
      'રોલર અને બ્રશ સાથે લાવવાના રહેશે.',
      'ફ્લોર પર કલરના ડાઘ ન પડે તેનું પ્લાસ્ટિક ઢાંકવું પડશે.',
      'સમયસર હાજરી જરૂરી છે.'
    ],
    mapCoords: {
      lat: 23.0335,
      lng: 72.4645,
      address: 'South Bopal, Ahmedabad, Gujarat'
    },
    assignedWorkers: [],
    timeline: [
      { timestamp: 'ગઈકાલે', event: 'જોબ બનાવી' }
    ],
    urgent: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'new_job',
    titleKey: 'notifications.new_job_title',
    messageKey: 'notifications.new_job_msg',
    timeAgoKey: '૧૦ મિનિટ પહેલાં',
    date: 'આજે',
    read: false,
    jobId: 'job-101'
  },
  {
    id: 'notif-2',
    type: 'tomorrow_reminder',
    titleKey: 'notifications.reminder_title',
    messageKey: 'notifications.reminder_msg',
    timeAgoKey: '૨ કલાક પહેલાં',
    date: 'ગઈકાલે',
    read: true,
    jobId: 'job-103'
  },
  {
    id: 'notif-3',
    type: 'job_accepted',
    titleKey: 'notifications.accepted_title',
    messageKey: 'notifications.accepted_msg',
    timeAgoKey: '૧ દિવસ પહેલાં',
    date: 'ગઈકાલે',
    read: true
  }
];
