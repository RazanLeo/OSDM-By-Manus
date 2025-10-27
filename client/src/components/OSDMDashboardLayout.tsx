import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { useUserMode } from '@/contexts/UserModeContext';
import { trpc } from '@/lib/trpc';
import {
  LayoutDashboard,
  ShoppingBag,
  Wrench,
  Briefcase,
  ShoppingCart,
  FileText,
  FileSignature,
  User,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  Menu,
  X,
  Wallet,
} from 'lucide-react';
import { PLATFORM_INFO } from '@shared/constants';

interface OSDMDashboardLayoutProps {
  children: ReactNode;
}

export default function OSDMDashboardLayout({ children }: OSDMDashboardLayoutProps) {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { userMode, toggleMode } = useUserMode();
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = '/';
  };

  // Navigation items based on user mode
  const sellerNavItems = [
    { icon: LayoutDashboard, labelAr: 'النظرة العامة', labelEn: 'Overview', href: '/dashboard' },
    { icon: ShoppingBag, labelAr: 'المنتجات الرقمية الجاهزة', labelEn: 'Ready Products', href: '/dashboard/seller/products' },
    { icon: Wrench, labelAr: 'الخدمات الرقمية المتخصصة', labelEn: 'Custom Services', href: '/dashboard/seller/services' },
    { icon: Briefcase, labelAr: 'العقود والمشاريع', labelEn: 'Contracts & Projects', href: '/dashboard/seller/contracts' },
    { icon: Wallet, labelAr: 'المحفظة والأرباح', labelEn: 'Wallet & Earnings', href: '/dashboard/seller/wallet' },
  ];

  const buyerNavItems = [
    { icon: LayoutDashboard, labelAr: 'النظرة العامة', labelEn: 'Overview', href: '/dashboard' },
    { icon: ShoppingCart, labelAr: 'مشتريات المنتجات', labelEn: 'Product Purchases', href: '/dashboard/buyer/purchases' },
    { icon: FileText, labelAr: 'طلبات الخدمات', labelEn: 'Service Orders', href: '/dashboard/buyer/orders' },
    { icon: Briefcase, labelAr: 'المشاريع المستلمة', labelEn: 'Received Projects', href: '/dashboard/buyer/projects' },
    { icon: Wallet, labelAr: 'المحفظة والمدفوعات', labelEn: 'Wallet & Payments', href: '/dashboard/buyer/wallet' },
  ];

  const navItems = userMode === 'seller' ? sellerNavItems : buyerNavItems;

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="OSDM" className="h-8 w-8" />
            <span className="font-bold gradient-text hidden sm:inline-block">
              {PLATFORM_INFO.name}
            </span>
          </Link>

          <div className="flex-1" />

          {/* Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMode}
            className="hidden md:flex items-center gap-2 gradient-bg text-white hover:opacity-90"
          >
            <span className="text-sm font-medium">
              {userMode === 'seller' 
                ? t('وضع البائع', 'Seller Mode')
                : t('وضع المشتري', 'Buyer Mode')
              }
            </span>
            <span className="text-xs">⇄</span>
          </Button>

          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
          >
            <span className="text-lg">{language === 'ar' ? '🇸🇦' : '🇺🇸'}</span>
            <span className="text-xs font-medium hidden sm:inline">
              {language === 'ar' ? 'EN' : 'AR'}
            </span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline text-sm">{user?.name || t('المستخدم', 'User')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-16 ${language === 'ar' ? 'right-0' : 'left-0'} z-40 h-[calc(100vh-4rem)] w-64 border-${language === 'ar' ? 'l' : 'r'} bg-background
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}
          `}
        >
          <div className="flex flex-col h-full p-4">
            {/* Mode Toggle Mobile */}
            <Button
              variant="outline"
              onClick={toggleMode}
              className="md:hidden mb-4 w-full gradient-bg text-white hover:opacity-90"
            >
              {userMode === 'seller' 
                ? t('تبديل إلى وضع المشتري', 'Switch to Buyer')
                : t('تبديل إلى وضع البائع', 'Switch to Seller')
              }
            </Button>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={`w-full justify-start gap-3 ${isActive ? 'gradient-bg text-white' : ''}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{t(item.labelAr, item.labelEn)}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-4 border-t">
              <Link href="/dashboard/settings">
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Settings className="h-5 w-5" />
                  <span>{t('الإعدادات', 'Settings')}</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>{t('تسجيل الخروج', 'Logout')}</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

