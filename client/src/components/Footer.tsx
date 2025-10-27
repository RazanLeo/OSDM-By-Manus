import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  MessageCircle,
  CreditCard,
  Smartphone
} from 'lucide-react';

export default function Footer() {
  const { t, direction } = useLanguage();
  const dir = direction;

  const companyLinks = [
    { labelAr: 'من نحن؟', labelEn: 'About Us', href: '/about' },
    { labelAr: 'الرؤية والرسالة', labelEn: 'Vision & Mission', href: '/vision' },
    { labelAr: 'الأهداف والمميزات ولماذا OSDM', labelEn: 'Goals & Why OSDM', href: '/why-osdm' },
    { labelAr: 'كل ما تحتاجه للبدء', labelEn: 'What You Need to Start', href: '/getting-started' },
    { labelAr: 'الفعاليات', labelEn: 'Events', href: '/events' },
    { labelAr: 'المدونة', labelEn: 'Blog', href: '/blog' },
    { labelAr: 'الإعلام والأخبار', labelEn: 'Media & News', href: '/news' },
    { labelAr: 'الوظائف', labelEn: 'Careers', href: '/careers' },
    { labelAr: 'مجتمع OSDM', labelEn: 'OSDM Community', href: '/community' },
  ];

  const platformLinks = [
    { labelAr: 'الخدمات الرئيسية للمنصة', labelEn: 'Main Platform Services', href: '/services' },
    { labelAr: 'الرسوم', labelEn: 'Fees', href: '/fees' },
    { labelAr: 'كتيب المستخدم', labelEn: 'User Guide', href: '/user-guide' },
    { labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ', href: '/faq' },
  ];

  const legalLinks = [
    { labelAr: 'سياسة الخصوصية', labelEn: 'Privacy Policy', href: '/privacy' },
    { labelAr: 'شروط الاستخدام', labelEn: 'Terms of Service', href: '/terms' },
    { labelAr: 'سياسة الأمان', labelEn: 'Security Policy', href: '/security' },
    { labelAr: 'سياسة الامتثال', labelEn: 'Compliance Policy', href: '/compliance' },
    { labelAr: 'سياسة حقوق الملكية الفكرية', labelEn: 'IP Policy', href: '/ip-policy' },
    { labelAr: 'السياسات الأخرى', labelEn: 'Other Policies', href: '/other-policies' },
  ];

  return (
    <footer className="bg-white border-t mt-20">
      <div className="container py-12 px-4">
        {/* Main Footer Content - 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Column 1: Logo, Name & Tagline */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <img 
              src="/logo.png" 
              alt="OSDM Logo" 
              className="h-24 w-24 object-contain mb-4"
            />
            <h3 
              className="text-3xl font-bold bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent leading-none mb-3"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              OSDM
            </h3>
            <p 
              className="text-base text-gray-600 text-center lg:text-start"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('السوق الرقمي ذو المحطة الواحدة', 'One Stop Digital Market')}
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <h4 
              className="text-base font-bold bg-gradient-to-r from-[#846F9C] to-[#4691A9] bg-clip-text text-transparent mb-4"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('الشركة', 'Company')}
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block"
                    style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {t(link.labelAr, link.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform Links */}
          <div>
            <h4 
              className="text-base font-bold bg-gradient-to-r from-[#4691A9] to-[#89A58F] bg-clip-text text-transparent mb-4"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('المنصة', 'Platform')}
            </h4>
            <ul className="space-y-2">
              {platformLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block"
                    style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {t(link.labelAr, link.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div>
            <h4 
              className="text-base font-bold bg-gradient-to-r from-[#846F9C] to-[#89A58F] bg-clip-text text-transparent mb-4"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('السياسات القانونية', 'Legal Policies')}
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block"
                    style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {t(link.labelAr, link.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact & Support */}
          <div>
            <h4 
              className="text-base font-bold bg-gradient-to-r from-[#4691A9] to-[#846F9C] bg-clip-text text-transparent mb-4"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('التواصل والدعم', 'Contact & Support')}
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                <span className="font-semibold">{t('المكتب:', 'Office:')}</span>
                <br />
                {t('جدة، المملكة العربية السعودية', 'Jeddah, Saudi Arabia')}
              </li>
              <li style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                <span className="font-semibold">{t('البريد الإلكتروني:', 'Email:')}</span>
                <br />
                <a href="mailto:app.osdm@gmail.com" className="hover:text-[#4691A9] transition-colors">
                  app.osdm@gmail.com
                </a>
              </li>
              <li style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                <span className="font-semibold">{t('الهاتف / واتساب / تليجرام:', 'Phone / WhatsApp / Telegram:')}</span>
                <br />
                <a href="tel:+966544827213" className="hover:text-[#4691A9] transition-colors">
                  +966 544 827 213
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center items-center gap-4 py-6 border-t border-b">
          {/* Mada */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CreditCard className="h-5 w-5 text-[#846F9C]" />
            <span className="text-sm font-medium text-gray-700">Mada</span>
          </div>
          {/* Visa */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CreditCard className="h-5 w-5 text-[#4691A9]" />
            <span className="text-sm font-medium text-gray-700">Visa</span>
          </div>
          {/* Mastercard */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CreditCard className="h-5 w-5 text-[#89A58F]" />
            <span className="text-sm font-medium text-gray-700">Mastercard</span>
          </div>
          {/* STC Pay */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Smartphone className="h-5 w-5 text-[#846F9C]" />
            <span className="text-sm font-medium text-gray-700">STC Pay</span>
          </div>
          {/* Apple Pay */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Smartphone className="h-5 w-5 text-[#4691A9]" />
            <span className="text-sm font-medium text-gray-700">Apple Pay</span>
          </div>
          {/* Google Pay */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Smartphone className="h-5 w-5 text-[#89A58F]" />
            <span className="text-sm font-medium text-gray-700">Google Pay</span>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col items-center gap-6 pt-6">
          {/* Social Media Icons */}
          <div className="flex gap-3">
            <a
              href="https://twitter.com/osdm_platform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#846F9C] to-[#4691A9] hover:opacity-90 flex items-center justify-center transition-all hover:scale-110"
              title="X (Twitter)"
            >
              <Twitter className="h-5 w-5 text-white" />
            </a>
            <a
              href="https://linkedin.com/company/osdm-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4691A9] to-[#89A58F] hover:opacity-90 flex items-center justify-center transition-all hover:scale-110"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-white" />
            </a>
            <a
              href="https://instagram.com/osdm_platform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#846F9C] to-[#89A58F] hover:opacity-90 flex items-center justify-center transition-all hover:scale-110"
              title="Instagram"
            >
              <Instagram className="h-5 w-5 text-white" />
            </a>
            <a
              href="https://youtube.com/@osdm_platform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4691A9] to-[#846F9C] hover:opacity-90 flex items-center justify-center transition-all hover:scale-110"
              title="YouTube"
            >
              <Youtube className="h-5 w-5 text-white" />
            </a>
            <a
              href="https://t.me/osdm_platform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#89A58F] to-[#4691A9] hover:opacity-90 flex items-center justify-center transition-all hover:scale-110"
              title="Telegram"
            >
              <MessageCircle className="h-5 w-5 text-white" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p 
              className="text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              <span>{t('صُنع', 'Made')}</span>
              <span className="text-xl bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent">❤️</span>
              <span>{t('في المملكة العربية السعودية', 'in Saudi Arabia')}</span>
              <span className="text-lg">🇸🇦</span>
            </p>
            <p 
              className="text-xs text-gray-500 mt-2"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('جميع الحقوق محفوظة لمنصة OSDM 2025', 'All Rights Reserved OSDM Platform 2025')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

