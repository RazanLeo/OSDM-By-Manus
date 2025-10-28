import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import {
  Search,
  ShoppingCart,
  Briefcase,
  Wrench,
  TrendingUp,
  Star,
  Eye,
  Download,
  Clock,
  DollarSign,
  Users,
  Package,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data for all markets
  const { data: products = [] } = trpc.products.list.useQuery({ status: 'active' });
  const { data: services = [] } = trpc.services.list.useQuery({});
  const { data: jobs = [] } = trpc.jobs.list.useQuery({});

  const { data: productCategories = [] } = trpc.productCategories.list.useQuery();
  const { data: serviceCategories = [] } = trpc.serviceCategories.list.useQuery();
  const { data: jobCategories = [] } = trpc.jobCategories.list.useQuery();

  // Get featured items (top 8 from each market)
  const featuredProducts = products.slice(0, 8);
  const featuredServices = services.slice(0, 8);
  const featuredJobs = jobs.slice(0, 8);

  const stats = [
    {
      icon: Package,
      label: t('منتج رقمي', 'Digital Products'),
      value: '10,000+',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Wrench,
      label: t('خدمة مصغرة', 'Micro Services'),
      value: '50,000+',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Briefcase,
      label: t('مشروع', 'Projects'),
      value: '25,000+',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Users,
      label: t('مستخدم نشط', 'Active Users'),
      value: '100,000+',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const features = [
    {
      icon: ShoppingCart,
      title: t('سوق المنتجات الرقمية', 'Digital Products Market'),
      description: t(
        'اكتشف آلاف المنتجات الرقمية الجاهزة للشراء والتحميل الفوري',
        'Discover thousands of ready-made digital products for instant purchase and download'
      ),
      link: '/markets/products',
      color: 'from-purple-600 to-blue-600',
    },
    {
      icon: Wrench,
      title: t('سوق الخدمات المصغرة', 'Micro Services Market'),
      description: t(
        'احصل على خدمات احترافية بأسعار تبدأ من 5$ فقط',
        'Get professional services starting from just $5'
      ),
      link: '/markets/services',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Briefcase,
      title: t('سوق المشاريع والعمل الحر', 'Freelance Projects Market'),
      description: t(
        'انشر مشروعك واحصل على عروض من أفضل المستقلين',
        'Post your project and get offers from top freelancers'
      ),
      link: '/markets/jobs',
      color: 'from-green-600 to-emerald-600',
    },
  ];

  const benefits = [
    t('دفع آمن ومضمون', 'Secure & Guaranteed Payment'),
    t('دعم فني 24/7', '24/7 Technical Support'),
    t('ضمان استرجاع الأموال', 'Money Back Guarantee'),
    t('تقييمات موثوقة', 'Verified Reviews'),
    t('منصة موحدة شاملة', 'Unified Comprehensive Platform'),
    t('أسعار تنافسية', 'Competitive Prices'),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="h-8 w-8 animate-pulse" />
                <h1 className="text-5xl md:text-7xl font-bold">
                  {t('منصة OSDM', 'OSDM Platform')}
                </h1>
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <p className="text-2xl md:text-3xl mb-4 font-semibold">
                {t(
                  'المنصة الموحدة الشاملة للمنتجات والخدمات والمشاريع الرقمية',
                  'The Unified Comprehensive Platform for Digital Products, Services & Projects'
                )}
              </p>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                {t(
                  'اشترِ منتجات جاهزة • احصل على خدمات احترافية • انشر مشاريعك',
                  'Buy Ready Products • Get Professional Services • Post Your Projects'
                )}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-3xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <Input
                  type="text"
                  placeholder={t(
                    'ابحث عن منتجات، خدمات، أو مشاريع...',
                    'Search for products, services, or projects...'
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-4 py-7 text-lg bg-white text-gray-900 rounded-full shadow-2xl"
                />
                <Button
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {t('بحث', 'Search')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gray-50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} mb-4`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Markets Overview */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                {t('استكشف أسواقنا الثلاثة', 'Explore Our Three Markets')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t(
                  'كل ما تحتاجه في منصة واحدة موحدة',
                  'Everything you need in one unified platform'
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} text-white mb-4`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link href={feature.link} className="w-full">
                      <Button className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90`}>
                        {t('استكشف الآن', 'Explore Now')}
                        <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Items */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                {t('الأكثر مبيعاً وشهرة', 'Best Sellers & Most Popular')}
              </h2>
            </div>

            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="products" className="text-lg">
                  <Package className="h-5 w-5 mr-2" />
                  {t('منتجات', 'Products')}
                </TabsTrigger>
                <TabsTrigger value="services" className="text-lg">
                  <Wrench className="h-5 w-5 mr-2" />
                  {t('خدمات', 'Services')}
                </TabsTrigger>
                <TabsTrigger value="jobs" className="text-lg">
                  <Briefcase className="h-5 w-5 mr-2" />
                  {t('مشاريع', 'Projects')}
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-xl transition-shadow overflow-hidden group">
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={product.coverImage || '/placeholder.png'}
                          alt={t(product.titleAr, product.titleEn)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 right-2 bg-purple-600">
                          {product.price} {product.currency}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-base">
                          {t(product.titleAr, product.titleEn)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{product.downloads || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/markets/products/${product.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            {t('عرض', 'View')}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/markets/products">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                      {t('عرض جميع المنتجات', 'View All Products')}
                      <ArrowRight className={`h-5 w-5 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredServices.map((service) => (
                    <Card key={service.id} className="hover:shadow-xl transition-shadow overflow-hidden group">
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={service.coverImage || '/placeholder.png'}
                          alt={t(service.titleAr, service.titleEn)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 right-2 bg-blue-600">
                          {t('يبدأ من', 'Starting at')} {service.startingPrice} {service.currency}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-base">
                          {t(service.titleAr, service.titleEn)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{service.rating || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{service.deliveryTime} {t('أيام', 'days')}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/markets/services/${service.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            {t('عرض', 'View')}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/markets/services">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      {t('عرض جميع الخدمات', 'View All Services')}
                      <ArrowRight className={`h-5 w-5 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              {/* Jobs Tab */}
              <TabsContent value="jobs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-base">
                          {t(job.titleAr, job.titleEn)}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {t(job.descriptionAr, job.descriptionEn)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('الميزانية', 'Budget')}</span>
                            <span className="font-semibold">
                              {job.budget} {job.currency}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('العروض', 'Bids')}</span>
                            <span>{job.bidsCount || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/markets/jobs/${job.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            {t('عرض', 'View')}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/markets/jobs">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      {t('عرض جميع المشاريع', 'View All Projects')}
                      <ArrowRight className={`h-5 w-5 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                {t('لماذا تختار منصة OSDM؟', 'Why Choose OSDM Platform?')}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-4">
              {t('جاهز للبدء؟', 'Ready to Get Started?')}
            </h2>
            <p className="text-xl mb-8">
              {t(
                'انضم إلى آلاف المستخدمين واستفد من منصتنا الموحدة الشاملة',
                'Join thousands of users and benefit from our unified comprehensive platform'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  {t('سجل الآن مجاناً', 'Register Now for Free')}
                </Button>
              </Link>
              <Link href="/markets/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  {t('تصفح المنصة', 'Browse Platform')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

