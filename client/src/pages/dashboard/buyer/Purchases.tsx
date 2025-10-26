import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart } from 'lucide-react';

export default function BuyerPurchases() {
  const { t } = useLanguage();

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t('مشترياتي', 'My Purchases')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('عرض وإدارة المنتجات الرقمية التي قمت بشرائها', 'View and manage your purchased digital products')}
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('لم تقم بشراء أي منتجات بعد', 'You haven\'t purchased any products yet')}
            </p>
          </CardContent>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}

