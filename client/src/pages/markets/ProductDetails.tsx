import { useState } from 'react';
import { useParams, Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Star, Download, Eye, ShoppingCart, Heart, Share2, FileText, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetails() {
  const { id } = useParams();
  const { t } = useLanguage();

  const { data, isLoading } = trpc.productsExt.public.productDetails.useQuery(
    { productId: parseInt(id!) },
    { enabled: !!id, retry: false }
  );
  const product = data?.product;
  const seller = data?.seller;
  const reviews = data?.reviews ?? [];

  const [couponCode, setCouponCode] = useState('');
  const [purchaseResult, setPurchaseResult] = useState<{
    downloadUrl: string;
    licenseKey: string;
  } | null>(null);

  const purchaseMutation = trpc.productsExt.buyer.purchase.useMutation({
    onSuccess: (res) => {
      setPurchaseResult({ downloadUrl: res.downloadUrl, licenseKey: res.licenseKey });
      toast.success(t(res.messageAr, res.messageEn));
    },
    onError: (e) => {
      toast.error(e.message || t('فشل إتمام الشراء', 'Purchase failed'));
    },
  });

  const handleBuyNow = () => {
    if (!product) return;
    purchaseMutation.mutate({
      productId: product.id,
      couponCode: couponCode.trim() || undefined,
    });
  };

  const handleAddToCart = () => {
    toast.success(t('تمت الإضافة إلى السلة', 'Added to cart'));
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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('المنتج غير موجود', 'Product not found')}</h1>
            <Link href="/markets/products">
              <Button>{t('العودة إلى السوق', 'Back to Market')}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating || 0;
  const sellerName = seller?.profile?.companyName || seller?.name || t('البائع', 'Seller');
  const sellerRating = seller?.profile?.rating ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={product.coverImage || '/placeholder.png'}
                    alt={t(product.titleAr, product.titleEn)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">
                        {t(product.titleAr, product.titleEn)}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{averageRating.toFixed(1)}</span>
                          <span>({reviews.length})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{product.downloads || 0} {t('مبيعة', 'sales')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{product.views || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs defaultValue="description" className="mt-6">
                    <TabsList>
                      <TabsTrigger value="description">
                        {t('الوصف', 'Description')}
                      </TabsTrigger>
                      <TabsTrigger value="files">
                        {t('الملفات', 'Files')} (1)
                      </TabsTrigger>
                      <TabsTrigger value="reviews">
                        {t('التقييمات', 'Reviews')} ({reviews.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-4">
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">
                          {t(product.descriptionAr, product.descriptionEn)}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="files" className="mt-4">
                      <div className="space-y-2">
                        {purchaseResult ? (
                          <Button
                            className="bg-osdm-purple hover:bg-osdm-purple/90"
                            onClick={() => window.open(purchaseResult.downloadUrl, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t('تحميل الملف', 'Download File')}
                          </Button>
                        ) : (
                          <p className="text-muted-foreground">
                            {t('سيتم عرض الملفات بعد الشراء', 'Files will be shown after purchase')}
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-4">
                      <div className="space-y-4">
                        {reviews.length > 0 ? (
                          reviews.map((review) => (
                            <Card key={review.id}>
                              <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                  <Avatar>
                                    <AvatarFallback>{review.reviewerName?.[0] || 'U'}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-semibold">
                                        {review.reviewerName || t('مستخدم', 'User')}
                                      </span>
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                              i < review.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {t(review.commentAr || '', review.commentEn || '')}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            {t('لا توجد تقييمات بعد', 'No reviews yet')}
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-osdm-purple">
                  {product.price} {product.currency}
                </CardTitle>
                <CardDescription>
                  {t('ترخيص لمشروع واحد', 'Single project license')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {purchaseResult ? (
                  <>
                    <Button
                      className="w-full bg-osdm-purple hover:bg-osdm-purple/90"
                      size="lg"
                      onClick={() => window.open(purchaseResult.downloadUrl, '_blank')}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      {t('تحميل المنتج', 'Download Product')}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      {t('مفتاح الترخيص:', 'License key:')}{' '}
                      <span className="font-medium">{purchaseResult.licenseKey}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <Input
                      placeholder={t('كود الخصم (اختياري)', 'Coupon code (optional)')}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      className="w-full bg-osdm-purple hover:bg-osdm-purple/90"
                      size="lg"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {t('إضافة إلى السلة', 'Add to Cart')}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={handleBuyNow}
                      disabled={purchaseMutation.isPending}
                    >
                      {purchaseMutation.isPending
                        ? t('جاري إتمام الشراء...', 'Processing purchase...')
                        : t('شراء الآن', 'Buy Now')}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Seller Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('البائع', 'Seller')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    {seller?.profile?.companyLogo && (
                      <AvatarImage src={seller.profile.companyLogo} />
                    )}
                    <AvatarFallback>{sellerName?.[0] || 'S'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{sellerName}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{sellerRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t('مراسلة البائع', 'Contact Seller')}
                </Button>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('معلومات المنتج', 'Product Info')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('التصنيف:', 'Category:')}</span>
                  <span className="font-medium">{t('منتجات رقمية', 'Digital Products')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('الملفات:', 'Files:')}</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('آخر تحديث:', 'Last Update:')}</span>
                  <span className="font-medium">
                    {new Date(product.updatedAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
