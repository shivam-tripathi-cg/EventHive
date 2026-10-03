export interface EventItem {
  id: string;
  title: string;
  category: 'cultural' | 'tech' | 'sports' | 'workshops' | 'diplomatic';
  categoryLabel: string;
  dateStr: string;
  shortDate: { month: string; day: string };
  time: string;
  venue: string;
  summary: string;
  attendees: number;
  isRsvpd?: boolean;
  featured?: boolean;
  badge?: string;
  gradient: string;
  iconName: string;
}

export interface PassItem {
  id: string;
  passId: string;
  eventTitle: string;
  eventSubtitle: string;
  category: string;
  dateStr: string;
  timeStr: string;
  venue: string;
  gateInfo: string;
  turnstileInfo: string;
  status: 'active' | 'past' | 'wishlist';
  badge: string;
  passType: string;
  qrCodeSeed: string;
  studentName?: string;
  studentRoll?: string;
  studentCourse?: string;
  barcode?: string;
  seatZone?: string;
}

export interface UserProfile {
  name: string;
  rollNumber: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  course: string;
  department: string;
  email: string;
  contactNumber: string;
  avatar: string;
  role: 'student' | 'faculty' | 'admin' | 'guest';
  isLoggedIn: boolean;
}

export const AVAILABLE_COURSES = [
  'MBBS (Bachelor of Medicine & Surgery)',
  'BDS (Bachelor of Dental Surgery)',
  'B.Tech CSE (Computer Science & Engineering)',
  'B.Tech AI & Data Science',
  'B.Tech Mechanical Engineering',
  'B.Tech Civil Engineering',
  'Ayurvedic (BAMS - Bachelor of Ayurvedic Medicine)',
  'Homeopathic (BHMS - Homeopathic Medicine)',
  'Pharmacy (B.Pharm)',
  'MBA / Management Studies',
  'BBA (Bachelor of Business Administration)',
  'Physiotherapy (BPT)',
  'Nursing (B.Sc Nursing)',
  'Law (BA LLB / BBA LLB)',
];

export interface RegisteredAccount {
  id: string;
  name: string;
  loginId: string; // GR Number for student, email for admin, staff ID for faculty, phone for guest
  password: string;
  role: 'student' | 'faculty' | 'admin' | 'guest';
  course: string;
  department: string;
  email: string;
  contactNumber: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  avatar?: string;
}

export const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'acc-dev',
    name: 'Dev Patel',
    loginId: 'SU202204192',
    password: 'student@2025',
    role: 'student',
    course: 'B.Tech CSE (Computer Science & Engineering)',
    department: 'Computer Science & Engineering',
    email: 'dev.patel22@swaminarayanuniversity.ac.in',
    contactNumber: '+91 98250 14920',
    age: 21,
    gender: 'Male',
  },
  {
    id: 'acc-admin',
    name: 'Dr. Arvind Mehta',
    loginId: 'admin.affairs@swaminarayanuniversity.ac.in',
    password: 'SU-ADMIN-SECURE-KEY',
    role: 'admin',
    course: 'Dean of Student Affairs',
    department: 'Administrative Directorate',
    email: 'admin.affairs@swaminarayanuniversity.ac.in',
    contactNumber: '+91 98111 22334',
    age: 48,
    gender: 'Male',
  },
  {
    id: 'acc-faculty',
    name: 'Prof. Rajesh Joshi',
    loginId: 'FAC-CSE-804',
    password: 'faculty@2025',
    role: 'faculty',
    course: 'Department of Computer Science & Engineering',
    department: 'Computer Science Faculty',
    email: 'r.joshi@swaminarayanuniversity.ac.in',
    contactNumber: '+91 98450 67890',
    age: 39,
    gender: 'Male',
  },
  {
    id: 'acc-guest',
    name: 'Aarav Sharma',
    loginId: '+91 99000 11223',
    password: '4829',
    role: 'guest',
    course: 'Visitor / Prospective Scholar',
    department: 'General Public Visitor',
    email: 'aarav.sharma@gmail.com',
    contactNumber: '+91 99000 11223',
    age: 24,
    gender: 'Male',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Dev Patel',
  rollNumber: 'SU202204192',
  age: 21,
  gender: 'Male',
  course: 'B.Tech CSE (Computer Science & Engineering)',
  department: 'Computer Science & Engineering',
  email: 'dev.patel22@swaminarayanuniversity.ac.in',
  contactNumber: '+91 98250 14920',
  avatar: '',
  role: 'student',
  isLoggedIn: true,
};

