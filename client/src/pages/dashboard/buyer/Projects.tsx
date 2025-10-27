import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase, Star } from 'lucide-react';

export default function BuyerProjects() {
  const { t } = useLanguage();

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('المشاريع المستلمة', 'Received Projects')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('المشاريع التي تم تسليمها لك من المستقلين', 'Projects delivered to you by freelancers')}
            </p>
          </div>
          <Button className="gradient-bg text-white" onClick={() => window.location.href = '/add-review'}>
            <Star className="h-4 w-4 mr-2" />
            {t('إضافة تقييم', 'Add Review')}
          </Button>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('لا توجد مشاريع مستلمة حتى الآن', 'No received projects yet')}
            </p>
            <Button className="mt-4 gradient-bg text-white" onClick={() => window.location.href = '/markets/jobs'}>
              {t('تصفح المشاريع', 'Browse Projects')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}

