import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BuyerOrders() {
  const { t } = useLanguage();

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('الخدمات المستلمة', 'Received Services')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('الخدمات الرقمية التي تم تسليمها لك', 'Digital services delivered to you')}
            </p>
          </div>
          <Button className="gradient-bg text-white" onClick={() => window.location.href = '/add-review'}>
            <Star className="h-4 w-4 mr-2" />
            {t('إضافة تقييم', 'Add Review')}
          </Button>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('لا توجد خدمات مستلمة حتى الآن', 'No received services yet')}
            </p>
          </CardContent>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}

