-- Update account_type enum to include all account types
ALTER TYPE account_type ADD VALUE IF NOT EXISTS 'supplier';
ALTER TYPE account_type ADD VALUE IF NOT EXISTS 'medical_rep';
ALTER TYPE account_type ADD VALUE IF NOT EXISTS 'order_booker';

-- Create supplier_profiles table
CREATE TABLE IF NOT EXISTS public.supplier_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  license_picture_url TEXT,
  address TEXT NOT NULL,
  profile_picture_url TEXT,
  item_categories item_category[] DEFAULT '{}',
  payment_methods payment_method[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create medical_rep_profiles table
CREATE TABLE IF NOT EXISTS public.medical_rep_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  cnic_number TEXT NOT NULL,
  company_name TEXT NOT NULL,
  coverage_area TEXT NOT NULL,
  profile_picture_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_booker_profiles table
CREATE TABLE IF NOT EXISTS public.order_booker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  cnic_number TEXT NOT NULL,
  working_for TEXT NOT NULL,
  coverage_area TEXT NOT NULL,
  profile_picture_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.supplier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_rep_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_booker_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for supplier_profiles
CREATE POLICY "Users can view their own supplier profile"
  ON public.supplier_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own supplier profile"
  ON public.supplier_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplier profile"
  ON public.supplier_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for medical_rep_profiles
CREATE POLICY "Users can view their own medical rep profile"
  ON public.medical_rep_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medical rep profile"
  ON public.medical_rep_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical rep profile"
  ON public.medical_rep_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for order_booker_profiles
CREATE POLICY "Users can view their own order booker profile"
  ON public.order_booker_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own order booker profile"
  ON public.order_booker_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own order booker profile"
  ON public.order_booker_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_supplier_profiles_updated_at
  BEFORE UPDATE ON public.supplier_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_medical_rep_profiles_updated_at
  BEFORE UPDATE ON public.medical_rep_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_order_booker_profiles_updated_at
  BEFORE UPDATE ON public.order_booker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();