import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const orderBookerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  contactNumber: z.string().min(10, 'Valid contact number required'),
  cnicNumber: z.string().min(13, 'Valid CNIC number required'),
  workingFor: z.string().min(1, 'Working for is required'),
  coverageArea: z.string().min(1, 'Coverage area is required'),
});

type OrderBookerFormData = z.infer<typeof orderBookerSchema>;

const OrderBookerDetailsForm = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isUrdu = language === 'urdu';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<OrderBookerFormData>({
    resolver: zodResolver(orderBookerSchema),
  });

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const onSubmit = async (data: OrderBookerFormData) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      let profileUrl = null;

      if (profilePicture) {
        profileUrl = await uploadFile(profilePicture, 'profile-pictures');
      }

      const { error } = await supabase.from('order_booker_profiles').insert([{
        user_id: user.id,
        full_name: data.fullName,
        contact_number: data.contactNumber,
        cnic_number: data.cnicNumber,
        working_for: data.workingFor,
        coverage_area: data.coverageArea,
        profile_picture_url: profileUrl,
      }] as any);

      if (error) throw error;

      toast.success(t('profileCreated'));
      navigate('/language-selection');
    } catch (error) {
      console.error('Error creating order booker profile:', error);
      toast.error('Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg p-8">
        <h2 className={`text-3xl font-bold mb-6 text-center ${isUrdu ? 'font-urdu' : ''}`}>
          {t('orderBookerDetails')}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('fullName')}
            </label>
            <Input {...register('fullName')} className={isUrdu ? 'font-urdu text-right' : ''} />
            {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('contactNumber')}
            </label>
            <Input {...register('contactNumber')} className={isUrdu ? 'font-urdu text-right' : ''} />
            {errors.contactNumber && <p className="text-destructive text-sm mt-1">{errors.contactNumber.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('cnicNumber')}
            </label>
            <Input {...register('cnicNumber')} className={isUrdu ? 'font-urdu text-right' : ''} placeholder="12345-1234567-1" />
            {errors.cnicNumber && <p className="text-destructive text-sm mt-1">{errors.cnicNumber.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('workingFor')}
            </label>
            <Input {...register('workingFor')} className={isUrdu ? 'font-urdu text-right' : ''} />
            {errors.workingFor && <p className="text-destructive text-sm mt-1">{errors.workingFor.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('coverageArea')}
            </label>
            <Input {...register('coverageArea')} className={isUrdu ? 'font-urdu text-right' : ''} />
            {errors.coverageArea && <p className="text-destructive text-sm mt-1">{errors.coverageArea.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('uploadProfile')}
            </label>
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 mb-2" />
                <span>{profilePicture ? profilePicture.name : t('clickToUpload')}</span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrderBookerDetailsForm;
