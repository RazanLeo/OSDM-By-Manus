import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  MessageCircle,
  CreditCard,
  Smartphone
} from 'lucide-react';
import ContentModal from './modals/ContentModal';
import {
  aboutUsContent,
  visionMissionContent,
  whyOSDMContent,
  gettingStartedContent,
  underConstructionContent,
  communityContent,
  mainServicesContent,
  feesContent,
  userGuideContent,
  faqContent,
  privacyContent,
  termsContent,
  securityContent,
  complianceContent,
  intellectualPropertyContent,
  otherPoliciesContent
} from '@/data/footerContent';

export default function Footer() {
  const { t, direction } = useLanguage();
  const dir = direction;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    titleAr: string;
    titleEn: string;
    contentAr: string | React.ReactNode;
    contentEn: string | React.ReactNode;
  } | null>(null);

  const openModal = (titleAr: string, titleEn: string, contentAr: any, contentEn: any) => {
    setModalContent({ titleAr, titleEn, contentAr, contentEn });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <footer className="bg-white border-t mt-20">
      <div className="container py-12 px-4">
        {/* Main Footer Content - 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-8">
          {/* Column 1: Logo, Name & Tagline - Centered */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <img
              src="/logo.png"
              alt="OSDM Logo"
              className="h-48 w-auto object-contain mb-4"
            />
            <h3 
              className="text-4xl font-bold bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent leading-none mb-3 text-center"
              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, Cairo, Tajawal, sans-serif' : 'DIN Next LT Pro, Inter, sans-serif' }}
            >
              OSDM
            </h3>
            <p 
              className="text-lg text-gray-700 text-center font-medium"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('السوق الرقمي ذو المحطة الواحدة', 'One Stop Digital Market')}
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-bold bg-gradient-to-r from-[#846F9C] to-[#4691A9] bg-clip-text text-transparent mb-4"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('الشركة', 'Company')}
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => openModal('من نحن؟', 'About Us', aboutUsContent.ar, aboutUsContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('من نحن؟', 'About Us')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('الرؤية والرسالة', 'Vision & Mission', visionMissionContent.ar, visionMissionContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('الرؤية والرسالة', 'Vision & Mission')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('الأهداف والمميزات ولماذا OSDM', 'Goals & Why OSDM', whyOSDMContent.ar, whyOSDMContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('الأهداف والمميزات ولماذا OSDM', 'Goals & Why OSDM')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('كل ما تحتاجه للبدء', 'What You Need to Start', gettingStartedContent.ar, gettingStartedContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('كل ما تحتاجه للبدء', 'What You Need to Start')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('الفعاليات', 'Events', underConstructionContent.ar, underConstructionContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('الفعاليات', 'Events')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('المدونة', 'Blog', underConstructionContent.ar, underConstructionContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('المدونة', 'Blog')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('الإعلام والأخبار', 'Media & News', underConstructionContent.ar, underConstructionContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('الإعلام والأخبار', 'Media & News')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('الوظائف', 'Careers', underConstructionContent.ar, underConstructionContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('الوظائف', 'Careers')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('مجتمع OSDM', 'OSDM Community', communityContent.ar, communityContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('مجتمع OSDM', 'OSDM Community')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Links */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-bold bg-gradient-to-r from-[#4691A9] to-[#89A58F] bg-clip-text text-transparent mb-4"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('المنصة', 'Platform')}
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => openModal('الخدمات الرئيسية للمنصة', 'Main Platform Services', mainServicesContent.ar, mainServicesContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('الخدمات الرئيسية للمنصة', 'Main Platform Services')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('الرسوم', 'Fees', feesContent.ar, feesContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('الرسوم', 'Fees')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('كتيب المستخدم', 'User Guide', userGuideContent.ar, userGuideContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('كتيب المستخدم', 'User Guide')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('الأسئلة الشائعة', 'FAQ', faqContent.ar, faqContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('الأسئلة الشائعة', 'FAQ')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-bold bg-gradient-to-r from-[#846F9C] to-[#89A58F] bg-clip-text text-transparent mb-4"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('السياسات القانونية', 'Legal Policies')}
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => openModal('سياسة الخصوصية', 'Privacy Policy', privacyContent.ar, privacyContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('سياسة الخصوصية', 'Privacy Policy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('شروط الاستخدام', 'Terms of Service', termsContent.ar, termsContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('شروط الاستخدام', 'Terms of Service')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('سياسة الأمان', 'Security Policy', securityContent.ar, securityContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('سياسة الأمان', 'Security Policy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('سياسة الامتثال', 'Compliance Policy', complianceContent.ar, complianceContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('سياسة الامتثال', 'Compliance Policy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('سياسة حقوق الملكية الفكرية', 'Intellectual Property Policy', intellectualPropertyContent.ar, intellectualPropertyContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('سياسة حقوق الملكية الفكرية', 'IP Policy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('السياسات الأخرى', 'Other Policies', otherPoliciesContent.ar, otherPoliciesContent.en)}
                  className="text-gray-600 hover:text-[#4691A9] transition-colors text-sm block text-start"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('السياسات الأخرى', 'Other Policies')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact & Support */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-bold bg-gradient-to-r from-[#4691A9] to-[#846F9C] bg-clip-text text-transparent mb-4"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('التواصل والدعم', 'Contact & Support')}
            </h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                <span className="font-semibold block mb-1">{t('المكتب:', 'Office:')}</span>
                {t('جدة، المملكة العربية السعودية', 'Jeddah, Saudi Arabia')}
              </li>
              <li style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                <span className="font-semibold block mb-1">{t('البريد الإلكتروني:', 'Email:')}</span>
                <a href="mailto:app.osdm@gmail.com" className="hover:text-[#4691A9] transition-colors">
                  app.osdm@gmail.com
                </a>
              </li>
              <li style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                <span className="font-semibold block mb-1">{t('الهاتف / واتساب / تليجرام:', 'Phone / WhatsApp / Telegram:')}</span>
                <a href="tel:+966544827213" className="hover:text-[#4691A9] transition-colors">
                  +966 544 827 213
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center items-center gap-4 py-6 border-t border-b">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CreditCard className="h-5 w-5 text-[#846F9C]" />
            <span className="text-sm font-medium text-gray-700">Mada</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CreditCard className="h-5 w-5 text-[#4691A9]" />
            <span className="text-sm font-medium text-gray-700">Visa</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CreditCard className="h-5 w-5 text-[#89A58F]" />
            <span className="text-sm font-medium text-gray-700">Mastercard</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Smartphone className="h-5 w-5 text-[#846F9C]" />
            <span className="text-sm font-medium text-gray-700">STC Pay</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Smartphone className="h-5 w-5 text-[#4691A9]" />
            <span className="text-sm font-medium text-gray-700">Apple Pay</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Smartphone className="h-5 w-5 text-[#89A58F]" />
            <span className="text-sm font-medium text-gray-700">Google Pay</span>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col items-center gap-6 pt-6">
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

          <div className="text-center">
            <p 
              className="text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              <span>{t('صُنع بحب', 'Made with love')}</span>
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

      {/* Modal */}
      {modalContent && (
        <ContentModal
          isOpen={modalOpen}
          onClose={closeModal}
          titleAr={modalContent.titleAr}
          titleEn={modalContent.titleEn}
          contentAr={modalContent.contentAr}
          contentEn={modalContent.contentEn}
        />
      )}
    </footer>
  );
}

