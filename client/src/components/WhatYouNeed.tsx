import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserPlus, Mail, CreditCard, Rocket } from 'lucide-react';
import { Link } from 'wouter';

export default function WhatYouNeed() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: UserPlus,
      number: '1',
      titleAr: 'الجهاز',
      titleEn: 'Device',
      descAr: 'جهاز الكمبيوتر أو التابلت أو الجوال أو أي جهاز محمول أو لوحي.',
      descEn: 'Computer, tablet, mobile, or any portable or tablet device.',
    },
    {
      icon: Mail,
      number: '2',
      titleAr: 'الاتصال',
      titleEn: 'Connection',
      descAr: 'إنترنت',
      descEn: 'Internet',
    },
    {
      icon: CreditCard,
      number: '3',
      titleAr: 'الكفاءات',
      titleEn: 'Competencies',
      descAr: 'العلم والمعرفة والخبرات والمهارات القدرات والمواهب والإبداعات.',
      descEn: 'Knowledge, experience, skills, abilities, talents, and creativity.',
    },
    {
      icon: Rocket,
      number: '4',
      titleAr: 'منصة OSDM',
      titleEn: 'OSDM Platform',
      descAr: 'التسجيل والقيام بعملية البيع والشراء.',
      descEn: 'Registration and buying and selling process.',
    },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('ما يحتاجه الفرد للبدء', 'What You Need to Start')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              'خطوات بسيطة للانضمام إلى منصة OSDM والبدء في تحقيق أهدافك',
              'Simple steps to join OSDM platform and start achieving your goals'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, idx) => (
            <Card key={idx} className="relative hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                {step.number}
              </div>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center text-xl">
                  {t(step.titleAr, step.titleEn)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {t(step.descAr, step.descEn)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {t('ابدأ الآن مجاناً', 'Start Now for Free')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

