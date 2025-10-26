/**
 * ثوابت منصة OSDM
 * جميع القيم مأخوذة حرفياً من البرومبت
 */

// الألوان الرسمية للمنصة
export const COLORS = {
  purple: '#846F9C', // البنفسجي الأرجواني
  blue: '#4691A9',   // الأزرق النيلي المتداخل مع الأزرق التركوازي
  green: '#89A58F',  // الأخضر ما بين الغامق والعشبي التيفاني
} as const;

// معلومات الاتصال
export const CONTACT_INFO = {
  office: {
    ar: 'جدة، المملكة العربية السعودية',
    en: 'Jeddah, Saudi Arabia',
  },
  email: 'app.osdm@gmail.com',
  phone: '00966544827213',
} as const;

// معلومات المنصة
export const PLATFORM_INFO = {
  name: 'OSDM',
  tagline: {
    ar: 'السوق الرقمي ذو المحطة الواحدة',
    en: 'One Stop Digital Market',
  },
  description: {
    ar: 'منصة سعودية رائدة تجمع كل ما تحتاجه من منتجات وخدمات وفرص عمل رقمية تحت سقف واحد',
    en: 'A leading Saudi platform that brings together everything you need from digital products, services, and job opportunities under one roof',
  },
} as const;

// أسماء الأسواق الثلاثة
export const MARKETS = {
  products: {
    nameAr: 'سوق المنتجات الرقمية الجاهزة',
    nameEn: 'Ready Made Digital Products',
    descriptionAr: 'منتجات رقمية جاهزة للشراء والتحميل الفوري',
    descriptionEn: 'Ready-made digital products for instant purchase and download',
  },
  services: {
    nameAr: 'سوق المنتجات والخدمات الرقمية المتخصصة حسب الطلب',
    nameEn: 'Custom Digital Products & Services By Order',
    descriptionAr: 'خدمات رقمية متخصصة حسب احتياجك',
    descriptionEn: 'Specialized digital services tailored to your needs',
  },
  jobs: {
    nameAr: 'سوق فرص العمل الحر الرقمي عن بعد',
    nameEn: 'Remote Work Opportunities for Freelancers',
    descriptionAr: 'فرص عمل حر تربط المستقلين بالشركات لتنفيذ المهام والأعمال والمشاريع بكافة أنواعها وأحجامها',
    descriptionEn: 'Freelance opportunities connecting freelancers with companies to execute tasks, work, and projects of all types and sizes',
  },
} as const;

// وسائل الدفع
export const PAYMENT_METHODS = [
  { name: 'Mada', icon: 'mada' },
  { name: 'Visa', icon: 'visa' },
  { name: 'MasterCard', icon: 'mastercard' },
  { name: 'STC Pay', icon: 'stcpay' },
  { name: 'Apple Pay', icon: 'applepay' },
  { name: 'Google Pay', icon: 'googlepay' },
] as const;

// وسائل التواصل الاجتماعي
export const SOCIAL_MEDIA = [
  { name: 'Snapchat', nameAr: 'سناب شات', url: '#', icon: 'snapchat' },
  { name: 'Instagram', nameAr: 'إنستغرام', url: '#', icon: 'instagram' },
  { name: 'TikTok', nameAr: 'تيك توك', url: '#', icon: 'tiktok' },
  { name: 'Telegram', nameAr: 'تلغرام', url: '#', icon: 'telegram' },
  { name: 'X', nameAr: 'إكس', url: '#', icon: 'x' },
  { name: 'LinkedIn', nameAr: 'لينكدن', url: '#', icon: 'linkedin' },
] as const;

// روابط الفوتر السريعة
export const FOOTER_LINKS = {
  company: {
    titleAr: 'الشركة',
    titleEn: 'Company',
    links: [
      { labelAr: 'من نحن؟', labelEn: 'About Us', href: '/about' },
      { labelAr: 'الرؤية والرسالة', labelEn: 'Vision & Mission', href: '/vision-mission' },
      { labelAr: 'الأهداف والمميزات ولماذا منصة OSDM؟', labelEn: 'Goals, Features & Why OSDM?', href: '/why-osdm' },
      { labelAr: 'كل ما تحتاجه للبدء؟', labelEn: 'Everything You Need to Start', href: '/get-started' },
      { labelAr: 'الفعاليات', labelEn: 'Events', href: '/events' },
      { labelAr: 'المدونة', labelEn: 'Blog', href: '/blog' },
      { labelAr: 'الإعلام والأخبار', labelEn: 'Media & News', href: '/news' },
      { labelAr: 'الوظائف', labelEn: 'Careers', href: '/careers' },
      { labelAr: 'مجتمع OSDM', labelEn: 'OSDM Community', href: '/community' },
    ],
  },
  platform: {
    titleAr: 'المنصة',
    titleEn: 'Platform',
    links: [
      { labelAr: 'الخدمات الرئيسية للمنصة', labelEn: 'Main Platform Services', href: '/services' },
      { labelAr: 'الرسوم', labelEn: 'Fees', href: '/fees' },
      { labelAr: 'كتيب المستخدم', labelEn: 'User Guide', href: '/user-guide' },
      { labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ', href: '/faq' },
    ],
  },
  legal: {
    titleAr: 'السياسات القانونية',
    titleEn: 'Legal Policies',
    links: [
      { labelAr: 'سياسة الخصوصية', labelEn: 'Privacy Policy', href: '/privacy' },
      { labelAr: 'شروط الاستخدام', labelEn: 'Terms of Use', href: '/terms' },
      { labelAr: 'سياسة الأمان', labelEn: 'Security Policy', href: '/security' },
      { labelAr: 'سياسة الامتثال', labelEn: 'Compliance Policy', href: '/compliance' },
      { labelAr: 'سياسة حقوق الملكية الفكرية والعلامة التجارية', labelEn: 'Intellectual Property & Trademark Policy', href: '/ip-policy' },
    ],
  },
} as const;

// حقوق النشر
export const COPYRIGHT = {
  ar: 'OSDM 2025 جميع الحقوق محفوظة صُنع في المملكة العربية السعودية 🇸🇦',
  en: 'OSDM 2025 All Rights Reserved Made in Saudi Arabia 🇸🇦',
} as const;

