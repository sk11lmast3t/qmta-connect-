import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'english' | 'urdu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  english: {
    // Auth
    signUp: 'Sign Up',
    login: 'Login',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    
    // Account Types
    selectAccountType: 'Select Your Account Type',
    trader: 'Trader',
    supplier: 'Supplier',
    medicalRepresentative: 'Medical Representative',
    medicalStoreOwner: 'Medical Store Owner',
    orderBooker: 'Order Booker',
    continue: 'Continue',
    
    // Language Selection
    selectLanguage: 'Select Your Preferred Language',
    english: 'English',
    urdu: 'اردو',
    
    // Dashboard
    welcome: 'Welcome to QMTA Portal',
    dashboard: 'Dashboard',
    logout: 'Logout',
    profile: 'Profile',
    
    // Common
    loading: 'Loading...',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    
    // Portal
    portalTitle: 'Quetta Medicine Traders Association',
    portalSubtitle: 'Professional Portal for Medical Industry',
    
    // Trader Form
    traderDetails: 'Trader Details',
    shopName: 'Shop Name',
    ownerName: 'Owner Name',
    contactNumber: 'Contact Number',
    uploadLicense: 'Upload License Picture',
    address: 'Address',
    availability: 'Availability',
    active: 'Active',
    inactive: 'Inactive',
    openHours: 'Open Hours (Optional)',
    itemCategories: 'Item Categories',
    multinational: 'Multinational',
    net: 'Net',
    surgical: 'Surgical',
    homeopathic: 'Homeopathic',
    supplierDetails: 'Supplier Details',
    medicalRepDetails: 'Medical Representative Details',
    orderBookerDetails: 'Order Booker Details',
    companyName: 'Company Name',
    fullName: 'Full Name',
    cnicNumber: 'CNIC Number',
    coverageArea: 'Coverage Area',
    workingFor: 'Working For',
    paymentMethods: 'Payment Methods',
    easypaisa: 'Easypaisa',
    jazzcash: 'JazzCash',
    bankAccount: 'Bank Account',
    uploadProfilePicture: 'Upload Profile Picture',
    clickToUpload: 'Click to upload',
    submitting: 'Submitting...',
    profileCreated: 'Profile created successfully',
    
    // Home Page
    home: 'Home',
    aboutUs: 'About Us',
    services: 'Services',
    communityPage: 'Community Page',
    complaintPage: 'Complaint Page',
    contactSupplier: 'Contact Supplier',
    contactMedicalOwner: 'Contact Medical Store Owner',
    contactMedicalRep: 'Contact Medical Representative',
    contactOrderBooker: 'Contact Order Booker',
    quickContacts: 'Quick Contacts',
    searchPlaceholder: 'Search...',
  },
  urdu: {
    // Auth
    signUp: 'رجسٹر کریں',
    login: 'لاگ ان',
    email: 'ای میل',
    username: 'صارف نام',
    password: 'پاس ورڈ',
    confirmPassword: 'پاس ورڈ کی تصدیق کریں',
    alreadyHaveAccount: 'پہلے سے اکاؤنٹ ہے؟',
    dontHaveAccount: 'اکاؤنٹ نہیں ہے؟',
    rememberMe: 'مجھے یاد رکھیں',
    forgotPassword: 'پاس ورڈ بھول گئے؟',
    
    // Account Types
    selectAccountType: 'اپنی اکاؤنٹ کی قسم منتخب کریں',
    trader: 'تاجر',
    supplier: 'سپلائر',
    medicalRepresentative: 'میڈیکل نمائندہ',
    medicalStoreOwner: 'میڈیکل سٹور مالک',
    orderBooker: 'آرڈر بُکر',
    continue: 'جاری رکھیں',
    
    // Language Selection
    selectLanguage: 'اپنی پسندیدہ زبان منتخب کریں',
    english: 'English',
    urdu: 'اردو',
    
    // Dashboard
    welcome: 'کوئٹہ میڈیسن ٹریڈرز ایسوسی ایشن میں خوش آمدید',
    dashboard: 'ڈیش بورڈ',
    logout: 'لاگ آؤٹ',
    profile: 'پروفائل',
    
    // Common
    loading: 'لوڈ ہو رہا ہے...',
    submit: 'جمع کروائیں',
    cancel: 'منسوخ کریں',
    save: 'محفوظ کریں',
    
    // Portal
    portalTitle: 'کوئٹہ میڈیسن ٹریڈرز ایسوسی ایشن',
    portalSubtitle: 'طبی صنعت کے لیے پیشہ ورانہ پورٹل',
    
    // Trader Form
    traderDetails: 'تاجر کی تفصیلات',
    shopName: 'دکان کا نام',
    ownerName: 'مالک کا نام',
    contactNumber: 'رابطہ نمبر',
    uploadLicense: 'لائسنس کی تصویر اپ لوڈ کریں',
    address: 'پتہ',
    availability: 'دستیابی',
    active: 'فعال',
    inactive: 'غیر فعال',
    openHours: 'کھلنے کے اوقات (اختیاری)',
    itemCategories: 'اشیاء کی اقسام',
    multinational: 'ملٹی نیشنل',
    net: 'نیٹ',
    surgical: 'سرجیکل',
    homeopathic: 'ہومیوپیتھک',
    supplierDetails: 'سپلائر کی تفصیلات',
    medicalRepDetails: 'میڈیکل نمائندے کی تفصیلات',
    orderBookerDetails: 'آرڈر بُکر کی تفصیلات',
    companyName: 'کمپنی کا نام',
    fullName: 'مکمل نام',
    cnicNumber: 'شناختی کارڈ نمبر',
    coverageArea: 'کوریج علاقہ',
    workingFor: 'کام کر رہے ہیں',
    paymentMethods: 'ادائیگی کے طریقے',
    easypaisa: 'ایزی پیسہ',
    jazzcash: 'جاز کیش',
    bankAccount: 'بینک اکاؤنٹ',
    uploadProfilePicture: 'پروفائل تصویر اپ لوڈ کریں',
    clickToUpload: 'اپ لوڈ کرنے کے لیے کلک کریں',
    submitting: 'جمع کرایا جا رہا ہے...',
    profileCreated: 'پروفائل کامیابی سے بنایا گیا',
    
    // Home Page
    home: 'ہوم',
    aboutUs: 'ہمارے بارے میں',
    services: 'خدمات',
    communityPage: 'کمیونٹی صفحہ',
    complaintPage: 'شکایت صفحہ',
    contactSupplier: 'سپلائر سے رابطہ کریں',
    contactMedicalOwner: 'میڈیکل سٹور مالک سے رابطہ کریں',
    contactMedicalRep: 'میڈیکل نمائندے سے رابطہ کریں',
    contactOrderBooker: 'آرڈر بُکر سے رابطہ کریں',
    quickContacts: 'فوری رابطے',
    searchPlaceholder: 'تلاش کریں...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.english] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
