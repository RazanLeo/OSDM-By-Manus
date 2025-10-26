import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText } from 'lucide-react';

export default function BuyerOrders() {
  const { t } = useLanguage();

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t('طلبات الخدمات', 'Service Orders')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('متابعة طلبات الخدمات الرقمية المتخصصة', 'Track your custom digital service orders')}
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('لا توجد طلبات خدمات حالياً', 'No service orders at the moment')}
            </p>
          </CardContent>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}

