import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { productCategories, serviceCategories, jobCategories } from '../schema';

/**
 * Simple Categories Seeder for OSDM Platform
 * Creates basic category structure for all 3 markets
 */

async function seedAllCategories() {
  console.log('🌱 Starting categories seeding...\n');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);
  
  try {
    // ========== PRODUCTS MARKET ==========
    console.log('📦 Seeding Products Market...');
    await db.delete(productCategories);
    
    const productCats = [
      { nameAr: 'المحتوى النصي والمكتوب', nameEn: 'Written & Text Content', icon: 'BookText', order: 1 },
      { nameAr: 'المحتوى المرئي البصري', nameEn: 'Visual Content', icon: 'Image', order: 2 },
      { nameAr: 'المحتوى السمعي الصوتي', nameEn: 'Audio Content', icon: 'Headphones', order: 3 },
      { nameAr: 'المحتوى المرئي المتحرك والفيديو', nameEn: 'Video Content', icon: 'Video', order: 4 },
      { nameAr: 'المحتوى التفاعلي والرقمي', nameEn: 'Interactive Digital Content', icon: 'MousePointer', order: 5 },
      { nameAr: 'محتوى البرمجة والتقنية', nameEn: 'Programming & Technical Content', icon: 'Code', order: 6 },
      { nameAr: 'المنتجات الرقمية المتخصصة', nameEn: 'Specialized Digital Products', icon: 'Sparkles', order: 7 },
      { nameAr: 'الخدمات الاشتراكية والعضويات', nameEn: 'Subscription Services', icon: 'CreditCard', order: 8 }
    ];
    
    for (const cat of productCats) {
      await db.insert(productCategories).values(cat);
    }
    console.log('✅ Products: 8 main categories');
    
    // ========== SERVICES MARKET ==========
    console.log('\n📦 Seeding Services Market...');
    await db.delete(serviceCategories);
    
    const serviceCats = [
      { nameAr: 'خدمات الكتابة والمحتوى', nameEn: 'Writing & Content Services', icon: 'PenTool', order: 1 },
      { nameAr: 'خدمات التصميم والإبداع', nameEn: 'Design & Creative Services', icon: 'Palette', order: 2 },
      { nameAr: 'خدمات الصوت والفيديو', nameEn: 'Audio & Video Services', icon: 'Video', order: 3 },
      { nameAr: 'خدمات البرمجة والتطوير', nameEn: 'Programming & Development Services', icon: 'Code', order: 4 },
      { nameAr: 'خدمات التسويق والأعمال', nameEn: 'Marketing & Business Services', icon: 'TrendingUp', order: 5 },
      { nameAr: 'خدمات التعليم والتدريب', nameEn: 'Education & Training Services', icon: 'GraduationCap', order: 6 },
      { nameAr: 'الخدمات المتخصصة', nameEn: 'Specialized Services', icon: 'Wrench', order: 7 },
      { nameAr: 'الخدمات الحية', nameEn: 'Live Services', icon: 'Radio', order: 8 }
    ];
    
    for (const cat of serviceCats) {
      await db.insert(serviceCategories).values(cat);
    }
    console.log('✅ Services: 8 main categories');
    
    // ========== JOBS MARKET ==========
    console.log('\n📦 Seeding Jobs Market...');
    await db.delete(jobCategories);
    
    const jobCats = [
      { nameAr: 'الكتابة والمحتوى', nameEn: 'Writing & Content', icon: 'PenTool', order: 1 },
      { nameAr: 'التصميم والإبداع', nameEn: 'Design & Creative', icon: 'Palette', order: 2 },
      { nameAr: 'الصوت والفيديو', nameEn: 'Audio & Video', icon: 'Video', order: 3 },
      { nameAr: 'البرمجة والتطوير', nameEn: 'Programming & Development', icon: 'Code', order: 4 },
      { nameAr: 'التسويق الرقمي والأعمال', nameEn: 'Digital Marketing & Business', icon: 'TrendingUp', order: 5 },
      { nameAr: 'التعليم والتدريب', nameEn: 'Education & Training', icon: 'GraduationCap', order: 6 },
      { nameAr: 'الخدمات المتخصصة', nameEn: 'Specialized Services', icon: 'Wrench', order: 7 },
      { nameAr: 'الخدمات الحية', nameEn: 'Live Services', icon: 'Radio', order: 8 }
    ];
    
    for (const cat of jobCats) {
      await db.insert(jobCategories).values(cat);
    }
    console.log('✅ Jobs: 8 main categories');
    
    console.log('\n🎉 ========================================');
    console.log('🎉 CATEGORIES SEEDING COMPLETED!');
    console.log('🎉 ========================================');
    console.log('📊 Total: 24 main categories created');
    console.log('🌟 All categories seeded successfully!\n');
    
  } finally {
    await connection.end();
  }
}

// Run the seeder
seedAllCategories()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

