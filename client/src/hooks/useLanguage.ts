import { useState, useEffect } from 'react';

export function useLanguage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Get language from localStorage or default to Arabic
    const savedLang = localStorage.getItem('language') as 'ar' | 'en' || 'ar';
    setLanguage(savedLang);
    
    // Set HTML dir attribute
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return {
    language,
    isRTL: language === 'ar',
    toggleLanguage,
    setLanguage: (lang: 'ar' | 'en') => {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    },
  };
}

