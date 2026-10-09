/**
 * CampusConnect Central Database & State Store
 * Persistent storage for Events, Users, Booked Passes, Attendees Directory, Activity Logs, and Feedback
 */

import { EventItem, PassItem, UserProfile, RegisteredAccount, DEFAULT_ACCOUNTS, CAMPUS_EVENTS, INITIAL_PASSES, INITIAL_USER_PROFILE } from './eventsData';

export interface UserActivityLog {
  id: string;
  userId: string;
  type: 'view_event' | 'wishlist_add' | 'wishlist_remove' | 'pass_claimed' | 'payment_completed' | 'profile_updated' | 'feedback_submitted' | 'login' | 'logout';
  title: string;
  description: string;
  timestamp: string;
  eventId?: string;
  passId?: string;
}

export interface AttendeeRecord {
  id: string;
  passId: string;
  eventId: string;
  eventTitle: string;
  studentName: string;
  studentRoll: string;
  studentCourse: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar: string;
  passType: string;
  bookingDate: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  seatZone: string;
  gateInfo: string;
  pricePaid?: number;
  paymentMethod?: string;
}

export interface EventFeedbackRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  studentName: string;
  studentRoll: string;
  rating: number; // 1 to 5
  category: string;
  message: string;
  createdAt: string;
}

export interface DetailedEventItem extends EventItem {
  subtitle?: string;
  aboutText?: string;
  schedule?: { time: string; title: string; desc?: string }[];
  rules?: string[];
  perks?: string[];
  isFree?: boolean;
  ticketPrice?: number;
  organizer?: string;
  passColorTheme?: string;
  customBadge?: string;
  bannerImage?: string;
  status?: 'active' | 'draft' | 'archived';
}

const STORAGE_KEYS = {
  EVENTS: 'eventhive_db_events',
  ATTENDEES: 'eventhive_db_attendees',
  ACTIVITY_LOGS: 'eventhive_db_activity_logs',
  FEEDBACK: 'eventhive_db_feedback',
  USERS: 'eventhive_db_registered_accounts',
  CURRENT_USER: 'eventhive_user_profile',
};

