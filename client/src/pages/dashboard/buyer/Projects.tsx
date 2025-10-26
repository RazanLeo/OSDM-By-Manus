import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase, Plus } from 'lucide-react';

export default function BuyerProjects() {
  const { t } = useLanguage();

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('مشاريعي المنشورة', 'My Posted Projects')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('إدارة المشاريع التي قمت بنشرها ومتابعة العروض', 'Manage your posted projects and track bids')}
            </p>
          </div>
          <Button className="bg-osdm-green hover:bg-osdm-green/90">
            <Plus className="h-4 w-4 mr-2" />
            {t('نشر مشروع جديد', 'Post New Project')}
          </Button>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('لم تقم بنشر أي مشاريع بعد', 'You haven\'t posted any projects yet')}
            </p>
            <Button className="mt-4 bg-osdm-green hover:bg-osdm-green/90">
              <Plus className="h-4 w-4 mr-2" />
              {t('نشر أول مشروع', 'Post First Project')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}

