/**
 * Date selector helpers for hotel-booking style date picker
 */

export interface DateItem {
  key: string;       // 'today', 'tomorrow', 'all', or 'YYYY-MM-DD'
  dateStr: string;   // 'YYYY-MM-DD'
  dayOfWeek: string; // 'Som', 'Mangal' / 'Mon', 'Tue'
  dayNumber: number; // 18, 19
  monthName: string; // 'Nov', 'નવે'
  relativeLabelKey: string; // 'today', 'tomorrow', or ''
  isToday: boolean;
  isTomorrow: boolean;
}

export function formatDateToIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const GU_DAYS = ['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'];
const HI_DAYS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनિ'];
const EN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const GU_MONTHS = ['જાન્યુ', 'ફેબ્રુ', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટે', 'ઓક્ટો', 'નવે', 'ડિસે'];
const HI_MONTHS = ['जन', 'फ़र', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुला', 'अग', 'सितં', 'अक्तू', 'नवं', 'दिसં'];
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function generateDateStrip(daysCount = 14, lang = 'gu'): DateItem[] {
  const items: DateItem[] = [];
  const today = new Date();

  for (let i = 0; i < daysCount; i++) {
    const cur = new Date();
    cur.setDate(today.getDate() + i);

    const iso = formatDateToIso(cur);
    const dayIndex = cur.getDay();
    const monthIndex = cur.getMonth();

    let dayOfWeek = EN_DAYS[dayIndex];
    let monthName = EN_MONTHS[monthIndex];

    if (lang === 'gu') {
      dayOfWeek = GU_DAYS[dayIndex];
      monthName = GU_MONTHS[monthIndex];
    } else if (lang === 'hi') {
      dayOfWeek = HI_DAYS[dayIndex];
      monthName = HI_MONTHS[monthIndex];
    }

    items.push({
      key: iso,
      dateStr: iso,
      dayOfWeek,
      dayNumber: cur.getDate(),
      monthName,
      relativeLabelKey: i === 0 ? 'today' : i === 1 ? 'tomorrow' : '',
      isToday: i === 0,
      isTomorrow: i === 1
    });
  }

  return items;
}

/**
 * Checks if a job matches a selected date string ('all', or 'YYYY-MM-DD')
 */
export function matchesJobDate(job: { date: string; targetDate?: string }, selectedDateIso: string): boolean {
  if (selectedDateIso === 'all') return true;

  const todayIso = formatDateToIso(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = formatDateToIso(tomorrow);

  // If job has targetDate set, compare directly
  if (job.targetDate) {
    return job.targetDate === selectedDateIso;
  }

  // Fallback heuristic based on legacy date string
  const dateLower = (job.date || '').toLowerCase();
  const isTodayJob = dateLower.includes('આજે') || dateLower.includes('today') || dateLower.includes('आज');
  const isTomorrowJob = dateLower.includes('આવતીકાલે') || dateLower.includes('tomorrow') || dateLower.includes('कल');

  if (selectedDateIso === todayIso) {
    return isTodayJob;
  }

  if (selectedDateIso === tomorrowIso) {
    return isTomorrowJob;
  }

  // If selecting a further date and job string matches YYYY-MM-DD or numeric date
  return job.date.includes(selectedDateIso);
}
