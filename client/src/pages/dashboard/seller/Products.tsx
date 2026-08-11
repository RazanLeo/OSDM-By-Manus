import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const emptyForm = {
  categoryId: '',
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  price: '',
  coverImage: '',
  fileUrl: '',
};

export default function SellerProducts() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  const { data: allProducts = [], isLoading } = trpc.productsExt.seller.myProducts.useQuery();
  const { data: salesStats } = trpc.productsExt.seller.salesStats.useQuery();
  const { data: categories = [] } = trpc.productCategories.list.useQuery();
  const products = allProducts.filter(p => p.isActive);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const invalidate = () => {
    utils.productsExt.seller.myProducts.invalidate();
    utils.productsExt.seller.salesStats.invalidate();
  };

  const deleteMutation = trpc.productsExt.seller.deleteProduct.useMutation({
    onSuccess: () => {
      toast.success(t('تم حذف المنتج بنجاح', 'Product deleted successfully'));
      invalidate();
    },
    onError: () => {
      toast.error(t('فشل حذف المنتج', 'Failed to delete product'));
    },
  });

  const createMutation = trpc.productsExt.seller.createProduct.useMutation({
    onSuccess: () => {
      toast.success(t('تمت إضافة المنتج بنجاح', 'Product added successfully'));
      setDialogOpen(false);
      invalidate();
    },
    onError: (e) => {
      toast.error(e.message || t('فشل إضافة المنتج', 'Failed to add product'));
    },
  });

  const updateMutation = trpc.productsExt.seller.updateProduct.useMutation({
    onSuccess: () => {
      toast.success(t('تم تحديث المنتج بنجاح', 'Product updated successfully'));
      setDialogOpen(false);
      invalidate();
    },
    onError: (e) => {
      toast.error(e.message || t('فشل تحديث المنتج', 'Failed to update product'));
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product: (typeof products)[number]) => {
    setEditingId(product.id);
    setForm({
      categoryId: String(product.categoryId),
      titleAr: product.titleAr,
      titleEn: product.titleEn,
      descriptionAr: product.descriptionAr,
      descriptionEn: product.descriptionEn,
      price: String(product.price),
      coverImage: product.coverImage,
      fileUrl: product.fileUrl,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const price = parseInt(form.price);
    const categoryId = parseInt(form.categoryId);
    if (
      !categoryId ||
      !form.titleAr.trim() ||
      !form.titleEn.trim() ||
      !form.descriptionAr.trim() ||
      !form.descriptionEn.trim() ||
      !price ||
      price <= 0 ||
      !form.coverImage.trim() ||
      !form.fileUrl.trim()
    ) {
      toast.error(t('يرجى تعبئة جميع الحقول المطلوبة', 'Please fill in all required fields'));
      return;
    }
    const payload = {
      categoryId,
      titleAr: form.titleAr.trim(),
      titleEn: form.titleEn.trim(),
      descriptionAr: form.descriptionAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      price,
      coverImage: form.coverImage.trim(),
      fileUrl: form.fileUrl.trim(),
    };
    if (editingId) {
      updateMutation.mutate({ productId: editingId, ...payload });
    } else {
      createMutation.mutate({ ...payload, status: 'active' });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm(t('هل أنت متأكد من حذف هذا المنتج؟', 'Are you sure you want to delete this product?'))) {
      deleteMutation.mutate({ productId: id });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { labelAr: string; labelEn: string; className: string }> = {
      draft: { labelAr: 'مسودة', labelEn: 'Draft', className: 'bg-[#846F9C]' },
      pending: { labelAr: 'قيد المراجعة', labelEn: 'Pending', className: 'bg-[#4691A9]' },
      active: { labelAr: 'نشط', labelEn: 'Active', className: 'bg-[#89A58F]' },
      rejected: { labelAr: 'مرفوض', labelEn: 'Rejected', className: 'bg-[#846F9C]/70' },
      suspended: { labelAr: 'معلق', labelEn: 'Suspended', className: 'bg-[#4691A9]/70' },
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
          <Button className="bg-osdm-purple hover:bg-osdm-purple/90" onClick={openCreate}>
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
                {salesStats?.totals.salesCount ?? 0}
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
              <Button className="mt-4 bg-osdm-purple hover:bg-osdm-purple/90" onClick={openCreate}>
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
                      <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
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

        {/* Create / Edit Product Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? t('تعديل المنتج', 'Edit Product')
                  : t('إضافة منتج جديد', 'Add New Product')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('التصنيف', 'Category')}</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('اختر التصنيف', 'Select category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.icon} {t(cat.nameAr, cat.nameEn)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('العنوان بالعربية', 'Title (Arabic)')}</Label>
                <Input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('العنوان بالإنجليزية', 'Title (English)')}</Label>
                <Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('الوصف بالعربية', 'Description (Arabic)')}</Label>
                <Textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('الوصف بالإنجليزية', 'Description (English)')}</Label>
                <Textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('السعر (ر.س)', 'Price (SAR)')}</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('رابط صورة الغلاف', 'Cover Image URL')}</Label>
                <Input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('رابط ملف المنتج', 'Product File URL')}</Label>
                <Input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button
                className="bg-osdm-purple hover:bg-osdm-purple/90"
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? t('حفظ التعديلات', 'Save Changes') : t('إضافة المنتج', 'Add Product')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OSDMDashboardLayout>
  );
}
