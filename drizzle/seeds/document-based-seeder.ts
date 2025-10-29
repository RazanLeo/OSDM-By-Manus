import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { productCategories } from '../schema';
import { isNull } from 'drizzle-orm';

/**
 * DOCUMENT-BASED SEEDER - 100% من المستند الأصلي
 * 8 تصنيفات أساسية + 25 فرعي + 273 نوع = 306 تصنيف
 */

async function seedProductsFromDocument() {
  console.log('🌱 Starting DOCUMENT-BASED seeding...\n');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);
  
  try {
    // حذف جميع التصنيفات القديمة
    await db.delete(productCategories);
    console.log('🗑️  Cleared old categories\n');
    
    let totalMain = 0;
    let totalSub = 0;
    let totalTypes = 0;
    
    // 1. المحتوى النصي والمكتوب - Written & Text Content
    const [main1Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى النصي والمكتوب',
      nameEn: 'Written & Text Content',
      icon: 'BookText',
      order: 1
    });
    const main1Id = main1Result.insertId;
    totalMain++;
    console.log(`  ✓ Written & Text Content`);
    
    // 1.1 الكتب الإلكترونية
    const [sub1_1Result] = await db.insert(productCategories).values({
      nameAr: 'الكتب الإلكترونية',
      nameEn: 'E-Books',
      parentId: main1Id,
      icon: 'Book',
      order: 1
    });
    const sub1_1Id = sub1_1Result.insertId;
    totalSub++;
    
    // الأنواع (28)
    const types1_1 = [
      { nameAr: 'كتب علمية وأكاديمية', nameEn: 'كتب علمية وأكاديمية', parentId: sub1_1Id, order: 1 },
      { nameAr: 'كتب أطفال واليافعين', nameEn: 'كتب أطفال واليافعين', parentId: sub1_1Id, order: 2 },
      { nameAr: 'كتب تطوير وتنمية الذات', nameEn: 'كتب تطوير وتنمية الذات', parentId: sub1_1Id, order: 3 },
      { nameAr: 'السير الذاتية والمذكرات', nameEn: 'السير الذاتية والمذكرات', parentId: sub1_1Id, order: 4 },
      { nameAr: 'كتب التاريخ', nameEn: 'كتب التاريخ', parentId: sub1_1Id, order: 5 },
      { nameAr: 'كتب الجغرافيا', nameEn: 'كتب الجغرافيا', parentId: sub1_1Id, order: 6 },
      { nameAr: 'العلوم والعلوم الطبيعية', nameEn: 'العلوم والعلوم الطبيعية', parentId: sub1_1Id, order: 7 },
      { nameAr: 'العلوم الاجتماعية', nameEn: 'العلوم الاجتماعية', parentId: sub1_1Id, order: 8 },
      { nameAr: 'أعمال واقتصاد', nameEn: 'أعمال واقتصاد', parentId: sub1_1Id, order: 9 },
      { nameAr: 'دين وفلسفة', nameEn: 'دين وفلسفة', parentId: sub1_1Id, order: 10 },
      { nameAr: 'الفنون والحرف', nameEn: 'الفنون والحرف', parentId: sub1_1Id, order: 11 },
      { nameAr: 'كتب تعليم الموضة والتجميل وصناعة الحلي والعطور', nameEn: 'كتب تعليم الموضة والتجميل وصناعة الحلي والعطور', parentId: sub1_1Id, order: 12 },
      { nameAr: 'الطبخ والطعام', nameEn: 'الطبخ والطعام', parentId: sub1_1Id, order: 13 },
      { nameAr: 'الطب والصحة', nameEn: 'الطب والصحة', parentId: sub1_1Id, order: 14 },
      { nameAr: 'التقنية والحاسوب', nameEn: 'التقنية والحاسوب', parentId: sub1_1Id, order: 15 },
      { nameAr: 'السفر والسياحة والترفيه', nameEn: 'السفر والسياحة والترفيه', parentId: sub1_1Id, order: 16 },
      { nameAr: 'التعليم والكتب المدرسية', nameEn: 'التعليم والكتب المدرسية', parentId: sub1_1Id, order: 17 },
      { nameAr: 'الرياضة', nameEn: 'الرياضة', parentId: sub1_1Id, order: 18 },
      { nameAr: 'القانون', nameEn: 'القانون', parentId: sub1_1Id, order: 19 },
      { nameAr: 'البيئة والطبيعة', nameEn: 'البيئة والطبيعة', parentId: sub1_1Id, order: 20 },
      { nameAr: 'المراجع', nameEn: 'المراجع', parentId: sub1_1Id, order: 21 },
      { nameAr: 'الروايات والخيال', nameEn: 'الروايات والخيال', parentId: sub1_1Id, order: 22 },
      { nameAr: 'الأدب الكلاسيكي', nameEn: 'الأدب الكلاسيكي', parentId: sub1_1Id, order: 23 },
      { nameAr: 'القصص القصيرة', nameEn: 'القصص القصيرة', parentId: sub1_1Id, order: 24 },
      { nameAr: 'الروايات المصورة', nameEn: 'الروايات المصورة', parentId: sub1_1Id, order: 25 },
      { nameAr: 'المسرحيات', nameEn: 'المسرحيات', parentId: sub1_1Id, order: 26 },
      { nameAr: 'الشعر', nameEn: 'الشعر', parentId: sub1_1Id, order: 27 },
      { nameAr: 'الأساطير والخرافات', nameEn: 'الأساطير والخرافات', parentId: sub1_1Id, order: 28 },
    ];
    for (const type of types1_1) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 28 types`);
    
    // 1.2 البحوث والدراسات والتقارير والتحليلات
    const [sub1_2Result] = await db.insert(productCategories).values({
      nameAr: 'البحوث والدراسات والتقارير والتحليلات',
      nameEn: 'Research & Reports',
      parentId: main1Id,
      icon: 'FileText',
      order: 2
    });
    const sub1_2Id = sub1_2Result.insertId;
    totalSub++;
    
    // الأنواع (7)
    const types1_2 = [
      { nameAr: 'أبحاث السوق', nameEn: 'أبحاث السوق', parentId: sub1_2Id, order: 1 },
      { nameAr: 'تقارير الصناعة', nameEn: 'تقارير الصناعة', parentId: sub1_2Id, order: 2 },
      { nameAr: 'دراسات الجدوى', nameEn: 'دراسات الجدوى', parentId: sub1_2Id, order: 3 },
      { nameAr: 'أوراق بيضاء', nameEn: 'أوراق بيضاء', parentId: sub1_2Id, order: 4 },
      { nameAr: 'دراسات حالة', nameEn: 'دراسات حالة', parentId: sub1_2Id, order: 5 },
      { nameAr: 'تقارير إحصائية', nameEn: 'تقارير إحصائية', parentId: sub1_2Id, order: 6 },
      { nameAr: 'بحوث علمية ودراسات علمية', nameEn: 'بحوث علمية ودراسات علمية', parentId: sub1_2Id, order: 7 },
    ];
    for (const type of types1_2) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 7 types`);
    
    // 1.3 القوالب والنماذج النصية
    const [sub1_3Result] = await db.insert(productCategories).values({
      nameAr: 'القوالب والنماذج النصية',
      nameEn: 'Text Templates',
      parentId: main1Id,
      icon: 'FileType',
      order: 3
    });
    const sub1_3Id = sub1_3Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types1_3 = [
      { nameAr: 'قوالب السيرة الذاتية', nameEn: 'قوالب السيرة الذاتية', parentId: sub1_3Id, order: 1 },
      { nameAr: 'قوالب الخطابات الرسمية', nameEn: 'قوالب الخطابات الرسمية', parentId: sub1_3Id, order: 2 },
      { nameAr: 'قوالب خطط العمل', nameEn: 'قوالب خطط العمل', parentId: sub1_3Id, order: 3 },
      { nameAr: 'قوالب العقود القانونية', nameEn: 'قوالب العقود القانونية', parentId: sub1_3Id, order: 4 },
      { nameAr: 'قوالب التسويق', nameEn: 'قوالب التسويق', parentId: sub1_3Id, order: 5 },
      { nameAr: 'قوالب البريد الإلكتروني', nameEn: 'قوالب البريد الإلكتروني', parentId: sub1_3Id, order: 6 },
      { nameAr: 'قوالب الفواتير', nameEn: 'قوالب الفواتير', parentId: sub1_3Id, order: 7 },
      { nameAr: 'قوالب العروض التقديمية', nameEn: 'قوالب العروض التقديمية', parentId: sub1_3Id, order: 8 },
      { nameAr: 'قوالب المستندات', nameEn: 'قوالب المستندات', parentId: sub1_3Id, order: 9 },
      { nameAr: 'قوالب التقارير', nameEn: 'قوالب التقارير', parentId: sub1_3Id, order: 10 },
    ];
    for (const type of types1_3) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 1.4 المحتوى التعليمي والإعلامي المكتوب
    const [sub1_4Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى التعليمي والإعلامي المكتوب',
      nameEn: 'Educational Content',
      parentId: main1Id,
      icon: 'GraduationCap',
      order: 4
    });
    const sub1_4Id = sub1_4Result.insertId;
    totalSub++;
    
    // الأنواع (9)
    const types1_4 = [
      { nameAr: 'دورات تدريبية مكتوبة وملفات تعليمية', nameEn: 'دورات تدريبية مكتوبة وملفات تعليمية', parentId: sub1_4Id, order: 1 },
      { nameAr: 'ملخصات جاهزة', nameEn: 'ملخصات جاهزة', parentId: sub1_4Id, order: 2 },
      { nameAr: 'كتيبات وأدلة تعليمية', nameEn: 'كتيبات وأدلة تعليمية', parentId: sub1_4Id, order: 3 },
      { nameAr: 'كتيبات وأدلة إرشادية', nameEn: 'كتيبات وأدلة إرشادية', parentId: sub1_4Id, order: 4 },
      { nameAr: 'مقالات ومدونات ومنشورات', nameEn: 'مقالات ومدونات ومنشورات', parentId: sub1_4Id, order: 5 },
      { nameAr: 'ملفات تعليمية', nameEn: 'ملفات تعليمية', parentId: sub1_4Id, order: 6 },
      { nameAr: 'أوراق عمل', nameEn: 'أوراق عمل', parentId: sub1_4Id, order: 7 },
      { nameAr: 'اختبارات ومسابقات', nameEn: 'اختبارات ومسابقات', parentId: sub1_4Id, order: 8 },
      { nameAr: 'ملفات (برومبتات)', nameEn: 'ملفات (برومبتات)', parentId: sub1_4Id, order: 9 },
    ];
    for (const type of types1_4) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 9 types`);
    
    // 2. المحتوى المرئي (البصري) - Visual Content
    const [main2Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى المرئي (البصري)',
      nameEn: 'Visual Content',
      icon: 'Image',
      order: 2
    });
    const main2Id = main2Result.insertId;
    totalMain++;
    console.log(`  ✓ Visual Content`);
    
    // 2.1 قوالب التصميم الجرافيكي
    const [sub2_1Result] = await db.insert(productCategories).values({
      nameAr: 'قوالب التصميم الجرافيكي',
      nameEn: 'Graphic Design Templates',
      parentId: main2Id,
      icon: 'Palette',
      order: 1
    });
    const sub2_1Id = sub2_1Result.insertId;
    totalSub++;
    
    // الأنواع (8)
    const types2_1 = [
      { nameAr: 'قوالب Canva', nameEn: 'قوالب Canva', parentId: sub2_1Id, order: 1 },
      { nameAr: 'قوالب Photoshop', nameEn: 'قوالب Photoshop', parentId: sub2_1Id, order: 2 },
      { nameAr: 'قوالب Illustrator', nameEn: 'قوالب Illustrator', parentId: sub2_1Id, order: 3 },
      { nameAr: 'قوالب InDesign', nameEn: 'قوالب InDesign', parentId: sub2_1Id, order: 4 },
      { nameAr: 'قوالب Figma', nameEn: 'قوالب Figma', parentId: sub2_1Id, order: 5 },
      { nameAr: 'قوالب Sketch', nameEn: 'قوالب Sketch', parentId: sub2_1Id, order: 6 },
      { nameAr: 'قوالب After Effects', nameEn: 'قوالب After Effects', parentId: sub2_1Id, order: 7 },
      { nameAr: 'قوالب Premiere Pro', nameEn: 'قوالب Premiere Pro', parentId: sub2_1Id, order: 8 },
    ];
    for (const type of types2_1) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 8 types`);
    
    // 2.2 الصور والرسومات
    const [sub2_2Result] = await db.insert(productCategories).values({
      nameAr: 'الصور والرسومات',
      nameEn: 'Images & Graphics',
      parentId: main2Id,
      icon: 'Image',
      order: 2
    });
    const sub2_2Id = sub2_2Result.insertId;
    totalSub++;
    
    // الأنواع (13)
    const types2_2 = [
      { nameAr: 'صور فوتوغرافية مخزنة', nameEn: 'صور فوتوغرافية مخزنة', parentId: sub2_2Id, order: 1 },
      { nameAr: 'رسوم توضيحية', nameEn: 'رسوم توضيحية', parentId: sub2_2Id, order: 2 },
      { nameAr: 'أيقونات', nameEn: 'أيقونات', parentId: sub2_2Id, order: 3 },
      { nameAr: 'شخصيات كرتونية', nameEn: 'شخصيات كرتونية', parentId: sub2_2Id, order: 4 },
      { nameAr: 'رسومات فنية', nameEn: 'رسومات فنية', parentId: sub2_2Id, order: 5 },
      { nameAr: 'إنفوجرافيك', nameEn: 'إنفوجرافيك', parentId: sub2_2Id, order: 6 },
      { nameAr: 'رسوم بيانية', nameEn: 'رسوم بيانية', parentId: sub2_2Id, order: 7 },
      { nameAr: 'خلفيات', nameEn: 'خلفيات', parentId: sub2_2Id, order: 8 },
      { nameAr: 'أنماط', nameEn: 'أنماط', parentId: sub2_2Id, order: 9 },
      { nameAr: 'ملصقات رقمية', nameEn: 'ملصقات رقمية', parentId: sub2_2Id, order: 10 },
      { nameAr: 'صور PNG شفافة', nameEn: 'صور PNG شفافة', parentId: sub2_2Id, order: 11 },
      { nameAr: 'صور Vector', nameEn: 'صور Vector', parentId: sub2_2Id, order: 12 },
      { nameAr: 'تصاميم ديكورات جاهزة', nameEn: 'تصاميم ديكورات جاهزة', parentId: sub2_2Id, order: 13 },
    ];
    for (const type of types2_2) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 13 types`);
    
    // 2.3 تصاميم الطباعة
    const [sub2_3Result] = await db.insert(productCategories).values({
      nameAr: 'تصاميم الطباعة',
      nameEn: 'Print Designs',
      parentId: main2Id,
      icon: 'Printer',
      order: 3
    });
    const sub2_3Id = sub2_3Result.insertId;
    totalSub++;
    
    // الأنواع (12)
    const types2_3 = [
      { nameAr: 'تصاميم التيشيرتات', nameEn: 'تصاميم التيشيرتات', parentId: sub2_3Id, order: 1 },
      { nameAr: 'تصاميم الأكواب', nameEn: 'تصاميم الأكواب', parentId: sub2_3Id, order: 2 },
      { nameAr: 'تصاميم الحقائب', nameEn: 'تصاميم الحقائب', parentId: sub2_3Id, order: 3 },
      { nameAr: 'تصاميم البوسترات', nameEn: 'تصاميم البوسترات', parentId: sub2_3Id, order: 4 },
      { nameAr: 'تصاميم الملصقات', nameEn: 'تصاميم الملصقات', parentId: sub2_3Id, order: 5 },
      { nameAr: 'تصاميم القبعات', nameEn: 'تصاميم القبعات', parentId: sub2_3Id, order: 6 },
      { nameAr: 'تصاميم الوسائد', nameEn: 'تصاميم الوسائد', parentId: sub2_3Id, order: 7 },
      { nameAr: 'تصاميم الهواتف', nameEn: 'تصاميم الهواتف', parentId: sub2_3Id, order: 8 },
      { nameAr: 'تصاميم اللوحات', nameEn: 'تصاميم اللوحات', parentId: sub2_3Id, order: 9 },
      { nameAr: 'تصاميم البطاقات وبطاقات الأعمال', nameEn: 'تصاميم البطاقات وبطاقات الأعمال', parentId: sub2_3Id, order: 10 },
      { nameAr: 'تصاميم دعوات وبطاقات التهنئة', nameEn: 'تصاميم دعوات وبطاقات التهنئة', parentId: sub2_3Id, order: 11 },
      { nameAr: 'تصاميم شهادات', nameEn: 'تصاميم شهادات', parentId: sub2_3Id, order: 12 },
    ];
    for (const type of types2_3) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 12 types`);
    
    // 2.4 قوالب الأعمال والإنتاجية
    const [sub2_4Result] = await db.insert(productCategories).values({
      nameAr: 'قوالب الأعمال والإنتاجية',
      nameEn: 'Business Templates',
      parentId: main2Id,
      icon: 'Briefcase',
      order: 4
    });
    const sub2_4Id = sub2_4Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types2_4 = [
      { nameAr: 'قوالب Excel', nameEn: 'قوالب Excel', parentId: sub2_4Id, order: 1 },
      { nameAr: 'قوالب Google Sheets', nameEn: 'قوالب Google Sheets', parentId: sub2_4Id, order: 2 },
      { nameAr: 'قوالب Notion', nameEn: 'قوالب Notion', parentId: sub2_4Id, order: 3 },
      { nameAr: 'قوالب Airtable', nameEn: 'قوالب Airtable', parentId: sub2_4Id, order: 4 },
      { nameAr: 'قوالب Monday', nameEn: 'قوالب Monday', parentId: sub2_4Id, order: 5 },
      { nameAr: 'قوالب Trello', nameEn: 'قوالب Trello', parentId: sub2_4Id, order: 6 },
      { nameAr: 'قوالب Asana', nameEn: 'قوالب Asana', parentId: sub2_4Id, order: 7 },
      { nameAr: 'Digital Planners', nameEn: 'Digital Planners', parentId: sub2_4Id, order: 8 },
      { nameAr: 'قوالب التقويم', nameEn: 'قوالب التقويم', parentId: sub2_4Id, order: 9 },
      { nameAr: 'قوالب الميزانية', nameEn: 'قوالب الميزانية', parentId: sub2_4Id, order: 10 },
    ];
    for (const type of types2_4) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 2.5 موارد التصميم
    const [sub2_5Result] = await db.insert(productCategories).values({
      nameAr: 'موارد التصميم',
      nameEn: 'Design Resources',
      parentId: main2Id,
      icon: 'Sparkles',
      order: 5
    });
    const sub2_5Id = sub2_5Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types2_5 = [
      { nameAr: 'خطوط رقمية', nameEn: 'خطوط رقمية', parentId: sub2_5Id, order: 1 },
      { nameAr: 'فُرَش فوتوشوب', nameEn: 'فُرَش فوتوشوب', parentId: sub2_5Id, order: 2 },
      { nameAr: 'أدوات تصميم', nameEn: 'أدوات تصميم', parentId: sub2_5Id, order: 3 },
      { nameAr: 'Actions', nameEn: 'Actions', parentId: sub2_5Id, order: 4 },
      { nameAr: 'Presets', nameEn: 'Presets', parentId: sub2_5Id, order: 5 },
      { nameAr: 'LUTs', nameEn: 'LUTs', parentId: sub2_5Id, order: 6 },
      { nameAr: 'Mockups', nameEn: 'Mockups', parentId: sub2_5Id, order: 7 },
      { nameAr: 'فلاتر وتأثيرات', nameEn: 'فلاتر وتأثيرات', parentId: sub2_5Id, order: 8 },
      { nameAr: 'Overlays', nameEn: 'Overlays', parentId: sub2_5Id, order: 9 },
      { nameAr: 'Gradients', nameEn: 'Gradients', parentId: sub2_5Id, order: 10 },
    ];
    for (const type of types2_5) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 3. المحتوى السمعي (الصوتي) - Audio Content
    const [main3Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى السمعي (الصوتي)',
      nameEn: 'Audio Content',
      icon: 'Headphones',
      order: 3
    });
    const main3Id = main3Result.insertId;
    totalMain++;
    console.log(`  ✓ Audio Content`);
    
    // 3.1 الموسيقى والمؤثرات الصوتية
    const [sub3_1Result] = await db.insert(productCategories).values({
      nameAr: 'الموسيقى والمؤثرات الصوتية',
      nameEn: 'Music & Sound Effects',
      parentId: main3Id,
      icon: 'Music',
      order: 1
    });
    const sub3_1Id = sub3_1Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types3_1 = [
      { nameAr: 'موسيقى خالية من حقوق الملكية', nameEn: 'موسيقى خالية من حقوق الملكية', parentId: sub3_1Id, order: 1 },
      { nameAr: 'موسيقى خلفية', nameEn: 'موسيقى خلفية', parentId: sub3_1Id, order: 2 },
      { nameAr: 'موسيقى تصويرية', nameEn: 'موسيقى تصويرية', parentId: sub3_1Id, order: 3 },
      { nameAr: 'مؤثرات صوتية', nameEn: 'مؤثرات صوتية', parentId: sub3_1Id, order: 4 },
      { nameAr: 'أصوات طبيعية', nameEn: 'أصوات طبيعية', parentId: sub3_1Id, order: 5 },
      { nameAr: 'أصوات المدينة', nameEn: 'أصوات المدينة', parentId: sub3_1Id, order: 6 },
      { nameAr: 'Loops موسيقية', nameEn: 'Loops موسيقية', parentId: sub3_1Id, order: 7 },
      { nameAr: 'Beats', nameEn: 'Beats', parentId: sub3_1Id, order: 8 },
      { nameAr: 'نغمات رنين', nameEn: 'نغمات رنين', parentId: sub3_1Id, order: 9 },
      { nameAr: 'تنبيهات صوتية', nameEn: 'تنبيهات صوتية', parentId: sub3_1Id, order: 10 },
    ];
    for (const type of types3_1) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 3.2 المحتوى الصوتي التعليمي والترفيهي
    const [sub3_2Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى الصوتي التعليمي والترفيهي',
      nameEn: 'Educational Audio',
      parentId: main3Id,
      icon: 'Mic',
      order: 2
    });
    const sub3_2Id = sub3_2Result.insertId;
    totalSub++;
    
    // الأنواع (11)
    const types3_2 = [
      { nameAr: 'كتب صوتية', nameEn: 'كتب صوتية', parentId: sub3_2Id, order: 1 },
      { nameAr: 'بودكاست مسجل', nameEn: 'بودكاست مسجل', parentId: sub3_2Id, order: 2 },
      { nameAr: 'دروس صوتية', nameEn: 'دروس صوتية', parentId: sub3_2Id, order: 3 },
      { nameAr: 'محاضرات مسجلة', nameEn: 'محاضرات مسجلة', parentId: sub3_2Id, order: 4 },
      { nameAr: 'قصص وروايات صوتية', nameEn: 'قصص وروايات صوتية', parentId: sub3_2Id, order: 5 },
      { nameAr: 'تأملات موجهة', nameEn: 'تأملات موجهة', parentId: sub3_2Id, order: 6 },
      { nameAr: 'ملفات استرخاء وتأملات', nameEn: 'ملفات استرخاء وتأملات', parentId: sub3_2Id, order: 7 },
      { nameAr: 'ملفات ASMR', nameEn: 'ملفات ASMR', parentId: sub3_2Id, order: 8 },
      { nameAr: 'دورات تدريبية صوتية', nameEn: 'دورات تدريبية صوتية', parentId: sub3_2Id, order: 9 },
      { nameAr: 'ندوات مسجلة وموارد تعليمية', nameEn: 'ندوات مسجلة وموارد تعليمية', parentId: sub3_2Id, order: 10 },
      { nameAr: 'أغاني', nameEn: 'أغاني', parentId: sub3_2Id, order: 11 },
    ];
    for (const type of types3_2) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 11 types`);
    
    // 4. المحتوى المرئي المتحرك (الفيديو) - Video Content
    const [main4Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى المرئي المتحرك (الفيديو)',
      nameEn: 'Video Content',
      icon: 'Video',
      order: 4
    });
    const main4Id = main4Result.insertId;
    totalMain++;
    console.log(`  ✓ Video Content`);
    
    // 4.1 لقطات ومقاطع الفيديو
    const [sub4_1Result] = await db.insert(productCategories).values({
      nameAr: 'لقطات ومقاطع الفيديو',
      nameEn: 'Stock Videos',
      parentId: main4Id,
      icon: 'Film',
      order: 1
    });
    const sub4_1Id = sub4_1Result.insertId;
    totalSub++;
    
    // الأنواع (11)
    const types4_1 = [
      { nameAr: 'لقطات فيديو مخزنة', nameEn: 'لقطات فيديو مخزنة', parentId: sub4_1Id, order: 1 },
      { nameAr: 'مقاطع فيديو قصيرة', nameEn: 'مقاطع فيديو قصيرة', parentId: sub4_1Id, order: 2 },
      { nameAr: 'مقاطع فيديو طويلة', nameEn: 'مقاطع فيديو طويلة', parentId: sub4_1Id, order: 3 },
      { nameAr: 'فيديو خلفيات متحركة', nameEn: 'فيديو خلفيات متحركة', parentId: sub4_1Id, order: 4 },
      { nameAr: 'فلاتر تأثيرات فيديو جاهزة', nameEn: 'فلاتر تأثيرات فيديو جاهزة', parentId: sub4_1Id, order: 5 },
      { nameAr: 'مقاطع Drone', nameEn: 'مقاطع Drone', parentId: sub4_1Id, order: 6 },
      { nameAr: 'مقاطع Time-lapse', nameEn: 'مقاطع Time-lapse', parentId: sub4_1Id, order: 7 },
      { nameAr: 'مقاطع Slow Motion', nameEn: 'مقاطع Slow Motion', parentId: sub4_1Id, order: 8 },
      { nameAr: 'مقاطع 360 درجة', nameEn: 'مقاطع 360 درجة', parentId: sub4_1Id, order: 9 },
      { nameAr: 'مقاطع VR', nameEn: 'مقاطع VR', parentId: sub4_1Id, order: 10 },
      { nameAr: 'مقاطع Green Screen', nameEn: 'مقاطع Green Screen', parentId: sub4_1Id, order: 11 },
    ];
    for (const type of types4_1) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 11 types`);
    
    // 4.2 قوالب الفيديو والموشن جرافيك
    const [sub4_2Result] = await db.insert(productCategories).values({
      nameAr: 'قوالب الفيديو والموشن جرافيك',
      nameEn: 'Video Templates',
      parentId: main4Id,
      icon: 'Clapperboard',
      order: 2
    });
    const sub4_2Id = sub4_2Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types4_2 = [
      { nameAr: 'قوالب المقدمات', nameEn: 'قوالب المقدمات', parentId: sub4_2Id, order: 1 },
      { nameAr: 'قوالب الخاتمات', nameEn: 'قوالب الخاتمات', parentId: sub4_2Id, order: 2 },
      { nameAr: 'قوالب العناوين', nameEn: 'قوالب العناوين', parentId: sub4_2Id, order: 3 },
      { nameAr: 'قوالب الانتقالات', nameEn: 'قوالب الانتقالات', parentId: sub4_2Id, order: 4 },
      { nameAr: 'قوالب Lower Thirds', nameEn: 'قوالب Lower Thirds', parentId: sub4_2Id, order: 5 },
      { nameAr: 'قوالب الإعلانات', nameEn: 'قوالب الإعلانات', parentId: sub4_2Id, order: 6 },
      { nameAr: 'قوالب السوشيال ميديا', nameEn: 'قوالب السوشيال ميديا', parentId: sub4_2Id, order: 7 },
      { nameAr: 'رسوم متحركة جاهزة', nameEn: 'رسوم متحركة جاهزة', parentId: sub4_2Id, order: 8 },
      { nameAr: 'قوالب الشرح', nameEn: 'قوالب الشرح', parentId: sub4_2Id, order: 9 },
      { nameAr: 'قوالب العروض المتحركة', nameEn: 'قوالب العروض المتحركة', parentId: sub4_2Id, order: 10 },
    ];
    for (const type of types4_2) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 4.3 المحتوى التعليمي المرئي
    const [sub4_3Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى التعليمي المرئي',
      nameEn: 'Educational Videos',
      parentId: main4Id,
      icon: 'PlayCircle',
      order: 3
    });
    const sub4_3Id = sub4_3Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types4_3 = [
      { nameAr: 'دورات فيديو مسجلة', nameEn: 'دورات فيديو مسجلة', parentId: sub4_3Id, order: 1 },
      { nameAr: 'شروحات تعليمية', nameEn: 'شروحات تعليمية', parentId: sub4_3Id, order: 2 },
      { nameAr: 'محاضرات مسجلة', nameEn: 'محاضرات مسجلة', parentId: sub4_3Id, order: 3 },
      { nameAr: 'ورش عمل مسجلة', nameEn: 'ورش عمل مسجلة', parentId: sub4_3Id, order: 4 },
      { nameAr: 'ندوات مسجلة', nameEn: 'ندوات مسجلة', parentId: sub4_3Id, order: 5 },
      { nameAr: 'دروس مسجلة', nameEn: 'دروس مسجلة', parentId: sub4_3Id, order: 6 },
      { nameAr: 'أفلام وثائقية', nameEn: 'أفلام وثائقية', parentId: sub4_3Id, order: 7 },
      { nameAr: 'فيديوهات How-to', nameEn: 'فيديوهات How-to', parentId: sub4_3Id, order: 8 },
      { nameAr: 'مراجعات منتجات', nameEn: 'مراجعات منتجات', parentId: sub4_3Id, order: 9 },
      { nameAr: 'دليل استخدام مرئي', nameEn: 'دليل استخدام مرئي', parentId: sub4_3Id, order: 10 },
    ];
    for (const type of types4_3) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 5. المحتوى التفاعلي والرقمي - Interactive Digital Content
    const [main5Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى التفاعلي والرقمي',
      nameEn: 'Interactive Digital Content',
      icon: 'MousePointer',
      order: 5
    });
    const main5Id = main5Result.insertId;
    totalMain++;
    console.log(`  ✓ Interactive Digital Content`);
    
    // 5.1 الألعاب والتطبيقات الجاهزة
    const [sub5_1Result] = await db.insert(productCategories).values({
      nameAr: 'الألعاب والتطبيقات الجاهزة',
      nameEn: 'Games & Apps',
      parentId: main5Id,
      icon: 'Gamepad2',
      order: 1
    });
    const sub5_1Id = sub5_1Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types5_1 = [
      { nameAr: 'ألعاب بسيطة', nameEn: 'ألعاب بسيطة', parentId: sub5_1Id, order: 1 },
      { nameAr: 'ألعاب تعليمية', nameEn: 'ألعاب تعليمية', parentId: sub5_1Id, order: 2 },
      { nameAr: 'ألعاب الألغاز', nameEn: 'ألعاب الألغاز', parentId: sub5_1Id, order: 3 },
      { nameAr: 'تطبيقات أدوات', nameEn: 'تطبيقات أدوات', parentId: sub5_1Id, order: 4 },
      { nameAr: 'تطبيقات إنتاجية', nameEn: 'تطبيقات إنتاجية', parentId: sub5_1Id, order: 5 },
      { nameAr: 'تطبيقات تعليمية', nameEn: 'تطبيقات تعليمية', parentId: sub5_1Id, order: 6 },
      { nameAr: 'Game Assets', nameEn: 'Game Assets', parentId: sub5_1Id, order: 7 },
      { nameAr: 'Unity Assets', nameEn: 'Unity Assets', parentId: sub5_1Id, order: 8 },
      { nameAr: 'Unreal Assets', nameEn: 'Unreal Assets', parentId: sub5_1Id, order: 9 },
      { nameAr: 'Game Templates', nameEn: 'Game Templates', parentId: sub5_1Id, order: 10 },
    ];
    for (const type of types5_1) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 5.2 المحتويات التفاعلية الأخرى
    const [sub5_2Result] = await db.insert(productCategories).values({
      nameAr: 'المحتويات التفاعلية الأخرى',
      nameEn: 'Other Interactive',
      parentId: main5Id,
      icon: 'Layers',
      order: 2
    });
    const sub5_2Id = sub5_2Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types5_2 = [
      { nameAr: 'استبيانات تفاعلية', nameEn: 'استبيانات تفاعلية', parentId: sub5_2Id, order: 1 },
      { nameAr: 'اختبارات تفاعلية', nameEn: 'اختبارات تفاعلية', parentId: sub5_2Id, order: 2 },
      { nameAr: 'حاسبات تفاعلية', nameEn: 'حاسبات تفاعلية', parentId: sub5_2Id, order: 3 },
      { nameAr: 'خرائط تفاعلية', nameEn: 'خرائط تفاعلية', parentId: sub5_2Id, order: 4 },
      { nameAr: 'عروض تقديمية تفاعلية', nameEn: 'عروض تقديمية تفاعلية', parentId: sub5_2Id, order: 5 },
      { nameAr: 'إنفوجرافيك تفاعلي', nameEn: 'إنفوجرافيك تفاعلي', parentId: sub5_2Id, order: 6 },
      { nameAr: 'جولات افتراضية', nameEn: 'جولات افتراضية', parentId: sub5_2Id, order: 7 },
      { nameAr: 'نماذج تفاعلية', nameEn: 'نماذج تفاعلية', parentId: sub5_2Id, order: 8 },
      { nameAr: 'Timeline تفاعلي', nameEn: 'Timeline تفاعلي', parentId: sub5_2Id, order: 9 },
      { nameAr: 'Dashboard Templates', nameEn: 'Dashboard Templates', parentId: sub5_2Id, order: 10 },
    ];
    for (const type of types5_2) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 6. محتوى البرمجة والتقنية - Programming & Technical Content
    const [main6Result] = await db.insert(productCategories).values({
      nameAr: 'محتوى البرمجة والتقنية',
      nameEn: 'Programming & Technical Content',
      icon: 'Code',
      order: 6
    });
    const main6Id = main6Result.insertId;
    totalMain++;
    console.log(`  ✓ Programming & Technical Content`);
    
    // 6.1 الأكواد والسكريبتات
    const [sub6_1Result] = await db.insert(productCategories).values({
      nameAr: 'الأكواد والسكريبتات',
      nameEn: 'Code & Scripts',
      parentId: main6Id,
      icon: 'Terminal',
      order: 1
    });
    const sub6_1Id = sub6_1Result.insertId;
    totalSub++;
    
    // الأنواع (11)
    const types6_1 = [
      { nameAr: 'قوالب ومقتطفات أكواد جاهزة', nameEn: 'قوالب ومقتطفات أكواد جاهزة', parentId: sub6_1Id, order: 1 },
      { nameAr: 'سكريبتات Python', nameEn: 'سكريبتات Python', parentId: sub6_1Id, order: 2 },
      { nameAr: 'سكريبتات JavaScript', nameEn: 'سكريبتات JavaScript', parentId: sub6_1Id, order: 3 },
      { nameAr: 'سكريبتات PHP', nameEn: 'سكريبتات PHP', parentId: sub6_1Id, order: 4 },
      { nameAr: 'سكريبتات Bash', nameEn: 'سكريبتات Bash', parentId: sub6_1Id, order: 5 },
      { nameAr: 'سكربتات Pine تريدنج فيو', nameEn: 'سكربتات Pine تريدنج فيو', parentId: sub6_1Id, order: 6 },
      { nameAr: 'مقتطفات أكواد', nameEn: 'مقتطفات أكواد', parentId: sub6_1Id, order: 7 },
      { nameAr: 'Regular Expressions', nameEn: 'Regular Expressions', parentId: sub6_1Id, order: 8 },
      { nameAr: 'SQL Queries', nameEn: 'SQL Queries', parentId: sub6_1Id, order: 9 },
      { nameAr: 'API Collections', nameEn: 'API Collections', parentId: sub6_1Id, order: 10 },
      { nameAr: 'Postman Collections', nameEn: 'Postman Collections', parentId: sub6_1Id, order: 11 },
    ];
    for (const type of types6_1) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 11 types`);
    
    // 6.2 الإضافات والمكونات
    const [sub6_2Result] = await db.insert(productCategories).values({
      nameAr: 'الإضافات والمكونات',
      nameEn: 'Plugins & Components',
      parentId: main6Id,
      icon: 'Package',
      order: 2
    });
    const sub6_2Id = sub6_2Result.insertId;
    totalSub++;
    
    // الأنواع (11)
    const types6_2 = [
      { nameAr: 'إضافات WordPress', nameEn: 'إضافات WordPress', parentId: sub6_2Id, order: 1 },
      { nameAr: 'إضافات Shopify', nameEn: 'إضافات Shopify', parentId: sub6_2Id, order: 2 },
      { nameAr: 'إضافات Chrome', nameEn: 'إضافات Chrome', parentId: sub6_2Id, order: 3 },
      { nameAr: 'إضافات VS Code', nameEn: 'إضافات VS Code', parentId: sub6_2Id, order: 4 },
      { nameAr: 'إضافات Photoshop', nameEn: 'إضافات Photoshop', parentId: sub6_2Id, order: 5 },
      { nameAr: 'إضافات Excel', nameEn: 'إضافات Excel', parentId: sub6_2Id, order: 6 },
      { nameAr: 'Libraries', nameEn: 'Libraries', parentId: sub6_2Id, order: 7 },
      { nameAr: 'Frameworks', nameEn: 'Frameworks', parentId: sub6_2Id, order: 8 },
      { nameAr: 'APIs', nameEn: 'APIs', parentId: sub6_2Id, order: 9 },
      { nameAr: 'SDKs', nameEn: 'SDKs', parentId: sub6_2Id, order: 10 },
      { nameAr: 'مكونات إضافية أخرى واضافات متصفح أخرى', nameEn: 'مكونات إضافية أخرى واضافات متصفح أخرى', parentId: sub6_2Id, order: 11 },
    ];
    for (const type of types6_2) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 11 types`);
    
    // 6.3 قوالب التقنية والبيانات
    const [sub6_3Result] = await db.insert(productCategories).values({
      nameAr: 'قوالب التقنية والبيانات',
      nameEn: 'Technical Templates',
      parentId: main6Id,
      icon: 'Database',
      order: 3
    });
    const sub6_3Id = sub6_3Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types6_3 = [
      { nameAr: 'قوالب قواعد البيانات', nameEn: 'قوالب قواعد البيانات', parentId: sub6_3Id, order: 1 },
      { nameAr: 'Docker Templates', nameEn: 'Docker Templates', parentId: sub6_3Id, order: 2 },
      { nameAr: 'Kubernetes Templates', nameEn: 'Kubernetes Templates', parentId: sub6_3Id, order: 3 },
      { nameAr: 'CI/CD Pipelines', nameEn: 'CI/CD Pipelines', parentId: sub6_3Id, order: 4 },
      { nameAr: 'Infrastructure as Code', nameEn: 'Infrastructure as Code', parentId: sub6_3Id, order: 5 },
      { nameAr: 'Cloud Templates', nameEn: 'Cloud Templates', parentId: sub6_3Id, order: 6 },
      { nameAr: 'مؤشرات Trading View', nameEn: 'مؤشرات Trading View', parentId: sub6_3Id, order: 7 },
      { nameAr: 'Expert Advisors', nameEn: 'Expert Advisors', parentId: sub6_3Id, order: 8 },
      { nameAr: 'Blockchain Smart Contracts', nameEn: 'Blockchain Smart Contracts', parentId: sub6_3Id, order: 9 },
      { nameAr: 'Machine Learning Models', nameEn: 'Machine Learning Models', parentId: sub6_3Id, order: 10 },
    ];
    for (const type of types6_3) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 6.4 قوالب المواقع والتطبيقات
    const [sub6_4Result] = await db.insert(productCategories).values({
      nameAr: 'قوالب المواقع والتطبيقات',
      nameEn: 'Web & App Templates',
      parentId: main6Id,
      icon: 'Layout',
      order: 4
    });
    const sub6_4Id = sub6_4Result.insertId;
    totalSub++;
    
    // الأنواع (12)
    const types6_4 = [
      { nameAr: 'قوالب WordPress', nameEn: 'قوالب WordPress', parentId: sub6_4Id, order: 1 },
      { nameAr: 'قوالب Shopify', nameEn: 'قوالب Shopify', parentId: sub6_4Id, order: 2 },
      { nameAr: 'قوالب HTML/CSS', nameEn: 'قوالب HTML/CSS', parentId: sub6_4Id, order: 3 },
      { nameAr: 'قوالب React', nameEn: 'قوالب React', parentId: sub6_4Id, order: 4 },
      { nameAr: 'قوالب Vue', nameEn: 'قوالب Vue', parentId: sub6_4Id, order: 5 },
      { nameAr: 'قوالب Angular', nameEn: 'قوالب Angular', parentId: sub6_4Id, order: 6 },
      { nameAr: 'قوالب Bootstrap', nameEn: 'قوالب Bootstrap', parentId: sub6_4Id, order: 7 },
      { nameAr: 'قوالب Landing Pages', nameEn: 'قوالب Landing Pages', parentId: sub6_4Id, order: 8 },
      { nameAr: 'قوالب Email', nameEn: 'قوالب Email', parentId: sub6_4Id, order: 9 },
      { nameAr: 'قوالب Mobile Apps', nameEn: 'قوالب Mobile Apps', parentId: sub6_4Id, order: 10 },
      { nameAr: 'جميع أنواع قوالب المواقع والتطبيقات الأخرى', nameEn: 'جميع أنواع قوالب المواقع والتطبيقات الأخرى', parentId: sub6_4Id, order: 11 },
      { nameAr: 'حلول وأنظمة برمجية معدة مسبقًا', nameEn: 'حلول وأنظمة برمجية معدة مسبقًا', parentId: sub6_4Id, order: 12 },
    ];
    for (const type of types6_4) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 12 types`);
    
    // 7. المنتجات الرقمية المتخصصة - Specialized Digital Products
    const [main7Result] = await db.insert(productCategories).values({
      nameAr: 'المنتجات الرقمية المتخصصة',
      nameEn: 'Specialized Digital Products',
      icon: 'Sparkles',
      order: 7
    });
    const main7Id = main7Result.insertId;
    totalMain++;
    console.log(`  ✓ Specialized Digital Products`);
    
    // 7.1 الأصول الرقمية و NFTs
    const [sub7_1Result] = await db.insert(productCategories).values({
      nameAr: 'الأصول الرقمية و NFTs',
      nameEn: 'NFTs & Digital Assets',
      parentId: main7Id,
      icon: 'Coins',
      order: 1
    });
    const sub7_1Id = sub7_1Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types7_1 = [
      { nameAr: 'فن رقمي NFT', nameEn: 'فن رقمي NFT', parentId: sub7_1Id, order: 1 },
      { nameAr: 'مقتنيات NFT', nameEn: 'مقتنيات NFT', parentId: sub7_1Id, order: 2 },
      { nameAr: 'NFTs الألعاب', nameEn: 'NFTs الألعاب', parentId: sub7_1Id, order: 3 },
      { nameAr: 'NFTs الموسيقى', nameEn: 'NFTs الموسيقى', parentId: sub7_1Id, order: 4 },
      { nameAr: 'NFTs العقارات الافتراضية', nameEn: 'NFTs العقارات الافتراضية', parentId: sub7_1Id, order: 5 },
      { nameAr: 'أفاتار NFT', nameEn: 'أفاتار NFT', parentId: sub7_1Id, order: 6 },
      { nameAr: 'Domain NFTs', nameEn: 'Domain NFTs', parentId: sub7_1Id, order: 7 },
      { nameAr: 'Membership NFTs', nameEn: 'Membership NFTs', parentId: sub7_1Id, order: 8 },
      { nameAr: 'Utility NFTs', nameEn: 'Utility NFTs', parentId: sub7_1Id, order: 9 },
      { nameAr: 'AR/VR NFTs', nameEn: 'AR/VR NFTs', parentId: sub7_1Id, order: 10 },
    ];
    for (const type of types7_1) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 7.2 المحتوى ثلاثي الأبعاد
    const [sub7_2Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى ثلاثي الأبعاد',
      nameEn: '3D Content',
      parentId: main7Id,
      icon: 'Box',
      order: 2
    });
    const sub7_2Id = sub7_2Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types7_2 = [
      { nameAr: 'نماذج 3D جاهزة', nameEn: 'نماذج 3D جاهزة', parentId: sub7_2Id, order: 1 },
      { nameAr: 'مواد وخامات 3D', nameEn: 'مواد وخامات 3D', parentId: sub7_2Id, order: 2 },
      { nameAr: 'أنيميشن 3D', nameEn: 'أنيميشن 3D', parentId: sub7_2Id, order: 3 },
      { nameAr: 'بيئات 3D', nameEn: 'بيئات 3D', parentId: sub7_2Id, order: 4 },
      { nameAr: 'شخصيات 3D', nameEn: 'شخصيات 3D', parentId: sub7_2Id, order: 5 },
      { nameAr: 'أثاث 3D', nameEn: 'أثاث 3D', parentId: sub7_2Id, order: 6 },
      { nameAr: 'سيارات 3D', nameEn: 'سيارات 3D', parentId: sub7_2Id, order: 7 },
      { nameAr: 'نباتات 3D', nameEn: 'نباتات 3D', parentId: sub7_2Id, order: 8 },
      { nameAr: 'معمار 3D', nameEn: 'معمار 3D', parentId: sub7_2Id, order: 9 },
      { nameAr: 'ملابس 3D', nameEn: 'ملابس 3D', parentId: sub7_2Id, order: 10 },
    ];
    for (const type of types7_2) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 7.3 المحتوى للواقع الافتراضي والمعزز
    const [sub7_3Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى للواقع الافتراضي والمعزز',
      nameEn: 'VR & AR Content',
      parentId: main7Id,
      icon: 'Glasses',
      order: 3
    });
    const sub7_3Id = sub7_3Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types7_3 = [
      { nameAr: 'تطبيقات VR', nameEn: 'تطبيقات VR', parentId: sub7_3Id, order: 1 },
      { nameAr: 'ألعاب VR', nameEn: 'ألعاب VR', parentId: sub7_3Id, order: 2 },
      { nameAr: 'جولات VR', nameEn: 'جولات VR', parentId: sub7_3Id, order: 3 },
      { nameAr: 'تدريب VR', nameEn: 'تدريب VR', parentId: sub7_3Id, order: 4 },
      { nameAr: 'فلاتر AR', nameEn: 'فلاتر AR', parentId: sub7_3Id, order: 5 },
      { nameAr: 'تطبيقات AR', nameEn: 'تطبيقات AR', parentId: sub7_3Id, order: 6 },
      { nameAr: 'ألعاب AR', nameEn: 'ألعاب AR', parentId: sub7_3Id, order: 7 },
      { nameAr: 'كتب AR', nameEn: 'كتب AR', parentId: sub7_3Id, order: 8 },
      { nameAr: 'بطاقات AR', nameEn: 'بطاقات AR', parentId: sub7_3Id, order: 9 },
      { nameAr: 'تجارب Metaverse', nameEn: 'تجارب Metaverse', parentId: sub7_3Id, order: 10 },
    ];
    for (const type of types7_3) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 8. الخدمات الاشتراكية والعضويات - Subscription Services
    const [main8Result] = await db.insert(productCategories).values({
      nameAr: 'الخدمات الاشتراكية والعضويات',
      nameEn: 'Subscription Services',
      icon: 'CreditCard',
      order: 8
    });
    const main8Id = main8Result.insertId;
    totalMain++;
    console.log(`  ✓ Subscription Services`);
    
    // 8.1 المحتوى الاشتراكي
    const [sub8_1Result] = await db.insert(productCategories).values({
      nameAr: 'المحتوى الاشتراكي',
      nameEn: 'Subscription Content',
      parentId: main8Id,
      icon: 'Repeat',
      order: 1
    });
    const sub8_1Id = sub8_1Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types8_1 = [
      { nameAr: 'نشرات إخبارية، مدونات، مقالات مدفوعة', nameEn: 'نشرات إخبارية، مدونات، مقالات مدفوعة', parentId: sub8_1Id, order: 1 },
      { nameAr: 'محتوى حصري', nameEn: 'محتوى حصري', parentId: sub8_1Id, order: 2 },
      { nameAr: 'مكتبات موارد', nameEn: 'مكتبات موارد', parentId: sub8_1Id, order: 3 },
      { nameAr: 'قوالب شهرية', nameEn: 'قوالب شهرية', parentId: sub8_1Id, order: 4 },
      { nameAr: 'Stock Assets اشتراك', nameEn: 'Stock Assets اشتراك', parentId: sub8_1Id, order: 5 },
      { nameAr: 'دورات اشتراكية', nameEn: 'دورات اشتراكية', parentId: sub8_1Id, order: 6 },
      { nameAr: 'Coaching Programs', nameEn: 'Coaching Programs', parentId: sub8_1Id, order: 7 },
      { nameAr: 'Mastermind Groups', nameEn: 'Mastermind Groups', parentId: sub8_1Id, order: 8 },
      { nameAr: 'Community Access', nameEn: 'Community Access', parentId: sub8_1Id, order: 9 },
      { nameAr: 'Premium Support', nameEn: 'Premium Support', parentId: sub8_1Id, order: 10 },
    ];
    for (const type of types8_1) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    // 8.2 منصات SaaS والخدمات السحابية
    const [sub8_2Result] = await db.insert(productCategories).values({
      nameAr: 'منصات SaaS والخدمات السحابية',
      nameEn: 'SaaS Platforms',
      parentId: main8Id,
      icon: 'Cloud',
      order: 2
    });
    const sub8_2Id = sub8_2Result.insertId;
    totalSub++;
    
    // الأنواع (10)
    const types8_2 = [
      { nameAr: 'منصات إدارة المشاريع', nameEn: 'منصات إدارة المشاريع', parentId: sub8_2Id, order: 1 },
      { nameAr: 'منصات CRM', nameEn: 'منصات CRM', parentId: sub8_2Id, order: 2 },
      { nameAr: 'منصات التسويق', nameEn: 'منصات التسويق', parentId: sub8_2Id, order: 3 },
      { nameAr: 'منصات التحليلات', nameEn: 'منصات التحليلات', parentId: sub8_2Id, order: 4 },
      { nameAr: 'منصات التعليم', nameEn: 'منصات التعليم', parentId: sub8_2Id, order: 5 },
      { nameAr: 'منصات المحاسبة', nameEn: 'منصات المحاسبة', parentId: sub8_2Id, order: 6 },
      { nameAr: 'منصات التصميم', nameEn: 'منصات التصميم', parentId: sub8_2Id, order: 7 },
      { nameAr: 'منصات التخزين السحابي', nameEn: 'منصات التخزين السحابي', parentId: sub8_2Id, order: 8 },
      { nameAr: 'منصات الأمان السحابي', nameEn: 'منصات الأمان السحابي', parentId: sub8_2Id, order: 9 },
      { nameAr: 'منصات التواصل', nameEn: 'منصات التواصل', parentId: sub8_2Id, order: 10 },
    ];
    for (const type of types8_2) {
      await db.insert(productCategories).values(type);
      totalTypes++;
    }
    console.log(`    → 10 types`);
    
    console.log('\n🎉 ========================================');
    console.log('🎉 DOCUMENT-BASED SEEDING COMPLETED!');
    console.log('🎉 ========================================');
    console.log(`📊 Total: ${totalMain} main + ${totalSub} sub + ${totalTypes} types = ${totalMain + totalSub + totalTypes}`);
    console.log('🌟 All categories from document seeded!\n');
    
  } finally {
    await connection.end();
  }
}

seedProductsFromDocument()
  .then(() => {
    console.log('✅ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
