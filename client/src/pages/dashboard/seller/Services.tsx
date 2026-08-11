import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Plus, Edit, Trash2, Eye, Package, Check, X, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TierKey = 'basic' | 'standard' | 'premium';

interface TierForm {
  enabled: boolean;
  nameAr: string;
  nameEn: string;
  price: string;
  deliveryDays: string;
  revisions: string;
  features: string;
}

interface ServiceForm {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: string;
  startingPrice: string;
  deliveryTime: string;
  coverImage: string;
}

const emptyServiceForm: ServiceForm = {
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  categoryId: '',
  startingPrice: '',
  deliveryTime: '',
  coverImage: '',
};

const emptyTier = (): TierForm => ({
  enabled: false,
  nameAr: '',
  nameEn: '',
  price: '',
  deliveryDays: '',
  revisions: '1',
  features: '',
});

const emptyTiers = (): Record<TierKey, TierForm> => ({
  basic: emptyTier(),
  standard: emptyTier(),
  premium: emptyTier(),
});

export default function SellerServices() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  const { data: services = [], isLoading } = trpc.servicesExt.myServices.useQuery();
  const { data: categories = [] } = trpc.serviceCategories.list.useQuery();
  const { data: sellerOrders = [], isLoading: ordersLoading } = trpc.serviceOrders.myOrders.useQuery({
    type: 'seller',
  });

  // ---------- Service create/edit dialog ----------
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyServiceForm);

  // ---------- Packages editor dialog ----------
  const [pkgServiceId, setPkgServiceId] = useState<number | null>(null);
  const [tiers, setTiers] = useState<Record<TierKey, TierForm>>(emptyTiers());
  const packagesQuery = trpc.servicesExt.packages.useQuery(
    { serviceId: pkgServiceId ?? 0 },
    { enabled: pkgServiceId !== null },
  );
  useEffect(() => {
    if (pkgServiceId !== null && packagesQuery.data) {
      const next = emptyTiers();
      for (const p of packagesQuery.data) {
        const tier = p.meta.tier as TierKey;
        next[tier] = {
          enabled: true,
          nameAr: p.nameAr,
          nameEn: p.nameEn,
          price: String(p.price),
          deliveryDays: String(p.deliveryTime),
          revisions: String(p.meta.revisions),
          features: p.meta.features.join('\n'),
        };
      }
      setTiers(next);
    }
  }, [pkgServiceId, packagesQuery.data]);

  // ---------- Deliver dialog ----------
  const [deliverOrderId, setDeliverOrderId] = useState<number | null>(null);
  const [deliverMessage, setDeliverMessage] = useState('');
  const [deliverFiles, setDeliverFiles] = useState('');

  // ---------- Mutations ----------
  const invalidateServices = () => utils.servicesExt.myServices.invalidate();
  const invalidateOrders = () => utils.serviceOrders.myOrders.invalidate({ type: 'seller' });

  const createMutation = trpc.servicesExt.createService.useMutation({
    onSuccess: () => {
      toast.success(t('تمت إضافة الخدمة بنجاح', 'Service added successfully'));
      setServiceDialogOpen(false);
      invalidateServices();
    },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.servicesExt.updateService.useMutation({
    onSuccess: () => {
      toast.success(t('تم تحديث الخدمة بنجاح', 'Service updated successfully'));
      setServiceDialogOpen(false);
      invalidateServices();
    },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.servicesExt.deleteService.useMutation({
    onSuccess: () => {
      toast.success(t('تم حذف الخدمة بنجاح', 'Service deleted successfully'));
      invalidateServices();
    },
    onError: (e) => toast.error(e.message),
  });
  const setPackagesMutation = trpc.servicesExt.setPackages.useMutation({
    onSuccess: () => {
      toast.success(t('تم حفظ الباقات بنجاح', 'Packages saved successfully'));
      setPkgServiceId(null);
      if (pkgServiceId !== null) {
        utils.servicesExt.packages.invalidate({ serviceId: pkgServiceId });
      }
    },
    onError: (e) => toast.error(e.message),
  });
  const acceptOrderMutation = trpc.servicesExt.acceptOrder.useMutation({
    onSuccess: () => {
      toast.success(t('تم قبول الطلب وبدء التنفيذ', 'Order accepted, work started'));
      invalidateOrders();
    },
    onError: (e) => toast.error(e.message),
  });
  const rejectOrderMutation = trpc.servicesExt.rejectOrder.useMutation({
    onSuccess: () => {
      toast.success(
        t('تم رفض الطلب واسترداد المبلغ كاملاً للمشتري', 'Order rejected, buyer fully refunded'),
      );
      invalidateOrders();
    },
    onError: (e) => toast.error(e.message),
  });
  const deliverOrderMutation = trpc.servicesExt.deliverOrder.useMutation({
    onSuccess: () => {
      toast.success(t('تم تسليم الطلب وبانتظار قبول المشتري', 'Order delivered, awaiting buyer acceptance'));
      setDeliverOrderId(null);
      setDeliverMessage('');
      setDeliverFiles('');
      invalidateOrders();
    },
    onError: (e) => toast.error(e.message),
  });

  // ---------- Handlers ----------
  const openCreateDialog = () => {
    setEditingServiceId(null);
    setForm(emptyServiceForm);
    setServiceDialogOpen(true);
  };

  const openEditDialog = (service: (typeof services)[number]) => {
    setEditingServiceId(service.id);
    setForm({
      titleAr: service.titleAr,
      titleEn: service.titleEn,
      descriptionAr: service.descriptionAr,
      descriptionEn: service.descriptionEn,
      categoryId: String(service.categoryId),
      startingPrice: String(service.startingPrice),
      deliveryTime: String(service.deliveryTime),
      coverImage: service.coverImage,
    });
    setServiceDialogOpen(true);
  };

  const handleSubmitService = () => {
    const startingPrice = parseInt(form.startingPrice, 10);
    const deliveryTime = parseInt(form.deliveryTime, 10);
    const categoryId = parseInt(form.categoryId, 10);
    if (
      !form.titleAr.trim() ||
      !form.titleEn.trim() ||
      !form.descriptionAr.trim() ||
      !form.descriptionEn.trim() ||
      !form.coverImage.trim() ||
      !Number.isInteger(categoryId) ||
      !Number.isInteger(startingPrice) ||
      startingPrice <= 0 ||
      !Number.isInteger(deliveryTime) ||
      deliveryTime <= 0
    ) {
      toast.error(t('يرجى تعبئة جميع الحقول المطلوبة بقيم صحيحة', 'Please fill all required fields with valid values'));
      return;
    }
    const body = {
      titleAr: form.titleAr.trim(),
      titleEn: form.titleEn.trim(),
      descriptionAr: form.descriptionAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      categoryId,
      startingPrice,
      deliveryTime,
      coverImage: form.coverImage.trim(),
    };
    if (editingServiceId === null) {
      createMutation.mutate(body);
    } else {
      updateMutation.mutate({ serviceId: editingServiceId, ...body });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm(t('هل أنت متأكد من حذف هذه الخدمة؟', 'Are you sure you want to delete this service?'))) {
      deleteMutation.mutate({ serviceId: id });
    }
  };

  const handleSavePackages = () => {
    if (pkgServiceId === null) return;
    const tierKeys: TierKey[] = ['basic', 'standard', 'premium'];
    const packages = [] as Array<{
      tier: TierKey;
      nameAr: string;
      nameEn: string;
      price: number;
      deliveryDays: number;
      revisions: number;
      features: string[];
    }>;
    for (const key of tierKeys) {
      const tier = tiers[key];
      if (!tier.enabled) continue;
      const price = parseInt(tier.price, 10);
      const deliveryDays = parseInt(tier.deliveryDays, 10);
      const revisions = parseInt(tier.revisions, 10);
      if (
        !tier.nameAr.trim() ||
        !tier.nameEn.trim() ||
        !Number.isInteger(price) ||
        price <= 0 ||
        !Number.isInteger(deliveryDays) ||
        deliveryDays <= 0 ||
        !Number.isInteger(revisions) ||
        revisions < 0
      ) {
        toast.error(
          t('يرجى تعبئة بيانات الباقات المفعّلة بقيم صحيحة', 'Please fill enabled packages with valid values'),
        );
        return;
      }
      packages.push({
        tier: key,
        nameAr: tier.nameAr.trim(),
        nameEn: tier.nameEn.trim(),
        price,
        deliveryDays,
        revisions,
        features: tier.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
      });
    }
    if (packages.length === 0) {
      toast.error(t('فعّل باقة واحدة على الأقل', 'Enable at least one package'));
      return;
    }
    setPackagesMutation.mutate({ serviceId: pkgServiceId, packages });
  };

  const handleReject = (orderId: number) => {
    const reason = prompt(t('سبب الرفض (اختياري)', 'Rejection reason (optional)'));
    if (reason === null) return;
    rejectOrderMutation.mutate({ orderId, reason: reason || undefined });
  };

  const handleDeliver = () => {
    if (deliverOrderId === null) return;
    deliverOrderMutation.mutate({
      orderId: deliverOrderId,
      message: deliverMessage.trim() || undefined,
      files: deliverFiles
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    });
  };

  // ---------- Badges ----------
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { labelAr: string; labelEn: string; className: string }> = {
      draft: { labelAr: 'مسودة', labelEn: 'Draft', className: 'bg-[#846F9C]' },
      pending: { labelAr: 'قيد المراجعة', labelEn: 'Pending', className: 'bg-[#4691A9]' },
      active: { labelAr: 'نشطة', labelEn: 'Active', className: 'bg-[#89A58F]' },
      rejected: { labelAr: 'مرفوضة', labelEn: 'Rejected', className: 'bg-[#846F9C]/70' },
      suspended: { labelAr: 'معلقة', labelEn: 'Suspended', className: 'bg-[#4691A9]/70' },
    };
    const statusInfo = statusMap[status] || statusMap.draft;
    return (
      <Badge className={`${statusInfo.className} text-white`}>
        {t(statusInfo.labelAr, statusInfo.labelEn)}
      </Badge>
    );
  };

  const getOrderStatusBadge = (status: string) => {
    const statusMap: Record<string, { labelAr: string; labelEn: string; className: string }> = {
      pending: { labelAr: 'بانتظار القبول', labelEn: 'Awaiting Acceptance', className: 'bg-[#4691A9]' },
      in_progress: { labelAr: 'قيد التنفيذ', labelEn: 'In Progress', className: 'bg-[#4691A9]' },
      revision: { labelAr: 'طلب تعديل', labelEn: 'Revision Requested', className: 'bg-[#846F9C]' },
      delivered: { labelAr: 'تم التسليم', labelEn: 'Delivered', className: 'bg-[#89A58F]' },
      completed: { labelAr: 'مكتمل', labelEn: 'Completed', className: 'bg-[#89A58F]' },
      cancelled: { labelAr: 'ملغي', labelEn: 'Cancelled', className: 'bg-[#846F9C]/70' },
      disputed: { labelAr: 'نزاع مفتوح', labelEn: 'Disputed', className: 'bg-[#846F9C]/70' },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <Badge className={`${statusInfo.className} text-white`}>
        {t(statusInfo.labelAr, statusInfo.labelEn)}
      </Badge>
    );
  };

  const pendingOrders = sellerOrders.filter((o) => o.status === 'pending');
  const inProgressOrders = sellerOrders.filter((o) => o.status === 'in_progress' || o.status === 'revision');
  const deliveredOrders = sellerOrders.filter(
    (o) => o.status === 'delivered' || o.status === 'completed',
  );

  const renderOrderCard = (order: (typeof sellerOrders)[number]) => (
    <Card key={order.id} className="hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4 p-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">{t(order.titleAr, order.titleEn)}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {t(order.descriptionAr, order.descriptionEn)}
              </p>
            </div>
            {getOrderStatusBadge(order.status)}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-semibold">{t('السعر:', 'Price:')}</span>
              <span>
                {order.price} {order.currency}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">{t('رقم الطلب:', 'Order #:')}</span>
              <span>{order.id}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {order.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => acceptOrderMutation.mutate({ orderId: order.id })}
                  disabled={acceptOrderMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-1" />
                  {t('قبول الطلب', 'Accept Order')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleReject(order.id)}
                  disabled={rejectOrderMutation.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('رفض الطلب', 'Reject Order')}
                </Button>
              </>
            )}
            {(order.status === 'in_progress' || order.status === 'revision') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeliverOrderId(order.id)}
                disabled={deliverOrderMutation.isPending}
              >
                <Send className="h-4 w-4 mr-1" />
                {t('تسليم الطلب', 'Deliver Order')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderOrdersList = (orders: typeof sellerOrders) =>
    orders.length === 0 ? (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">{t('لا توجد طلبات هنا', 'No orders here')}</p>
        </CardContent>
      </Card>
    ) : (
      <div className="grid grid-cols-1 gap-4">{orders.map(renderOrderCard)}</div>
    );

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
          <Button className="bg-osdm-blue hover:bg-osdm-blue/90" onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            {t('إضافة خدمة جديدة', 'Add New Service')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {t('لم تقم بإضافة أي خدمات بعد', 'You haven\'t added any services yet')}
              </p>
              <Button className="mt-4 bg-osdm-blue hover:bg-osdm-blue/90" onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                {t('إضافة أول خدمة', 'Add First Service')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={service.coverImage || '/placeholder.png'}
                      alt={t(service.titleAr, service.titleEn)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">{t(service.titleAr, service.titleEn)}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {t(service.descriptionAr, service.descriptionEn)}
                        </p>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{t('يبدأ من:', 'Starting at:')}</span>
                        <span>
                          {service.startingPrice} {service.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{service.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>
                          {service.ordersCount || 0} {t('طلب', 'orders')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(service)}>
                        <Edit className="h-4 w-4 mr-1" />
                        {t('تعديل', 'Edit')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setPkgServiceId(service.id)}>
                        <Package className="h-4 w-4 mr-1" />
                        {t('الباقات', 'Packages')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(service.id)}
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

        {/* Orders pipeline */}
        <div>
          <h2 className="text-2xl font-bold gradient-text">{t('طلبات خدماتي', 'My Service Orders')}</h2>
          <p className="text-muted-foreground mt-2">
            {t('متابعة طلبات المشترين على خدماتك', 'Track buyer orders on your services')}
          </p>
        </div>

        {ordersLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">
                {t('بانتظار القبول', 'Pending')} ({pendingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                {t('قيد التنفيذ', 'In Progress')} ({inProgressOrders.length})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                {t('تم التسليم', 'Delivered')} ({deliveredOrders.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              {renderOrdersList(pendingOrders)}
            </TabsContent>
            <TabsContent value="in_progress" className="mt-4">
              {renderOrdersList(inProgressOrders)}
            </TabsContent>
            <TabsContent value="delivered" className="mt-4">
              {renderOrdersList(deliveredOrders)}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Create / edit service dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingServiceId === null
                ? t('إضافة خدمة جديدة', 'Add New Service')
                : t('تعديل الخدمة', 'Edit Service')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('العنوان بالعربية', 'Title (Arabic)')}</Label>
              <Input
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('العنوان بالإنجليزية', 'Title (English)')}</Label>
              <Input
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('الوصف بالعربية', 'Description (Arabic)')}</Label>
              <Textarea
                value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('الوصف بالإنجليزية', 'Description (English)')}</Label>
              <Textarea
                value={form.descriptionEn}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('التصنيف', 'Category')}</Label>
              <Select
                value={form.categoryId}
                onValueChange={(value) => setForm({ ...form, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('اختر التصنيف', 'Select category')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {t(c.nameAr, c.nameEn)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('السعر الابتدائي (ريال)', 'Starting Price (SAR)')}</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.startingPrice}
                  onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('مدة التسليم (أيام)', 'Delivery Time (days)')}</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.deliveryTime}
                  onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('رابط صورة الغلاف', 'Cover Image URL')}</Label>
              <Input
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setServiceDialogOpen(false)}>
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button
              className="bg-osdm-blue hover:bg-osdm-blue/90"
              onClick={handleSubmitService}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {t('حفظ', 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Packages editor dialog */}
      <Dialog open={pkgServiceId !== null} onOpenChange={(open) => !open && setPkgServiceId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('باقات الخدمة', 'Service Packages')}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">{t('أساسية', 'Basic')}</TabsTrigger>
              <TabsTrigger value="standard">{t('قياسية', 'Standard')}</TabsTrigger>
              <TabsTrigger value="premium">{t('مميزة', 'Premium')}</TabsTrigger>
            </TabsList>
            {(['basic', 'standard', 'premium'] as TierKey[]).map((key) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`tier-${key}`}
                      checked={tiers[key].enabled}
                      onCheckedChange={(checked) =>
                        setTiers({ ...tiers, [key]: { ...tiers[key], enabled: checked === true } })
                      }
                    />
                    <Label htmlFor={`tier-${key}`}>{t('تفعيل هذه الباقة', 'Enable this package')}</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('الاسم بالعربية', 'Name (Arabic)')}</Label>
                      <Input
                        value={tiers[key].nameAr}
                        onChange={(e) =>
                          setTiers({ ...tiers, [key]: { ...tiers[key], nameAr: e.target.value } })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('الاسم بالإنجليزية', 'Name (English)')}</Label>
                      <Input
                        value={tiers[key].nameEn}
                        onChange={(e) =>
                          setTiers({ ...tiers, [key]: { ...tiers[key], nameEn: e.target.value } })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{t('السعر (ريال)', 'Price (SAR)')}</Label>
                      <Input
                        type="number"
                        min={1}
                        value={tiers[key].price}
                        onChange={(e) =>
                          setTiers({ ...tiers, [key]: { ...tiers[key], price: e.target.value } })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('التسليم (أيام)', 'Delivery (days)')}</Label>
                      <Input
                        type="number"
                        min={1}
                        value={tiers[key].deliveryDays}
                        onChange={(e) =>
                          setTiers({ ...tiers, [key]: { ...tiers[key], deliveryDays: e.target.value } })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('عدد التعديلات', 'Revisions')}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={tiers[key].revisions}
                        onChange={(e) =>
                          setTiers({ ...tiers, [key]: { ...tiers[key], revisions: e.target.value } })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('المميزات (سطر لكل ميزة)', 'Features (one per line)')}</Label>
                    <Textarea
                      value={tiers[key].features}
                      onChange={(e) =>
                        setTiers({ ...tiers, [key]: { ...tiers[key], features: e.target.value } })
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPkgServiceId(null)}>
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button
              className="bg-osdm-blue hover:bg-osdm-blue/90"
              onClick={handleSavePackages}
              disabled={setPackagesMutation.isPending}
            >
              {t('حفظ الباقات', 'Save Packages')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deliver order dialog */}
      <Dialog open={deliverOrderId !== null} onOpenChange={(open) => !open && setDeliverOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('تسليم الطلب', 'Deliver Order')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('رسالة التسليم', 'Delivery Message')}</Label>
              <Textarea
                value={deliverMessage}
                onChange={(e) => setDeliverMessage(e.target.value)}
                placeholder={t('اكتب ملاحظات التسليم للمشتري', 'Write delivery notes for the buyer')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('روابط الملفات (سطر لكل رابط)', 'File links (one per line)')}</Label>
              <Textarea
                value={deliverFiles}
                onChange={(e) => setDeliverFiles(e.target.value)}
                placeholder={t('https://... رابط الملف', 'https://... file link')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeliverOrderId(null)}>
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button
              className="bg-osdm-blue hover:bg-osdm-blue/90"
              onClick={handleDeliver}
              disabled={deliverOrderMutation.isPending}
            >
              <Send className="h-4 w-4 mr-2" />
              {t('تسليم', 'Deliver')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OSDMDashboardLayout>
  );
}
