import { getDb } from './server/db';
import { products } from './drizzle/schema';

async function seedProducts() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    return;
  }

  console.log('Seeding products...');

  const productData = [
    {
      sellerId: 1,
      categoryId: 1,
      titleAr: 'قالب موقع تجارة إلكترونية احترافي',
      titleEn: 'Professional E-commerce Website Template',
      descriptionAr: 'قالب موقع تجارة إلكترونية كامل مع نظام سلة المشتريات والدفع الإلكتروني. يتضمن لوحة تحكم إدارية، نظام المنتجات، سلة المشتريات، وبوابات الدفع.',
      descriptionEn: 'Complete e-commerce website template with shopping cart and payment system. Includes admin dashboard, product system, shopping cart, and payment gateways.',
      price: 299,
      currency: 'SAR',
      coverImage: '/products/covers/ecommerce-template.jpg',
      images: JSON.stringify(['/products/ecommerce-1.jpg', '/products/ecommerce-2.jpg']),
      demoUrl: 'https://demo.osdm.sa/ecommerce',
      tags: JSON.stringify(['تجارة إلكترونية', 'قالب', 'موقع', 'E-commerce', 'Template']),
      fileUrl: '/products/files/ecommerce-template.zip',
      fileSize: 15000000,
      fileType: 'application/zip',
      downloads: 150,
      views: 1250,
      rating: 48,
      reviewsCount: 35,
      status: 'active',
      isActive: true
    },
    {
      sellerId: 1,
      categoryId: 2,
      titleAr: 'تطبيق جوال للتوصيل - كود كامل',
      titleEn: 'Delivery Mobile App - Full Source Code',
      descriptionAr: 'تطبيق جوال كامل للتوصيل مع لوحة تحكم إدارية. يدعم iOS و Android. يتضمن تتبع الطلبات، الدفع الإلكتروني، والإشعارات الفورية.',
      descriptionEn: 'Complete delivery mobile app with admin dashboard. Supports iOS and Android. Includes order tracking, online payment, and push notifications.',
      price: 1500,
      currency: 'SAR',
      coverImage: '/products/covers/delivery-app.jpg',
      images: JSON.stringify(['/products/delivery-1.jpg', '/products/delivery-2.jpg', '/products/delivery-3.jpg']),
      demoUrl: 'https://demo.osdm.sa/delivery-app',
      tags: JSON.stringify(['تطبيق جوال', 'توصيل', 'Mobile App', 'Delivery']),
      fileUrl: '/products/files/delivery-app.zip',
      fileSize: 50000000,
      fileType: 'application/zip',
      downloads: 45,
      views: 890,
      rating: 49,
      reviewsCount: 18,
      status: 'active',
      isActive: true
    },
    {
      sellerId: 1,
      categoryId: 3,
      titleAr: 'كتاب إلكتروني: دليل التسويق الرقمي الشامل',
      titleEn: 'E-book: Comprehensive Digital Marketing Guide',
      descriptionAr: 'دليل شامل للتسويق الرقمي يغطي جميع جوانب التسويق الإلكتروني: SEO، وسائل التواصل الاجتماعي، الإعلانات المدفوعة، التسويق بالمحتوى، والتحليلات.',
      descriptionEn: 'Comprehensive digital marketing guide covering all aspects: SEO, social media, paid ads, content marketing, and analytics.',
      price: 99,
      currency: 'SAR',
      coverImage: '/products/covers/marketing-book.jpg',
      images: JSON.stringify(['/products/marketing-preview.jpg']),
      tags: JSON.stringify(['كتاب', 'تسويق', 'تسويق رقمي', 'E-book', 'Marketing']),
      fileUrl: '/products/files/marketing-guide.pdf',
      fileSize: 5000000,
      fileType: 'application/pdf',
      downloads: 320,
      views: 2100,
      rating: 47,
      reviewsCount: 89,
      status: 'active',
      isActive: true
    },
    {
      sellerId: 1,
      categoryId: 4,
      titleAr: 'دورة تعليمية: تطوير تطبيقات الويب الحديثة',
      titleEn: 'Course: Modern Web Application Development',
      descriptionAr: 'دورة كاملة لتعلم تطوير تطبيقات الويب من الصفر باستخدام أحدث التقنيات: React، Node.js، MongoDB، وAWS. تتضمن 50 ساعة فيديو و20 مشروع عملي.',
      descriptionEn: 'Complete course to learn web development from scratch using latest technologies: React, Node.js, MongoDB, and AWS. Includes 50 hours of video and 20 practical projects.',
      price: 499,
      currency: 'SAR',
      coverImage: '/products/covers/web-course.jpg',
      images: JSON.stringify(['/products/course-1.jpg', '/products/course-2.jpg']),
      demoUrl: 'https://demo.osdm.sa/web-course',
      tags: JSON.stringify(['دورة', 'تطوير ويب', 'برمجة', 'Course', 'Web Development']),
      fileUrl: '/products/files/web-dev-course.zip',
      fileSize: 25000000,
      fileType: 'application/zip',
      downloads: 89,
      views: 1560,
      rating: 49,
      reviewsCount: 42,
      status: 'active',
      isActive: true
    },
    {
      sellerId: 1,
      categoryId: 5,
      titleAr: 'نظام إدارة محتوى CMS كامل',
      titleEn: 'Complete CMS Content Management System',
      descriptionAr: 'نظام إدارة محتوى كامل بلوحة تحكم احترافية. يدعم المقالات، الصفحات، الوسائط، المستخدمين، والصلاحيات. مبني بتقنيات حديثة.',
      descriptionEn: 'Complete content management system with professional dashboard. Supports articles, pages, media, users, and permissions. Built with modern technologies.',
      price: 799,
      currency: 'SAR',
      coverImage: '/products/covers/cms-system.jpg',
      images: JSON.stringify(['/products/cms-1.jpg', '/products/cms-2.jpg', '/products/cms-3.jpg']),
      demoUrl: 'https://demo.osdm.sa/cms',
      tags: JSON.stringify(['CMS', 'نظام إدارة', 'محتوى', 'Content Management']),
      fileUrl: '/products/files/cms-system.zip',
      fileSize: 35000000,
      fileType: 'application/zip',
      downloads: 67,
      views: 980,
      rating: 48,
      reviewsCount: 28,
      status: 'active',
      isActive: true
    }
  ];

  for (const product of productData) {
    try {
      await db.insert(products).values(product);
      console.log(`✓ Added: ${product.titleEn}`);
    } catch (error) {
      console.error(`✗ Failed to add ${product.titleEn}:`, error);
    }
  }

  console.log(`\nSeeded ${productData.length} products successfully!`);
}

seedProducts().catch(console.error).finally(() => process.exit(0));
