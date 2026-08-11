import { useParams, Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Star, Clock, Package, MessageCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ServiceDetails() {
  const { id } = useParams();
  const { t } = useLanguage();

  const { data, isLoading } = trpc.servicesExt.serviceDetails.useQuery({ serviceId: parseInt(id!) });
  const service = data?.service;
  const seller = data?.seller;
  const serviceReviews = data?.reviews ?? [];

  const [orderPackage, setOrderPackage] = useState<{ packageId?: number; name: string; price: number } | null>(null);
  const [requirements, setRequirements] = useState('');

  const orderMutation = trpc.servicesExt.orderService.useMutation({
    onSuccess: (result) => {
      toast.success(
        t(
          `تم إنشاء الطلب رقم ${result.orderId} وحُجز المبلغ (${result.price} ريال) في الضمان`,
          `Order #${result.orderId} created, amount (${result.price} SAR) held in escrow`,
        ),
      );
      setOrderPackage(null);
      setRequirements('');
    },
    onError: (e) => toast.error(e.message),
  });

  const handleOrderService = (pkg: { packageId?: number; name: string; price: number }) => {
    setOrderPackage(pkg);
  };

  const handleSubmitOrder = () => {
    if (!service || !orderPackage) return;
    if (!requirements.trim()) {
      toast.error(t('اكتب متطلبات طلبك أولاً', 'Write your order requirements first'));
      return;
    }
    orderMutation.mutate({
      serviceId: service.id,
      packageId: orderPackage.packageId,
      requirements: requirements.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('الخدمة غير موجودة', 'Service not found')}</h1>
            <Link href="/markets/services">
              <Button>{t('العودة إلى السوق', 'Back to Market')}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const realPackages = data?.packages ?? [];
  const packages =
    realPackages.length > 0
      ? realPackages.map((pkg) => ({
          packageId: pkg.id as number | undefined,
          name: t(pkg.nameAr, pkg.nameEn),
          price: pkg.price,
          deliveryTime: pkg.deliveryTime,
          features: pkg.meta.features,
        }))
      : [
          {
            packageId: undefined as number | undefined,
            name: t('الباقة الأساسية', 'Basic Package'),
            price: service.startingPrice,
            deliveryTime: service.deliveryTime,
            features: [] as string[],
          },
        ];

  const sellerName = seller?.name || t('البائع', 'Seller');
  const sellerRating = seller?.sellerProfile?.rating ?? service.rating ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={service.coverImage || '/placeholder.png'}
                    alt={t(service.titleAr, service.titleEn)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">
                        {t(service.titleAr, service.titleEn)}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{service.rating || 0}</span>
                          <span>({service.reviewsCount || 0})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{service.ordersCount || 0} {t('طلب', 'orders')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="description" className="mt-6">
                    <TabsList>
                      <TabsTrigger value="description">
                        {t('الوصف', 'Description')}
                      </TabsTrigger>
                      <TabsTrigger value="packages">
                        {t('الباقات', 'Packages')}
                      </TabsTrigger>
                      <TabsTrigger value="reviews">
                        {t('التقييمات', 'Reviews')} ({serviceReviews.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-4">
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">
                          {t(service.descriptionAr, service.descriptionEn)}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="packages" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {packages.map((pkg, idx) => (
                          <Card key={idx} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <CardTitle className="text-lg">{pkg.name}</CardTitle>
                              <CardDescription>
                                <div className="text-2xl font-bold text-osdm-blue mt-2">
                                  {pkg.price} {t('ريال', 'SAR')}
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-sm">
                                  <Clock className="h-4 w-4" />
                                  <span>{pkg.deliveryTime} {t('أيام', 'days')}</span>
                                </div>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {pkg.features.map((feature, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              <Button
                                className="w-full mt-4 bg-osdm-blue hover:bg-osdm-blue/90"
                                onClick={() => handleOrderService(pkg)}
                              >
                                {t('اطلب الآن', 'Order Now')}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-4">
                      {serviceReviews.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          {t('لا توجد تقييمات بعد', 'No reviews yet')}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {serviceReviews.map((review) => (
                            <Card key={review.id}>
                              <CardContent className="py-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="font-semibold">
                                      {review.reviewerName || t('مستخدم', 'User')}
                                    </p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                      {t(review.commentAr || '', review.commentEn || '') ||
                                        review.commentAr ||
                                        review.commentEn ||
                                        ''}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm shrink-0">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{review.rating}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('البائع', 'Seller')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>{sellerName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{sellerName}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{sellerRating}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t('مراسلة البائع', 'Contact Seller')}
                </Button>
              </CardContent>
            </Card>

            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('معلومات الخدمة', 'Service Info')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('التصنيف:', 'Category:')}</span>
                  <span className="font-medium">{t('خدمات رقمية', 'Digital Services')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('الطلبات:', 'Orders:')}</span>
                  <span className="font-medium">{service.ordersCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('آخر تحديث:', 'Last Update:')}</span>
                  <span className="font-medium">
                    {new Date(service.updatedAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Order service dialog */}
      <Dialog open={orderPackage !== null} onOpenChange={(open) => !open && setOrderPackage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('اطلب الخدمة', 'Order Service')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {orderPackage && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{orderPackage.name}</span>
                <Badge className="bg-osdm-blue text-white">
                  {orderPackage.price} {t('ريال', 'SAR')}
                </Badge>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {t(
                'سيتم حجز المبلغ في الضمان ولا يُحوَّل للبائع إلا بعد قبولك للتسليم',
                'The amount is held in escrow and only released to the seller after you accept the delivery',
              )}
            </p>
            <div className="space-y-2">
              <Label>{t('متطلبات الطلب', 'Order Requirements')}</Label>
              <Textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder={t('اشرح ما تحتاجه بالتفصيل', 'Explain what you need in detail')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderPackage(null)}>
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button
              className="bg-osdm-blue hover:bg-osdm-blue/90"
              onClick={handleSubmitOrder}
              disabled={orderMutation.isPending}
            >
              {t('تأكيد الطلب والدفع للضمان', 'Confirm Order & Pay to Escrow')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
