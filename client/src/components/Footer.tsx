import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { PLATFORM_INFO, CONTACT_INFO, FOOTER_LINKS, PAYMENT_METHODS, SOCIAL_MEDIA, COPYRIGHT } from '@shared/constants';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t mt-20">
      <div className="container py-12">
        {/* Main Footer Content - 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Column 1: Logo, Name & Tagline */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <img 
              src="/logo.png" 
              alt="OSDM Logo" 
              className="footer-logo mb-4"
            />
            <h3 className="text-[65px] font-bold gradient-text leading-none mb-2">
              {PLATFORM_INFO.name}
            </h3>
            <p className="text-[30px] text-gray-700 text-center lg:text-start">
              {t(PLATFORM_INFO.tagline.ar, PLATFORM_INFO.tagline.en)}
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <h4 className="text-lg font-bold gradient-text mb-4">
              {t(FOOTER_LINKS.company.titleAr, FOOTER_LINKS.company.titleEn)}
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    {t(link.labelAr, link.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform Links */}
          <div>
            <h4 className="text-lg font-bold gradient-text mb-4">
              {t(FOOTER_LINKS.platform.titleAr, FOOTER_LINKS.platform.titleEn)}
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.platform.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    {t(link.labelAr, link.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div>
            <h4 className="text-lg font-bold gradient-text mb-4">
              {t(FOOTER_LINKS.legal.titleAr, FOOTER_LINKS.legal.titleEn)}
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors text-sm"
                  >
                    {t(link.labelAr, link.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact & Support */}
          <div>
            <h4 className="text-lg font-bold gradient-text mb-4">
              {t('التواصل والدعم', 'Contact & Support')}
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <span className="font-semibold">{t('المكتب:', 'Office:')}</span>
                <br />
                {t(CONTACT_INFO.office.ar, CONTACT_INFO.office.en)}
              </li>
              <li>
                <span className="font-semibold">{t('البريد الإلكتروني:', 'Email:')}</span>
                <br />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-primary transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <span className="font-semibold">{t('الهاتف / واتساب / تليجرام:', 'Phone / WhatsApp / Telegram:')}</span>
                <br />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-primary transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center items-center gap-4 py-6 border-t border-b">
          {PAYMENT_METHODS.map((method, index) => (
            <div 
              key={index}
              className="payment-icon flex items-center justify-center bg-gray-100 rounded-lg p-2"
            >
              <span className="text-xs font-medium text-gray-700">{method.name}</span>
            </div>
          ))}
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6">
          {/* Social Media Icons */}
          <div className="flex gap-4">
            {SOCIAL_MEDIA.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title={t(social.nameAr, social.name)}
              >
                <span className="text-xs font-medium text-gray-700">
                  {social.name.charAt(0)}
                </span>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-600 text-center">
            {t(COPYRIGHT.ar, COPYRIGHT.en)}
          </p>
        </div>
      </div>
    </footer>
  );
}

