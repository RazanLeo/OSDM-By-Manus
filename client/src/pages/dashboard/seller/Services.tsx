import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus } from 'lucide-react';

export default function SellerServices() {
  const { t } = useLanguage();

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('خدماتي الرقمية', 'My Digital Services')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('إدارة خدماتك الرقمية المتخصصة', 'Manage your specialized digital services')}
            </p>
          </div>
          <Button className="bg-osdm-blue hover:bg-osdm-blue/90">
            <Plus className="h-4 w-4 mr-2" />
            {t('إضافة خدمة جديدة', 'Add New Service')}
          </Button>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {t('لم تقم بإضافة أي خدمات بعد', 'You haven\'t added any services yet')}
            </p>
            <Button className="mt-4 bg-osdm-blue hover:bg-osdm-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              {t('إضافة أول خدمة', 'Add First Service')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}