// Initial Detailed Events with Thanganat-level comprehensive metadata
export const INITIAL_DETAILED_EVENTS: DetailedEventItem[] = CAMPUS_EVENTS.map((evt) => {
  if (evt.id === 'thanganat-5') {
    return {
      ...evt,
      subtitle: 'Mega Navratri Mahotsav — 9 Nights of Sacred Rhythm',
      aboutText: 'Thanganat 5.0 is Gujarat’s grandest collegiate Ras-Garba mahotsav organized annually at the Swaminarayan University cricket grounds. Featuring high-fidelity acoustics, live traditional folk singers, and luminous festival decor.',
      schedule: [
        { time: '06:30 PM', title: 'Gate Entry & RFID Wristband Scanning' },
        { time: '07:00 PM', title: 'Maha Aarti of Maa Ambe' },
        { time: '07:45 PM', title: 'Traditional Dodhiya & Raas Rounds Begin' },
        { time: '10:30 PM', title: 'Sanedo & Western Fusion Garba Beats' },
        { time: '11:45 PM', title: 'Best Traditional Attire & Kedia Award Ceremony' },
      ],
      rules: [
        'Mandatory traditional Gujarati attire (Kedia / Kurta for boys, Chaniya Choli for girls).',
        'Physical University ID or Digital QR Pass scan required at Gate 02 turnstile.',
        'Strictly zero alcohol, tobacco, or non-vegetarian items permitted on campus.',
        'Re-entry requires biometric or RFID validation band.',
      ],
      perks: [
        'Exclusive VIP Pit Access near the central acoustic stage',
        'Complimentary traditional refreshment voucher (Fafda, Jalebi & Masala Chaas)',
        'Free high-resolution event photo downloads from the official press gallery',
      ],
      isFree: false,
      ticketPrice: 199,
      organizer: 'SU Cultural & Youth Activities Directorate',
      passColorTheme: 'gold',
      customBadge: 'Flagship Cultural Festival',
      status: 'active',
    };
  }

  if (evt.id === 'hacksu-2025') {
    return {
      ...evt,
      subtitle: '36-Hour National Collegiate Hackathon',
      aboutText: 'HackSU gathers over 500 elite coders, designers, and AI researchers across Western India. Build working solutions under 36 uninterrupted hours with mentorship from industry tech leads.',
      schedule: [
        { time: '08:00 AM', title: 'Hacker Check-in & Hardware Kit Distribution' },
        { time: '10:00 AM', title: 'Opening Keynote & Problem Statements Unveiled' },
        { time: '12:00 PM', title: 'Hacking Commences (36-Hour Clock Starts)' },
        { time: '09:00 PM', title: 'Midnight Review & Pizza Feast' },
        { time: '04:00 PM (Day 2)', title: 'Final Pitch to Venture Capitalist Panel' },
      ],
      rules: [
        'All code repositories must be initiated after opening keynote.',
        'Teams must consist of 2 to 4 enrolled university scholars.',
        'Overnight hostel lodging and high-speed Wi-Fi provided on premise.',
      ],
      perks: [
        '24/7 Red Bull energy lounge and meals included',
        '₹1,50,000 Total Cash Prize Pool & Direct Summer Internships',
        'Cloud GPU compute vouchers worth $200 per hacker',
      ],
      isFree: true,
      ticketPrice: 0,
      organizer: 'SU Dept of Computer Science & ACM Student Chapter',
      passColorTheme: 'indigo',
      customBadge: 'National Hackathon',
      status: 'active',
    };
  }

  return {
    ...evt,
    subtitle: `${evt.categoryLabel} Showcase`,
    aboutText: evt.summary,
    schedule: [
      { time: '15 Mins Prior', title: 'Gate Registration & Security Turnstile Clearance' },
      { time: 'Event Start', title: 'Inaugural Session & Welcome Address' },
      { time: 'Main Session', title: 'Core Activity & Showcase Performances' },
      { time: 'Conclude', title: 'Valedictory & Certificate Distribution' },
    ],
    rules: [
      'Valid student or faculty ID card must be presented upon entry.',
      'Maintain discipline and adhere to university code of conduct.',
      'Entry gates close 30 minutes after scheduled commencement.',
    ],
    perks: [
      'Official verified attendance credit stamped on scholar portal',
      'Digital participation certificate with verifiable QR signature',
    ],
    isFree: true,
    ticketPrice: 0,
    organizer: 'Swaminarayan University Student Council',
    passColorTheme: 'blue',
    customBadge: 'Campus Verified',
    status: 'active',
  };
});

