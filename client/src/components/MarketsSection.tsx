import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Wrench, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MarketsSection() {
  const { t, direction } = useLanguage();
  const dir = direction;

  const markets = [
    {
      id: 'products',
      icon: ShoppingBag,
      nameAr: 'سوق المنتجات الرقمية الجاهزة',
      nameEn: 'Ready Digital Products Market',
      descriptionAr: 'منتجات رقمية جاهزة للبيع والشراء الفوري',
      descriptionEn: 'Ready digital products for instant buying and selling',
      gradient: 'from-[#846F9C] to-[#4691A9]',
      href: '/markets/products',
    },
    {
      id: 'services',
      icon: Wrench,
      nameAr: 'سوق المنتجات والخدمات الرقمية المتخصصة حسب الطلب',
      nameEn: 'Specialized Digital Products & Services Market',
      descriptionAr: 'خدمات رقمية متخصصة حسب الطلب',
      descriptionEn: 'Specialized digital services on demand',
      gradient: 'from-[#4691A9] to-[#89A58F]',
      href: '/markets/services',
    },
    {
      id: 'jobs',
      icon: Briefcase,
      nameAr: 'سوق فرص العمل الحر الرقمي عن بعد',
      nameEn: 'Remote Freelance Digital Work Opportunities Market',
      descriptionAr: 'فرص عمل حر تربط المستقلين بالشركات لتنفيذ المهام والأعمال والمشاريع بكافة أنواعها وأحجامها',
      descriptionEn: 'Freelance opportunities connecting freelancers with companies to execute tasks, work, and projects of all types and sizes',
      gradient: 'from-[#846F9C] to-[#89A58F]',
      href: '/markets/jobs',
    },
  ];

  return (
    <section id="markets" className="container py-12 md:py-20 px-4">
      <div className="text-center mb-12">
        <h2 
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent mb-4 leading-normal"
          style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif', lineHeight: '1.5' }}
        >
          {t('الأسواق الرقمية', 'Digital Markets')}
        </h2>
        <p 
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
        >
          {t(
            'اختر السوق المناسب لاحتياجاتك واستكشف آلاف المنتجات والخدمات وفرص العمل',
            'Choose the right market for your needs and explore thousands of products, services, and job opportunities'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {markets.map((market) => {
          const Icon = market.icon;
          return (
            <Card 
              key={market.id} 
              className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#4691A9]/30 hover:scale-105 flex flex-col"
            >
              <CardHeader className="flex-1">
                <div className="flex justify-center mb-4">
                  <div className={`w-20 h-20 bg-gradient-to-r ${market.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle 
                  className={`text-xl font-bold text-center bg-gradient-to-r ${market.gradient} bg-clip-text text-transparent mb-3`}
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t(market.nameAr, market.nameEn)}
                </CardTitle>
                <CardDescription 
                  className="text-base text-center text-gray-600"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t(market.descriptionAr, market.descriptionEn)}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link href={market.href} className="w-full">
                  <Button 
                    className={`w-full bg-gradient-to-r ${market.gradient} hover:opacity-90 text-white shadow-lg`}
                    style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                  >
                    {t('دخول السوق', 'Enter Market')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

