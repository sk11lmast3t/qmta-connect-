import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const supplierSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  contactNumber: z.string().min(10, 'Valid contact number required'),
  address: z.string().min(5, 'Address is required'),
  itemCategories: z.array(z.string()).min(1, 'Select at least one category'),
  paymentMethods: z.array(z.string()).min(1, 'Select at least one payment method'),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

const SupplierDetailsForm = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isUrdu = language === 'urdu';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [licensePicture, setLicensePicture] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      itemCategories: [],
      paymentMethods: [],
    },
  });

  const selectedCategories = watch('itemCategories');
  const selectedPayments = watch('paymentMethods');

  const categories = ['multinational', 'net', 'surgical', 'homeopathic'];
  const paymentMethods = ['easypaisa', 'jazzcash', 'bankAccount'];

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setValue('itemCategories', updated);
  };

  const handlePaymentToggle = (method: string) => {
    const updated = selectedPayments.includes(method)
      ? selectedPayments.filter((m) => m !== method)
      : [...selectedPayments, method];
    setValue('paymentMethods', updated);
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const onSubmit = async (data: SupplierFormData) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      let licenseUrl = null;
      let profileUrl = null;

      if (licensePicture) {
        licenseUrl = await uploadFile(licensePicture, 'license-pictures');
      }

      if (profilePicture) {
        profileUrl = await uploadFile(profilePicture, 'profile-pictures');
      }

      const { error } = await supabase.from('supplier_profiles').insert([{
        user_id: user.id,
        company_name: data.companyName,
        owner_name: data.ownerName,
        contact_number: data.contactNumber,
        address: data.address,
        item_categories: data.itemCategories as any,
        payment_methods: data.paymentMethods as any,
        license_picture_url: licenseUrl,
        profile_picture_url: profileUrl,
      }]);

      if (error) throw error;

      toast.success(t('profileCreated'));
      navigate('/language-selection');
    } catch (error) {
      console.error('Error creating supplier profile:', error);
      toast.error('Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg p-8">
        <h2 className={`text-3xl font-bold mb-6 text-center ${isUrdu ? 'font-urdu' : ''}`}>
          {t('supplierDetails')}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('companyName')}
            </label>
            <Input {...register('companyName')} className={isUrdu ? 'font-urdu text-right' : ''} />
            {errors.companyName && <p className="text-destructive text-sm mt-1">{errors.companyName.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('ownerName')}
            </label>
            <Input {...register('ownerName')} className={isUrdu ? 'font-urdu text-right' : ''} />
            {errors.ownerName && <p className="text-destructive text-sm mt-1">{errors.ownerName.message}</p>}
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
              {t('address')}
            </label>
            <Textarea {...register('address')} className={isUrdu ? 'font-urdu text-right' : ''} />
            {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('itemCategories')}
            </label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => handleCategoryToggle(cat)}
                  />
                  <label className={isUrdu ? 'font-urdu' : ''}>{t(cat)}</label>
                </div>
              ))}
            </div>
            {errors.itemCategories && <p className="text-destructive text-sm mt-1">{errors.itemCategories.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('paymentMethods')}
            </label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedPayments.includes(method)}
                    onCheckedChange={() => handlePaymentToggle(method)}
                  />
                  <label className={isUrdu ? 'font-urdu' : ''}>{t(method)}</label>
                </div>
              ))}
            </div>
            {errors.paymentMethods && <p className="text-destructive text-sm mt-1">{errors.paymentMethods.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isUrdu ? 'font-urdu text-right' : ''}`}>
              {t('uploadLicense')}
            </label>
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 mb-2" />
                <span>{licensePicture ? licensePicture.name : t('clickToUpload')}</span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setLicensePicture(e.target.files?.[0] || null)} />
            </label>
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

export default SupplierDetailsForm;
