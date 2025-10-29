import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Search, ShoppingCart, Eye, Download, Star } from 'lucide-react';
import { Link } from 'wouter';

export default function ProductsMarket() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: categories = [] } = trpc.productCategories.list.useQuery();
  const { data: products = [], isLoading } = trpc.products.list.useQuery({
    categoryId: selectedCategory === 'all' ? undefined : parseInt(selectedCategory),
    search: searchQuery || undefined,
    status: 'active',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#846F9C] to-[#9B7FB0] text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('سوق المنتجات الرقمية الجاهزة', 'Ready Made Digital Products Market')}
            </h1>
            <p className="text-xl mb-8">
              {t(
                'اكتشف آلاف المنتجات الرقمية الجاهزة للشراء والتحميل الفوري',
                'Discover thousands of ready-made digital products for instant purchase and download'
              )}
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t('ابحث عن منتجات...', 'Search for products...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white text-gray-900"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64 bg-white text-gray-900">
                  <SelectValue placeholder={t('جميع التصنيفات', 'All Categories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('جميع التصنيفات', 'All Categories')}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.icon} {t(cat.nameAr, cat.nameEn)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container py-8">
          <div className="flex gap-3 overflow-x-auto pb-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-osdm-purple' : ''}
            >
              {t('الكل', 'All')}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id.toString() ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={selectedCategory === cat.id.toString() ? 'bg-osdm-purple' : ''}
              >
                {cat.icon} {t(cat.nameAr, cat.nameEn)}
              </Button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="container py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t('لا توجد منتجات متاحة حالياً', 'No products available at the moment')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={product.coverImage || '/placeholder.png'}
                      alt={t(product.titleAr, product.titleEn)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-osdm-purple text-white">
                        {product.price} {product.currency}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">
                      {t(product.titleAr, product.titleEn)}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {t(product.descriptionAr, product.descriptionEn)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating || 0}</span>
                        <span>({product.reviewsCount || 0})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{product.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{product.downloads || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Link href={`/markets/products/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        {t('عرض التفاصيل', 'View Details')}
                      </Button>
                    </Link>
                    <Button className="bg-osdm-purple hover:bg-osdm-purple/90">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

