import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bell, Check, ShoppingCart, MessageCircle, DollarSign, Star } from 'lucide-react';

export default function Notifications() {
  const { t } = useLanguage();

  // Mock data - replace with real data from API
  const notifications = [
    {
      id: 1,
      type: 'purchase',
      icon: ShoppingCart,
      title: t('عملية شراء جديدة', 'New Purchase'),
      message: t('تم شراء منتجك "قالب موقع إلكتروني"', 'Your product "Website Template" was purchased'),
      time: '5 دقائق',
      unread: true,
    },
    {
      id: 2,
      type: 'message',
      icon: MessageCircle,
      title: t('رسالة جديدة', 'New Message'),
      message: t('أحمد محمد أرسل لك رسالة', 'Ahmed Mohammed sent you a message'),
      time: '30 دقيقة',
      unread: true,
    },
    {
      id: 3,
      type: 'payment',
      icon: DollarSign,
      title: t('تم تحويل الأرباح', 'Earnings Transferred'),
      message: t('تم تحويل 500 ريال إلى محفظتك', '500 SAR transferred to your wallet'),
      time: 'ساعة واحدة',
      unread: false,
    },
    {
      id: 4,
      type: 'review',
      icon: Star,
      title: t('تقييم جديد', 'New Review'),
      message: t('حصلت على تقييم 5 نجوم من فاطمة علي', 'You received a 5-star review from Fatima Ali'),
      time: '3 ساعات',
      unread: false,
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'text-osdm-purple';
      case 'message':
        return 'text-osdm-blue';
      case 'payment':
        return 'text-green-500';
      case 'review':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('الإشعارات', 'Notifications')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('تابع آخر التحديثات والأنشطة', 'Follow latest updates and activities')}
            </p>
          </div>
          <Button variant="outline">
            <Check className="h-4 w-4 mr-2" />
            {t('تحديد الكل كمقروء', 'Mark All as Read')}
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <Card
                key={notification.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  notification.unread ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-accent ${getIconColor(notification.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold">{notification.title}</p>
                        {notification.unread && (
                          <Badge variant="default" className="bg-primary shrink-0">
                            {t('جديد', 'New')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <Bell className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {t('منذ', 'Since')} {notification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {t('لا توجد إشعارات جديدة', 'No new notifications')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </OSDMDashboardLayout>
  );
}

