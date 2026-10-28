import { PosterProfile } from '../types';

export const SAMPLE_POSTERS: PosterProfile[] = [
  {
    id: 'poster-01',
    name: 'વિજયભાઈ પટેલ (Vijay Patel)',
    companyName: 'શિવાલય ઇન્ફ્રાસ્ટ્રક્ચર (Shivalay Infra)',
    posterType: 'business',
    city: 'અમદાવાદ (Ahmedabad)',
    email: 'vijay@shivalayinfra.com',
    phone: '98250 12345',
    locationCoords: { lat: 23.0135, lng: 72.5085 },
    verified: true,
    totalJobsPosted: 14,
    activeJobsCount: 2,
    totalSpent: 48500
  },
  {
    id: 'poster-02',
    name: 'રાજેશભાઈ શાહ (Rajesh Shah)',
    companyName: 'પટેલ એન્ડ સન્સ કન્સ્ટ્રક્શન (Patel & Sons)',
    posterType: 'staffing_agency',
    city: 'અમદાવાદ (Ahmedabad)',
    email: 'rajesh@patelsons.co.in',
    phone: '98980 44556',
    locationCoords: { lat: 23.0805, lng: 72.5185 },
    verified: true,
    totalJobsPosted: 28,
    activeJobsCount: 4,
    totalSpent: 92400
  },
  {
    id: 'poster-03',
    name: 'જિગ્નેશભાઈ મહેતા (Jignesh Mehta)',
    companyName: 'મેટ્રો ઇન્ફ્રા પ્રોજેક્ટ્સ (Metro Infra)',
    posterType: 'business',
    city: 'ગાંધીનગર (Gandhinagar)',
    email: 'jignesh@metroinfra.in',
    phone: '97230 88990',
    locationCoords: { lat: 23.0900, lng: 72.5900 },
    verified: true,
    totalJobsPosted: 8,
    activeJobsCount: 1,
    totalSpent: 35000
  },
  {
    id: 'poster-04',
    name: 'અમીતભાઈ સોની (Amit Soni)',
    companyName: 'વ્યક્તિગત મકાન માલિક (Home Owner)',
    posterType: 'individual',
    city: 'વડોદરા (Vadodara)',
    email: 'amitsoni@gmail.com',
    phone: '94260 33441',
    locationCoords: { lat: 22.3072, lng: 73.1812 },
    verified: false,
    totalJobsPosted: 2,
    activeJobsCount: 1,
    totalSpent: 5200
  }
];
