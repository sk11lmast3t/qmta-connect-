import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Briefcase, 
  Package, 
  UserCheck, 
  Store, 
  ClipboardList 
} from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

type AccountType = 'trader' | 'supplier' | 'medical_representative' | 'medical_store_owner' | 'order_booker';

const accountTypes = [
  { 
    id: 'trader' as AccountType, 
    icon: Briefcase,
    labelKey: 'trader' 
  },
  { 
    id: 'supplier' as AccountType, 
    icon: Package,
    labelKey: 'supplier' 
  },
  { 
    id: 'medical_representative' as AccountType, 
    icon: UserCheck,
    labelKey: 'medicalRepresentative' 
  },
  { 
    id: 'medical_store_owner' as AccountType, 
    icon: Store,
    labelKey: 'medicalStoreOwner' 
  },
  { 
    id: 'order_booker' as AccountType, 
    icon: ClipboardList,
    labelKey: 'orderBooker' 
  },
];

function AccountTypeSelectionContent() {
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedType || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ account_type: selectedType })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(language === 'urdu' ? 'کامیابی سے محفوظ ہو گیا!' : 'Successfully saved!');
      
      // Navigate based on account type
      if (selectedType === 'trader') {
        navigate('/trader-details');
      } else if (selectedType === 'supplier') {
        navigate('/supplier-details');
      } else if (selectedType === 'medical_representative') {
        navigate('/medical-rep-details');
      } else if (selectedType === 'order_booker') {
        navigate('/order-booker-details');
      } else {
        navigate('/language-selection');
      }
    } catch (error) {
      toast.error(language === 'urdu' ? 'ایک خرابی واقع ہوئی' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isUrdu = language === 'urdu';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isUrdu ? 'font-urdu' : ''}`}>
            {t('selectAccountType')}
          </h1>
          <p className={`text-muted-foreground ${isUrdu ? 'font-urdu' : ''}`}>
            {language === 'urdu' 
              ? 'براہ کرم اپنے کاروبار کی قسم منتخب کریں'
              : 'Please select your business type'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {accountTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-smooth hover:shadow-medium ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-medium bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
                  <div className={`p-4 rounded-full ${isSelected ? 'bg-primary/20' : 'bg-secondary'}`}>
                    <Icon className={`h-8 w-8 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold text-center ${isUrdu ? 'font-urdu' : ''}`}>
                    {t(type.labelKey)}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedType || loading}
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

export default function AccountTypeSelection() {
  return (
    <ProtectedRoute>
      <AccountTypeSelectionContent />
    </ProtectedRoute>
  );
}
