import { useParams, Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Star, Download, Eye, ShoppingCart, Heart, Share2, FileText, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: parseInt(id!) });
  const reviews: any[] = [];

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

  const averageRating = 5.0;

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
                        <p className="text-muted-foreground">
                          {t('سيتم عرض الملفات بعد الشراء', 'Files will be shown after purchase')}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-4">
                      <div className="space-y-4">
                        {reviews.length > 0 ? (
                          reviews.map((review: any) => (
                            <Card key={review.id}>
                              <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                  <Avatar>
                                    <AvatarImage src={review.user?.avatar} />
                                    <AvatarFallback>{review.user?.name?.[0]}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-semibold">{review.user?.name}</span>
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
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
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
                <Button 
                  className="w-full bg-osdm-purple hover:bg-osdm-purple/90" 
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('إضافة إلى السلة', 'Add to Cart')}
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  {t('شراء الآن', 'Buy Now')}
                </Button>
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
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{t('البائع', 'Seller')}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>5.0</span>
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

