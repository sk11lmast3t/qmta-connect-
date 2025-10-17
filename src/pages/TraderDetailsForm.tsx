import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Upload } from 'lucide-react';

const itemCategories = ['multinational', 'net', 'surgical', 'homeopathic'] as const;
const paymentMethods = ['easypaisa', 'jazzcash', 'bank_account'] as const;

const formSchema = z.object({
  shopName: z.string().min(1, 'Shop name is required').max(100),
  ownerName: z.string().min(1, 'Owner name is required').max(100),
  contactNumber: z.string().min(10, 'Valid contact number required').max(20),
  address: z.string().min(1, 'Address is required').max(500),
  openHours: z.string().max(100).optional(),
  itemCategories: z.array(z.enum(itemCategories)).min(1, 'Select at least one category'),
  paymentMethods: z.array(z.enum(paymentMethods)).min(1, 'Select at least one payment method'),
});

type FormData = z.infer<typeof formSchema>;

function TraderDetailsFormContent() {
  const [loading, setLoading] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'active' | 'inactive'>('active');
  const [licensePicture, setLicensePicture] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isUrdu = language === 'urdu';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemCategories: [],
      paymentMethods: [],
    },
  });

  const selectedCategories = watch('itemCategories') || [];
  const selectedPayments = watch('paymentMethods') || [];

  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${user!.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setLoading(true);

    try {
      let licensePictureUrl = null;
      let profilePictureUrl = null;

      // Upload license picture
      if (licensePicture) {
        licensePictureUrl = await uploadFile(licensePicture, 'license-pictures', 'licenses');
        if (!licensePictureUrl) {
          throw new Error('Failed to upload license picture');
        }
      }

      // Upload profile picture
      if (profilePicture) {
        profilePictureUrl = await uploadFile(profilePicture, 'profile-pictures', 'profiles');
        if (!profilePictureUrl) {
          throw new Error('Failed to upload profile picture');
        }
      }

      // Insert trader profile
      const { error } = await supabase
        .from('trader_profiles')
        .insert({
          user_id: user.id,
          shop_name: data.shopName,
          owner_name: data.ownerName,
          contact_number: data.contactNumber,
          address: data.address,
          availability_status: availabilityStatus,
          open_hours: data.openHours || null,
          item_categories: data.itemCategories,
          payment_methods: data.paymentMethods,
          license_picture_url: licensePictureUrl,
          profile_picture_url: profilePictureUrl,
        });

      if (error) throw error;

      toast.success(isUrdu ? 'کامیابی سے محفوظ ہو گیا!' : 'Successfully saved!');
      navigate('/language-selection');
    } catch (error) {
      console.error('Error:', error);
      toast.error(isUrdu ? 'ایک خرابی واقع ہوئی' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: typeof itemCategories[number]) => {
    const current = selectedCategories;
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setValue('itemCategories', updated);
  };

  const handlePaymentChange = (method: typeof paymentMethods[number]) => {
    const current = selectedPayments;
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    setValue('paymentMethods', updated);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${isUrdu ? 'font-urdu' : ''}`}>
              {t('traderDetails')}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shop Name */}
            <div className="space-y-2">
              <Label htmlFor="shopName" className={isUrdu ? 'font-urdu' : ''}>
                {t('shopName')}
              </Label>
              <Input
                id="shopName"
                {...register('shopName')}
                className={isUrdu ? 'font-urdu text-right' : ''}
              />
              {errors.shopName && (
                <p className="text-sm text-destructive">{errors.shopName.message}</p>
              )}
            </div>

            {/* Owner Name */}
            <div className="space-y-2">
              <Label htmlFor="ownerName" className={isUrdu ? 'font-urdu' : ''}>
                {t('ownerName')}
              </Label>
              <Input
                id="ownerName"
                {...register('ownerName')}
                className={isUrdu ? 'font-urdu text-right' : ''}
              />
              {errors.ownerName && (
                <p className="text-sm text-destructive">{errors.ownerName.message}</p>
              )}
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber" className={isUrdu ? 'font-urdu' : ''}>
                {t('contactNumber')}
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                {...register('contactNumber')}
              />
              {errors.contactNumber && (
                <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className={isUrdu ? 'font-urdu' : ''}>
                {t('address')}
              </Label>
              <Textarea
                id="address"
                {...register('address')}
                rows={3}
                className={isUrdu ? 'font-urdu text-right' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            {/* Availability Status */}
            <div className="space-y-2">
              <Label className={isUrdu ? 'font-urdu' : ''}>{t('availability')}</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={availabilityStatus === 'active' ? 'default' : 'outline'}
                  onClick={() => setAvailabilityStatus('active')}
                  className={isUrdu ? 'font-urdu' : ''}
                >
                  {t('active')}
                </Button>
                <Button
                  type="button"
                  variant={availabilityStatus === 'inactive' ? 'default' : 'outline'}
                  onClick={() => setAvailabilityStatus('inactive')}
                  className={isUrdu ? 'font-urdu' : ''}
                >
                  {t('inactive')}
                </Button>
              </div>
            </div>

            {/* Open Hours */}
            <div className="space-y-2">
              <Label htmlFor="openHours" className={isUrdu ? 'font-urdu' : ''}>
                {t('openHours')}
              </Label>
              <Input
                id="openHours"
                {...register('openHours')}
                placeholder="e.g., 9:00 AM - 8:00 PM"
                className={isUrdu ? 'font-urdu text-right' : ''}
              />
            </div>

            {/* Item Categories */}
            <div className="space-y-2">
              <Label className={isUrdu ? 'font-urdu' : ''}>{t('itemCategories')}</Label>
              <div className="grid grid-cols-2 gap-4">
                {itemCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label
                      htmlFor={category}
                      className={`cursor-pointer ${isUrdu ? 'font-urdu' : ''}`}
                    >
                      {t(category)}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.itemCategories && (
                <p className="text-sm text-destructive">{errors.itemCategories.message}</p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <Label className={isUrdu ? 'font-urdu' : ''}>{t('paymentMethods')}</Label>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={selectedPayments.includes(method)}
                      onCheckedChange={() => handlePaymentChange(method)}
                    />
                    <Label
                      htmlFor={method}
                      className={`cursor-pointer ${isUrdu ? 'font-urdu' : ''}`}
                    >
                      {t(method)}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.paymentMethods && (
                <p className="text-sm text-destructive">{errors.paymentMethods.message}</p>
              )}
            </div>

            {/* License Picture Upload */}
            <div className="space-y-2">
              <Label htmlFor="license" className={isUrdu ? 'font-urdu' : ''}>
                {t('uploadLicense')}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="license"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLicensePicture(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Label
                  htmlFor="license"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-secondary"
                >
                  <Upload className="h-4 w-4" />
                  {licensePicture ? licensePicture.name : isUrdu ? 'فائل منتخب کریں' : 'Choose file'}
                </Label>
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <Label htmlFor="profile" className={isUrdu ? 'font-urdu' : ''}>
                {t('uploadProfilePicture')}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="profile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Label
                  htmlFor="profile"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-secondary"
                >
                  <Upload className="h-4 w-4" />
                  {profilePicture ? profilePicture.name : isUrdu ? 'فائل منتخب کریں' : 'Choose file'}
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full"
            >
              <span className={isUrdu ? 'font-urdu' : ''}>
                {loading ? t('loading') : t('continue')}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TraderDetailsForm() {
  return (
    <ProtectedRoute>
      <TraderDetailsFormContent />
    </ProtectedRoute>
  );
}