export const CAMPUS_EVENTS: EventItem[] = [
  {
    id: 'thanganat-5',
    title: 'Thanganat 5.0 — Live Garba Celebration',
    category: 'cultural',
    categoryLabel: 'Cultural & Arts',
    dateStr: 'Wed, Oct 4 • 7:00 PM - 12:00 AM',
    shortDate: { month: 'OCT', day: '04' },
    time: '7:00 PM - 12:00 AM',
    venue: 'New Cricket Ground, SU Campus',
    summary: 'Experience the thunderous beats of Dhol and authentic Ras-Garba under the stars. Mandatory traditional Kedia and Chaniya Choli attire. Gate entry valid only via RFID wristbands.',
    attendees: 2450,
    featured: true,
    badge: 'Happening Now • Day 2 of 3',
    gradient: 'from-amber-700 via-yellow-600 to-amber-900',
    iconName: 'Sparkles',
  },
  {
    id: 'hacksu-2025',
    title: 'HackSU: 36-Hr Campus Hackathon',
    category: 'tech',
    categoryLabel: 'Tech & Coding',
    dateStr: 'Fri, Oct 18 • 08:00 AM - Sat, Oct 19, 08:00 PM',
    shortDate: { month: 'OCT', day: '18' },
    time: '08:00 AM Onward (Overnight)',
    venue: 'Engineering Block 3 • Mega Turing Lab',
    summary: 'Join 500+ student developers solving AI, Web3, and HealthTech challenges. Includes overnight lodging, complimentary energy bars, and mentorship from industry CTOs.',
    attendees: 312,
    gradient: 'from-blue-700 via-indigo-700 to-slate-900',
    iconName: 'Code',
  },
  {
    id: 'robowar-arena',
    title: 'RoboWar Arena 2025',
    category: 'tech',
    categoryLabel: 'Tech & Coding',
    dateStr: 'Tue, Oct 22 • 10:00 AM - 05:30 PM',
    shortDate: { month: 'OCT', day: '22' },
    time: '10:00 AM - 05:30 PM',
    venue: 'Mechanical Workshop Complex • Ring B',
    summary: 'Heavyweight 30kg combat bots battle in a high-tensile bulletproof arena. Dual wedge spinners, flippers, and pneumatic hammers go head-to-head. Judged by ISRO Veteran Mentors.',
    attendees: 194,
    gradient: 'from-amber-600 via-red-600 to-neutral-900',
    iconName: 'Cpu',
  },
  {
    id: 'cricket-premier-league',
    title: 'Inter-College Cricket Premier League',
    category: 'sports',
    categoryLabel: 'Sports & E-Sports',
    dateStr: 'Oct 26 – Nov 02 • 01:00 PM - 07:00 PM Daily',
    shortDate: { month: 'OCT', day: '26' },
    time: '01:00 PM - 07:00 PM Daily',
    venue: 'Main Sports Pavilion • Floodlight Cricket Oval',
    summary: 'The flagship 16-over night tournament between 12 departments. Live DJ commentary, LED bails, electronic scoreboard, and cash purse of ₹1,00,000 for the winning department.',
    attendees: 480,
    gradient: 'from-emerald-700 via-teal-800 to-slate-900',
    iconName: 'Trophy',
  },
  {
    id: 'ai-ml-bootcamp',
    title: 'AI & Machine Learning Deep Dive Bootcamp',
    category: 'workshops',
    categoryLabel: 'Workshops & Seminars',
    dateStr: 'Nov 04 – Nov 05 • 09:30 AM - 04:30 PM',
    shortDate: { month: 'NOV', day: '04' },
    time: '09:30 AM - 04:30 PM',
    venue: 'Ramanujan Auditorium • Hall A',
    summary: 'Hands-on immersion in LLM fine-tuning, retrieval-augmented generation (RAG), and computer vision. Includes cloud GPU compute credits and co-certification with industry labs.',
    attendees: 228,
    gradient: 'from-purple-800 via-indigo-800 to-slate-900',
    iconName: 'GraduationCap',
  },
  {
    id: 'kala-kriti-fest',
    title: 'Kala-Kriti: Annual Drama & Street Play Fest',
    category: 'cultural',
    categoryLabel: 'Cultural & Arts',
    dateStr: 'Tue, Nov 12 • 03:00 PM - 09:30 PM',
    shortDate: { month: 'NOV', day: '12' },
    time: '03:00 PM - 09:30 PM',
    venue: 'Open-Air Amphitheatre • Central Lawns',
    summary: 'Uncensored social satire, musical mono-acts, and Nukkad Natak across 4 open-air campus circles. Showcasing 14 university troupes from across Western India.',
    attendees: 360,
    gradient: 'from-amber-800 via-orange-800 to-neutral-900',
    iconName: 'Theater',
  },
  {
    id: 'battle-of-the-bands',
    title: 'Battle of the Bands: Campus Rock Clash',
    category: 'cultural',
    categoryLabel: 'Cultural & Arts',
    dateStr: 'Mon, Nov 18 • 06:30 PM - 11:00 PM',
    shortDate: { month: 'NOV', day: '18' },
    time: '06:30 PM - 11:00 PM',
    venue: 'University Open Air Stadium',
    summary: 'High-voltage showdown of collegiate indie rock, metal, and eastern fusion ensembles. Professional acoustic sound rig with studio recording contract for winning band.',
    attendees: 740,
    gradient: 'from-rose-800 via-purple-900 to-black',
    iconName: 'Music',
  },
  {
    id: 'tedx-swaminarayan',
    title: 'TEDx Swaminarayan University: Breaking Horizons',
    category: 'workshops',
    categoryLabel: 'Workshops & Seminars',
    dateStr: 'Sun, Dec 02 • 01:00 PM - 07:00 PM',
    shortDate: { month: 'DEC', day: '02' },
    time: '01:00 PM - 07:00 PM',
    venue: 'Main University Convention Hall',
    summary: 'An independently organized afternoon of ideas worth spreading. Eight trailblazers covering neurotechnology, social entrepreneurship, and sustainable architecture.',
    attendees: 510,
    gradient: 'from-red-800 via-rose-900 to-neutral-950',
    iconName: 'Mic',
  },
  {
    id: 'startup-pitch',
    title: 'Startup Pitch & Angel Showcase',
    category: 'tech',
    categoryLabel: 'Tech & Coding',
    dateStr: 'Sat, Dec 15 • 10:00 AM - 04:00 PM',
    shortDate: { month: 'DEC', day: '15' },
    time: '10:00 AM - 04:00 PM',
    venue: 'Venture Studio • Innovation Tower 4th Floor',
    summary: 'Top 20 student startups present 5-minute pitches to certified angel networks and seed venture funds. Total commitment pool of ₹2.5 Cr in non-dilutive campus grants.',
    attendees: 145,
    gradient: 'from-blue-900 via-teal-900 to-black',
    iconName: 'Rocket',
  },
  {
    id: 'su-mun-2025',
    title: 'SU-MUN 2025: Annual Model United Nations',
    category: 'diplomatic',
    categoryLabel: 'Diplomatic Club',
    dateStr: 'Sat, Oct 18 • 9:00 AM Onward',
    shortDate: { month: 'OCT', day: '18' },
    time: '9:00 AM Onward',
    venue: 'Central Auditorium, Main Building',
    summary: 'Model United Nations Conference debating global policy, international governance, peacekeeping, and sustainable development.',
    attendees: 420,
    gradient: 'from-sky-800 via-blue-900 to-slate-900',
    iconName: 'Globe',
  },
  {
    id: 'christmas-carnival',
    title: 'Christmas Carnival & Acoustic Night',
    category: 'cultural',
    categoryLabel: 'Music & Arts',
    dateStr: 'Tue, Dec 24 • 5:00 PM Onward',
    shortDate: { month: 'DEC', day: '24' },
    time: '5:00 PM - 10:00 PM',
    venue: 'Student Amphitheatre',
    summary: 'Winter Fest & Acoustic Night with live unplugged sets, artisanal cocoa stalls, fairy light canopies, and university choir performances.',
    attendees: 680,
    gradient: 'from-emerald-900 via-red-900 to-amber-950',
    iconName: 'Flame',
  },
  {
    id: 'new-year-bash',
    title: 'New Year Bash 2026: Midnight Countdown',
    category: 'cultural',
    categoryLabel: 'Student Council',
    dateStr: 'Wed, Dec 31 • 8:00 PM Till 1:00 AM',
    shortDate: { month: 'DEC', day: '31' },
    time: '8:00 PM - 01:00 AM',
    venue: 'Main University Lawns',
    summary: 'DJ Night & Midnight Countdown featuring electronic dance showcases, cold pyrotechnics, street food street, and luminous drone formations.',
    attendees: 1200,
    gradient: 'from-amber-600 via-purple-900 to-neutral-950',
    iconName: 'Disc',
  },
  {
    id: 'makar-sankranti',
    title: 'Makar Sankranti Fest & Kite Carnival',
    category: 'sports',
    categoryLabel: 'Cultural Committee',
    dateStr: 'Wed, Jan 14 • 10:00 AM - 5:00 PM',
    shortDate: { month: 'JAN', day: '14' },
    time: '10:00 AM - 05:00 PM',
    venue: 'Sports Complex Ground',
    summary: 'Kite Flying & Traditional Food Mela celebrating Gujarati harvest heritage with authentic Undhiyu, Chikki stalls, and aerial kite battles.',
    attendees: 850,
    gradient: 'from-sky-600 via-amber-600 to-yellow-700',
    iconName: 'Sun',
  },
];

