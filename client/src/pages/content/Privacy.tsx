import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Privacy() {
  const { t, language } = useLanguage();

  const contentAr = `
# سياسة الخصوصية

آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}

## مقدمة

نحن في OSDM نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.

## 1. المعلومات التي نجمعها

### 1.1 المعلومات الشخصية
- الاسم
- عنوان البريد الإلكتروني
- رقم الهاتف
- معلومات الدفع

### 1.2 المعلومات التقنية
- عنوان IP
- نوع المتصفح
- نظام التشغيل
- سجل النشاط على المنصة

## 2. كيفية استخدام المعلومات

نستخدم معلوماتك لـ:
- تقديم وتحسين خدماتنا
- معالجة المعاملات المالية
- التواصل معك
- تخصيص تجربتك
- الامتثال للمتطلبات القانونية

## 3. مشاركة المعلومات

لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:
- بموافقتك الصريحة
- لإتمام المعاملات (مع بوابات الدفع)
- للامتثال للقوانين والأنظمة
- لحماية حقوقنا وأمن المنصة

## 4. أمن المعلومات

نتخذ إجراءات أمنية صارمة لحماية بياناتك:
- تشفير البيانات الحساسة
- خوادم آمنة
- مراقبة مستمرة للأنشطة المشبوهة
- تحديثات أمنية منتظمة

## 5. ملفات تعريف الارتباط (Cookies)

نستخدم ملفات تعريف الارتباط لـ:
- تحسين تجربة المستخدم
- تحليل استخدام المنصة
- تذكر تفضيلاتك

يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح.

## 6. حقوقك

لديك الحق في:
- الوصول إلى بياناتك الشخصية
- تصحيح البيانات غير الدقيقة
- حذف بياناتك (في حالات معينة)
- الاعتراض على معالجة بياناتك
- نقل بياناتك

## 7. الاحتفاظ بالبيانات

نحتفظ ببياناتك طالما كان حسابك نشطاً أو حسب الحاجة لتقديم الخدمات. قد نحتفظ ببعض البيانات للامتثال للمتطلبات القانونية.

## 8. خصوصية الأطفال

منصتنا غير موجهة للأطفال دون سن 18 عاماً. لا نجمع معلومات من الأطفال عن قصد.

## 9. التغييرات على السياسة

قد نحدث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على المنصة.

## 10. التواصل

لأي استفسارات حول سياسة الخصوصية:
- البريد الإلكتروني: app.osdm@gmail.com
- الهاتف: 00966544827213
- المكتب: جدة، المملكة العربية السعودية
  `;

  const contentEn = `
# Privacy Policy

Last Updated: ${new Date().toLocaleDateString('en-US')}

## Introduction

At OSDM, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information.

## 1. Information We Collect

### 1.1 Personal Information
- Name
- Email address
- Phone number
- Payment information

### 1.2 Technical Information
- IP address
- Browser type
- Operating system
- Activity log on the platform

## 2. How We Use Information

We use your information to:
- Provide and improve our services
- Process financial transactions
- Communicate with you
- Personalize your experience
- Comply with legal requirements

## 3. Information Sharing

We do not share your personal information with third parties except in the following cases:
- With your explicit consent
- To complete transactions (with payment gateways)
- To comply with laws and regulations
- To protect our rights and platform security

## 4. Information Security

We take strict security measures to protect your data:
- Encryption of sensitive data
- Secure servers
- Continuous monitoring of suspicious activities
- Regular security updates

## 5. Cookies

We use cookies to:
- Improve user experience
- Analyze platform usage
- Remember your preferences

You can control cookies through your browser settings.

## 6. Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Delete your data (in certain cases)
- Object to processing of your data
- Transfer your data

## 7. Data Retention

We retain your data as long as your account is active or as needed to provide services. We may retain some data to comply with legal requirements.

## 8. Children's Privacy

Our platform is not directed to children under 18 years of age. We do not knowingly collect information from children.

## 9. Policy Changes

We may update this policy from time to time. We will notify you of any material changes via email or notice on the platform.

## 10. Contact

For any inquiries about the privacy policy:
- Email: app.osdm@gmail.com
- Phone: 00966544827213
- Office: Jeddah, Saudi Arabia
  `;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <Card>
          <CardContent className="prose prose-lg max-w-none p-8">
            <div className="whitespace-pre-wrap">
              {language === 'ar' ? contentAr : contentEn}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

