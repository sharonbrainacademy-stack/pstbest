import React, { useState } from 'react';
import { MinistryProvider, useMinistry } from './context/MinistryContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AudioPlayer } from './components/AudioPlayer';
import { WhatsAppLiveAudioBanner } from './components/WhatsAppLiveAudioBanner';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Toast } from './components/Toast';
import { PrayerModal } from './components/PrayerModal';
import { ArticleModal } from './components/ArticleModal';
import { BookModal } from './components/BookModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { WordCafeSermonsPage } from './pages/WordCafeSermonsPage';
import { BooksPage } from './pages/BooksPage';
import { EventsPage } from './pages/EventsPage';
import { GivingPage } from './pages/GivingPage';
import { BookingPage } from './pages/BookingPage';
import { AdminPortal } from './pages/AdminPortal';

import { WordCafeArticle, Book } from './types';

const MainAppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<WordCafeArticle | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0A2342] text-slate-900 dark:text-white transition-colors duration-300 relative selection:bg-rose-500 selection:text-white">
      
      {/* Toast Notification Container */}
      <Toast />

      {/* WhatsApp Live Audio Sync Banner */}
      <WhatsAppLiveAudioBanner />

      {/* Navigation Bar with Live Marquee & Mobile Drawer */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-28 sm:pb-36">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={handleTabChange}
            onOpenArticle={article => setSelectedArticle(article)}
            onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage
            setActiveTab={handleTabChange}
            onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
          />
        )}

        {activeTab === 'sermons' && (
          <WordCafeSermonsPage
            onOpenArticle={article => setSelectedArticle(article)}
          />
        )}

        {activeTab === 'books' && (
          <BooksPage
            onOpenBookModal={book => setSelectedBook(book)}
          />
        )}

        {activeTab === 'events' && (
          <EventsPage
            onOpenBookingTab={() => handleTabChange('booking')}
          />
        )}

        {activeTab === 'giving' && (
          <GivingPage />
        )}

        {activeTab === 'booking' && (
          <BookingPage />
        )}

        {activeTab === 'admin' && (
          <AdminPortal setActiveTab={handleTabChange} />
        )}
      </main>

      {/* Comprehensive Church & Ministry Footer */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenPrayerModal={() => setIsPrayerModalOpen(true)}
      />

      {/* Global Modals */}
      <PrayerModal
        isOpen={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      {/* Persistent Floating Worship Pad & Sermon Audio Player */}
      <AudioPlayer />

      {/* WhatsApp Quick Prayer Channel Floating Trigger */}
      <FloatingWhatsApp />

    </div>
  );
};

export default function App() {
  return (
    <MinistryProvider>
      <MainAppLayout />
    </MinistryProvider>
  );
}
