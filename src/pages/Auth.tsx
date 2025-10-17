import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Stethoscope } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/account-type');
    }
  }, [user, navigate]);

  const isUrdu = language === 'urdu';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isUrdu ? 'font-urdu' : ''}`}>
            {t('portalTitle')}
          </h1>
          <p className={`text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
            {t('portalSubtitle')}
          </p>
        </div>

        <Card className="shadow-large transition-smooth hover:shadow-medium">
          <CardHeader>
            <CardTitle className={isUrdu ? 'font-urdu text-right' : ''}>
              {isLogin ? t('login') : t('signUp')}
            </CardTitle>
            <CardDescription className={isUrdu ? 'font-urdu text-right' : ''}>
              {isLogin
                ? language === 'urdu'
                  ? 'اپنے اکاؤنٹ میں لاگ ان کریں'
                  : 'Sign in to your account'
                : language === 'urdu'
                ? 'نیا اکاؤنٹ بنائیں'
                : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <LoginForm
                onToggleForm={() => setIsLogin(false)}
                onSuccess={() => navigate('/account-type')}
              />
            ) : (
              <SignUpForm
                onToggleForm={() => setIsLogin(true)}
                onSuccess={() => navigate('/account-type')}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
