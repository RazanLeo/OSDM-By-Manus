import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { ShoppingBag, Wrench, Briefcase, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const stats = [
    {
      icon: ShoppingBag,
      titleAr: 'المنتجات المباعة',
      titleEn: 'Products Sold',
      value: '0',
      change: '+0%',
      color: 'osdm-purple',
    },
    {
      icon: Wrench,
      titleAr: 'الخدمات المنفذة',
      titleEn: 'Services Delivered',
      value: '0',
      change: '+0%',
      color: 'osdm-blue',
    },
    {
      icon: Briefcase,
      titleAr: 'المشاريع المكتملة',
      titleEn: 'Projects Completed',
      value: '0',
      change: '+0%',
      color: 'osdm-green',
    },
    {
      icon: DollarSign,
      titleAr: 'إجمالي الأرباح',
      titleEn: 'Total Earnings',
      value: '0 SAR',
      change: '+0%',
      color: 'osdm-purple',
    },
  ];

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
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t(stat.titleAr, stat.titleEn)}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
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
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-osdm-purple rounded-full flex items-center justify-center mb-3">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <CardTitle>{t('إضافة منتج رقمي', 'Add Digital Product')}</CardTitle>
              <CardDescription>
                {t('ابدأ ببيع منتجاتك الرقمية الجاهزة', 'Start selling your ready-made digital products')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-osdm-blue rounded-full flex items-center justify-center mb-3">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <CardTitle>{t('إضافة خدمة رقمية', 'Add Digital Service')}</CardTitle>
              <CardDescription>
                {t('قدم خدماتك الرقمية المتخصصة', 'Offer your specialized digital services')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 bg-osdm-green rounded-full flex items-center justify-center mb-3">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <CardTitle>{t('تصفح المشاريع', 'Browse Projects')}</CardTitle>
              <CardDescription>
                {t('ابحث عن فرص عمل حر مناسبة', 'Find suitable freelance opportunities')}
              </CardDescription>
            </CardHeader>
          </Card>
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

