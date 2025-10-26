import { getDb } from './server/db';
import { products, productCategories, services, serviceCategories, jobs, jobCategories } from './drizzle/schema';

async function seedFullData() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    return;
  }

  console.log('Starting full seed data...');

  // Seed Products
  const productData = [
    {
      sellerId: 1,
      categoryId: 1,
      titleAr: 'قالب موقع تجارة إلكترونية احترافي',
      titleEn: 'Professional E-commerce Website Template',
      descriptionAr: 'قالب موقع تجارة إلكترونية كامل مع نظام سلة المشتريات والدفع الإلكتروني',
      descriptionEn: 'Complete e-commerce website template with shopping cart and payment system',
      price: 299,
      currency: 'SAR',
      fileUrl: '/products/ecommerce-template.zip',
      previewUrl: '/previews/ecommerce.png',
      status: 'active',
      downloads: 150,
      rating: 4.8
    },
    {
      sellerId: 1,
      categoryId: 2,
      titleAr: 'تطبيق جوال للتوصيل - كود كامل',
      titleEn: 'Delivery Mobile App - Full Source Code',
      descriptionAr: 'تطبيق جوال كامل للتوصيل مع لوحة تحكم إدارية',
      descriptionEn: 'Complete delivery mobile app with admin dashboard',
      price: 1500,
      currency: 'SAR',
      fileUrl: '/products/delivery-app.zip',
      previewUrl: '/previews/delivery-app.png',
      status: 'active',
      downloads: 45,
      rating: 4.9
    },
    {
      sellerId: 1,
      categoryId: 3,
      titleAr: 'كتاب إلكتروني: دليل التسويق الرقمي',
      titleEn: 'E-book: Digital Marketing Guide',
      descriptionAr: 'دليل شامل للتسويق الرقمي مع أمثلة عملية',
      descriptionEn: 'Comprehensive digital marketing guide with practical examples',
      price: 99,
      currency: 'SAR',
      fileUrl: '/products/marketing-guide.pdf',
      previewUrl: '/previews/marketing-book.png',
      status: 'active',
      downloads: 320,
      rating: 4.7
    },
    {
      sellerId: 1,
      categoryId: 4,
      titleAr: 'دورة تعليمية: تطوير تطبيقات الويب',
      titleEn: 'Course: Web Application Development',
      descriptionAr: 'دورة كاملة لتعلم تطوير تطبيقات الويب من الصفر',
      descriptionEn: 'Complete course to learn web development from scratch',
      price: 499,
      currency: 'SAR',
      fileUrl: '/products/web-dev-course.zip',
      previewUrl: '/previews/web-course.png',
      status: 'active',
      downloads: 89,
      rating: 4.9
    }
  ];

  for (const product of productData) {
    await db.insert(products).values(product);
  }
  console.log(`Seeded ${productData.length} products`);

  // Seed Services
  const serviceData = [
    {
      sellerId: 1,
      categoryId: 1,
      titleAr: 'تصميم موقع إلكتروني احترافي',
      titleEn: 'Professional Website Design',
      descriptionAr: 'تصميم موقع إلكتروني احترافي متجاوب مع جميع الأجهزة',
      descriptionEn: 'Professional responsive website design for all devices',
      basicPrice: 500,
      standardPrice: 1000,
      premiumPrice: 2000,
      basicDeliveryDays: 7,
      standardDeliveryDays: 14,
      premiumDeliveryDays: 21,
      currency: 'SAR',
      status: 'active',
      ordersCount: 25,
      rating: 4.8
    },
    {
      sellerId: 1,
      categoryId: 2,
      titleAr: 'تطوير تطبيق جوال',
      titleEn: 'Mobile App Development',
      descriptionAr: 'تطوير تطبيق جوال احترافي لنظامي iOS و Android',
      descriptionEn: 'Professional mobile app development for iOS and Android',
      basicPrice: 2000,
      standardPrice: 5000,
      premiumPrice: 10000,
      basicDeliveryDays: 30,
      standardDeliveryDays: 60,
      premiumDeliveryDays: 90,
      currency: 'SAR',
      status: 'active',
      ordersCount: 12,
      rating: 4.9
    },
    {
      sellerId: 1,
      categoryId: 3,
      titleAr: 'كتابة محتوى تسويقي',
      titleEn: 'Marketing Content Writing',
      descriptionAr: 'كتابة محتوى تسويقي احترافي لموقعك أو منتجك',
      descriptionEn: 'Professional marketing content for your website or product',
      basicPrice: 100,
      standardPrice: 250,
      premiumPrice: 500,
      basicDeliveryDays: 3,
      standardDeliveryDays: 5,
      premiumDeliveryDays: 7,
      currency: 'SAR',
      status: 'active',
      ordersCount: 67,
      rating: 4.7
    }
  ];

  for (const service of serviceData) {
    await db.insert(services).values(service);
  }
  console.log(`Seeded ${serviceData.length} services`);

  // Seed Jobs
  const jobData = [
    {
      employerId: 1,
      categoryId: 1,
      titleAr: 'مطلوب مطور ويب لبناء منصة تعليمية',
      titleEn: 'Web Developer Needed for Educational Platform',
      descriptionAr: 'نحتاج مطور ويب محترف لبناء منصة تعليمية كاملة',
      descriptionEn: 'We need a professional web developer to build a complete educational platform',
      budget: 15000,
      currency: 'SAR',
      duration: 90,
      skillsRequired: 'React, Node.js, MongoDB, AWS',
      status: 'open',
      bidsCount: 8,
      views: 156
    },
    {
      employerId: 1,
      categoryId: 2,
      titleAr: 'مصمم جرافيك لتصميم هوية تجارية',
      titleEn: 'Graphic Designer for Brand Identity',
      descriptionAr: 'نبحث عن مصمم جرافيك محترف لتصميم هوية تجارية كاملة',
      descriptionEn: 'Looking for professional graphic designer for complete brand identity',
      budget: 3000,
      currency: 'SAR',
      duration: 30,
      skillsRequired: 'Adobe Illustrator, Photoshop, Brand Design',
      status: 'open',
      bidsCount: 15,
      views: 234
    },
    {
      employerId: 1,
      categoryId: 3,
      titleAr: 'كاتب محتوى لمدونة تقنية',
      titleEn: 'Content Writer for Tech Blog',
      descriptionAr: 'نحتاج كاتب محتوى محترف للكتابة في مدونة تقنية',
      descriptionEn: 'We need professional content writer for tech blog',
      budget: 2000,
      currency: 'SAR',
      duration: 60,
      skillsRequired: 'Arabic Writing, SEO, Technology Knowledge',
      status: 'open',
      bidsCount: 23,
      views: 189
    }
  ];

  for (const job of jobData) {
    await db.insert(jobs).values(job);
  }
  console.log(`Seeded ${jobData.length} jobs`);

  console.log('Full seed data completed!');
}

seedFullData().catch(console.error);
