import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }).max(255),
  username: z.string().trim().min(3, { message: 'Username must be at least 3 characters' }).max(50),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SignUpFormProps {
  onToggleForm: () => void;
  onSuccess: () => void;
}

export const SignUpForm = ({ onToggleForm, onSuccess }: SignUpFormProps) => {
  const { t, language } = useLanguage();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validated = signUpSchema.parse(formData);
      const { error } = await signUp(validated.email, validated.password, validated.username);

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error(language === 'urdu' ? 'یہ ای میل پہلے سے رجسٹرڈ ہے' : 'This email is already registered');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(language === 'urdu' ? 'اکاؤنٹ کامیابی سے بنایا گیا!' : 'Account created successfully!');
        onSuccess();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const isUrdu = language === 'urdu';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className={isUrdu ? 'font-urdu' : ''}>{t('email')}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
          className={isUrdu ? 'text-right font-urdu' : ''}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className={isUrdu ? 'font-urdu' : ''}>{t('username')}</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          disabled={loading}
          className={isUrdu ? 'text-right font-urdu' : ''}
        />
        {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className={isUrdu ? 'font-urdu' : ''}>{t('password')}</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={loading}
          className={isUrdu ? 'text-right font-urdu' : ''}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className={isUrdu ? 'font-urdu' : ''}>{t('confirmPassword')}</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          disabled={loading}
          className={isUrdu ? 'text-right font-urdu' : ''}
        />
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        <span className={isUrdu ? 'font-urdu' : ''}>{loading ? t('loading') : t('signUp')}</span>
      </Button>

      <p className={`text-center text-sm ${isUrdu ? 'font-urdu' : ''}`}>
        {t('alreadyHaveAccount')}{' '}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-primary hover:underline"
          disabled={loading}
        >
          {t('login')}
        </button>
      </p>
    </form>
  );
};
