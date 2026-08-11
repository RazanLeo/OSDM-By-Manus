import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Users, Package, Briefcase, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { t, direction } = useLanguage();
  const [, navigate] = useLocation();
  const statsQuery = trpc.admin.stats.useQuery(undefined, { retry: false });
  const loading = statsQuery.isLoading;
  const stats = statsQuery.data ?? {
    totalUsers: 0,
    totalProducts: 0,
    totalServices: 0,
    totalJobs: 0,
    totalOrders: 0,
    totalRevenue: 0
  };

  const statCards = [
    {
      titleAr: 'إجمالي المستخدمين',
      titleEn: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/users'
    },
    {
      titleAr: 'إجمالي المنتجات',
      titleEn: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-green-500 to-green-600',
      link: '/admin/products'
    },
    {
      titleAr: 'إجمالي الخدمات',
      titleEn: 'Total Services',
      value: stats.totalServices,
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/services'
    },
    {
      titleAr: 'فرص العمل',
      titleEn: 'Job Opportunities',
      value: stats.totalJobs,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/jobs'
    },
    {
      titleAr: 'إجمالي الطلبات',
      titleEn: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-pink-500 to-pink-600',
      link: '/admin/orders'
    },
    {
      titleAr: 'إجمالي الإيرادات',
      titleEn: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-teal-500 to-teal-600',
      link: '/admin/revenue'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir={direction}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: direction === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
          >
            {t('لوحة تحكم الإدارة', 'Admin Dashboard')}
          </h1>
          <p 
            className="text-gray-600"
            style={{ fontFamily: direction === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
          >
            {t('مرحباً بك في لوحة التحكم', 'Welcome to the admin dashboard')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(card.link)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p 
                      className="text-gray-600 text-sm mb-2"
                      style={{ fontFamily: direction === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                    >
                      {t(card.titleAr, card.titleEn)}
                    </p>
                    <p 
                      className="text-3xl font-bold text-gray-900"
                      style={{ fontFamily: direction === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                    >
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-4 rounded-full bg-gradient-to-br ${card.color}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 
            className="text-xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: direction === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
          >
            {t('إجراءات سريعة', 'Quick Actions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              style={{ fontFamily: direction === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('إدارة المستخدمين', 'Manage Users')}
            </button>
            <button
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              style={{ fontFamily: direction === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('إدارة المنتجات', 'Manage Products')}
            </button>
            <button
              onClick={() => navigate('/admin/services')}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              style={{ fontFamily: direction === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('إدارة الخدمات', 'Manage Services')}
            </button>
            <button
              onClick={() => navigate('/admin/jobs')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              style={{ fontFamily: direction === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('إدارة فرص العمل', 'Manage Jobs')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

