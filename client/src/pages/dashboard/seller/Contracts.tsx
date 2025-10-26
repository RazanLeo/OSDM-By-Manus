import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase } from 'lucide-react';

export default function SellerContracts() {
  const { t } = useLanguage();

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t('عقودي ومشاريعي', 'My Contracts & Projects')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('إدارة عقودك والمشاريع التي تعمل عليها', 'Manage your contracts and ongoing projects')}
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('لا توجد عقود أو مشاريع حالياً', 'No contracts or projects at the moment')}
            </p>
          </CardContent>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}

