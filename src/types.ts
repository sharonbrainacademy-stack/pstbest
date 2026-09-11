export interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
  purpose: string;
}

export interface ServiceTime {
  title: string;
  day: string;
  time: string;
  description: string;
}

export interface MinistryConfig {
  pastorName: string;
  ministryTitle: string;
  churchName: string;
  branchHeadquarters: string;
  motto: string;
  announcementBanner: string;
  phoneNumbers: string[];
  whatsappMinistryLine: string;
  whatsappPrayerChannelUrl: string;
  emails: string[];
  address: string;
  serviceTimes: ServiceTime[];
  bankAccounts: BankAccount[];
  primaryColor: string;
  accentColor: string;
  navyColor: string;
  heroImageUrl: string;
  aboutExecutiveImageUrl: string;
  pastorAndWifeImageUrl: string;
  wordCafeBannerUrl: string;
  socials: {
    facebook: string;
    youtube: string;
    instagram: string;
    telegram: string;
  };
}

export interface Sermon {
  id: string;
  title: string;
  scripture: string;
  series: string;
  duration: string;
  durationSeconds: number;
  date: string;
  preacher: string;
  category: 'Prophetic' | 'Grace' | 'Deliverance' | 'Prayer' | 'Kingdom Wealth' | 'Faith';
  description: string;
  audioUrl: string;
  videoUrl?: string;
  playsCount: number;
  isFeatured?: boolean;
}

export interface WordCafeArticle {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  scriptureRef: string;
  tags: string[];
  excerpt: string;
  content: string;
  prayerDeclaration: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  pages: number;
  year: string;
  format: string;
  coverImage: string;
  description: string;
  keyRevelations: string[];
  chapters: string[];
  featuredQuote: string;
  priceNgn: number;
  downloadSampleUrl?: string;
}

export interface MinistryEvent {
  id: string;
  title: string;
  theme: string;
  startDate: string;
  endDate?: string;
  time: string;
  venue: string;
  minister: string;
  description: string;
  isFeatured: boolean;
  category: 'Crusade' | 'Conference' | 'Special Service' | 'Vigil';
  rsvpCount: number;
}

export interface BookingRequest {
  id: string;
  eventName: string;
  organizationName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  eventDate: string;
  venueCityState: string;
  expectedAttendees: string;
  eventType: string;
  additionalNotes: string;
  status: 'pending' | 'reviewed' | 'approved' | 'declined';
  submittedAt: string;
}

export interface GivingRecord {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  givingType: 'Tithe' | 'Offering' | 'Outreach Seed' | 'Building Project' | 'Prophetic Seed';
  amount: number;
  currency: string;
  bankUsed: string;
  referenceNumber: string;
  date: string;
  notes?: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'Healing & Health' | 'Prophetic Deliverance' | 'Financial Miracle' | 'Marriage & Family' | 'Spiritual Growth' | 'Other';
  request: string;
  isPrivate: boolean;
  submittedAt: string;
  status: 'Received' | 'In Prayer' | 'Answered';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Media Minister' | 'Protocol Officer';
  lastLogin: string;
  canManageSettings: boolean;
  canManageSermons: boolean;
  canManageBookings: boolean;
  password?: string;
  isFirstTimeLogin?: boolean;
  addedBy?: string;
  createdAt?: string;
}

export interface WhatsAppBroadcast {
  id: string;
  title: string;
  audioUrl: string;
  preacher: string;
  postedAt: string;
  timestamp: number;
  isLive: boolean;
  caption?: string;
}

export interface DailyScripture {
  verse: string;
  reference: string;
  propheticTheme: string;
  reflection: string;
  declaration: string;
}
