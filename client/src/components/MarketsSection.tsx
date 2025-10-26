import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Wrench, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MARKETS } from '@shared/constants';

export default function MarketsSection() {
  const { t } = useLanguage();

  const markets = [
    {
      id: 'products',
      icon: ShoppingBag,
      color: 'osdm-purple',
      bgColor: 'bg-osdm-purple',
      ...MARKETS.products,
      href: '/markets/products',
    },
    {
      id: 'services',
      icon: Wrench,
      color: 'osdm-blue',
      bgColor: 'bg-osdm-blue',
      ...MARKETS.services,
      href: '/markets/services',
    },
    {
      id: 'jobs',
      icon: Briefcase,
      color: 'osdm-green',
      bgColor: 'bg-osdm-green',
      ...MARKETS.jobs,
      href: '/markets/jobs',
    },
  ];

  return (
    <section id="markets" className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
          {t('الأسواق الرقمية', 'Digital Markets')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
              className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary"
            >
              <CardHeader>
                <div className={`w-16 h-16 ${market.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className={`text-xl font-bold ${market.color}`}>
                  {t(market.nameAr, market.nameEn)}
                </CardTitle>
                <CardDescription className="text-base">
                  {t(market.descriptionAr, market.descriptionEn)}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={market.href} className="w-full">
                  <Button className={`w-full ${market.bgColor} hover:opacity-90 text-white`}>
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