export const INITIAL_PASSES: PassItem[] = [
  {
    id: 'pass-1',
    passId: 'SU-THANG-88421',
    eventTitle: 'Thanganat 5.0 — Live Garba Celebration',
    eventSubtitle: 'Grand Campus Ras-Garba Mega Gala',
    category: 'Cultural Mega Gala',
    dateStr: 'Wed, Oct 4, 2025 • 7:00 PM - 12:00 AM',
    timeStr: '7:00 PM - 12:00 AM',
    venue: 'New Cricket Ground, SU Campus',
    gateInfo: 'Gate 02 • Student VIP FastPass Entry',
    turnstileInfo: 'Lane B • Turnstile 04',
    status: 'active',
    badge: 'Active • FastScan Verified',
    passType: 'VIP Student Pass',
    qrCodeSeed: 'SU-THANG-88421-DEV-PATEL-NFC-GATE-04',
    barcode: '||| | | |||| || ||| || |||| | ||| | ||',
    seatZone: 'Zone A • Circle 01',
    studentName: 'Dev Patel',
    studentRoll: 'SU202204192',
    studentCourse: 'B.Tech CSE (Computer Science & Engineering)',
  },
  {
    id: 'pass-2',
    passId: 'SU-MUN-10294',
    eventTitle: 'SU-MUN 2025: Model United Nations',
    eventSubtitle: 'Diplomatic Leadership & Policy Summit',
    category: 'Diplomatic Symposium',
    dateStr: 'Sat, Oct 18, 2025 • 9:00 AM Onward',
    timeStr: '9:00 AM Onward',
    venue: 'Central Auditorium, Main Academic Block',
    gateInfo: 'UNSC Delegate Podium • South Gate',
    turnstileInfo: 'Delegate Podium Alpha • Seat #UNSC-07',
    status: 'active',
    badge: 'Confirmed Delegate',
    passType: 'Delegate Pass',
    qrCodeSeed: 'SU-MUN-10294-DEV-PATEL-UNSC-SEAT-07',
    barcode: '|| |||| | | ||| |||| | || ||| | |||| |',
    seatZone: 'UNSC Chamber • Row 3',
    studentName: 'Dev Patel',
    studentRoll: 'SU202204192',
    studentCourse: 'B.Tech CSE (Computer Science & Engineering)',
  },
  {
    id: 'pass-3',
    passId: 'SU-HACK-77215',
    eventTitle: 'HackSU: 36-Hr Campus Hackathon',
    eventSubtitle: 'Innovation & Rapid Prototyping Clash',
    category: 'Tech & Coding Gala',
    dateStr: 'Fri, Nov 8, 2025 • Starts 10:00 AM',
    timeStr: '10:00 AM Onward (Overnight)',
    venue: 'Engineering Block 3 Innovation Lab',
    gateInfo: 'Lab Turnstile #01 • Dev-Bench #14',
    turnstileInfo: 'Overnight Access • Hardware Bay C',
    status: 'active',
    badge: 'Hacker Pass • Team Alpha',
    passType: 'Hacker Pass',
    qrCodeSeed: 'SU-HACK-77215-DEV-PATEL-BENCH-14',
    barcode: '|||| | ||| | || |||| | | |||| || || |',
    seatZone: 'Turing Lab • Bench 14',
    studentName: 'Dev Patel',
    studentRoll: 'SU202204192',
    studentCourse: 'B.Tech CSE (Computer Science & Engineering)',
  },
];

