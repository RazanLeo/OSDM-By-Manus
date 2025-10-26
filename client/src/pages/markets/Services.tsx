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
import { Search, Clock, Star, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

export default function ServicesMarket() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: categories = [] } = trpc.serviceCategories.list.useQuery();
  const { data: services = [], isLoading } = trpc.services.list.useQuery({
    categoryId: selectedCategory === 'all' ? undefined : parseInt(selectedCategory),
    search: searchQuery || undefined,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('سوق المنتجات والخدمات الرقمية المتخصصة حسب الطلب', 'Custom Digital Products & Services By Order Market')}
            </h1>
            <p className="text-xl mb-8">
              {t(
                'احصل على خدمات رقمية متخصصة مصممة خصيصاً لاحتياجاتك',
                'Get specialized digital services tailored to your specific needs'
              )}
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t('ابحث عن خدمات...', 'Search for services...')}
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
              className={selectedCategory === 'all' ? 'bg-osdm-blue' : ''}
            >
              {t('الكل', 'All')}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id.toString() ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={selectedCategory === cat.id.toString() ? 'bg-osdm-blue' : ''}
              >
                {cat.icon} {t(cat.nameAr, cat.nameEn)}
              </Button>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section className="container py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t('لا توجد خدمات متاحة حالياً', 'No services available at the moment')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={service.coverImage || '/placeholder.png'}
                      alt={t(service.titleAr, service.titleEn)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-osdm-blue text-white">
                        {t('يبدأ من', 'Starting at')} {service.startingPrice} {service.currency}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">
                      {t(service.titleAr, service.titleEn)}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {t(service.descriptionAr, service.descriptionEn)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating || 0}</span>
                        <span>({service.reviewsCount || 0})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {service.deliveryTime} {t(
                            service.deliveryTimeUnit === 'hours' ? 'ساعة' : service.deliveryTimeUnit === 'days' ? 'يوم' : 'أسبوع',
                            service.deliveryTimeUnit === 'hours' ? 'hour' : service.deliveryTimeUnit === 'days' ? 'day' : 'week'
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Link href={`/markets/services/${service.id}`} className="w-full">
                      <Button className="w-full bg-osdm-blue hover:bg-osdm-blue/90">
                        {t('عرض التفاصيل وطلب الخدمة', 'View Details & Order')}
                      </Button>
                    </Link>
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

