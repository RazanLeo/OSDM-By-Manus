import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Flag,
  Layers,
  Zap,
  TrendingUp,
  ShoppingCart,
  Shield,
  BarChart3,
  MousePointerClick,
  Layout,
  Briefcase,
  CreditCard,
  Sparkles,
  Gift,
  Heart,
  Globe,
} from 'lucide-react';

export default function WhyChooseOSDM() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Flag,
      titleAr: 'منصة سعودية رائدة',
      titleEn: 'Leading Saudi Platform',
      descAr:
        'منصة رقمية متكاملة تستلهم رؤية 2030، تدعم التحول الرقمي والاقتصاد الوطني وحل مشكلة البطالة.',
      descEn:
        'An integrated digital platform inspired by Vision 2030, supporting digital transformation, the national economy, and solving unemployment.',
    },
    {
      icon: Layers,
      titleAr: 'تنوع وشمولية استثنائية',
      titleEn: 'Exceptional Diversity and Inclusivity',
      descAr:
        'كل ما تبحث عنه في سوق رقمي ثلاثي موحد: جميع أنواع المنتجات والخدمات والوظائف الرقمية المتنوعة تلبي جميع الاحتياجات.',
      descEn:
        'Everything you need in a unified triple digital market: all types of diverse digital products, services, and jobs that meet all needs.',
    },
    {
      icon: Zap,
      titleAr: 'تجربة موحدة متكاملة',
      titleEn: 'Unified Integrated Experience',
      descAr:
        'شراء وبيع من مكان دون الحاجة للتشتت والتنقل بين منصات متعددة، لتجربة سلسة وآمنة.',
      descEn:
        'Buy and sell from one place without the need to scatter and navigate between multiple platforms, for a seamless and secure experience.',
    },
    {
      icon: TrendingUp,
      titleAr: 'تمكين البائعين',
      titleEn: 'Empowering Sellers',
      descAr:
        'فرص واسعة لتحقيق أو زيادة الدخل وانتشار الأعمال وجذب العملاء وخفض التكاليف مع أدوات تسويقية وبيئة رقمية محفّزة للابتكار دون عناء التسويق الفردي وإنشاء المواقع الخاصة',
      descEn:
        'Wide opportunities to achieve or increase income, spread businesses, attract customers, and reduce costs with marketing tools and a digital environment that encourages innovation without the hassle of individual marketing and creating private websites.',
    },
    {
      icon: ShoppingCart,
      titleAr: 'تمكين المشترين',
      titleEn: 'Empowering Buyers',
      descAr:
        'حلول مرنة وسريعة للأفراد والشركات للحصول على المنتجات والخدمات الرقمية ولتنفيذ كل المشاريع والمهام والأعمال الرقمية بموثوقية عالية.',
      descEn:
        'Flexible and fast solutions for individuals and companies to obtain digital products and services and to implement all digital projects, tasks, and businesses with high reliability.',
    },
    {
      icon: Shield,
      titleAr: 'أمان وموثوقية',
      titleEn: 'Security and Reliability',
      descAr:
        'حماية متقدمة للمعاملات والبيانات مع نظام تقييمات ومراجعات شفاف ودعم فني متواصل.',
      descEn:
        'Advanced protection for transactions and data with a transparent rating and review system and continuous technical support.',
    },
    {
      icon: BarChart3,
      titleAr: 'أدوات تحليلية متطورة',
      titleEn: 'Advanced Analytical Tools',
      descAr:
        'لوحات تحكم وتقارير شاملة تساعدك على اتخاذ قرارات أفضل وتحسين وإدارة الأداء والأعمال.',
      descEn:
        'Comprehensive dashboards and reports that help you make better decisions and improve and manage performance and business.',
    },
    {
      icon: MousePointerClick,
      titleAr: 'سهولة الاستخدام',
      titleEn: 'Ease of Use',
      descAr:
        'واجهة عصرية سهلة تدعم البحث المتقدم والفلاتر الذكية، مع تصنيفات شاملة وقوائم مفضلة ومقارنات وخدمات مخصصة.',
      descEn:
        'Modern, easy-to-use interface that supports advanced search and smart filters, with comprehensive categories, favorites, comparisons, and customized services.',
    },
    {
      icon: Layout,
      titleAr: 'لوحة تحكم موحدة',
      titleEn: 'Unified Dashboard',
      descAr:
        'حساب موحد يتيح بلوحة تحكم رئيسية يتيح للمستخدم الدخول كبائع ومشتري في نفس الوقت مع 6 لوحات تحكم فرعية 3 لوضع البائع و3 لوضع المشتري في كل الأسواق الثلاث.',
      descEn:
        'A unified account with a main dashboard that allows the user to enter as a seller and buyer at the same time with 6 sub-dashboards: 3 for the seller mode and 3 for the buyer mode in all three markets.',
    },
    {
      icon: Briefcase,
      titleAr: 'دعم العمل الحر',
      titleEn: 'Freelance Support',
      descAr:
        'بوابة متخصصة تربط المستقلين بالشركات لتنفيذ مشاريع ومهام وأعمال متنوعة بكافة أحجامها عن بعد بسهولة.',
      descEn:
        'A specialized portal that connects freelancers with companies to implement various projects, tasks, and businesses of all sizes remotely with ease.',
    },
    {
      icon: CreditCard,
      titleAr: 'حلول دفع متكاملة',
      titleEn: 'Integrated Payment Solutions',
      descAr:
        'خيارات دفع متنوعة وآمنة (Mada، Visa، Apple Pay وغيرها)، مع نظام حماية وأمان للأموال.',
      descEn:
        'Various and secure payment options (Mada, Visa, Apple Pay, etc.), with a money protection and security system.',
    },
    {
      icon: Sparkles,
      titleAr: 'ذكاء اصطناعي وأتمتة',
      titleEn: 'AI and Automation',
      descAr:
        'تقنيات حديثة تسهل العمليات وتزيد من جودة الخدمات والعمليات التشغيلية والتحليلية وكفاءة الأداء.',
      descEn:
        'Modern technologies that facilitate operations and increase the quality of services, operational and analytical processes, and performance efficiency.',
    },
    {
      icon: Gift,
      titleAr: 'برامج ولاء وحوافز',
      titleEn: 'Loyalty and Incentive Programs',
      descAr:
        'خصومات، مكافآت، مسابقات، دروس وبرامج إحالة تعزز من قيمتك وتزيد من فرصك الربحية.',
      descEn:
        'Discounts, rewards, competitions, lessons, and referral programs that enhance your value and increase your profit opportunities.',
    },
    {
      icon: Heart,
      titleAr: 'مصداقية وقيمة مضافة',
      titleEn: 'Credibility and Added Value',
      descAr:
        'مصلحة المستخدمين أولاً: توفير قيمة حقيقية ومصداقية وتجربة موثوقة قبل كل شيء.',
      descEn:
        "Users' interest first: providing real value, credibility, and a reliable experience above all else.",
    },
    {
      icon: Globe,
      titleAr: 'التكامل والمرونة والحرية',
      titleEn: 'Integration, Flexibility, and Freedom',
      descAr:
        'اعمل من أي مكان وفي أي وقت بشكل عن بعد بشكل رقمي كامل كل ما تحتاجه هو جهازك واتصالك بالإنترنت وكفاءاتك ومنصتنا لتصل إلى الحرية المالية.',
      descEn:
        'Work from anywhere and at any time remotely in a completely digital way. All you need is your device, your internet connection, your competencies, and our platform to reach financial freedom.',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent">
            {t('لماذا تختار منصة OSDM؟', 'Why Choose OSDM Platform?')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'مميزات استثنائية تجعل OSDM الخيار الأمثل لجميع احتياجاتك الرقمية',
              'Exceptional features that make OSDM the optimal choice for all your digital needs'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="hover:shadow-lg transition-all duration-300 border-l-4"
              style={{
                borderLeftColor:
                  idx % 3 === 0 ? '#846F9C' : idx % 3 === 1 ? '#4691A9' : '#89A58F',
              }}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor:
                        idx % 3 === 0
                          ? 'rgba(132, 111, 156, 0.1)'
                          : idx % 3 === 1
                          ? 'rgba(70, 145, 169, 0.1)'
                          : 'rgba(137, 165, 143, 0.1)',
                    }}
                  >
                    <feature.icon
                      className="h-6 w-6"
                      style={{
                        color:
                          idx % 3 === 0 ? '#846F9C' : idx % 3 === 1 ? '#4691A9' : '#89A58F',
                      }}
                    />
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {t(feature.titleAr, feature.titleEn)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
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

