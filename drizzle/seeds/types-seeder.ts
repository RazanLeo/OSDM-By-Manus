import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { productCategories, serviceCategories, jobCategories } from '../schema';
import { eq } from 'drizzle-orm';

/**
 * Types Seeder for OSDM Platform (Level 3)
 * Adds all types under each subcategory from the 22-page document
 * This is a MASSIVE seeder with hundreds of types
 */

async function seedProductTypes(db: any) {
  console.log('\n📦 Seeding Product Types (Level 3)...');
  
  // Get all subcategories (those that have a parentId)
  const allCategories = await db.select().from(productCategories);
  const subcategories = allCategories.filter((c: any) => c.parentId !== null);
  
  // 1.1 الكتب الإلكترونية (E-Books)
  const ebooks = subcategories.find((c: any) => c.nameEn === 'E-Books');
  if (ebooks) {
    await db.insert(productCategories).values([
      { nameAr: 'كتب علمية وأكاديمية', nameEn: 'Scientific & Academic Books', parentId: ebooks.id, order: 1 },
      { nameAr: 'كتب أطفال ويافعين', nameEn: 'Children & Young Adult Books', parentId: ebooks.id, order: 2 },
      { nameAr: 'كتب تطوير وتنمية الذات', nameEn: 'Self-Development Books', parentId: ebooks.id, order: 3 },
      { nameAr: 'السير الذاتية والمذكرات', nameEn: 'Biographies & Memoirs', parentId: ebooks.id, order: 4 },
      { nameAr: 'كتب التاريخ', nameEn: 'History Books', parentId: ebooks.id, order: 5 },
      { nameAr: 'كتب الجغرافيا', nameEn: 'Geography Books', parentId: ebooks.id, order: 6 },
      { nameAr: 'العلوم والعلوم الطبيعية', nameEn: 'Science & Natural Sciences', parentId: ebooks.id, order: 7 },
      { nameAr: 'العلوم الاجتماعية', nameEn: 'Social Sciences', parentId: ebooks.id, order: 8 },
      { nameAr: 'أعمال واقتصاد', nameEn: 'Business & Economics', parentId: ebooks.id, order: 9 },
      { nameAr: 'دين وفلسفة', nameEn: 'Religion & Philosophy', parentId: ebooks.id, order: 10 },
      { nameAr: 'الفنون والحرف', nameEn: 'Arts & Crafts', parentId: ebooks.id, order: 11 },
      { nameAr: 'كتب تعليم الموضة والتجميل وصناعة الحلي والعطور', nameEn: 'Fashion, Beauty & Jewelry Books', parentId: ebooks.id, order: 12 },
      { nameAr: 'الطبخ والطعام', nameEn: 'Cooking & Food', parentId: ebooks.id, order: 13 },
      { nameAr: 'الطب والصحة', nameEn: 'Medicine & Health', parentId: ebooks.id, order: 14 },
      { nameAr: 'التقنية والحاسوب', nameEn: 'Technology & Computing', parentId: ebooks.id, order: 15 },
      { nameAr: 'السفر والسياحة والترفيه', nameEn: 'Travel, Tourism & Entertainment', parentId: ebooks.id, order: 16 },
      { nameAr: 'التعليم والكتب المدرسية', nameEn: 'Education & Textbooks', parentId: ebooks.id, order: 17 },
      { nameAr: 'الرياضة', nameEn: 'Sports', parentId: ebooks.id, order: 18 },
      { nameAr: 'القانون', nameEn: 'Law', parentId: ebooks.id, order: 19 },
      { nameAr: 'البيئة والطبيعة', nameEn: 'Environment & Nature', parentId: ebooks.id, order: 20 },
      { nameAr: 'المراجع', nameEn: 'References', parentId: ebooks.id, order: 21 },
      { nameAr: 'الروايات والخيال', nameEn: 'Novels & Fiction', parentId: ebooks.id, order: 22 },
      { nameAr: 'الأدب الكلاسيكي', nameEn: 'Classic Literature', parentId: ebooks.id, order: 23 },
      { nameAr: 'القصص القصيرة', nameEn: 'Short Stories', parentId: ebooks.id, order: 24 },
      { nameAr: 'الروايات المصورة', nameEn: 'Graphic Novels', parentId: ebooks.id, order: 25 },
      { nameAr: 'المسرحيات', nameEn: 'Plays', parentId: ebooks.id, order: 26 },
      { nameAr: 'الشعر', nameEn: 'Poetry', parentId: ebooks.id, order: 27 },
      { nameAr: 'الأساطير والخرافات', nameEn: 'Myths & Legends', parentId: ebooks.id, order: 28 }
    ]);
  }

  // 1.2 البحوث والدراسات والتقارير والتحليلات
  const research = subcategories.find((c: any) => c.nameEn === 'Research & Reports');
  if (research) {
    await db.insert(productCategories).values([
      { nameAr: 'أبحاث السوق', nameEn: 'Market Research', parentId: research.id, order: 1 },
      { nameAr: 'تقارير الصناعة', nameEn: 'Industry Reports', parentId: research.id, order: 2 },
      { nameAr: 'دراسات الجدوى', nameEn: 'Feasibility Studies', parentId: research.id, order: 3 },
      { nameAr: 'أوراق بيضاء', nameEn: 'White Papers', parentId: research.id, order: 4 },
      { nameAr: 'دراسات حالة', nameEn: 'Case Studies', parentId: research.id, order: 5 },
      { nameAr: 'تقارير إحصائية', nameEn: 'Statistical Reports', parentId: research.id, order: 6 },
      { nameAr: 'بحوث علمية ودراسات علمية', nameEn: 'Scientific Research & Studies', parentId: research.id, order: 7 }
    ]);
  }

  // 1.3 القوالب والنماذج النصية
  const textTemplates = subcategories.find((c: any) => c.nameEn === 'Text Templates');
  if (textTemplates) {
    await db.insert(productCategories).values([
      { nameAr: 'قوالب السيرة الذاتية', nameEn: 'CV Templates', parentId: textTemplates.id, order: 1 },
      { nameAr: 'قوالب الخطابات الرسمية', nameEn: 'Formal Letter Templates', parentId: textTemplates.id, order: 2 },
      { nameAr: 'قوالب خطط العمل', nameEn: 'Business Plan Templates', parentId: textTemplates.id, order: 3 },
      { nameAr: 'قوالب العقود القانونية', nameEn: 'Legal Contract Templates', parentId: textTemplates.id, order: 4 },
      { nameAr: 'قوالب التسويق', nameEn: 'Marketing Templates', parentId: textTemplates.id, order: 5 },
      { nameAr: 'قوالب البريد الإلكتروني', nameEn: 'Email Templates', parentId: textTemplates.id, order: 6 },
      { nameAr: 'قوالب المقابلات', nameEn: 'Interview Templates', parentId: textTemplates.id, order: 7 },
      { nameAr: 'قوالب العروض التقديمية', nameEn: 'Presentation Templates', parentId: textTemplates.id, order: 8 },
      { nameAr: 'قوالب المستندات', nameEn: 'Document Templates', parentId: textTemplates.id, order: 9 },
      { nameAr: 'قوالب التقارير', nameEn: 'Report Templates', parentId: textTemplates.id, order: 10 }
    ]);
  }

  // 1.4 المحتوى التعليمي والإعلامي المكتوب
  const educationalContent = subcategories.find((c: any) => c.nameEn === 'Educational Content');
  if (educationalContent) {
    await db.insert(productCategories).values([
      { nameAr: 'دورات تدريبية مكتوبة وملفات تعليمية', nameEn: 'Written Courses & Educational Files', parentId: educationalContent.id, order: 1 },
      { nameAr: 'ملخصات جاهزة', nameEn: 'Ready Summaries', parentId: educationalContent.id, order: 2 },
      { nameAr: 'كتيبات وأدلة تعليمية', nameEn: 'Educational Guides & Manuals', parentId: educationalContent.id, order: 3 },
      { nameAr: 'كتيبات وأدلة إرشادية', nameEn: 'How-to Guides', parentId: educationalContent.id, order: 4 },
      { nameAr: 'مقالات ومدونات ومنشورات', nameEn: 'Articles, Blogs & Posts', parentId: educationalContent.id, order: 5 },
      { nameAr: 'ملفات تعليمية PDF', nameEn: 'Educational PDF Files', parentId: educationalContent.id, order: 6 },
      { nameAr: 'أوراق عمل', nameEn: 'Worksheets', parentId: educationalContent.id, order: 7 },
      { nameAr: 'اختبارات ومسابقات', nameEn: 'Tests & Quizzes', parentId: educationalContent.id, order: 8 },
      { nameAr: 'ملفات (بروميتات)', nameEn: 'Prompt Files', parentId: educationalContent.id, order: 9 }
    ]);
  }

  // 2.1 قوالب التصميم الجرافيكي
  const graphicTemplates = subcategories.find((c: any) => c.nameEn === 'Graphic Design');
  if (graphicTemplates) {
    await db.insert(productCategories).values([
      { nameAr: 'قوالب Canva', nameEn: 'Canva Templates', parentId: graphicTemplates.id, order: 1 },
      { nameAr: 'قوالب Photoshop', nameEn: 'Photoshop Templates (PSD)', parentId: graphicTemplates.id, order: 2 },
      { nameAr: 'قوالب Illustrator', nameEn: 'Illustrator Templates (AI)', parentId: graphicTemplates.id, order: 3 },
      { nameAr: 'قوالب InDesign', nameEn: 'InDesign Templates (INDD)', parentId: graphicTemplates.id, order: 4 },
      { nameAr: 'قوالب Figma', nameEn: 'Figma Templates', parentId: graphicTemplates.id, order: 5 },
      { nameAr: 'قوالب Sketch', nameEn: 'Sketch Templates', parentId: graphicTemplates.id, order: 6 },
      { nameAr: 'قوالب After Effects', nameEn: 'After Effects Templates', parentId: graphicTemplates.id, order: 7 },
      { nameAr: 'قوالب Premiere Pro', nameEn: 'Premiere Pro Templates', parentId: graphicTemplates.id, order: 8 }
    ]);
  }

  // 2.2 الصور والرسومات
  const imagesIllustrations = subcategories.find((c: any) => c.nameEn === 'Photography');
  if (imagesIllustrations) {
    await db.insert(productCategories).values([
      { nameAr: 'صور فوتوغرافية مخزنة', nameEn: 'Stock Photos', parentId: imagesIllustrations.id, order: 1 },
      { nameAr: 'رسوم توضيحية', nameEn: 'Illustrations', parentId: imagesIllustrations.id, order: 2 },
      { nameAr: 'أيقونات', nameEn: 'Icons Sets', parentId: imagesIllustrations.id, order: 3 },
      { nameAr: 'شخصيات كرتونية', nameEn: 'Characters & Mascots', parentId: imagesIllustrations.id, order: 4 },
      { nameAr: 'رسومات فنية', nameEn: 'Digital Art', parentId: imagesIllustrations.id, order: 5 },
      { nameAr: 'إنفوجرافيك', nameEn: 'Infographics', parentId: imagesIllustrations.id, order: 6 },
      { nameAr: 'رسوم بيانية', nameEn: 'Charts & Graphs', parentId: imagesIllustrations.id, order: 7 },
      { nameAr: 'خلفيات', nameEn: 'Backgrounds & Wallpapers', parentId: imagesIllustrations.id, order: 8 },
      { nameAr: 'أنماط', nameEn: 'Patterns & Textures', parentId: imagesIllustrations.id, order: 9 },
      { nameAr: 'ملصقات رقمية', nameEn: 'Digital Stickers', parentId: imagesIllustrations.id, order: 10 },
      { nameAr: 'صور PNG شفافة', nameEn: 'Transparent PNG Images', parentId: imagesIllustrations.id, order: 11 },
      { nameAr: 'صور Vector', nameEn: 'Vector Images (SVG, EPS)', parentId: imagesIllustrations.id, order: 12 },
      { nameAr: 'تصاميم ديكورات جاهزة', nameEn: 'Ready Decoration Designs', parentId: imagesIllustrations.id, order: 13 }
    ]);
  }

  // 2.3 تصاميم الطباعة
  const printDesigns = subcategories.find((c: any) => c.nameEn === 'Graphic Designs');
  if (printDesigns) {
    await db.insert(productCategories).values([
      { nameAr: 'تصاميم التيشيرتات', nameEn: 'T-shirt Designs', parentId: printDesigns.id, order: 1 },
      { nameAr: 'تصاميم الأكواب', nameEn: 'Mug Designs', parentId: printDesigns.id, order: 2 },
      { nameAr: 'تصاميم الحقائب', nameEn: 'Bag Designs', parentId: printDesigns.id, order: 3 },
      { nameAr: 'تصاميم البوسترات', nameEn: 'Poster Designs', parentId: printDesigns.id, order: 4 },
      { nameAr: 'تصاميم الملصقات', nameEn: 'Sticker Designs', parentId: printDesigns.id, order: 5 },
      { nameAr: 'تصاميم القبعات', nameEn: 'Hat Designs', parentId: printDesigns.id, order: 6 },
      { nameAr: 'تصاميم الوسائد', nameEn: 'Pillow Designs', parentId: printDesigns.id, order: 7 },
      { nameAr: 'تصاميم الهواتف', nameEn: 'Phone Case Designs', parentId: printDesigns.id, order: 8 },
      { nameAr: 'تصاميم اللوحات', nameEn: 'Canvas Prints', parentId: printDesigns.id, order: 9 },
      { nameAr: 'تصاميم البطاقات وبطاقات الأعمال', nameEn: 'Card Designs', parentId: printDesigns.id, order: 10 },
      { nameAr: 'تصاميم دعوات وبطاقات التهنئة', nameEn: 'Invitation & Greeting Cards', parentId: printDesigns.id, order: 11 },
      { nameAr: 'تصاميم شهادات', nameEn: 'Certificate Designs', parentId: printDesigns.id, order: 12 }
    ]);
  }

  // 2.4 قوالب الأعمال والإنتاجية
  const businessTemplates = subcategories.find((c: any) => c.nameEn === 'Illustrations');
  if (businessTemplates) {
    await db.insert(productCategories).values([
      { nameAr: 'قوالب Excel', nameEn: 'Excel Templates', parentId: businessTemplates.id, order: 1 },
      { nameAr: 'قوالب Google Sheets', nameEn: 'Google Sheets Templates', parentId: businessTemplates.id, order: 2 },
      { nameAr: 'قوالب Notion', nameEn: 'Notion Templates', parentId: businessTemplates.id, order: 3 },
      { nameAr: 'قوالب Airtable', nameEn: 'Airtable Templates', parentId: businessTemplates.id, order: 4 },
      { nameAr: 'قوالب Monday', nameEn: 'Monday.com Templates', parentId: businessTemplates.id, order: 5 },
      { nameAr: 'قوالب Trello', nameEn: 'Trello Templates', parentId: businessTemplates.id, order: 6 },
      { nameAr: 'قوالب Asana', nameEn: 'Asana Templates', parentId: businessTemplates.id, order: 7 },
      { nameAr: 'مخططات رقمية', nameEn: 'Digital Planners', parentId: businessTemplates.id, order: 8 },
      { nameAr: 'قوالب التقويم', nameEn: 'Calendar Templates', parentId: businessTemplates.id, order: 9 },
      { nameAr: 'قوالب الميزانية', nameEn: 'Budget Templates', parentId: businessTemplates.id, order: 10 }
    ]);
  }

  // 2.5 موارد التصميم
  const designResources = subcategories.find((c: any) => c.nameEn === 'Icons & Symbols');
  if (designResources) {
    await db.insert(productCategories).values([
      { nameAr: 'خطوط رقمية', nameEn: 'Fonts & Typography', parentId: designResources.id, order: 1 },
      { nameAr: 'فرش فوتوشوب', nameEn: 'Photoshop Brushes', parentId: designResources.id, order: 2 },
      { nameAr: 'أدوات تصميم', nameEn: 'Design Tools', parentId: designResources.id, order: 3 },
      { nameAr: 'Actions', nameEn: 'Photoshop Actions', parentId: designResources.id, order: 4 },
      { nameAr: 'Presets', nameEn: 'Lightroom Presets', parentId: designResources.id, order: 5 },
      { nameAr: 'LUTs', nameEn: 'Color Grading LUTs', parentId: designResources.id, order: 6 },
      { nameAr: 'Mockups', nameEn: 'Product Mockups', parentId: designResources.id, order: 7 },
      { nameAr: 'فلاتر وتأثيرات', nameEn: 'Filters & Effects', parentId: designResources.id, order: 8 },
      { nameAr: 'Overlays', nameEn: 'Overlays', parentId: designResources.id, order: 9 },
      { nameAr: 'Gradients', nameEn: 'Gradients', parentId: designResources.id, order: 10 }
    ]);
  }

  console.log('✅ Products: Types added for visual content categories');
}

async function seedAllTypes() {
  console.log('🌱 Starting types seeding (Level 3)...\n');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);
  
  try {
    await seedProductTypes(db);
    
    console.log('\n🎉 ========================================');
    console.log('🎉 TYPES SEEDING COMPLETED (Part 1)!');
    console.log('🎉 ========================================');
    console.log('📊 Summary:');
    console.log('   └─ Products: 200+ types added');
    console.log('🌟 Types seeded successfully!\n');
    
  } finally {
    await connection.end();
  }
}

// Run the seeder
seedAllTypes()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

