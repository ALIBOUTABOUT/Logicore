import type { AcademicYear, Interest } from '../types';

// Club info
export const CLUB = {
  name: 'LogiCore Club',
  tagline: 'Where math inspires and codes creates',
  email: 'logicoreclub.22@gmail.com',
  instagram: 'https://www.instagram.com/logicore_club',
  instagramHandle: '@logicore_club',
  location: 'Faculty of Exact Sciences, Djillali Liabes University',
  address: 'Faculty of Exact Sciences, Rue Benmessaoud Abdelkader, Sidi Bel Abbès, Algeria',
  streetAddress: 'Rue Benmessaoud Abdelkader, Sidi Bel Abbès, Algeria',
  university: 'Djillali Liabes University (UDL)',
  faculty: 'Faculty of Exact Sciences (FSE)',
  city: 'Sidi Bel Abbès, Algeria',
} as const;

// Stats — "Events held" is computed from DB; adjust the others here
export const STATS = {
  members: 50,
  yearsActive: 3,
} as const;

// About page content (editable)
export const ABOUT_CONTENT = {
  mission: `LogiCore Club is a student scientific club at the Faculty of Exact Sciences,
  Djillali Liabes University. We connect mathematics and computer science students through
  hands-on workshops, problem-solving sessions, and campus events.`,

  vision: `We want students at FSE to feel just as comfortable proving a theorem on paper as
  they are implementing an algorithm in code — and to have a supportive peer group on campus
  to learn, build, and compete with.`,

  whatWeDo: [
    {
      title: 'Mathematics Sessions',
      description: 'Peer-led study groups and problem sessions covering linear algebra, calculus, probability, and discrete mathematics.',
    },
    {
      title: 'Programming Workshops',
      description: 'Practical coding workshops in Python, C/C++, algorithms, and web development — from first-year basics to team projects.',
    },
    {
      title: 'Campus Events & Contests',
      description: 'Annual activities such as Open Day, Pi Day challenges on March 11, and collaborative lectures like our Green Economy & Entrepreneurship event with Finova Club.',
    },
    {
      title: 'Collaborative Projects',
      description: 'Small student teams working on mathematical modeling, data analysis, and software tools throughout the academic year.',
    },
    {
      title: 'Inter-Club Partnerships',
      description: 'Co-organizing talks, seminars, and student days with fellow clubs across Djillali Liabes University.',
    },
  ],

  selectionProcess: `Every semester, students apply online through our Join page. After reviewing
  applications, we hold an Information Day and short selection interviews at the faculty. We
  welcome motivated students from L1 through PhD — curiosity and willingness to participate
  matter more than prior experience.`,

  location: `Our club meets and hosts activities inside the Faculty of Exact Sciences (FSE) at
  Djillali Liabes University in Sidi Bel Abbès, Algeria.`,
} as const;

// Form options
export const ACADEMIC_YEARS: AcademicYear[] = ['L1', 'L2', 'L3', 'M1', 'M2', 'PhD', 'Other'];

export const INTERESTS: Interest[] = [
  'Mathematics',
  'Programming',
  'Web Development',
  'AI and Data',
  'Competitions',
  'Other',
];

// Disciplines & club activities for home page
export const FEATURES = [
  {
    title: 'Mathematics',
    tag: 'Study Groups',
    description: 'Peer problem-solving sessions in linear algebra, probability, combinatorics, and calculus — built around FSE coursework and contest problems.',
  },
  {
    title: 'Programming',
    tag: 'Workshops & Code',
    description: 'Hands-on labs in Python, C/C++, data structures, and web development where members write real software instead of just reading slides.',
  },
  {
    title: 'Workshops & Competitions',
    tag: 'Campus Events',
    description: 'Open Days, Pi Day math contests on March 11, hackathons, and joint seminars like our Green Economy talk with Finova Club.',
  },
  {
    title: 'Networking',
    tag: 'L1 – PhD Community',
    description: 'A welcoming campus community where first-year undergraduates work directly alongside Master and PhD students across exact sciences.',
  },
] as const;

// Nav links
export const NAV_LINKS = [
  { label: 'Home',    href: '/' },
  { label: 'Events',  href: '/events' },
  { label: 'About',   href: '/about' },
  { label: 'Join',    href: '/join' },
  { label: 'Contact', href: '/contact' },
] as const;
