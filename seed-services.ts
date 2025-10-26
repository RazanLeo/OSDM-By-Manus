import { getDb } from './server/db';
import { services } from './drizzle/schema';

async function seedServices() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    return;
  }

  console.log('Seeding services...');

  const serviceData = [
    {
      sellerId: 1,
      categoryId: 1,
      titleAr: 'تصميم موقع إلكتروني احترافي متجاوب',
      titleEn: 'Professional Responsive Website Design',
      descriptionAr: 'تصميم موقع إلكتروني احترافي متجاوب مع جميع الأجهزة. يشمل التصميم، البرمجة، والاستضافة.',
      descriptionEn: 'Professional responsive website design for all devices. Includes design, development, and hosting.',
      basicPrice: 500,
      basicDeliveryDays: 7,
      basicFeaturesAr: 'تصميم 5 صفحات، متجاوب، نموذج اتصال',
      basicFeaturesEn: '5 pages design, responsive, contact form',
      standardPrice: 1000,
      standardDeliveryDays: 14,
      standardFeaturesAr: 'تصميم 10 صفحات، متجاوب، نموذج اتصال، لوحة تحكم بسيطة',
      standardFeaturesEn: '10 pages design, responsive, contact form, simple dashboard',
      premiumPrice: 2000,
      premiumDeliveryDays: 21,
      premiumFeaturesAr: 'تصميم غير محدود، متجاوب، لوحة تحكم كاملة، SEO، دعم شهر',
      premiumFeaturesEn: 'Unlimited pages, responsive, full dashboard, SEO, 1 month support',
      currency: 'SAR',
      coverImage: '/services/covers/web-design.jpg',
      images: JSON.stringify(['/services/web-1.jpg', '/services/web-2.jpg']),
      tags: JSON.stringify(['تصميم مواقع', 'تطوير ويب', 'Web Design', 'Development']),
      ordersCount: 25,
      views: 890,
      rating: 48,
      reviewsCount: 18,
      status: 'active',
      isActive: true
    },
    {
      sellerId: 1,
      categoryId: 2,
      titleAr: 'تطوير تطبيق جوال iOS و Android',
      titleEn: 'Mobile App Development iOS & Android',
      descriptionAr: 'تطوير تطبيق جوال احترافي لنظامي iOS و Android باستخدام أحدث التقنيات.',
      descriptionEn: 'Professional mobile app development for iOS and Android using latest technologies.',
      basicPrice: 2000,
      basicDeliveryDays: 30,
      basicFeaturesAr: 'تطبيق بسيط، 5 شاشات، تصميم أساسي',
      basicFeaturesEn: 'Simple app, 5 screens, basic design',
      standardPrice: 5000,
      standardDeliveryDays: 60,
      standardFeaturesAr: 'تطبيق متوسط، 15 شاشة، تصميم احترافي، API',
      standardFeaturesEn: 'Medium app, 15 screens, professional design, API',
      premiumPrice: 10000,
      premiumDeliveryDays: 90,
      premiumFeaturesAr: 'تطبيق متقدم، شاشات غير محدودة، تصميم مخصص، API، لوحة تحكم، دعم 3 أشهر',
      premiumFeaturesEn: 'Advanced app, unlimited screens, custom design, API, dashboard, 3 months support',
      currency: 'SAR',
      coverImage: '/services/covers/mobile-dev.jpg',
      images: JSON.stringify(['/services/mobile-1.jpg', '/services/mobile-2.jpg', '/services/mobile-3.jpg']),
      tags: JSON.stringify(['تطبيقات جوال', 'iOS', 'Android', 'Mobile Development']),
      ordersCount: 12,
      views: 567,
      rating: 49,
      reviewsCount: 9,
      status: 'active',
      isActive: true
    },
    {
      sellerId: 1,
      categoryId: 3,
      titleAr: 'كتابة محتوى تسويقي احترافي',
      titleEn: 'Professional Marketing Content Writing',
      descriptionAr: 'كتابة محتوى تسويقي احترافي لموقعك، منتجك، أو خدمتك. محتوى جذاب ومحسّن لمحركات البحث.',
      descriptionEn: 'Professional marketing content for your website, product, or service. Engaging and SEO-optimized content.',
      basicPrice: 100,
      basicDeliveryDays: 3,
      basicFeaturesAr: '500 كلمة، مقال واحد، مراجعة واحدة',
      basicFeaturesEn: '500 words, 1 article, 1 revision',
      standardPrice: 250,
      standardDeliveryDays: 5,
      standardFeaturesAr: '1500 كلمة، 3 مقالات، مراجعتين، SEO',
      standardFeaturesEn: '1500 words, 3 articles, 2 revisions, SEO',
      premiumPrice: 500,
      premiumDeliveryDays: 7,
      premiumFeaturesAr: '3000 كلمة، 6 مقالات، مراجعات غير محدودة، SEO، صور',
      premiumFeaturesEn: '3000 words, 6 articles, unlimited revisions, SEO, images',
      currency: 'SAR',
      coverImage: '/services/covers/content-writing.jpg',
      images: JSON.stringify(['/services/content-1.jpg']),
      tags: JSON.stringify(['كتابة محتوى', 'تسويق', 'SEO', 'Content Writing']),
      ordersCount: 67,
      views: 1234,
      rating: 47,
      reviewsCount: 45,
      status: 'active',
      isActive: true
    },
    {
      sellerId: 1,
      categoryId: 4,
      titleAr: 'تصميم هوية تجارية متكاملة',
      titleEn: 'Complete Brand Identity Design',
      descriptionAr: 'تصميم هوية تجارية متكاملة تشمل الشعار، الألوان، الخطوط، وجميع المواد التسويقية.',
      descriptionEn: 'Complete brand identity design including logo, colors, fonts, and all marketing materials.',
      basicPrice: 800,
      basicDeliveryDays: 7,
      basicFeaturesAr: 'شعار، 3 تصاميم، مراجعتين، ملفات عالية الجودة',
      basicFeaturesEn: 'Logo, 3 designs, 2 revisions, high-quality files',
      standardPrice: 1500,
      standardDeliveryDays: 14,
      standardFeaturesAr: 'شعار، بطاقة عمل، ورقة رسمية، 5 تصاميم، 3 مراجعات',
      standardFeaturesEn: 'Logo, business card, letterhead, 5 designs, 3 revisions',
      premiumPrice: 3000,
      premiumDeliveryDays: 21,
      premiumFeaturesAr: 'هوية كاملة، شعار، بطاقات، أوراق، مواد تسويقية، دليل الهوية، مراجعات غير محدودة',
      premiumFeaturesEn: 'Complete identity, logo, cards, papers, marketing materials, brand guide, unlimited revisions',
      currency: 'SAR',
      coverImage: '/services/covers/brand-identity.jpg',
      images: JSON.stringify(['/services/brand-1.jpg', '/services/brand-2.jpg']),
      tags: JSON.stringify(['هوية تجارية', 'تصميم شعار', 'Brand Identity', 'Logo Design']),
      ordersCount: 34,
      views: 789,
      rating: 48,
      reviewsCount: 22,
      status: 'active',
      isActive: true
    },
    {
      sellerId: 1,
      categoryId: 5,
      titleAr: 'إدارة حسابات التواصل الاجتماعي',
      titleEn: 'Social Media Management',
      descriptionAr: 'إدارة احترافية لحسابات التواصل الاجتماعي الخاصة بك. تصميم منشورات، جدولة، وتفاعل مع المتابعين.',
      descriptionEn: 'Professional social media management. Post design, scheduling, and follower engagement.',
      basicPrice: 500,
      basicDeliveryDays: 30,
      basicFeaturesAr: 'منصة واحدة، 10 منشورات شهرياً، تقرير شهري',
      basicFeaturesEn: '1 platform, 10 posts/month, monthly report',
      standardPrice: 1000,
      standardDeliveryDays: 30,
      standardFeaturesAr: 'منصتين، 20 منشور شهرياً، تفاعل يومي، تقرير أسبوعي',
      standardFeaturesEn: '2 platforms, 20 posts/month, daily engagement, weekly report',
      premiumPrice: 2000,
      premiumDeliveryDays: 30,
      premiumFeaturesAr: '4 منصات، 40 منشور شهرياً، تفاعل مستمر، إعلانات، تقرير يومي',
      premiumFeaturesEn: '4 platforms, 40 posts/month, continuous engagement, ads, daily report',
      currency: 'SAR',
      coverImage: '/services/covers/social-media.jpg',
      images: JSON.stringify(['/services/social-1.jpg', '/services/social-2.jpg']),
      tags: JSON.stringify(['تواصل اجتماعي', 'إدارة حسابات', 'Social Media', 'Management']),
      ordersCount: 45,
      views: 1120,
      rating: 46,
      reviewsCount: 31,
      status: 'active',
      isActive: true
    }
  ];

  for (const service of serviceData) {
    try {
      await db.insert(services).values(service);
      console.log(`✓ Added: ${service.titleEn}`);
    } catch (error) {
      console.error(`✗ Failed to add ${service.titleEn}:`, error);
    }
  }

  console.log(`\nSeeded ${serviceData.length} services successfully!`);
}

seedServices().catch(console.error).finally(() => process.exit(0));
