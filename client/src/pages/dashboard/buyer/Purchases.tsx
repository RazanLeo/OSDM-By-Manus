import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { ShoppingCart, Star, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function BuyerPurchases() {
  const { t } = useLanguage();

  const { data: purchases = [], isLoading } = trpc.productsExt.buyer.myPurchases.useQuery();

  const downloadMutation = trpc.productsExt.buyer.download.useMutation({
    onSuccess: (data) => {
      window.open(data.fileUrl, '_blank');
      toast.success(t('بدأ التحميل', 'Download started'));
    },
    onError: (e) => {
      toast.error(e.message || t('فشل التحميل', 'Download failed'));
    },
  });

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('مشترياتي', 'My Purchases')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('عرض وإدارة المنتجات الرقمية التي قمت بشرائها', 'View and manage your purchased digital products')}
            </p>
          </div>
          <Button className="gradient-bg text-white" onClick={() => window.location.href = '/add-review'}>
            <Star className="h-4 w-4 mr-2" />
            {t('إضافة تقييم', 'Add Review')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : purchases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t('لم تقم بشراء أي منتجات بعد', 'You haven\'t purchased any products yet')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {purchases.map((purchase) => (
              <Card key={purchase.purchaseId} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={purchase.coverImage || '/placeholder.png'}
                      alt={t(purchase.titleAr, purchase.titleEn)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          {t(purchase.titleAr, purchase.titleEn)}
                        </h3>
                        {purchase.licenseKey && (
                          <p className="text-sm text-muted-foreground">
                            {t('مفتاح الترخيص:', 'License key:')}{' '}
                            <span className="font-medium">{purchase.licenseKey}</span>
                          </p>
                        )}
                      </div>
                      <Badge className={`${purchase.status === 'completed' ? 'bg-[#89A58F]' : 'bg-[#4691A9]'} text-white`}>
                        {purchase.status === 'completed'
                          ? t('مكتمل', 'Completed')
                          : t('قيد المعالجة', 'Processing')}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{t('السعر:', 'Price:')}</span>
                        <span>{purchase.price} {purchase.currency}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{purchase.downloadCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>
                          {purchase.purchasedAt
                            ? new Date(purchase.purchasedAt).toLocaleDateString('ar-SA')
                            : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="bg-osdm-purple hover:bg-osdm-purple/90"
                        onClick={() => downloadMutation.mutate({ purchaseId: purchase.purchaseId })}
                        disabled={purchase.status !== 'completed' || downloadMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {t('تحميل', 'Download')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </OSDMDashboardLayout>
  );
}
