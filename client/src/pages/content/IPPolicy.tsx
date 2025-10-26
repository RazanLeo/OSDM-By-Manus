import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function IPPolicy() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent">
            {t('سياسة الملكية الفكرية', 'Intellectual Property Policy')}
          </h1>

          {language === 'ar' ? (
            <div className="prose prose-lg max-w-none" dir="rtl">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">مقدمة</h2>
                <p>
                  تحترم منصة OSDM حقوق الملكية الفكرية لجميع الأطراف. نحن ملتزمون بحماية حقوق
                  المؤلفين والمبدعين ومالكي المحتوى الرقمي.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">حقوق الملكية الفكرية</h2>
                <p>
                  جميع المنتجات والخدمات والمحتوى المعروض على منصة OSDM محمي بموجب قوانين حقوق
                  النشر والملكية الفكرية السعودية والدولية.
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>البائعون يحتفظون بكامل حقوق الملكية الفكرية لمنتجاتهم وخدماتهم</li>
                  <li>المشترون يحصلون على ترخيص استخدام فقط وليس ملكية المحتوى</li>
                  <li>يُمنع نسخ أو توزيع أو إعادة بيع المحتوى دون إذن صريح من المالك</li>
                  <li>منصة OSDM تحتفظ بحقوق الملكية الفكرية لتصميم المنصة ووظائفها</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">الإبلاغ عن انتهاكات حقوق الملكية الفكرية</h2>
                <p>
                  إذا كنت تعتقد أن محتوى معروض على منصتنا ينتهك حقوق الملكية الفكرية الخاصة بك،
                  يرجى التواصل معنا فوراً عبر:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>البريد الإلكتروني: app.osdm@gmail.com</li>
                  <li>الهاتف / واتساب / تليجرام: 00966544827213</li>
                </ul>
                <p className="mt-4">
                  يجب أن يتضمن الإبلاغ: وصف المحتوى المنتهك، إثبات الملكية، معلومات الاتصال
                  الخاصة بك.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">التراخيص والاستخدام</h2>
                <p>
                  عند شراء منتج أو خدمة من منصة OSDM، فإنك تحصل على ترخيص استخدام محدد حسب
                  الشروط المحددة من قبل البائع. يجب عليك الالتزام بشروط الترخيص المحددة.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">المسؤولية</h2>
                <p>
                  البائعون مسؤولون عن ضمان أن جميع المحتوى الذي يعرضونه لا ينتهك حقوق الملكية
                  الفكرية لأي طرف ثالث. منصة OSDM غير مسؤولة عن أي انتهاكات من قبل البائعين.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">الإجراءات التصحيحية</h2>
                <p>
                  في حالة ثبوت انتهاك حقوق الملكية الفكرية، سنتخذ الإجراءات التالية:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>إزالة المحتوى المنتهك فوراً</li>
                  <li>تعليق أو إنهاء حساب البائع المخالف</li>
                  <li>التعاون مع السلطات المختصة عند الحاجة</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">التحديثات</h2>
                <p>
                  نحتفظ بالحق في تحديث هذه السياسة في أي وقت. سيتم إخطار المستخدمين بأي تغييرات
                  جوهرية.
                </p>
              </section>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none" dir="ltr">
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p>
                  OSDM platform respects the intellectual property rights of all parties. We are
                  committed to protecting the rights of authors, creators, and digital content
                  owners.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Intellectual Property Rights</h2>
                <p>
                  All products, services, and content displayed on OSDM platform are protected
                  under Saudi and international copyright and intellectual property laws.
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Sellers retain full intellectual property rights to their products and services</li>
                  <li>Buyers receive a usage license only, not ownership of the content</li>
                  <li>Copying, distributing, or reselling content without explicit permission from the owner is prohibited</li>
                  <li>OSDM platform retains intellectual property rights to the platform design and functionality</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Reporting Intellectual Property Violations</h2>
                <p>
                  If you believe that content displayed on our platform violates your intellectual
                  property rights, please contact us immediately via:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Email: app.osdm@gmail.com</li>
                  <li>Phone / WhatsApp / Telegram: 00966544827213</li>
                </ul>
                <p className="mt-4">
                  The report must include: description of the infringing content, proof of
                  ownership, your contact information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Licenses and Usage</h2>
                <p>
                  When purchasing a product or service from OSDM platform, you receive a specific
                  usage license as defined by the seller. You must comply with the specified
                  license terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Responsibility</h2>
                <p>
                  Sellers are responsible for ensuring that all content they display does not
                  violate the intellectual property rights of any third party. OSDM platform is not
                  responsible for any violations by sellers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Corrective Actions</h2>
                <p>
                  In case of proven intellectual property rights violation, we will take the
                  following actions:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Immediate removal of the infringing content</li>
                  <li>Suspension or termination of the violating seller's account</li>
                  <li>Cooperation with relevant authorities when necessary</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Updates</h2>
                <p>
                  We reserve the right to update this policy at any time. Users will be notified of
                  any material changes.
                </p>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

