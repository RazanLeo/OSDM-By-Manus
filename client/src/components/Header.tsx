import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import {
  Search,
  Bell,
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  ChevronUp,
  ChevronDown,
  Globe,
} from 'lucide-react';

export default function Header() {
  const { language, setLanguage, t, direction } = useLanguage();
  const dir = direction;
  const [location] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll buttons based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = '/';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container flex h-20 items-center justify-between gap-4 px-4">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/logo.png"
                alt="OSDM Logo"
                className="h-16 w-16 object-contain"
              />
              <div className="flex flex-col">
                <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="osdm-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#846F9C', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#4691A9', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#89A58F', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <text
                    x="0"
                    y="28"
                    fill="url(#osdm-gradient)"
                    fontSize="32"
                    fontWeight="bold"
                    fontFamily={dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif'}
                  >
                    OSDM
                  </text>
                </svg>
                <span
                  className="text-xs text-gray-600"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('السوق الرقمي ذو المحطة الواحدة', 'One Stop Digital Market')}
                </span>
              </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5`} />
              <Input
                type="text"
                placeholder={t('ابحث عن منتجات، خدمات، أو فرص عمل...', 'Search for products, services, or jobs...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${dir === 'rtl' ? 'pr-10' : 'pl-10'} h-11 border-2 border-gray-200 focus:border-[#4691A9] transition-colors`}
                style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-[#846F9C]/10 hover:to-[#4691A9]/10 transition-all"
                >
                  <Globe className="h-5 w-5" />
                  <span className="hidden sm:inline" style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                    {language === 'ar' ? (
                      <>
                        <span className="text-lg">🇸🇦</span> العربية
                      </>
                    ) : (
                      <>
                        <span className="text-lg">🇺🇸</span> English
                      </>
                    )}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'}>
                <DropdownMenuItem
                  onClick={() => setLanguage('ar')}
                  className="cursor-pointer"
                  style={{ fontFamily: 'DIN Next LT Arabic, sans-serif' }}
                >
                  <span className="text-lg mr-2">🇸🇦</span> العربية (AR)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage('en')}
                  className="cursor-pointer"
                  style={{ fontFamily: 'DIN Next LT Pro, sans-serif' }}
                >
                  <span className="text-lg mr-2">🇺🇸</span> English (EN)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gradient-to-r hover:from-[#846F9C]/10 hover:to-[#4691A9]/10 transition-all"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            )}

            {/* Navigation Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gradient-to-r hover:from-[#846F9C]/10 hover:to-[#4691A9]/10 transition-all"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <a className="w-full cursor-pointer" style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                      {t('الرئيسية', 'Home')}
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/markets/products">
                    <a className="w-full cursor-pointer" style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                      {t('سوق المنتجات', 'Products Market')}
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/markets/services">
                    <a className="w-full cursor-pointer" style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                      {t('سوق الخدمات', 'Services Market')}
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/markets/jobs">
                    <a className="w-full cursor-pointer" style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                      {t('سوق فرص العمل', 'Jobs Market')}
                    </a>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gradient-to-r hover:from-[#846F9C]/10 hover:to-[#4691A9]/10 transition-all"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <a className="w-full cursor-pointer flex items-center gap-2" style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                        <LayoutDashboard className="h-4 w-4" />
                        {t('لوحة التحكم', 'Dashboard')}
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center gap-2 text-red-600"
                    style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t('تسجيل الخروج', 'Logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-2 border-[#4691A9] text-[#4691A9] hover:bg-gradient-to-r hover:from-[#846F9C]/10 hover:to-[#4691A9]/10 transition-all"
                    style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#846F9C] to-[#4691A9] flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    {t('تسجيل الدخول', 'Login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] hover:opacity-90 transition-opacity text-white shadow-lg"
                    style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                  >
                    {t('إنشاء حساب', 'Sign Up')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden container pb-3 px-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5`} />
              <Input
                type="text"
                placeholder={t('ابحث...', 'Search...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${dir === 'rtl' ? 'pr-10' : 'pl-10'}`}
                style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
              />
            </div>
          </form>
        </div>
      </header>

      {/* Scroll to Top/Bottom Buttons */}
      <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 flex flex-col gap-2`}>
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className="rounded-full shadow-lg bg-gradient-to-r from-[#846F9C] to-[#4691A9] hover:opacity-90 transition-opacity"
            title={t('الذهاب لأعلى', 'Go to Top')}
          >
            <ChevronUp className="h-5 w-5 text-white" />
          </Button>
        )}
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="rounded-full shadow-lg bg-gradient-to-r from-[#4691A9] to-[#89A58F] hover:opacity-90 transition-opacity"
          title={t('الذهاب لأسفل', 'Go to Bottom')}
        >
          <ChevronDown className="h-5 w-5 text-white" />
        </Button>
      </div>
    </>
  );
}

