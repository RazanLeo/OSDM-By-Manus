import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Monitor, Wifi, Brain, Rocket } from 'lucide-react';
import { Link } from 'wouter';

export default function WhatYouNeed() {
  const { t, direction } = useLanguage();
  const dir = direction;

  const steps = [
    {
      icon: Monitor,
      number: '1',
      titleAr: 'الجهاز',
      titleEn: 'Device',
      descAr: 'جهاز الكمبيوتر أو التابلت أو الجوال أو أي جهاز محمول أو لوحي',
      descEn: 'Computer, tablet, mobile, or any portable or tablet device',
      gradient: 'from-[#846F9C] to-[#4691A9]',
    },
    {
      icon: Wifi,
      number: '2',
      titleAr: 'الاتصال',
      titleEn: 'Connection',
      descAr: 'إنترنت',
      descEn: 'Internet',
      gradient: 'from-[#4691A9] to-[#89A58F]',
    },
    {
      icon: Brain,
      number: '3',
      titleAr: 'الكفاءات',
      titleEn: 'Competencies',
      descAr: 'العلم والمعرفة والخبرات والمهارات القدرات والمواهب والإبداعات',
      descEn: 'Knowledge, experience, skills, abilities, talents, and creativity',
      gradient: 'from-[#846F9C] to-[#89A58F]',
    },
    {
      icon: Rocket,
      number: '4',
      titleAr: 'منصة OSDM',
      titleEn: 'OSDM Platform',
      descAr: 'التسجيل والقيام بعملية البيع والشراء',
      descEn: 'Registration and buying and selling process',
      gradient: 'from-[#4691A9] to-[#846F9C]',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent"
            style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
          >
            {t('ما يحتاجه المستخدم للبدء', 'What You Need to Start')}
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
          >
            {t(
              'خطوات بسيطة للانضمام إلى منصة OSDM والبدء في تحقيق أهدافك',
              'Simple steps to join OSDM platform and start achieving your goals'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, idx) => (
            <Card key={idx} className="relative hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-[#4691A9]/20">
              <div className={`absolute -top-4 ${dir === 'rtl' ? '-right-4' : '-left-4'} w-12 h-12 rounded-full bg-gradient-to-r ${step.gradient} text-white flex items-center justify-center text-xl font-bold shadow-lg`}>
                {step.number}
              </div>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full bg-gradient-to-r ${step.gradient} bg-opacity-10`}>
                    <step.icon className={`h-8 w-8 text-[#4691A9]`} />
                  </div>
                </div>
                <CardTitle 
                  className="text-center text-xl bg-gradient-to-r from-[#846F9C] to-[#4691A9] bg-clip-text text-transparent"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t(step.titleAr, step.titleEn)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription 
                  className="text-center text-gray-600"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t(step.descAr, step.descEn)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/auth/register">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#4691A9] to-[#89A58F] hover:opacity-90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('ابدأ تجربة البيع والشراء', 'Start Selling & Buying Experience')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

