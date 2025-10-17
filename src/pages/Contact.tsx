import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const Contact = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language } = useLanguage();
  const { type } = useParams<{ type: string }>();
  const isUrdu = language === 'urdu';

  const getTitle = () => {
    switch (type) {
      case 'supplier':
        return 'Contact Supplier';
      case 'medical-rep':
        return 'Contact Medical Representative';
      case 'medical-owner':
        return 'Contact Medical Owner';
      case 'order-booker':
        return 'Contact Order Booker';
      default:
        return 'Contact';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-6 ${isUrdu ? 'font-urdu text-right' : ''}`}>
          {getTitle()}
        </h1>
        <div className={`prose max-w-none ${isUrdu ? 'font-urdu text-right' : ''}`}>
          <p className="text-lg text-muted-foreground">
            Contact information will appear here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Contact;