// Initial Attendees Seeded Data
export const INITIAL_ATTENDEES: AttendeeRecord[] = [
  {
    id: 'att-1',
    passId: 'SU-THANG-88421',
    eventId: 'thanganat-5',
    eventTitle: 'Thanganat 5.0 — Live Garba Celebration',
    studentName: 'Shivam Tripathi',
    studentRoll: 'SU202204192',
    studentCourse: 'B.Tech CSE (Computer Science & Engineering)',
    studentEmail: 'shivam.tripathi@swaminarayanuniversity.ac.in',
    studentPhone: '+91 98250 14920',
    studentAvatar: '',
    passType: 'Student VIP Entry',
    bookingDate: '2025-10-02 18:32',
    isCheckedIn: true,
    checkedInAt: '2025-10-04 19:15',
    seatZone: 'Zone A • Circle 01',
    gateInfo: 'Gate 02 • Student VIP FastPass',
    pricePaid: 199,
    paymentMethod: 'UPI (tto.shivam.dm12@oksbi)',
  },
  {
    id: 'att-2',
    passId: 'SU-MUN-10294',
    eventId: 'su-mun-2025',
    eventTitle: 'SU-MUN 2025: Annual Model United Nations',
    studentName: 'Shivam Tripathi',
    studentRoll: 'SU202204192',
    studentCourse: 'B.Tech CSE (Computer Science & Engineering)',
    studentEmail: 'shivam.tripathi@swaminarayanuniversity.ac.in',
    studentPhone: '+91 98250 14920',
    studentAvatar: '',
    passType: 'Delegate Pass',
    bookingDate: '2025-10-03 14:10',
    isCheckedIn: false,
    seatZone: 'UNSC Chamber • Row 3',
    gateInfo: 'UNSC Delegate Podium • South Gate',
    pricePaid: 0,
    paymentMethod: 'Free Delegate Pass',
  },
  {
    id: 'att-3',
    passId: 'SU-HACK-77215',
    eventId: 'hacksu-2025',
    eventTitle: 'HackSU: 36-Hr Campus Hackathon',
    studentName: 'Shivam Tripathi',
    studentRoll: 'SU202204192',
    studentCourse: 'B.Tech CSE (Computer Science & Engineering)',
    studentEmail: 'shivam.tripathi@swaminarayanuniversity.ac.in',
    studentPhone: '+91 98250 14920',
    studentAvatar: '',
    passType: 'Hacker Pass',
    bookingDate: '2025-10-04 11:05',
    isCheckedIn: false,
    seatZone: 'Turing Lab • Bench 14',
    gateInfo: 'Lab Turnstile #01',
    pricePaid: 0,
    paymentMethod: 'Free Student Entry',
  },
  {
    id: 'att-4',
    passId: 'SU-THANG-91042',
    eventId: 'thanganat-5',
    eventTitle: 'Thanganat 5.0 — Live Garba Celebration',
    studentName: 'Priya Joshi',
    studentRoll: 'SU202301140',
    studentCourse: 'MBBS (Bachelor of Medicine & Surgery)',
    studentEmail: 'priya.j@swaminarayanuniversity.ac.in',
    studentPhone: '+91 99245 78102',
    studentAvatar: '',
    passType: 'Admin Free Pass',
    bookingDate: '2025-10-03 09:20',
    isCheckedIn: true,
    checkedInAt: '2025-10-04 19:30',
    seatZone: 'VIP Pavilion • Row 2',
    gateInfo: 'Gate 02 • FastPass',
    pricePaid: 0,
    paymentMethod: 'Admin Complimentary Pass',
  },
  {
    id: 'att-5',
    passId: 'SU-ROBO-33108',
    eventId: 'robowar-arena',
    eventTitle: 'RoboWar Arena 2025',
    studentName: 'Aman Verma',
    studentRoll: 'SU202208912',
    studentCourse: 'B.Tech Mechanical Engineering',
    studentEmail: 'aman.v@swaminarayanuniversity.ac.in',
    studentPhone: '+91 97230 44102',
    studentAvatar: '',
    passType: 'Student Standard',
    bookingDate: '2025-10-05 16:45',
    isCheckedIn: false,
    seatZone: 'Bleachers • Section C',
    gateInfo: 'Gate 01 • Workshop Entrance',
    pricePaid: 0,
    paymentMethod: 'Free Entry',
  },
];

// Initial Activity Logs
export const INITIAL_ACTIVITY_LOGS: UserActivityLog[] = [
  {
    id: 'act-1',
    userId: 'SU202204192',
    type: 'login',
    title: 'Logged in to CampusConnect',
    description: 'Authenticated via Swaminarayan University scholar credentials.',
    timestamp: 'Today at 09:15 AM',
  },
  {
    id: 'act-2',
    userId: 'SU202204192',
    type: 'pass_claimed',
    title: 'VIP Pass Claimed — Thanganat 5.0',
    description: 'Claimed official entry pass for Ground Gate 02, Turnstile B.',
    timestamp: 'Yesterday at 06:32 PM',
    eventId: 'thanganat-5',
  },
  {
    id: 'act-3',
    userId: 'SU202204192',
    type: 'wishlist_add',
    title: 'Saved to Wishlist',
    description: 'Added "SU-MUN 2025: Model United Nations" to your event wishlist.',
    timestamp: '2 days ago',
    eventId: 'su-mun-2025',
  },
  {
    id: 'act-4',
    userId: 'SU202204192',
    type: 'view_event',
    title: 'Viewed Event Details',
    description: 'Explored schedule and rules for HackSU 36-Hr Hackathon.',
    timestamp: '3 days ago',
    eventId: 'hacksu-2025',
  },
];

