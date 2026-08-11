import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Bell, Check, AlertTriangle, Info, CircleCheck, CircleX } from 'lucide-react';

export default function Notifications() {
  const { t, language } = useLanguage();
  const utils = trpc.useUtils();

  const { data: notifications = [], isLoading } = trpc.notifications.list.useQuery({ limit: 100 });

  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
    },
  });

  const markAllReadMutation = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => {
      toast.success(t('تم تحديد جميع الإشعارات كمقروءة', 'All notifications marked as read'));
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t('فشلت العملية', 'Operation failed'));
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CircleCheck;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return CircleX;
      default:
        return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-osdm-purple';
      default:
        return 'text-osdm-blue';
    }
  };

  const formatTime = (d: string | Date) =>
    new Date(d).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });

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
          <Button
            variant="outline"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            <Check className="h-4 w-4 mr-2" />
            {t('تحديد الكل كمقروء', 'Mark All as Read')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    !notification.isRead ? 'border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markReadMutation.mutate({ id: notification.id });
                    }
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full bg-accent ${getIconColor(notification.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-semibold">{t(notification.titleAr, notification.titleEn)}</p>
                          {!notification.isRead && (
                            <Badge variant="default" className="bg-primary shrink-0">
                              {t('جديد', 'New')}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {t(notification.bodyAr || '', notification.bodyEn || '')}
                        </p>
                        <div className="flex items-center gap-2">
                          <Bell className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
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
