import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  LogOut, 
  User, 
  Globe,
  Stethoscope 
} from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Profile {
  username: string;
  account_type: string;
  language: string;
}

function DashboardContent() {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, account_type, language')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
          if (data.language) {
            setLanguage(data.language as 'english' | 'urdu');
          }
          
          // Redirect to onboarding if not completed
          if (!data.account_type) {
            navigate('/account-type');
          } else if (!data.language) {
            navigate('/language-selection');
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate, setLanguage]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(language === 'urdu' ? 'لاگ آؤٹ میں خرابی' : 'Error signing out');
    } else {
      navigate('/auth');
    }
  };

  const isUrdu = language === 'urdu';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isUrdu ? 'font-urdu' : ''}`}>
                  {t('portalTitle')}
                </h1>
                <p className={`text-xs text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
                  {t('dashboard')}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className={isUrdu ? 'font-urdu' : ''}>{t('logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${isUrdu ? 'font-urdu' : ''}`}>
            {t('welcome')}{profile?.username ? `, ${profile.username}` : ''}
          </h2>
          <p className={`text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
            {language === 'urdu' 
              ? 'آپ کا ڈیش بورڈ تیار ہے۔ یہاں سے اپنے کاروبار کو منظم کریں'
              : 'Your dashboard is ready. Manage your business from here'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className={isUrdu ? 'font-urdu' : ''}>{t('profile')}</CardTitle>
              </div>
              <CardDescription className={isUrdu ? 'font-urdu' : ''}>
                {language === 'urdu' ? 'آپ کی معلومات' : 'Your information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className={`text-sm text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
                  {t('username')}
                </p>
                <p className="font-medium">{profile?.username || user?.email}</p>
              </div>
              <div>
                <p className={`text-sm text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
                  {language === 'urdu' ? 'اکاؤنٹ کی قسم' : 'Account Type'}
                </p>
                <p className={`font-medium ${isUrdu ? 'font-urdu' : ''}`}>
                  {profile?.account_type ? t(profile.account_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' ', '')) : '-'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Language Card */}
          <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className={isUrdu ? 'font-urdu' : ''}>
                  {language === 'urdu' ? 'زبان' : 'Language'}
                </CardTitle>
              </div>
              <CardDescription className={isUrdu ? 'font-urdu' : ''}>
                {language === 'urdu' ? 'آپ کی ترجیحی زبان' : 'Your preferred language'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`font-medium ${isUrdu ? 'font-urdu' : ''}`}>
                {language === 'english' ? 'English' : 'اردو'}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setLanguage(language === 'english' ? 'urdu' : 'english')}
              >
                <span className={language === 'english' ? 'font-urdu' : ''}>
                  {language === 'english' ? 'اردو میں تبدیل کریں' : 'Switch to English'}
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Placeholder Cards for Future Features */}
          <Card className="shadow-soft hover:shadow-medium transition-smooth border-dashed">
            <CardHeader>
              <CardTitle className={isUrdu ? 'font-urdu' : ''}>
                {language === 'urdu' ? 'جلد آ رہا ہے' : 'Coming Soon'}
              </CardTitle>
              <CardDescription className={isUrdu ? 'font-urdu' : ''}>
                {language === 'urdu' ? 'مزید خصوصیات جلد شامل کی جائیں گی' : 'More features will be added soon'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
