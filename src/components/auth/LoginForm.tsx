import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

interface LoginFormProps {
  onToggleForm: () => void;
  onSuccess: () => void;
}

export const LoginForm = ({ onToggleForm, onSuccess }: LoginFormProps) => {
  const { t, language } = useLanguage();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validated = loginSchema.parse(formData);
      const { error } = await signIn(validated.email, validated.password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(language === 'urdu' ? 'غلط ای میل یا پاس ورڈ' : 'Invalid email or password');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(language === 'urdu' ? 'کامیابی سے لاگ ان ہو گئے!' : 'Logged in successfully!');
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

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, rememberMe: checked as boolean })
            }
            disabled={loading}
          />
          <Label
            htmlFor="rememberMe"
            className={`text-sm cursor-pointer ${isUrdu ? 'font-urdu' : ''}`}
          >
            {t('rememberMe')}
          </Label>
        </div>
        <button
          type="button"
          className={`text-sm text-primary hover:underline ${isUrdu ? 'font-urdu' : ''}`}
          disabled={loading}
        >
          {t('forgotPassword')}
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        <span className={isUrdu ? 'font-urdu' : ''}>{loading ? t('loading') : t('login')}</span>
      </Button>

      <p className={`text-center text-sm ${isUrdu ? 'font-urdu' : ''}`}>
        {t('dontHaveAccount')}{' '}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-primary hover:underline"
          disabled={loading}
        >
          {t('signUp')}
        </button>
      </p>
    </form>
  );
};
