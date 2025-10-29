import { getDb } from '../../server/db';
import { serviceCategories, jobCategories } from '../schema';
import { isNull } from 'drizzle-orm';

async function seedServicesAndJobs() {
  const db = await getDb();
  if (!db) {
    console.error('❌ Database connection failed!');
    process.exit(1);
  }
  
  console.log('🌱 Starting SERVICES & JOBS seeding...');
  
  let totalMain = 0;
  let totalSub = 0;
  let totalTypes = 0;
  
  // ============================================
  // سوق الخدمات (SERVICE CATEGORIES)
  // ============================================
  console.log('\n📦 Seeding SERVICE CATEGORIES...');
  
  // 1. خدمات الكتابة والمحتوى
  const service1Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات الكتابة والمحتوى',
    nameEn: 'Writing & Content Services',
    parentId: null,
    order: 1
  }).returning({ id: serviceCategories.id }))[0].id;
  totalMain++;
  console.log(`  ✓ خدمات الكتابة والمحتوى`);
  
  const service1_1Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات كتابة المحتوى',
    nameEn: 'Content Writing',
    parentId: service1Id,
    order: 1
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (15)
  const types1_1 = [
    { nameAr: 'كتابة المقالات', nameEn: 'كتابة المقالات', parentId: service1_1Id, order: 1 },
    { nameAr: 'كتابة المدونات', nameEn: 'كتابة المدونات', parentId: service1_1Id, order: 2 },
    { nameAr: 'كتابة النصوص التسويقية', nameEn: 'كتابة النصوص التسويقية', parentId: service1_1Id, order: 3 },
    { nameAr: 'أوصاف المنتجات', nameEn: 'أوصاف المنتجات', parentId: service1_1Id, order: 4 },
    { nameAr: 'النصوص الإعلانية', nameEn: 'النصوص الإعلانية', parentId: service1_1Id, order: 5 },
    { nameAr: 'كتابة السيناريوهات', nameEn: 'كتابة السيناريوهات', parentId: service1_1Id, order: 6 },
    { nameAr: 'كتابة البودكاست', nameEn: 'كتابة البودكاست', parentId: service1_1Id, order: 7 },
    { nameAr: 'كتابة المحتوى التقني', nameEn: 'كتابة المحتوى التقني', parentId: service1_1Id, order: 8 },
    { nameAr: 'كتابة المحتوى الطبي', nameEn: 'كتابة المحتوى الطبي', parentId: service1_1Id, order: 9 },
    { nameAr: 'كتابة المحتوى القانوني', nameEn: 'كتابة المحتوى القانوني', parentId: service1_1Id, order: 10 },
    { nameAr: 'Ghost Writing', nameEn: 'Ghost Writing', parentId: service1_1Id, order: 11 },
    { nameAr: 'كتابة السيرة الذاتية', nameEn: 'كتابة السيرة الذاتية', parentId: service1_1Id, order: 12 },
    { nameAr: 'بحوث وتقارير وتحليلات ودراسات', nameEn: 'بحوث وتقارير وتحليلات ودراسات', parentId: service1_1Id, order: 13 },
    { nameAr: 'إعداد محتوى ورش عمل ودورات تدريبية', nameEn: 'إعداد محتوى ورش عمل ودورات تدريبية', parentId: service1_1Id, order: 14 },
    { nameAr: 'محتويات نصية أخرى', nameEn: 'محتويات نصية أخرى', parentId: service1_1Id, order: 15 },
  ];
  await db.insert(serviceCategories).values(types1_1);
  totalTypes += types1_1.length;
  console.log(`    → ${types1_1.length} types`);

  const service1_2Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات التحرير والترجمة',
    nameEn: 'Editing & Translation',
    parentId: service1Id,
    order: 2
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types1_2 = [
    { nameAr: 'التحرير اللغوي', nameEn: 'التحرير اللغوي', parentId: service1_2Id, order: 1 },
    { nameAr: 'التدقيق اللغوي', nameEn: 'التدقيق اللغوي', parentId: service1_2Id, order: 2 },
    { nameAr: 'الترجمة العامة', nameEn: 'الترجمة العامة', parentId: service1_2Id, order: 3 },
    { nameAr: 'الترجمة المتخصصة', nameEn: 'الترجمة المتخصصة', parentId: service1_2Id, order: 4 },
    { nameAr: 'الترجمة الفورية', nameEn: 'الترجمة الفورية', parentId: service1_2Id, order: 5 },
    { nameAr: 'التعريب', nameEn: 'التعريب', parentId: service1_2Id, order: 6 },
    { nameAr: 'Transcription', nameEn: 'Transcription', parentId: service1_2Id, order: 7 },
    { nameAr: 'Subtitling', nameEn: 'Subtitling', parentId: service1_2Id, order: 8 },
    { nameAr: 'إعادة الكتابة', nameEn: 'إعادة الكتابة', parentId: service1_2Id, order: 9 },
    { nameAr: 'التلخيص', nameEn: 'التلخيص', parentId: service1_2Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types1_2);
  totalTypes += types1_2.length;
  console.log(`    → ${types1_2.length} types`);

  // 2. خدمات التصميم والإبداع
  const service2Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات التصميم والإبداع',
    nameEn: 'Design & Creative Services',
    parentId: null,
    order: 2
  }).returning({ id: serviceCategories.id }))[0].id;
  totalMain++;
  console.log(`  ✓ خدمات التصميم والإبداع`);
  
  const service2_1Id = (await db.insert(serviceCategories).values({
    nameAr: 'التصميم الجرافيكي',
    nameEn: 'Graphic Design',
    parentId: service2Id,
    order: 1
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (13)
  const types2_1 = [
    { nameAr: 'تصميم الشعارات', nameEn: 'تصميم الشعارات', parentId: service2_1Id, order: 1 },
    { nameAr: 'الهوية البصرية', nameEn: 'الهوية البصرية', parentId: service2_1Id, order: 2 },
    { nameAr: 'تصميم البوسترات', nameEn: 'تصميم البوسترات', parentId: service2_1Id, order: 3 },
    { nameAr: 'تصميم البروشورات', nameEn: 'تصميم البروشورات', parentId: service2_1Id, order: 4 },
    { nameAr: 'تصميم الكتب', nameEn: 'تصميم الكتب', parentId: service2_1Id, order: 5 },
    { nameAr: 'تصميم الأغلفة', nameEn: 'تصميم الأغلفة', parentId: service2_1Id, order: 6 },
    { nameAr: 'تصميم البطاقات', nameEn: 'تصميم البطاقات', parentId: service2_1Id, order: 7 },
    { nameAr: 'تصميم التغليف', nameEn: 'تصميم التغليف', parentId: service2_1Id, order: 8 },
    { nameAr: 'تصميم الإعلانات', nameEn: 'تصميم الإعلانات', parentId: service2_1Id, order: 9 },
    { nameAr: 'تصميم السوشيال ميديا', nameEn: 'تصميم السوشيال ميديا', parentId: service2_1Id, order: 10 },
    { nameAr: 'تصميم البانرات', nameEn: 'تصميم البانرات', parentId: service2_1Id, order: 11 },
    { nameAr: 'الرسم الرقمي', nameEn: 'الرسم الرقمي', parentId: service2_1Id, order: 12 },
    { nameAr: 'تنقيح وتعديل الصور', nameEn: 'تنقيح وتعديل الصور', parentId: service2_1Id, order: 13 },
  ];
  await db.insert(serviceCategories).values(types2_1);
  totalTypes += types2_1.length;
  console.log(`    → ${types2_1.length} types`);

  const service2_2Id = (await db.insert(serviceCategories).values({
    nameAr: 'التصميم والطباعة',
    nameEn: 'Design & Printing',
    parentId: service2Id,
    order: 2
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (12)
  const types2_2 = [
    { nameAr: 'تصاميم التيشيرتات', nameEn: 'تصاميم التيشيرتات', parentId: service2_2Id, order: 1 },
    { nameAr: 'تصاميم الأكواب', nameEn: 'تصاميم الأكواب', parentId: service2_2Id, order: 2 },
    { nameAr: 'تصاميم الحقائب', nameEn: 'تصاميم الحقائب', parentId: service2_2Id, order: 3 },
    { nameAr: 'تصاميم البوسترات', nameEn: 'تصاميم البوسترات', parentId: service2_2Id, order: 4 },
    { nameAr: 'تصاميم الملصقات', nameEn: 'تصاميم الملصقات', parentId: service2_2Id, order: 5 },
    { nameAr: 'تصاميم القبعات', nameEn: 'تصاميم القبعات', parentId: service2_2Id, order: 6 },
    { nameAr: 'تصاميم الوسائد', nameEn: 'تصاميم الوسائد', parentId: service2_2Id, order: 7 },
    { nameAr: 'تصاميم الهواتف', nameEn: 'تصاميم الهواتف', parentId: service2_2Id, order: 8 },
    { nameAr: 'تصاميم اللوحات', nameEn: 'تصاميم اللوحات', parentId: service2_2Id, order: 9 },
    { nameAr: 'تصاميم البطاقات وبطاقات الأعمال', nameEn: 'تصاميم البطاقات وبطاقات الأعمال', parentId: service2_2Id, order: 10 },
    { nameAr: 'تصاميم دعوات وبطاقات التهنئة', nameEn: 'تصاميم دعوات وبطاقات التهنئة', parentId: service2_2Id, order: 11 },
    { nameAr: 'تصاميم شهادات', nameEn: 'تصاميم شهادات', parentId: service2_2Id, order: 12 },
  ];
  await db.insert(serviceCategories).values(types2_2);
  totalTypes += types2_2.length;
  console.log(`    → ${types2_2.length} types`);

  const service2_3Id = (await db.insert(serviceCategories).values({
    nameAr: 'تصميم المواقع والتطبيقات',
    nameEn: 'Web & App Design',
    parentId: service2Id,
    order: 3
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types2_3 = [
    { nameAr: 'تصميم UI', nameEn: 'تصميم UI', parentId: service2_3Id, order: 1 },
    { nameAr: 'تصميم UX', nameEn: 'تصميم UX', parentId: service2_3Id, order: 2 },
    { nameAr: 'تصميم المواقع', nameEn: 'تصميم المواقع', parentId: service2_3Id, order: 3 },
    { nameAr: 'تصميم التطبيقات', nameEn: 'تصميم التطبيقات', parentId: service2_3Id, order: 4 },
    { nameAr: 'تصميم Dashboard', nameEn: 'تصميم Dashboard', parentId: service2_3Id, order: 5 },
    { nameAr: 'Wireframing', nameEn: 'Wireframing', parentId: service2_3Id, order: 6 },
    { nameAr: 'Prototyping', nameEn: 'Prototyping', parentId: service2_3Id, order: 7 },
    { nameAr: 'تصميم الأيقونات', nameEn: 'تصميم الأيقونات', parentId: service2_3Id, order: 8 },
    { nameAr: 'تصميم التفاعل', nameEn: 'تصميم التفاعل', parentId: service2_3Id, order: 9 },
    { nameAr: 'تصميم الاستجابة', nameEn: 'تصميم الاستجابة', parentId: service2_3Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types2_3);
  totalTypes += types2_3.length;
  console.log(`    → ${types2_3.length} types`);

  // 3. خدمات الصوت والفيديو
  const service3Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات الصوت والفيديو',
    nameEn: 'Audio & Video Services',
    parentId: null,
    order: 3
  }).returning({ id: serviceCategories.id }))[0].id;
  totalMain++;
  console.log(`  ✓ خدمات الصوت والفيديو`);
  
  const service3_1Id = (await db.insert(serviceCategories).values({
    nameAr: 'الخدمات الصوتية',
    nameEn: 'Audio Services',
    parentId: service3Id,
    order: 1
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types3_1 = [
    { nameAr: 'التعليق الصوتي', nameEn: 'التعليق الصوتي', parentId: service3_1Id, order: 1 },
    { nameAr: 'إنتاج البودكاست', nameEn: 'إنتاج البودكاست', parentId: service3_1Id, order: 2 },
    { nameAr: 'تأليف الموسيقى', nameEn: 'تأليف الموسيقى', parentId: service3_1Id, order: 3 },
    { nameAr: 'المؤثرات الصوتية', nameEn: 'المؤثرات الصوتية', parentId: service3_1Id, order: 4 },
    { nameAr: 'الميكساج والماسترنج', nameEn: 'الميكساج والماسترنج', parentId: service3_1Id, order: 5 },
    { nameAr: 'تسجيل وتأليف الأغاني', nameEn: 'تسجيل وتأليف الأغاني', parentId: service3_1Id, order: 6 },
    { nameAr: 'الإنتاج الموسيقي', nameEn: 'الإنتاج الموسيقي', parentId: service3_1Id, order: 7 },
    { nameAr: 'تحرير الصوت', nameEn: 'تحرير الصوت', parentId: service3_1Id, order: 8 },
    { nameAr: 'ترميم الصوت', nameEn: 'ترميم الصوت', parentId: service3_1Id, order: 9 },
    { nameAr: 'Foley Art', nameEn: 'Foley Art', parentId: service3_1Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types3_1);
  totalTypes += types3_1.length;
  console.log(`    → ${types3_1.length} types`);

  const service3_2Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات الفيديو',
    nameEn: 'Video Services',
    parentId: service3Id,
    order: 2
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types3_2 = [
    { nameAr: 'إنتاج الفيديو', nameEn: 'إنتاج الفيديو', parentId: service3_2Id, order: 1 },
    { nameAr: 'تصوير الفعاليات والمناسبات', nameEn: 'تصوير الفعاليات والمناسبات', parentId: service3_2Id, order: 2 },
    { nameAr: 'تصوير المنتجات', nameEn: 'تصوير المنتجات', parentId: service3_2Id, order: 3 },
    { nameAr: 'المونتاج', nameEn: 'المونتاج', parentId: service3_2Id, order: 4 },
    { nameAr: 'الموشن جرافيك', nameEn: 'الموشن جرافيك', parentId: service3_2Id, order: 5 },
    { nameAr: 'الرسوم المتحركة 2D', nameEn: 'الرسوم المتحركة 2D', parentId: service3_2Id, order: 6 },
    { nameAr: 'الرسوم المتحركة 3D', nameEn: 'الرسوم المتحركة 3D', parentId: service3_2Id, order: 7 },
    { nameAr: 'المؤثرات البصرية VFX', nameEn: 'المؤثرات البصرية VFX', parentId: service3_2Id, order: 8 },
    { nameAr: 'تصحيح الألوان', nameEn: 'تصحيح الألوان', parentId: service3_2Id, order: 9 },
    { nameAr: 'البث المباشر', nameEn: 'البث المباشر', parentId: service3_2Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types3_2);
  totalTypes += types3_2.length;
  console.log(`    → ${types3_2.length} types`);

  // 4. خدمات البرمجة والتطوير
  const service4Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات البرمجة والتطوير',
    nameEn: 'Programming & Development',
    parentId: null,
    order: 4
  }).returning({ id: serviceCategories.id }))[0].id;
  totalMain++;
  console.log(`  ✓ خدمات البرمجة والتطوير`);
  
  const service4_1Id = (await db.insert(serviceCategories).values({
    nameAr: 'تطوير المواقع الكاملة',
    nameEn: 'Full Website Development',
    parentId: service4Id,
    order: 1
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (16)
  const types4_1 = [
    { nameAr: 'تطوير Frontend', nameEn: 'تطوير Frontend', parentId: service4_1Id, order: 1 },
    { nameAr: 'تطوير Backend', nameEn: 'تطوير Backend', parentId: service4_1Id, order: 2 },
    { nameAr: 'Full Stack Development', nameEn: 'Full Stack Development', parentId: service4_1Id, order: 3 },
    { nameAr: 'تطوير WordPress', nameEn: 'تطوير WordPress', parentId: service4_1Id, order: 4 },
    { nameAr: 'تطوير Shopify', nameEn: 'تطوير Shopify', parentId: service4_1Id, order: 5 },
    { nameAr: 'تطوير Laravel', nameEn: 'تطوير Laravel', parentId: service4_1Id, order: 6 },
    { nameAr: 'تطوير React', nameEn: 'تطوير React', parentId: service4_1Id, order: 7 },
    { nameAr: 'تطوير Vue', nameEn: 'تطوير Vue', parentId: service4_1Id, order: 8 },
    { nameAr: 'تطوير Angular', nameEn: 'تطوير Angular', parentId: service4_1Id, order: 9 },
    { nameAr: 'تطوير API', nameEn: 'تطوير API', parentId: service4_1Id, order: 10 },
    { nameAr: 'تطوير CMS', nameEn: 'تطوير CMS', parentId: service4_1Id, order: 11 },
    { nameAr: 'صيانة المواقع ودعم فني', nameEn: 'صيانة المواقع ودعم فني', parentId: service4_1Id, order: 12 },
    { nameAr: 'تخصيص  السكربتات والبرمجيات والمكونات الإضافية', nameEn: 'تخصيص  السكربتات والبرمجيات والمكونات الإضافية', parentId: service4_1Id, order: 13 },
    { nameAr: 'حلول مؤسسية متخصصة', nameEn: 'حلول مؤسسية متخصصة', parentId: service4_1Id, order: 14 },
    { nameAr: 'اختبار البرمجيات (Testing).', nameEn: 'اختبار البرمجيات (Testing).', parentId: service4_1Id, order: 15 },
    { nameAr: 'تكامل البرمجي (System Integration)', nameEn: 'تكامل البرمجي (System Integration)', parentId: service4_1Id, order: 16 },
  ];
  await db.insert(serviceCategories).values(types4_1);
  totalTypes += types4_1.length;
  console.log(`    → ${types4_1.length} types`);

  const service4_2Id = (await db.insert(serviceCategories).values({
    nameAr: 'تطوير التطبيقات الكاملة',
    nameEn: 'Full App Development',
    parentId: service4Id,
    order: 2
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types4_2 = [
    { nameAr: 'تطوير iOS', nameEn: 'تطوير iOS', parentId: service4_2Id, order: 1 },
    { nameAr: 'تطوير Android', nameEn: 'تطوير Android', parentId: service4_2Id, order: 2 },
    { nameAr: 'تطوير Cross-Platform', nameEn: 'تطوير Cross-Platform', parentId: service4_2Id, order: 3 },
    { nameAr: 'تطوير Desktop Apps', nameEn: 'تطوير Desktop Apps', parentId: service4_2Id, order: 4 },
    { nameAr: 'تطوير PWA', nameEn: 'تطوير PWA', parentId: service4_2Id, order: 5 },
    { nameAr: 'تطوير الألعاب', nameEn: 'تطوير الألعاب', parentId: service4_2Id, order: 6 },
    { nameAr: 'تطوير VR/AR', nameEn: 'تطوير VR/AR', parentId: service4_2Id, order: 7 },
    { nameAr: 'تطوير IoT', nameEn: 'تطوير IoT', parentId: service4_2Id, order: 8 },
    { nameAr: 'تطوير Blockchain', nameEn: 'تطوير Blockchain', parentId: service4_2Id, order: 9 },
    { nameAr: 'تطوير AI/ML', nameEn: 'تطوير AI/ML', parentId: service4_2Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types4_2);
  totalTypes += types4_2.length;
  console.log(`    → ${types4_2.length} types`);

  // 5. التسويق الرقمي والأعمال
  const service5Id = (await db.insert(serviceCategories).values({
    nameAr: 'التسويق الرقمي والأعمال',
    nameEn: 'Digital Marketing & Business',
    parentId: null,
    order: 5
  }).returning({ id: serviceCategories.id }))[0].id;
  totalMain++;
  console.log(`  ✓ التسويق الرقمي والأعمال`);
  
  const service5_1Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات التسويق الرقمي',
    nameEn: 'Digital Marketing',
    parentId: service5Id,
    order: 1
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (12)
  const types5_1 = [
    { nameAr: 'تحسين محركات البحث SEO', nameEn: 'تحسين محركات البحث SEO', parentId: service5_1Id, order: 1 },
    { nameAr: 'التسويق بالمحتوى', nameEn: 'التسويق بالمحتوى', parentId: service5_1Id, order: 2 },
    { nameAr: 'إدارة السوشيال ميديا', nameEn: 'إدارة السوشيال ميديا', parentId: service5_1Id, order: 3 },
    { nameAr: 'الإعلانات المدفوعة PPC', nameEn: 'الإعلانات المدفوعة PPC', parentId: service5_1Id, order: 4 },
    { nameAr: 'التسويق بالبريد الإلكتروني', nameEn: 'التسويق بالبريد الإلكتروني', parentId: service5_1Id, order: 5 },
    { nameAr: 'التسويق بالعمولة', nameEn: 'التسويق بالعمولة', parentId: service5_1Id, order: 6 },
    { nameAr: 'التسويق بالمؤثرين', nameEn: 'التسويق بالمؤثرين', parentId: service5_1Id, order: 7 },
    { nameAr: 'تحليل البيانات', nameEn: 'تحليل البيانات', parentId: service5_1Id, order: 8 },
    { nameAr: 'استراتيجيات التسويق', nameEn: 'استراتيجيات التسويق', parentId: service5_1Id, order: 9 },
    { nameAr: 'تحسين معدل التحويل CRO', nameEn: 'تحسين معدل التحويل CRO', parentId: service5_1Id, order: 10 },
    { nameAr: 'Growth Hacking', nameEn: 'Growth Hacking', parentId: service5_1Id, order: 11 },
    { nameAr: 'Marketing Automation', nameEn: 'Marketing Automation', parentId: service5_1Id, order: 12 },
  ];
  await db.insert(serviceCategories).values(types5_1);
  totalTypes += types5_1.length;
  console.log(`    → ${types5_1.length} types`);

  const service5_2Id = (await db.insert(serviceCategories).values({
    nameAr: 'الاستشارات والخدمات المهنية',
    nameEn: 'Consulting Services',
    parentId: service5Id,
    order: 2
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (13)
  const types5_2 = [
    { nameAr: 'استشارات الأعمال', nameEn: 'استشارات الأعمال', parentId: service5_2Id, order: 1 },
    { nameAr: 'استشارات التسويق', nameEn: 'استشارات التسويق', parentId: service5_2Id, order: 2 },
    { nameAr: 'استشارات مالية', nameEn: 'استشارات مالية', parentId: service5_2Id, order: 3 },
    { nameAr: 'استشارات تقنية وبرمجية', nameEn: 'استشارات تقنية وبرمجية', parentId: service5_2Id, order: 4 },
    { nameAr: 'استشارات الموارد البشرية', nameEn: 'استشارات الموارد البشرية', parentId: service5_2Id, order: 5 },
    { nameAr: 'استشارات قانونية', nameEn: 'استشارات قانونية', parentId: service5_2Id, order: 6 },
    { nameAr: 'استشارات الإدارة', nameEn: 'استشارات الإدارة', parentId: service5_2Id, order: 7 },
    { nameAr: 'دراسات الجدوى', nameEn: 'دراسات الجدوى', parentId: service5_2Id, order: 8 },
    { nameAr: 'أبحاث السوق', nameEn: 'أبحاث السوق', parentId: service5_2Id, order: 9 },
    { nameAr: 'تخطيط الأعمال', nameEn: 'تخطيط الأعمال', parentId: service5_2Id, order: 10 },
    { nameAr: 'إدارة المشاريع', nameEn: 'إدارة المشاريع', parentId: service5_2Id, order: 11 },
    { nameAr: 'Virtual Assistant', nameEn: 'Virtual Assistant', parentId: service5_2Id, order: 12 },
    { nameAr: 'استشارات توجيه وإرشاد نفسي وذاتي ووعي وتطوير ذاتي', nameEn: 'استشارات توجيه وإرشاد نفسي وذاتي ووعي وتطوير ذاتي', parentId: service5_2Id, order: 13 },
  ];
  await db.insert(serviceCategories).values(types5_2);
  totalTypes += types5_2.length;
  console.log(`    → ${types5_2.length} types`);

  // 6. التعليم والتدريب
  const service6Id = (await db.insert(serviceCategories).values({
    nameAr: 'التعليم والتدريب',
    nameEn: 'Education & Training',
    parentId: null,
    order: 6
  }).returning({ id: serviceCategories.id }))[0].id;
  totalMain++;
  console.log(`  ✓ التعليم والتدريب`);
  
  const service6_1Id = (await db.insert(serviceCategories).values({
    nameAr: 'التدريس والتعليم عبر الإنترنت',
    nameEn: 'Online Teaching',
    parentId: service6Id,
    order: 1
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types6_1 = [
    { nameAr: 'التدريس الخصوصي', nameEn: 'التدريس الخصوصي', parentId: service6_1Id, order: 1 },
    { nameAr: 'تعليم اللغات', nameEn: 'تعليم اللغات', parentId: service6_1Id, order: 2 },
    { nameAr: 'تعليم البرمجة', nameEn: 'تعليم البرمجة', parentId: service6_1Id, order: 3 },
    { nameAr: 'تعليم الموسيقى', nameEn: 'تعليم الموسيقى', parentId: service6_1Id, order: 4 },
    { nameAr: 'تعليم الفنون', nameEn: 'تعليم الفنون', parentId: service6_1Id, order: 5 },
    { nameAr: 'التعليم الأكاديمي', nameEn: 'التعليم الأكاديمي', parentId: service6_1Id, order: 6 },
    { nameAr: 'تعليم المهارات', nameEn: 'تعليم المهارات', parentId: service6_1Id, order: 7 },
    { nameAr: 'تحضير الامتحانات', nameEn: 'تحضير الامتحانات', parentId: service6_1Id, order: 8 },
    { nameAr: 'IELTS/TOEFL', nameEn: 'IELTS/TOEFL', parentId: service6_1Id, order: 9 },
    { nameAr: 'SAT/GRE', nameEn: 'SAT/GRE', parentId: service6_1Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types6_1);
  totalTypes += types6_1.length;
  console.log(`    → ${types6_1.length} types`);

  const service6_2Id = (await db.insert(serviceCategories).values({
    nameAr: 'التدريب والتطوير المهني',
    nameEn: 'Professional Training',
    parentId: service6Id,
    order: 2
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types6_2 = [
    { nameAr: 'Life Coaching', nameEn: 'Life Coaching', parentId: service6_2Id, order: 1 },
    { nameAr: 'Business Coaching', nameEn: 'Business Coaching', parentId: service6_2Id, order: 2 },
    { nameAr: 'Career Coaching', nameEn: 'Career Coaching', parentId: service6_2Id, order: 3 },
    { nameAr: 'Executive Coaching', nameEn: 'Executive Coaching', parentId: service6_2Id, order: 4 },
    { nameAr: 'Leadership Training', nameEn: 'Leadership Training', parentId: service6_2Id, order: 5 },
    { nameAr: 'Soft Skills Training', nameEn: 'Soft Skills Training', parentId: service6_2Id, order: 6 },
    { nameAr: 'Technical Training', nameEn: 'Technical Training', parentId: service6_2Id, order: 7 },
    { nameAr: 'Sales Training', nameEn: 'Sales Training', parentId: service6_2Id, order: 8 },
    { nameAr: 'Customer Service Training', nameEn: 'Customer Service Training', parentId: service6_2Id, order: 9 },
    { nameAr: 'Team Building', nameEn: 'Team Building', parentId: service6_2Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types6_2);
  totalTypes += types6_2.length;
  console.log(`    → ${types6_2.length} types`);

  // 7. الخدمات المتخصصة
  const service7Id = (await db.insert(serviceCategories).values({
    nameAr: 'الخدمات المتخصصة',
    nameEn: 'Specialized Services',
    parentId: null,
    order: 7
  }).returning({ id: serviceCategories.id }))[0].id;
  totalMain++;
  console.log(`  ✓ الخدمات المتخصصة`);
  
  const service7_1Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات البيانات والتحليل',
    nameEn: 'Data & Analytics',
    parentId: service7Id,
    order: 1
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types7_1 = [
    { nameAr: 'تحليل البيانات', nameEn: 'تحليل البيانات', parentId: service7_1Id, order: 1 },
    { nameAr: 'علم البيانات', nameEn: 'علم البيانات', parentId: service7_1Id, order: 2 },
    { nameAr: 'تعلم الآلة', nameEn: 'تعلم الآلة', parentId: service7_1Id, order: 3 },
    { nameAr: 'الذكاء الاصطناعي', nameEn: 'الذكاء الاصطناعي', parentId: service7_1Id, order: 4 },
    { nameAr: 'Business Intelligence', nameEn: 'Business Intelligence', parentId: service7_1Id, order: 5 },
    { nameAr: 'Data Visualization', nameEn: 'Data Visualization', parentId: service7_1Id, order: 6 },
    { nameAr: 'Big Data', nameEn: 'Big Data', parentId: service7_1Id, order: 7 },
    { nameAr: 'Data Mining', nameEn: 'Data Mining', parentId: service7_1Id, order: 8 },
    { nameAr: 'Predictive Analytics', nameEn: 'Predictive Analytics', parentId: service7_1Id, order: 9 },
    { nameAr: 'Statistical Analysis', nameEn: 'Statistical Analysis', parentId: service7_1Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types7_1);
  totalTypes += types7_1.length;
  console.log(`    → ${types7_1.length} types`);

  const service7_2Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات الأمن السيبراني',
    nameEn: 'Cybersecurity',
    parentId: service7Id,
    order: 2
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types7_2 = [
    { nameAr: 'اختبار الاختراق', nameEn: 'اختبار الاختراق', parentId: service7_2Id, order: 1 },
    { nameAr: 'تقييم الثغرات', nameEn: 'تقييم الثغرات', parentId: service7_2Id, order: 2 },
    { nameAr: 'استشارات الأمن', nameEn: 'استشارات الأمن', parentId: service7_2Id, order: 3 },
    { nameAr: 'Incident Response', nameEn: 'Incident Response', parentId: service7_2Id, order: 4 },
    { nameAr: 'Security Audits', nameEn: 'Security Audits', parentId: service7_2Id, order: 5 },
    { nameAr: 'Compliance', nameEn: 'Compliance', parentId: service7_2Id, order: 6 },
    { nameAr: 'Security Training', nameEn: 'Security Training', parentId: service7_2Id, order: 7 },
    { nameAr: 'Forensics', nameEn: 'Forensics', parentId: service7_2Id, order: 8 },
    { nameAr: 'SOC Services', nameEn: 'SOC Services', parentId: service7_2Id, order: 9 },
    { nameAr: 'Risk Assessment', nameEn: 'Risk Assessment', parentId: service7_2Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types7_2);
  totalTypes += types7_2.length;
  console.log(`    → ${types7_2.length} types`);

  const service7_3Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات العمل الحر الأخرى',
    nameEn: 'Other Freelance Services',
    parentId: service7Id,
    order: 3
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (13)
  const types7_3 = [
    { nameAr: 'إدارة المتاجر الإلكترونية', nameEn: 'إدارة المتاجر الإلكترونية', parentId: service7_3Id, order: 1 },
    { nameAr: 'خدمة العملاء عن بعد', nameEn: 'خدمة العملاء عن بعد', parentId: service7_3Id, order: 2 },
    { nameAr: 'إدخال البيانات', nameEn: 'إدخال البيانات', parentId: service7_3Id, order: 3 },
    { nameAr: 'البحث على الإنترنت', nameEn: 'البحث على الإنترنت', parentId: service7_3Id, order: 4 },
    { nameAr: 'النسخ الطبي', nameEn: 'النسخ الطبي', parentId: service7_3Id, order: 5 },
    { nameAr: 'المحاسبة عن بعد', nameEn: 'المحاسبة عن بعد', parentId: service7_3Id, order: 6 },
    { nameAr: 'إدارة حسابات التواصل', nameEn: 'إدارة حسابات التواصل', parentId: service7_3Id, order: 7 },
    { nameAr: 'Community Management', nameEn: 'Community Management', parentId: service7_3Id, order: 8 },
    { nameAr: 'Content Moderation', nameEn: 'Content Moderation', parentId: service7_3Id, order: 9 },
    { nameAr: 'Online Reputation Management', nameEn: 'Online Reputation Management', parentId: service7_3Id, order: 10 },
    { nameAr: 'إدارة حسابات التداول اليومي', nameEn: 'إدارة حسابات التداول اليومي', parentId: service7_3Id, order: 11 },
    { nameAr: 'إدارة حسابات التسويق بالعمولة', nameEn: 'إدارة حسابات التسويق بالعمولة', parentId: service7_3Id, order: 12 },
    { nameAr: 'خدمات الربط بين الشركات والفريلانسرز', nameEn: 'خدمات الربط بين الشركات والفريلانسرز', parentId: service7_3Id, order: 13 },
  ];
  await db.insert(serviceCategories).values(types7_3);
  totalTypes += types7_3.length;
  console.log(`    → ${types7_3.length} types`);

  const service7_4Id = (await db.insert(serviceCategories).values({
    nameAr: 'خدمات الذكاء الاصطناعي والوكلاء والأتمتة',
    nameEn: 'AI & Automation',
    parentId: service7Id,
    order: 4
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (12)
  const types7_4 = [
    { nameAr: 'تطوير Chatbots', nameEn: 'تطوير Chatbots', parentId: service7_4Id, order: 1 },
    { nameAr: 'Virtual AI Assistants', nameEn: 'Virtual AI Assistants', parentId: service7_4Id, order: 2 },
    { nameAr: 'AI Content Generation', nameEn: 'AI Content Generation', parentId: service7_4Id, order: 3 },
    { nameAr: 'AI Voice Services', nameEn: 'AI Voice Services', parentId: service7_4Id, order: 4 },
    { nameAr: 'AI Image Generation', nameEn: 'AI Image Generation', parentId: service7_4Id, order: 5 },
    { nameAr: 'AI Video Generation', nameEn: 'AI Video Generation', parentId: service7_4Id, order: 6 },
    { nameAr: 'Process Automation', nameEn: 'Process Automation', parentId: service7_4Id, order: 7 },
    { nameAr: 'Workflow Automation', nameEn: 'Workflow Automation', parentId: service7_4Id, order: 8 },
    { nameAr: 'RPA Services', nameEn: 'RPA Services', parentId: service7_4Id, order: 9 },
    { nameAr: 'AI Training Services', nameEn: 'AI Training Services', parentId: service7_4Id, order: 10 },
    { nameAr: 'AI Integration Services', nameEn: 'AI Integration Services', parentId: service7_4Id, order: 11 },
    { nameAr: 'No-code/Low-code Development', nameEn: 'No-code/Low-code Development', parentId: service7_4Id, order: 12 },
  ];
  await db.insert(serviceCategories).values(types7_4);
  totalTypes += types7_4.length;
  console.log(`    → ${types7_4.length} types`);

  // 8. الخدمات الحية والتفاعلية
  const service8Id = (await db.insert(serviceCategories).values({
    nameAr: 'الخدمات الحية والتفاعلية',
    nameEn: 'Live & Interactive Services',
    parentId: null,
    order: 8
  }).returning({ id: serviceCategories.id }))[0].id;
  totalMain++;
  console.log(`  ✓ الخدمات الحية والتفاعلية`);
  
  const service8_1Id = (await db.insert(serviceCategories).values({
    nameAr: 'الفعاليات والورش الحية',
    nameEn: 'Live Events & Workshops',
    parentId: service8Id,
    order: 1
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types8_1 = [
    { nameAr: 'ورش العمل الحية', nameEn: 'ورش العمل الحية', parentId: service8_1Id, order: 1 },
    { nameAr: 'الندوات الحية', nameEn: 'الندوات الحية', parentId: service8_1Id, order: 2 },
    { nameAr: 'المؤتمرات الافتراضية', nameEn: 'المؤتمرات الافتراضية', parentId: service8_1Id, order: 3 },
    { nameAr: 'الدورات الحية', nameEn: 'الدورات الحية', parentId: service8_1Id, order: 4 },
    { nameAr: 'جلسات Q&A', nameEn: 'جلسات Q&A', parentId: service8_1Id, order: 5 },
    { nameAr: 'Masterclasses', nameEn: 'Masterclasses', parentId: service8_1Id, order: 6 },
    { nameAr: 'Panel Discussions', nameEn: 'Panel Discussions', parentId: service8_1Id, order: 7 },
    { nameAr: 'Virtual Summits', nameEn: 'Virtual Summits', parentId: service8_1Id, order: 8 },
    { nameAr: 'Networking Events', nameEn: 'Networking Events', parentId: service8_1Id, order: 9 },
    { nameAr: 'Virtual Trade Shows', nameEn: 'Virtual Trade Shows', parentId: service8_1Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types8_1);
  totalTypes += types8_1.length;
  console.log(`    → ${types8_1.length} types`);

  const service8_2Id = (await db.insert(serviceCategories).values({
    nameAr: 'الاستشارات الشخصية',
    nameEn: 'Personal Consulting',
    parentId: service8Id,
    order: 2
  }).returning({ id: serviceCategories.id }))[0].id;
  totalSub++;
  
  // الأنواع (10)
  const types8_2 = [
    { nameAr: 'استشارات 1-on-1', nameEn: 'استشارات 1-on-1', parentId: service8_2Id, order: 1 },
    { nameAr: 'Group Coaching', nameEn: 'Group Coaching', parentId: service8_2Id, order: 2 },
    { nameAr: 'Mentoring', nameEn: 'Mentoring', parentId: service8_2Id, order: 3 },
    { nameAr: 'Strategy Sessions', nameEn: 'Strategy Sessions', parentId: service8_2Id, order: 4 },
    { nameAr: 'Brainstorming Sessions', nameEn: 'Brainstorming Sessions', parentId: service8_2Id, order: 5 },
    { nameAr: 'Review Sessions', nameEn: 'Review Sessions', parentId: service8_2Id, order: 6 },
    { nameAr: 'Feedback Sessions', nameEn: 'Feedback Sessions', parentId: service8_2Id, order: 7 },
    { nameAr: 'Planning Sessions', nameEn: 'Planning Sessions', parentId: service8_2Id, order: 8 },
    { nameAr: 'Accountability Coaching', nameEn: 'Accountability Coaching', parentId: service8_2Id, order: 9 },
    { nameAr: 'Performance Coaching', nameEn: 'Performance Coaching', parentId: service8_2Id, order: 10 },
  ];
  await db.insert(serviceCategories).values(types8_2);
  totalTypes += types8_2.length;
  console.log(`    → ${types8_2.length} types`);

  
  // ============================================
  // سوق فرص العمل (JOB CATEGORIES)
  // ============================================
  console.log('\n💼 Seeding JOB CATEGORIES...');
  
  await db.insert(jobCategories).values({
    nameAr: 'الذكاء الاصطناعي والوكلاء والأتمتة',
    nameEn: 'AI & Automation',
    parentId: null,
    order: 1
  });
  console.log(`  ✓ الذكاء الاصطناعي والوكلاء والأتمتة`);
  
  await db.insert(jobCategories).values({
    nameAr: 'البرمجة والتطوير وتكنولوجيا المعلومات والتقنية',
    nameEn: 'Programming & IT',
    parentId: null,
    order: 2
  });
  console.log(`  ✓ البرمجة والتطوير وتكنولوجيا المعلومات والتقنية`);
  
  await db.insert(jobCategories).values({
    nameAr: 'الأعمال والمشاريع والمهام والإدارة',
    nameEn: 'Business & Management',
    parentId: null,
    order: 3
  });
  console.log(`  ✓ الأعمال والمشاريع والمهام والإدارة`);
  
  await db.insert(jobCategories).values({
    nameAr: 'المالية والاقتصاد والمحاسبة',
    nameEn: 'Finance & Accounting',
    parentId: null,
    order: 4
  });
  console.log(`  ✓ المالية والاقتصاد والمحاسبة`);
  
  await db.insert(jobCategories).values({
    nameAr: 'المبيعات والتسويق',
    nameEn: 'Sales & Marketing',
    parentId: null,
    order: 5
  });
  console.log(`  ✓ المبيعات والتسويق`);
  
  await db.insert(jobCategories).values({
    nameAr: 'الكتابة والترجمة والمحتوى',
    nameEn: 'Writing & Translation',
    parentId: null,
    order: 6
  });
  console.log(`  ✓ الكتابة والترجمة والمحتوى`);
  
  await db.insert(jobCategories).values({
    nameAr: 'التصميم والإبداع',
    nameEn: 'Design & Creative',
    parentId: null,
    order: 7
  });
  console.log(`  ✓ التصميم والإبداع`);
  
  await db.insert(jobCategories).values({
    nameAr: 'إعداد الدراسات والبحوث والتقارير والخطط',
    nameEn: 'Research & Reports',
    parentId: null,
    order: 8
  });
  console.log(`  ✓ إعداد الدراسات والبحوث والتقارير والخطط`);
  
  await db.insert(jobCategories).values({
    nameAr: 'التعليم والتدريب',
    nameEn: 'Education & Training',
    parentId: null,
    order: 9
  });
  console.log(`  ✓ التعليم والتدريب`);
  
  await db.insert(jobCategories).values({
    nameAr: 'القانون',
    nameEn: 'Legal',
    parentId: null,
    order: 10
  });
  console.log(`  ✓ القانون`);
  
  await db.insert(jobCategories).values({
    nameAr: 'الهندسة والعمارة',
    nameEn: 'Engineering & Architecture',
    parentId: null,
    order: 11
  });
  console.log(`  ✓ الهندسة والعمارة`);
  
  await db.insert(jobCategories).values({
    nameAr: 'الإدارة والدعم والتشغيل',
    nameEn: 'Admin & Support',
    parentId: null,
    order: 12
  });
  console.log(`  ✓ الإدارة والدعم والتشغيل`);
  
  await db.insert(jobCategories).values({
    nameAr: 'الموارد البشرية والتوظيف',
    nameEn: 'HR & Recruitment',
    parentId: null,
    order: 13
  });
  console.log(`  ✓ الموارد البشرية والتوظيف`);
  
  
  console.log('\n🎉 ========================================');
  console.log('🎉 SERVICES & JOBS SEEDING COMPLETED!');
  console.log('🎉 ========================================');
  console.log(`📊 Services: ${totalMain} main + ${totalSub} sub + ${totalTypes} types = ${totalMain + totalSub + totalTypes}`);
  console.log(`📊 Jobs: 13 main`);
  console.log(`🌟 Total: ${totalMain + totalSub + totalTypes + 13} categories!`);
}

seedServicesAndJobs()
  .then(() => {
    console.log('✅ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
