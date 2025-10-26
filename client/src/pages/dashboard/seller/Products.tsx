import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SellerProducts() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  
  const { data: products = [], isLoading } = trpc.products.myProducts.useQuery();
  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success(t('تم حذف المنتج بنجاح', 'Product deleted successfully'));
      utils.products.myProducts.invalidate();
    },
    onError: () => {
      toast.error(t('فشل حذف المنتج', 'Failed to delete product'));
    },
  });

  const handleDelete = (id: number) => {
    if (confirm(t('هل أنت متأكد من حذف هذا المنتج؟', 'Are you sure you want to delete this product?'))) {
      deleteMutation.mutate({ id });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { labelAr: string; labelEn: string; className: string }> = {
      draft: { labelAr: 'مسودة', labelEn: 'Draft', className: 'bg-gray-500' },
      pending: { labelAr: 'قيد المراجعة', labelEn: 'Pending', className: 'bg-yellow-500' },
      active: { labelAr: 'نشط', labelEn: 'Active', className: 'bg-green-500' },
      rejected: { labelAr: 'مرفوض', labelEn: 'Rejected', className: 'bg-red-500' },
      suspended: { labelAr: 'معلق', labelEn: 'Suspended', className: 'bg-orange-500' },
    };
    
    const statusInfo = statusMap[status] || statusMap.draft;
    return (
      <Badge className={`${statusInfo.className} text-white`}>
        {t(statusInfo.labelAr, statusInfo.labelEn)}
      </Badge>
    );
  };

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('منتجاتي الرقمية', 'My Digital Products')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('إدارة منتجاتك الرقمية الجاهزة للبيع', 'Manage your ready-made digital products for sale')}
            </p>
          </div>
          <Button className="bg-osdm-purple hover:bg-osdm-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            {t('إضافة منتج جديد', 'Add New Product')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('إجمالي المنتجات', 'Total Products')}</CardDescription>
              <CardTitle className="text-2xl">{products.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('المنتجات النشطة', 'Active Products')}</CardDescription>
              <CardTitle className="text-2xl">
                {products.filter(p => p.status === 'active').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('إجمالي المبيعات', 'Total Sales')}</CardDescription>
              <CardTitle className="text-2xl">
                {products.reduce((sum, p) => sum + (p.downloads || 0), 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('إجمالي المشاهدات', 'Total Views')}</CardDescription>
              <CardTitle className="text-2xl">
                {products.reduce((sum, p) => sum + (p.views || 0), 0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Products List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {t('لم تقم بإضافة أي منتجات بعد', 'You haven\'t added any products yet')}
              </p>
              <Button className="mt-4 bg-osdm-purple hover:bg-osdm-purple/90">
                <Plus className="h-4 w-4 mr-2" />
                {t('إضافة أول منتج', 'Add First Product')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  {/* Product Image */}
                  <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={product.coverImage || '/placeholder.png'}
                      alt={t(product.titleAr, product.titleEn)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          {t(product.titleAr, product.titleEn)}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {t(product.descriptionAr, product.descriptionEn)}
                        </p>
                      </div>
                      {getStatusBadge(product.status)}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{t('السعر:', 'Price:')}</span>
                        <span>{product.price} {product.currency}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{product.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{product.downloads || 0}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        {t('تعديل', 'Edit')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t('حذف', 'Delete')}
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

