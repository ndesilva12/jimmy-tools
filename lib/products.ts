export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  available: boolean;
  type: 'guide' | 'script' | 'database' | 'session';
  features: string[];
  preview?: string[];
}

export const products: Product[] = [
  // GUIDES
  {
    id: 'openclaw-setup',
    name: 'The Complete OpenClaw Setup Guide',
    tagline: 'From zero to your own AI assistant',
    description: 'Installation, configuration, channels, troubleshooting. 30+ pages.',
    longDescription: 'Everything you need to get OpenClaw running on your machine. This comprehensive guide walks you through installation on Mac, Linux, or Windows, configuring your first AI agent, connecting messaging channels like Telegram and Discord, and troubleshooting common issues. Written by an AI that lives and breathes OpenClaw every day.',
    price: 19.99,
    available: true,
    type: 'guide',
    features: [
      'Installation on Mac, Linux, Windows',
      'Onboarding wizard walkthrough',
      'Channel setup (Telegram, WhatsApp, Discord)',
      'Troubleshooting common issues',
      'Advanced configuration options',
    ],
    preview: ['📄 30+ pages', '📋 Step-by-step instructions', '🔧 Troubleshooting guide', '💡 Pro tips throughout'],
  },
  {
    id: 'foia-mastery',
    name: 'FOIA Request Mastery',
    tagline: 'Get government records most people can\'t',
    description: 'Complete guide to filing effective FOIA requests, appeals, and litigation.',
    longDescription: 'The definitive guide to the Freedom of Information Act. Learn how to craft requests that get results, navigate agency bureaucracy, appeal denials, and even take agencies to court. Includes templates, agency-specific tips, and advanced techniques used by investigative journalists.',
    price: 24.99,
    available: true,
    type: 'guide',
    features: [
      '12 comprehensive chapters',
      'Agency-by-agency guide (FBI, CIA, State, DOD)',
      'Fee waiver templates that work',
      'Appeal letter templates',
      'Exemption-by-exemption breakdown',
      'State public records laws overview',
    ],
    preview: ['📄 50+ pages', '📋 Ready-to-use templates', '🏛️ Agency insider tips', '⚖️ Legal strategy guide'],
  },
  {
    id: 'osint-playbook',
    name: 'OSINT Investigator\'s Playbook',
    tagline: '50+ techniques to find anyone and investigate anything',
    description: 'The complete open source intelligence guide for researchers.',
    longDescription: 'Master the art of open source intelligence. This playbook covers 50+ techniques for finding people, investigating businesses, verifying identities, and uncovering hidden connections—all using publicly available information. From social media forensics to corporate research to geolocation.',
    price: 29.99,
    available: true,
    type: 'guide',
    features: [
      '20 chapters of techniques',
      'People search & identification',
      'Social media intelligence',
      'Corporate & business research',
      'Image & video analysis',
      'Geolocation techniques',
      'Domain & website investigation',
      'OPSEC for investigators',
    ],
    preview: ['📄 60+ pages', '🔍 50+ techniques', '🛠️ Tool recommendations', '📋 Case study walkthroughs'],
  },
  {
    id: 'background-check-diy',
    name: 'Background Check DIY',
    tagline: 'Research anyone legally — save $100+ per search',
    description: 'Do your own background checks using public records.',
    longDescription: 'Stop paying $50-150 for background check services. This guide teaches you to conduct thorough background checks yourself using the same public records professionals use. Criminal records, civil court cases, property ownership, professional licenses, and more—all legally accessible.',
    price: 24.99,
    available: true,
    type: 'guide',
    features: [
      '20 comprehensive chapters',
      'Criminal records search guide',
      'Civil court & eviction records',
      'Employment & education verification',
      'Property & asset discovery',
      'State-by-state resource guide',
      'Ready-to-use checklists',
    ],
    preview: ['📄 50+ pages', '📋 5 complete checklists', '🏛️ State-by-state resources', '⚖️ Legal considerations'],
  },
  
  // SESSION
  {
    id: 'openclaw-session',
    name: '1-on-1 OpenClaw Setup Session',
    tagline: '1-hour personalized setup with live expert help',
    description: '1 hour video call to set up your OpenClaw instance.',
    longDescription: 'Get personalized help setting up OpenClaw with a 1-hour video call. We\'ll walk through installation together, configure your channels, customize your agent, and answer all your questions. Perfect if you want to get up and running fast without the trial and error.',
    price: 99,
    available: true,
    type: 'session',
    features: [
      'Complete installation walkthrough',
      'Channel configuration (Telegram, WhatsApp, etc.)',
      'Custom setup for your specific needs',
      'Live troubleshooting & Q&A',
      '30-day follow-up support via email',
    ],
    preview: ['1️⃣ Purchase session', '2️⃣ Pick a time on the calendar', '3️⃣ Join video call', '4️⃣ Walk away with a working setup'],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByType(type: Product['type']): Product[] {
  return products.filter(p => p.type === type);
}
