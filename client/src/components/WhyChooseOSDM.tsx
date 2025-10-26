import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Zap, Users, DollarSign, Headphones, Award } from 'lucide-react';

export default function WhyChooseOSDM() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      titleAr: 'أمان وموثوقية',
      titleEn: 'Security & Reliability',
      descAr: 'نظام حماية متقدم لضمان سلامة معاملاتك وبياناتك',
      descEn: 'Advanced protection system to ensure the safety of your transactions and data',
    },
    {
      icon: Zap,
      titleAr: 'سرعة وكفاءة',
      titleEn: 'Speed & Efficiency',
      descAr: 'منصة سريعة وسهلة الاستخدام لإنجاز أعمالك بفعالية',
      descEn: 'Fast and easy-to-use platform to accomplish your tasks effectively',
    },
    {
      icon: Users,
      titleAr: 'مجتمع احترافي',
      titleEn: 'Professional Community',
      descAr: 'آلاف المحترفين والخبراء في مختلف المجالات',
      descEn: 'Thousands of professionals and experts in various fields',
    },
    {
      icon: DollarSign,
      titleAr: 'أسعار تنافسية',
      titleEn: 'Competitive Prices',
      descAr: 'أفضل الأسعار مع ضمان الجودة العالية',
      descEn: 'Best prices with guaranteed high quality',
    },
    {
      icon: Headphones,
      titleAr: 'دعم فني 24/7',
      titleEn: '24/7 Technical Support',
      descAr: 'فريق دعم متاح على مدار الساعة لمساعدتك',
      descEn: 'Support team available around the clock to help you',
    },
    {
      icon: Award,
      titleAr: 'ضمان الجودة',
      titleEn: 'Quality Guarantee',
      descAr: 'نضمن لك الحصول على أفضل الخدمات والمنتجات',
      descEn: 'We guarantee you the best services and products',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('لماذا تختار منصة OSDM؟', 'Why Choose OSDM Platform?')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'نقدم لك أفضل تجربة في عالم الأعمال الرقمية',
              'We offer you the best experience in the digital business world'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    {t(feature.titleAr, feature.titleEn)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t(feature.descAr, feature.descEn)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

