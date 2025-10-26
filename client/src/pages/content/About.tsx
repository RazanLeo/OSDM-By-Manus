import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t, language } = useLanguage();

  const contentAr = `
# من نحن

**OSDM - السوق الرقمي ذو المحطة الواحدة** هي منصة سعودية رائدة تجمع كل ما تحتاجه من منتجات وخدمات وفرص عمل رقمية تحت سقف واحد.

## رؤيتنا

أن نكون المنصة الرقمية الأولى في المملكة العربية السعودية والشرق الأوسط التي توفر تجربة متكاملة وسلسة للمستخدمين في مجال الاقتصاد الرقمي.

## رسالتنا

نسعى لتمكين الأفراد والشركات من الوصول إلى أفضل المنتجات والخدمات الرقمية، وتوفير فرص عمل حر مميزة، من خلال منصة موثوقة وآمنة وسهلة الاستخدام.

## ما نقدمه

### 1. سوق المنتجات الرقمية الجاهزة
منتجات رقمية جاهزة للشراء والتحميل الفوري (قوالب، تصاميم، كتب إلكترونية، برامج، وغيرها).

### 2. سوق المنتجات والخدمات الرقمية المتخصصة حسب الطلب
خدمات رقمية متخصصة حسب احتياجاتك (تصميم، برمجة، كتابة، تسويق، وأكثر).

### 3. سوق فرص العمل الحر الرقمي عن بعد
فرص عمل حر عن بعد مع نظام مزايدات احترافي يربط أصحاب المشاريع بالمستقلين المحترفين.

## لماذا تختار OSDM؟

- **منصة واحدة متكاملة**: كل ما تحتاجه في مكان واحد
- **حساب موحد**: تبديل سلس بين وضع البائع والمشتري
- **أمان وموثوقية**: حماية كاملة لمعاملاتك المالية
- **دعم فني متميز**: فريق دعم متاح على مدار الساعة
- **محفظة رقمية**: إدارة سهلة لأرباحك ومدفوعاتك

## تواصل معنا

نحن هنا لخدمتك! لا تتردد في التواصل معنا عبر:

- **البريد الإلكتروني**: app.osdm@gmail.com
- **الهاتف / واتساب / تليجرام**: 00966544827213
- **المكتب**: جدة، المملكة العربية السعودية
  `;

  const contentEn = `
# About Us

**OSDM - One-Stop Digital Market** is a leading Saudi platform that brings together everything you need in digital products, services, and job opportunities under one roof.

## Our Vision

To be the leading digital platform in Saudi Arabia and the Middle East that provides an integrated and seamless experience for users in the digital economy.

## Our Mission

We strive to empower individuals and businesses to access the best digital products and services, and provide outstanding freelance opportunities, through a reliable, secure, and easy-to-use platform.

## What We Offer

### 1. Ready-Made Digital Products Market
Ready-made digital products for instant purchase and download (templates, designs, e-books, software, and more).

### 2. Custom Digital Products & Services Market
Specialized digital services tailored to your needs (design, programming, writing, marketing, and more).

### 3. Remote Freelance Work Opportunities Market
Remote freelance opportunities with a professional bidding system connecting project owners with professional freelancers.

## Why Choose OSDM?

- **One Integrated Platform**: Everything you need in one place
- **Unified Account**: Seamless switching between seller and buyer modes
- **Security and Reliability**: Complete protection for your financial transactions
- **Outstanding Technical Support**: Support team available 24/7
- **Digital Wallet**: Easy management of your earnings and payments

## Contact Us

We're here to serve you! Feel free to contact us via:

- **Email**: app.osdm@gmail.com
- **Phone / WhatsApp / Telegram**: 00966544827213
- **Office**: Jeddah, Saudi Arabia
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

