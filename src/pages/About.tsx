import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

const About = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t, language } = useLanguage();
  const isUrdu = language === 'urdu';

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-6 ${isUrdu ? 'font-urdu text-right' : ''}`}>
          {t('aboutUs')}
        </h1>
        <div className={`prose max-w-none ${isUrdu ? 'font-urdu text-right' : ''}`}>
          <p className="text-lg text-muted-foreground">
            Welcome to QMTA - Quetta Medical Trade Association
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
