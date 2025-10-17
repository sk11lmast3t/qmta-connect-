import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function HomeContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isUrdu = language === 'urdu';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className={`text-4xl font-bold mb-2 ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'خوش آمدید' : 'Welcome'}{' '}
                {user?.email?.split('@')[0]}!
              </h1>
              <p className={`text-muted-foreground text-lg ${isUrdu ? 'font-urdu' : ''}`}>
                {t('portalTitle')}
              </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-medium transition-smooth">
                <CardHeader>
                  <CardTitle className={isUrdu ? 'font-urdu' : ''}>
                    {t('dashboard')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu 
                      ? 'اپنے ڈیش بورڈ اور سرگرمیوں کو دیکھیں'
                      : 'View your dashboard and activities'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-medium transition-smooth">
                <CardHeader>
                  <CardTitle className={isUrdu ? 'font-urdu' : ''}>
                    {t('communityPage')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu 
                      ? 'کمیونٹی کے ساتھ جڑیں'
                      : 'Connect with the community'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-medium transition-smooth">
                <CardHeader>
                  <CardTitle className={isUrdu ? 'font-urdu' : ''}>
                    {t('services')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu 
                      ? 'دستیاب خدمات تلاش کریں'
                      : 'Explore available services'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