// Initial Feedback
export const INITIAL_FEEDBACK: EventFeedbackRecord[] = [
  {
    id: 'fb-1',
    eventId: 'thanganat-5',
    eventTitle: 'Thanganat 5.0 — Live Garba Celebration',
    studentName: 'Shivam Tripathi',
    studentRoll: 'SU202204192',
    rating: 5,
    category: 'Cultural Events',
    message: 'Spectacular lighting and sound arrangement! The RFID wristband entry was super fast without any queue.',
    createdAt: '2025-10-05',
  },
  {
    id: 'fb-2',
    eventId: 'hacksu-2025',
    eventTitle: 'HackSU: 36-Hr Campus Hackathon',
    studentName: 'Priya Joshi',
    studentRoll: 'SU202301140',
    rating: 5,
    category: 'Technical & Workshops',
    message: 'Awesome mentors and very comfortable workspace in Turing Lab.',
    createdAt: '2025-10-06',
  },
];

// Database Helper Service
export class DatabaseService {
  // Events
  static getEvents(): DetailedEventItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading events from storage:', e);
    }
    return INITIAL_DETAILED_EVENTS;
  }

  static saveEvents(events: DetailedEventItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      window.dispatchEvent(new Event('eventhive_db_updated'));
    } catch (e) {
      console.error('Error saving events:', e);
    }
  }

  static addEvent(newEvent: DetailedEventItem): void {
    const events = this.getEvents();
    const updated = [newEvent, ...events];
    this.saveEvents(updated);
  }

  static updateEvent(eventId: string, updatedFields: Partial<DetailedEventItem>): void {
    const events = this.getEvents();
    const updated = events.map((e) => (e.id === eventId ? { ...e, ...updatedFields } : e));
    this.saveEvents(updated);
  }

  static deleteEvent(eventId: string): void {
    const events = this.getEvents();
    const updated = events.filter((e) => e.id !== eventId);
    this.saveEvents(updated);
  }

  // Attendees
  static getAttendees(): AttendeeRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ATTENDEES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading attendees:', e);
    }
    return INITIAL_ATTENDEES;
  }

  static saveAttendees(attendees: AttendeeRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDEES, JSON.stringify(attendees));
      window.dispatchEvent(new Event('eventhive_attendees_updated'));
    } catch (e) {
      console.error('Error saving attendees:', e);
    }
  }

  static addAttendee(attendee: AttendeeRecord): void {
    const attendees = this.getAttendees();
    const updated = [attendee, ...attendees];
    this.saveAttendees(updated);
  }

  static toggleCheckIn(attendeeId: string, customStatus?: boolean): AttendeeRecord | null {
    const attendees = this.getAttendees();
    let updatedRecord: AttendeeRecord | null = null;
    const updated = attendees.map((att) => {
      if (att.id === attendeeId || att.passId === attendeeId) {
        const nextStatus = customStatus !== undefined ? customStatus : !att.isCheckedIn;
        updatedRecord = {
          ...att,
          isCheckedIn: nextStatus,
          checkedInAt: nextStatus ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
        return updatedRecord;
      }
      return att;
    });
    this.saveAttendees(updated);
    return updatedRecord;
  }

  // Activity Logs
  static getActivityLogs(userId?: string): UserActivityLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      if (stored) {
        const parsed: UserActivityLog[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          if (userId) return parsed.filter((l) => l.userId === userId || !l.userId);
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading activity logs:', e);
    }
    return INITIAL_ACTIVITY_LOGS;
  }

  static logActivity(log: Omit<UserActivityLog, 'id'>): void {
    try {
      const logs = this.getActivityLogs();
      const newEntry: UserActivityLog = {
        ...log,
        id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };
      const updated = [newEntry, ...logs.slice(0, 49)]; // keep 50 most recent
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(updated));
      window.dispatchEvent(new Event('eventhive_activity_updated'));
    } catch (e) {
      console.error('Error saving activity log:', e);
    }
  }

  // Feedback
  static getFeedback(): EventFeedbackRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading feedback:', e);
    }
    return INITIAL_FEEDBACK;
  }

  static addFeedback(fb: Omit<EventFeedbackRecord, 'id' | 'createdAt'>): void {
    const feedbackList = this.getFeedback();
    const newEntry: EventFeedbackRecord = {
      ...fb,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newEntry, ...feedbackList];
    try {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(updated));
      window.dispatchEvent(new Event('eventhive_feedback_updated'));
    } catch (e) {
      console.error('Error saving feedback:', e);
    }
  }
}
