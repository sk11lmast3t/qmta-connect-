-- Create storage buckets for trader files
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('license-pictures', 'license-pictures', false),
  ('profile-pictures', 'profile-pictures', true);

-- Create enum for availability status
CREATE TYPE availability_status AS ENUM ('active', 'inactive');

-- Create enum for item categories
CREATE TYPE item_category AS ENUM ('multinational', 'net', 'surgical', 'homeopathic');

-- Create enum for payment methods
CREATE TYPE payment_method AS ENUM ('easypaisa', 'jazzcash', 'bank_account');

-- Create trader_profiles table
CREATE TABLE public.trader_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  license_picture_url TEXT,
  address TEXT NOT NULL,
  availability_status availability_status DEFAULT 'active',
  open_hours TEXT,
  item_categories item_category[] DEFAULT '{}',
  payment_methods payment_method[] DEFAULT '{}',
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.trader_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trader_profiles
CREATE POLICY "Users can view their own trader profile"
  ON public.trader_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trader profile"
  ON public.trader_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trader profile"
  ON public.trader_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_trader_profiles_updated_at
  BEFORE UPDATE ON public.trader_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Storage policies for license pictures
CREATE POLICY "Users can upload their own license picture"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'license-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own license picture"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'license-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own license picture"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'license-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own license picture"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'license-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for profile pictures (public bucket)
CREATE POLICY "Anyone can view profile pictures"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload their own profile picture"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own profile picture"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'profile-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own profile picture"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'profile-pictures' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );