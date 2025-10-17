import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Globe } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const languages = [
  { id: 'english', label: 'English', nativeLabel: 'English' },
  { id: 'urdu', label: 'Urdu', nativeLabel: 'اردو' },
];

function LanguageSelectionContent() {
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          language: language,
          onboarding_completed: true 
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(language === 'urdu' ? 'خوش آمدید!' : 'Welcome!');
      navigate('/home');
    } catch (error) {
      toast.error(language === 'urdu' ? 'ایک خرابی واقع ہوئی' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isUrdu = language === 'urdu';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isUrdu ? 'font-urdu' : ''}`}>
            {t('selectLanguage')}
          </h1>
          <p className={`text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
            {language === 'urdu' 
              ? 'آپ بعد میں بھی زبان تبدیل کر سکتے ہیں'
              : 'You can change this later in settings'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {languages.map((lang) => {
            const isSelected = language === lang.id;
            
            return (
              <Card
                key={lang.id}
                className={`cursor-pointer transition-smooth hover:shadow-medium ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-medium bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setLanguage(lang.id as 'english' | 'urdu')}
              >
                <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                  <div className={`text-5xl ${lang.id === 'urdu' ? 'font-urdu' : ''}`}>
                    {lang.id === 'english' ? '🇬🇧' : '🇵🇰'}
                  </div>
                  <h3 className={`text-2xl font-semibold text-center ${
                    lang.id === 'urdu' ? 'font-urdu' : ''
                  }`}>
                    {lang.nativeLabel}
                  </h3>
                  {isSelected && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={loading}
          size="lg"
          className="w-full md:w-auto md:mx-auto md:block"
        >
          <span className={isUrdu ? 'font-urdu' : ''}>
            {loading ? t('loading') : t('continue')}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default function LanguageSelection() {
  return (
    <ProtectedRoute>
      <LanguageSelectionContent />
    </ProtectedRoute>
  );
}
