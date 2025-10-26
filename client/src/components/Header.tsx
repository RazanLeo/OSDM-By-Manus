import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { PLATFORM_INFO } from '@shared/constants';

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="OSDM Logo" 
            className="h-12 w-12 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold gradient-text">
              {PLATFORM_INFO.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {t(PLATFORM_INFO.tagline.ar, PLATFORM_INFO.tagline.en)}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t('الرئيسية', 'Home')}
          </Link>
          <Link href="/markets" className="text-sm font-medium hover:text-primary transition-colors">
            {t('الأسواق', 'Markets')}
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            {t('من نحن', 'About')}
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            {t('اتصل بنا', 'Contact')}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
          >
            <span className="text-lg">{language === 'ar' ? '🇸🇦' : '🇺🇸'}</span>
            <span className="text-xs font-medium">
              {language === 'ar' ? 'EN' : 'AR'}
            </span>
          </Button>

          {/* Auth Buttons */}
          {isAuthenticated && user ? (
            <Link href="/dashboard">
              <Button size="sm" className="gradient-bg text-white">
                {t('لوحة التحكم', 'Dashboard')}
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="sm" className="gradient-bg text-white">
                {t('تسجيل الدخول', 'Sign In')}
              </Button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