export const CONCLUDED_EVENTS = [
  {
    id: 'c1',
    dateLabel: 'Concluded Sep 2024',
    title: 'Ganpati Utsav & Visarjan Celebration',
    category: 'Full Campus Festivity',
    desc: '10 days of eco-friendly clay idol worship, maha-aarti, daily prasad distribution, and campus-wide procession.',
    badge: '340+ Photos Archived',
    actionText: 'View Gallery',
    gradient: 'from-amber-900 to-stone-900',
  },
  {
    id: 'c2',
    dateLabel: 'Concluded Aug 2024',
    title: 'Janmashtami Dahi Handi Mahotsav',
    category: 'Tradition & Athletics',
    desc: 'Five-tier human pyramids contested across 8 faculty houses. Winners Mechanical Titans claimed the campus trophy.',
    badge: 'Winners: Mechanical Titans',
    actionText: 'View Highlights',
    gradient: 'from-yellow-900 to-neutral-900',
  },
  {
    id: 'c3',
    dateLabel: 'Concluded Jul 2024',
    title: 'Monsoon Tree Plantation & Eco-Drive',
    category: 'Environmental Stewardship',
    desc: '1,500 indigenous neem and peepal saplings planted along the south perimeter with Gujarat Forestry Dept.',
    badge: '1,500 Saplings Planted',
    actionText: 'Impact Report',
    gradient: 'from-emerald-950 to-neutral-900',
  },
];
