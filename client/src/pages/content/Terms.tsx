import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Terms() {
  const { t, language } = useLanguage();

  const contentAr = `
# شروط وأحكام الاستخدام

آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}

## 1. القبول بالشروط

باستخدامك لمنصة OSDM، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.

## 2. التسجيل والحساب

- يجب أن تكون بعمر 18 عاماً أو أكثر للتسجيل في المنصة
- يجب تقديم معلومات صحيحة ودقيقة عند التسجيل
- أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور
- يجب إخطارنا فوراً بأي استخدام غير مصرح به لحسابك

## 3. استخدام المنصة

### 3.1 الاستخدام المسموح
- شراء وبيع المنتجات والخدمات الرقمية القانونية
- نشر وتنفيذ المشاريع الرقمية المشروعة
- التواصل الاحترافي مع المستخدمين الآخرين

### 3.2 الاستخدام المحظور
- نشر محتوى مخالف للشريعة الإسلامية أو القوانين السعودية
- انتهاك حقوق الملكية الفكرية
- الاحتيال أو التضليل
- إساءة استخدام المنصة أو التلاعب بنظامها

## 4. المنتجات والخدمات

### 4.1 مسؤولية البائع
- ضمان جودة المنتجات والخدمات المقدمة
- تقديم وصف دقيق للمنتجات
- الالتزام بمواعيد التسليم المحددة

### 4.2 مسؤولية المشتري
- دفع المبالغ المستحقة في الوقت المحدد
- تقديم المعلومات اللازمة لإتمام الخدمة
- التعامل بشكل احترافي مع البائع

## 5. المدفوعات والعمولات

- تحتفظ OSDM بنسبة عمولة من كل معاملة
- يتم احتساب العمولات بشكل تلقائي
- المبالغ المدفوعة غير قابلة للاسترداد إلا في حالات محددة

## 6. حقوق الملكية الفكرية

- جميع حقوق الملكية الفكرية للمنصة محفوظة لـ OSDM
- المحتوى المنشور من قبل المستخدمين يبقى ملكاً لهم
- يمنح المستخدمون OSDM ترخيصاً لعرض المحتوى على المنصة

## 7. الإنهاء والتعليق

نحتفظ بالحق في:
- تعليق أو إنهاء الحسابات المخالفة
- حذف المحتوى المخالف
- اتخاذ الإجراءات القانونية عند الضرورة

## 8. إخلاء المسؤولية

- OSDM وسيط بين البائعين والمشترين
- لا نتحمل مسؤولية جودة المنتجات أو الخدمات
- المعاملات تتم على مسؤولية الأطراف

## 9. التعديلات

نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية.

## 10. القانون الحاكم

تخضع هذه الشروط لأنظمة المملكة العربية السعودية.

## 11. التواصل

لأي استفسارات حول الشروط والأحكام:
- البريد الإلكتروني: app.osdm@gmail.com
- الهاتف: 00966544827213
  `;

  const contentEn = `
# Terms and Conditions

Last Updated: ${new Date().toLocaleDateString('en-US')}

## 1. Acceptance of Terms

By using the OSDM platform, you agree to comply with these terms and conditions. If you do not agree to any of these terms, please do not use the platform.

## 2. Registration and Account

- You must be 18 years or older to register on the platform
- You must provide accurate and complete information when registering
- You are responsible for maintaining the confidentiality of your account and password
- You must notify us immediately of any unauthorized use of your account

## 3. Use of Platform

### 3.1 Permitted Use
- Buying and selling legal digital products and services
- Posting and executing legitimate digital projects
- Professional communication with other users

### 3.2 Prohibited Use
- Publishing content that violates Islamic law or Saudi laws
- Infringing intellectual property rights
- Fraud or deception
- Misusing the platform or manipulating its system

## 4. Products and Services

### 4.1 Seller Responsibility
- Ensuring quality of products and services offered
- Providing accurate product descriptions
- Meeting specified delivery deadlines

### 4.2 Buyer Responsibility
- Paying due amounts on time
- Providing necessary information to complete the service
- Dealing professionally with the seller

## 5. Payments and Commissions

- OSDM retains a commission percentage from each transaction
- Commissions are calculated automatically
- Payments are non-refundable except in specific cases

## 6. Intellectual Property Rights

- All intellectual property rights of the platform are reserved for OSDM
- Content published by users remains their property
- Users grant OSDM a license to display content on the platform

## 7. Termination and Suspension

We reserve the right to:
- Suspend or terminate violating accounts
- Delete violating content
- Take legal action when necessary

## 8. Disclaimer

- OSDM is an intermediary between sellers and buyers
- We are not responsible for the quality of products or services
- Transactions are at the parties' own responsibility

## 9. Modifications

We reserve the right to modify these terms at any time. Users will be notified of any material changes.

## 10. Governing Law

These terms are subject to the laws of the Kingdom of Saudi Arabia.

## 11. Contact

For any inquiries about the terms and conditions:
- Email: app.osdm@gmail.com
- Phone: 00966544827213
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

