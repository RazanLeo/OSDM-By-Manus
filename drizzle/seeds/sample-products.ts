import { createConnection } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { products } from '../schema';

async function seedSampleProducts() {
  console.log('🌱 Starting sample products seeding...');
  
  const connection = await createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  const sampleProducts = [
    {
      sellerId: 1,
      categoryId: 1,
      titleAr: 'كتاب إلكتروني: دليل التسويق الرقمي',
      titleEn: 'E-Book: Digital Marketing Guide',
      descriptionAr: 'دليل شامل للتسويق الرقمي يغطي جميع الاستراتيجيات الحديثة',
      descriptionEn: 'Comprehensive digital marketing guide covering all modern strategies',
      price: 99,
      currency: 'SAR',
      coverImage: 'https://picsum.photos/seed/product1/400/300',
      fileUrl: 'https://example.com/files/product1.pdf',
      downloads: 245,
      views: 1250,
      rating: 4.8,
      reviewsCount: 42,
      status: 'active',
      isActive: true,
    },
    {
      sellerId: 1,
      categoryId: 2,
      titleAr: 'قالب تصميم: واجهة تطبيق جوال',
      titleEn: 'Design Template: Mobile App UI',
      descriptionAr: 'قالب تصميم احترافي لواجهة تطبيق جوال مع 50+ شاشة',
      descriptionEn: 'Professional mobile app UI template with 50+ screens',
      price: 199,
      currency: 'SAR',
      coverImage: 'https://picsum.photos/seed/product2/400/300',
      fileUrl: 'https://example.com/files/product2.zip',
      downloads: 189,
      views: 980,
      rating: 4.9,
      reviewsCount: 35,
      status: 'active',
      isActive: true,
    },
    {
      sellerId: 1,
      categoryId: 3,
      titleAr: 'مقاطع صوتية: موسيقى خلفية للفيديو',
      titleEn: 'Audio Tracks: Background Music for Videos',
      descriptionAr: 'مجموعة من 20 مقطع موسيقي خلفي احترافي',
      descriptionEn: 'Collection of 20 professional background music tracks',
      price: 149,
      currency: 'SAR',
      coverImage: 'https://picsum.photos/seed/product3/400/300',
      fileUrl: 'https://example.com/files/product3.zip',
      downloads: 312,
      views: 1450,
      rating: 4.7,
      reviewsCount: 58,
      status: 'active',
      isActive: true,
    },
    {
      sellerId: 1,
      categoryId: 1,
      titleAr: 'كتاب: أساسيات البرمجة بلغة Python',
      titleEn: 'Book: Python Programming Basics',
      descriptionAr: 'كتاب تعليمي شامل للمبتدئين في البرمجة بلغة Python',
      descriptionEn: 'Comprehensive tutorial book for Python programming beginners',
      price: 129,
      currency: 'SAR',
      coverImage: 'https://picsum.photos/seed/product4/400/300',
      fileUrl: 'https://example.com/files/product4.pdf',
      downloads: 421,
      views: 2100,
      rating: 4.9,
      reviewsCount: 87,
      status: 'active',
      isActive: true,
    },
    {
      sellerId: 1,
      categoryId: 2,
      titleAr: 'حزمة أيقونات: 500 أيقونة احترافية',
      titleEn: 'Icon Pack: 500 Professional Icons',
      descriptionAr: 'حزمة شاملة من 500 أيقونة احترافية بصيغ متعددة',
      descriptionEn: 'Comprehensive pack of 500 professional icons in multiple formats',
      price: 79,
      currency: 'SAR',
      coverImage: 'https://picsum.photos/seed/product5/400/300',
      fileUrl: 'https://example.com/files/product5.zip',
      downloads: 567,
      views: 2890,
      rating: 4.8,
      reviewsCount: 102,
      status: 'active',
      isActive: true,
    },
    {
      sellerId: 1,
      categoryId: 3,
      titleAr: 'مؤثرات صوتية: حزمة الألعاب',
      titleEn: 'Sound Effects: Gaming Pack',
      descriptionAr: 'أكثر من 100 مؤثر صوتي احترافي للألعاب',
      descriptionEn: 'Over 100 professional sound effects for games',
      price: 169,
      currency: 'SAR',
      coverImage: 'https://picsum.photos/seed/product6/400/300',
      fileUrl: 'https://example.com/files/product6.zip',
      downloads: 234,
      views: 1120,
      rating: 4.6,
      reviewsCount: 45,
      status: 'active',
      isActive: true,
    },
    {
      sellerId: 1,
      categoryId: 1,
      titleAr: 'دورة تدريبية: التصوير الفوتوغرافي الاحترافي',
      titleEn: 'Course: Professional Photography',
      descriptionAr: 'دورة شاملة في التصوير الفوتوغرافي الاحترافي مع 50 درس',
      descriptionEn: 'Comprehensive professional photography course with 50 lessons',
      price: 299,
      currency: 'SAR',
      coverImage: 'https://picsum.photos/seed/product7/400/300',
      fileUrl: 'https://example.com/files/product7.zip',
      downloads: 156,
      views: 890,
      rating: 4.9,
      reviewsCount: 67,
      status: 'active',
      isActive: true,
    },
    {
      sellerId: 1,
      categoryId: 2,
      titleAr: 'قوالب بريزنتيشن: حزمة الأعمال',
      titleEn: 'Presentation Templates: Business Pack',
      descriptionAr: '30 قالب بريزنتيشن احترافي للأعمال',
      descriptionEn: '30 professional business presentation templates',
      price: 119,
      currency: 'SAR',
      coverImage: 'https://picsum.photos/seed/product8/400/300',
      fileUrl: 'https://example.com/files/product8.zip',
      downloads: 389,
      views: 1670,
      rating: 4.7,
      reviewsCount: 73,
      status: 'active',
      isActive: true,
    },
    {
      sellerId: 1,
      categoryId: 1,
      titleAr: 'كتاب: استراتيجيات التجارة الإلكترونية',
      titleEn: 'Book: E-Commerce Strategies',
      descriptionAr: 'دليل شامل لبناء وتطوير متجر إلكتروني ناجح',
      descriptionEn: 'Comprehensive guide to building and growing a successful online store',
      price: 159,
      currency: 'SAR',
      coverImage: 'https://picsum.photos/seed/product9/400/300',
      fileUrl: 'https://example.com/files/product9.pdf',
      downloads: 278,
      views: 1340,
      rating: 4.8,
      reviewsCount: 56,
      status: 'active',
      isActive: true,
    },
  ];

  for (const product of sampleProducts) {
    await db.insert(products).values(product);
  }

  console.log(`✅ Added ${sampleProducts.length} sample products`);
  console.log('🎉 Sample products seeding completed!');
  
  await connection.end();
}

seedSampleProducts()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

