
import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { useUserMode } from '@/contexts/UserModeContext';
import { ShoppingBag, Wrench, Briefcase, DollarSign, ShoppingCart, Star } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { userMode } = useUserMode();

  const sellerStats = [
    {
      icon: ShoppingBag,
      titleAr: 'المنتجات المباعة',
      titleEn: 'Products Sold',
      value: '0',
      change: '+0%',
      bgColor: 'bg-gradient-to-r from-[#846F9C] to-[#846F9C]/80',
    },
    {
      icon: Wrench,
      titleAr: 'الخدمات المنفذة',
      titleEn: 'Services Delivered',
      value: '0',
      change: '+0%',
      bgColor: 'bg-gradient-to-r from-[#4691A9] to-[#4691A9]/80',
    },
    {
      icon: Briefcase,
      titleAr: 'المشاريع المكتملة',
      titleEn: 'Projects Completed',
      value: '0',
      change: '+0%',
      bgColor: 'bg-gradient-to-r from-[#89A58F] to-[#89A58F]/80',
    },
    {
      icon: DollarSign,
      titleAr: 'إجمالي الأرباح',
      titleEn: 'Total Earnings',
      value: '0 SAR',
      change: '+0%',
      bgColor: 'bg-gradient-to-r from-[#846F9C] to-[#4691A9]',
    },
  ];

  const buyerStats = [
    {
      icon: ShoppingCart,
      titleAr: 'المنتجات المشتراة',
      titleEn: 'Products Purchased',
      value: '0',
      change: '+0%',
      bgColor: 'bg-gradient-to-r from-[#846F9C] to-[#846F9C]/80',
    },
    {
      icon: Wrench,
      titleAr: 'الخدمات المستلمة',
      titleEn: 'Services Received',
      value: '0',
      change: '+0%',
      bgColor: 'bg-gradient-to-r from-[#4691A9] to-[#4691A9]/80',
    },
    {
      icon: Briefcase,
      titleAr: 'المشاريع المستلمة',
      titleEn: 'Projects Received',
      value: '0',
      change: '+0%',
      bgColor: 'bg-gradient-to-r from-[#89A58F] to-[#89A58F]/80',
    },
    {
      icon: DollarSign,
      titleAr: 'إجمالي المصروفات',
      titleEn: 'Total Expenses',
      value: '0 SAR',
      change: '+0%',
      bgColor: 'bg-gradient-to-r from-[#846F9C] to-[#4691A9]',
    },
  ];

  const stats = userMode === 'seller' ? sellerStats : buyerStats;

  const sellerActions = [
    {
      icon: ShoppingBag,
      titleAr: 'إضافة منتج رقمي',
      titleEn: 'Add Digital Product',
      descriptionAr: 'ابدأ ببيع منتجاتك الرقمية الجاهزة',
      descriptionEn: 'Start selling your ready-made digital products',
      bgColor: 'bg-gradient-to-r from-[#846F9C] to-[#846F9C]/80',
      href: '/dashboard/seller/products',
    },
    {
      icon: Wrench,
      titleAr: 'إضافة خدمة رقمية',
      titleEn: 'Add Digital Service',
      descriptionAr: 'قدم خدماتك الرقمية المتخصصة',
      descriptionEn: 'Offer your specialized digital services',
      bgColor: 'bg-gradient-to-r from-[#4691A9] to-[#4691A9]/80',
      href: '/dashboard/seller/services',
    },
    {
      icon: Briefcase,
      titleAr: 'إضافة مشروع',
      titleEn: 'Add Project',
      descriptionAr: 'أضف مشروعاً جديداً لإدارة عقودك',
      descriptionEn: 'Add a new project to manage your contracts',
      bgColor: 'bg-gradient-to-r from-[#89A58F] to-[#89A58F]/80',
      href: '/dashboard/seller/contracts',
    },
  ];

  const buyerActions = [
    {
      icon: ShoppingBag,
      titleAr: 'تصفح المنتجات',
      titleEn: 'Browse Products',
      descriptionAr: 'اكتشف المنتجات الرقمية الجاهزة',
      descriptionEn: 'Discover ready-made digital products',
      bgColor: 'bg-gradient-to-r from-[#846F9C] to-[#846F9C]/80',
      href: '/markets/products',
    },
    {
      icon: Wrench,
      titleAr: 'طلب خدمة',
      titleEn: 'Request Service',
      descriptionAr: 'اطلب خدمة رقمية متخصصة',
      descriptionEn: 'Request a specialized digital service',
      bgColor: 'bg-gradient-to-r from-[#4691A9] to-[#4691A9]/80',
      href: '/markets/services',
    },
    {
      icon: Star,
      titleAr: 'إضافة تقييم',
      titleEn: 'Add Review',
      descriptionAr: 'قيّم تجربتك مع البائعين',
      descriptionEn: 'Rate your experience with sellers',
      bgColor: 'bg-gradient-to-r from-[#89A58F] to-[#89A58F]/80',
      href: '/dashboard/buyer/purchases',
    },
  ];

  const actions = userMode === 'seller' ? sellerActions : buyerActions;

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t('مرحباً', 'Welcome')}, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('هذه نظرة عامة على نشاطك في منصة OSDM', 'Here\'s an overview of your activity on OSDM platform')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t(stat.titleAr, stat.titleEn)}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-full`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change} {t('من الشهر الماضي', 'from last month')}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = action.href}>
                <CardHeader>
                  <div className={`w-12 h-12 ${action.bgColor} rounded-full flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{t(action.titleAr, action.titleEn)}</CardTitle>
                  <CardDescription>
                    {t(action.descriptionAr, action.descriptionEn)}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('النشاط الأخير', 'Recent Activity')}</CardTitle>
            <CardDescription>
              {t('آخر التحديثات والأنشطة في حسابك', 'Latest updates and activities in your account')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              {t('لا توجد أنشطة حديثة', 'No recent activities')}
            </div>
          </CardContent>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}

