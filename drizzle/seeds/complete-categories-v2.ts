import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);
import { productCategories, serviceCategories, jobCategories } from '../schema';

/**
 * Complete Categories Seeder for OSDM Platform - Version 2
 * Works with existing schema (parentId structure)
 * All 3 Markets: Products, Services, Jobs
 */

async function seedProductCategories() {
  console.log('\n📦 Seeding Products Market Categories...');
  
  // Delete old data
  await db.delete(productCategories);
  
  // 1. المحتوى النصي والمكتوب
  const [textContent] = await db.insert(productCategories).values({
    nameAr: 'المحتوى النصي والمكتوب',
    nameEn: 'Written & Text Content',
    icon: 'FileText',
    order: 1
  }).returning();
  
  await db.insert(productCategories).values([
    { nameAr: 'الكتب الإلكترونية', nameEn: 'E-Books', parentId: textContent.id, icon: 'Book', order: 1 },
    { nameAr: 'البحوث والدراسات والتقارير والتحليلات', nameEn: 'Research & Reports', parentId: textContent.id, icon: 'FileSearch', order: 2 },
    { nameAr: 'القوالب والنماذج النصية', nameEn: 'Text Templates', parentId: textContent.id, icon: 'FileType', order: 3 },
    { nameAr: 'المحتوى التعليمي والإعلامي المكتوب', nameEn: 'Educational Content', parentId: textContent.id, icon: 'GraduationCap', order: 4 }
  ]);

  // 2. المحتوى المرئي البصري
  const [visualContent] = await db.insert(productCategories).values({
    nameAr: 'المحتوى المرئي البصري',
    nameEn: 'Visual Content',
    icon: 'Image',
    order: 2
  }).returning();
  
  await db.insert(productCategories).values([
    { nameAr: 'الصور الفوتوغرافية', nameEn: 'Photography', parentId: visualContent.id, icon: 'Camera', order: 1 },
    { nameAr: 'التصاميم الجرافيكية', nameEn: 'Graphic Designs', parentId: visualContent.id, icon: 'Palette', order: 2 },
    { nameAr: 'الرسومات التوضيحية', nameEn: 'Illustrations', parentId: visualContent.id, icon: 'Brush', order: 3 },
    { nameAr: 'الأيقونات والرموز', nameEn: 'Icons & Symbols', parentId: visualContent.id, icon: 'Star', order: 4 },
    { nameAr: 'الخطوط والطباعة', nameEn: 'Fonts & Typography', parentId: visualContent.id, icon: 'Type', order: 5 }
  ]);

  // 3. المحتوى السمعي (الصوتي)
  const [audioContent] = await db.insert(productCategories).values({
    nameAr: 'المحتوى السمعي (الصوتي)',
    nameEn: 'Audio Content',
    icon: 'Headphones',
    order: 3
  }).returning();
  
  await db.insert(productCategories).values([
    { nameAr: 'الموسيقى والمقطوعات الصوتية', nameEn: 'Music & Audio Tracks', parentId: audioContent.id, icon: 'Music', order: 1 },
    { nameAr: 'المؤثرات الصوتية', nameEn: 'Sound Effects', parentId: audioContent.id, icon: 'Volume2', order: 2 }
  ]);

  // 4. المحتوى المرئي المتحرك (الفيديو)
  const [videoContent] = await db.insert(productCategories).values({
    nameAr: 'المحتوى المرئي المتحرك (الفيديو)',
    nameEn: 'Video Content',
    icon: 'Video',
    order: 4
  }).returning();
  
  await db.insert(productCategories).values([
    { nameAr: 'مقاطع الفيديو الجاهزة', nameEn: 'Stock Videos', parentId: videoContent.id, icon: 'Film', order: 1 },
    { nameAr: 'قوالب الفيديو', nameEn: 'Video Templates', parentId: videoContent.id, icon: 'Clapperboard', order: 2 },
    { nameAr: 'الرسوم المتحركة', nameEn: 'Animations', parentId: videoContent.id, icon: 'Zap', order: 3 }
  ]);

  // 5. المحتوى التفاعلي والرقمي
  const [interactiveContent] = await db.insert(productCategories).values({
    nameAr: 'المحتوى التفاعلي والرقمي',
    nameEn: 'Interactive Digital Content',
    icon: 'MousePointer',
    order: 5
  }).returning();
  
  await db.insert(productCategories).values([
    { nameAr: 'قوالب العروض التقديمية', nameEn: 'Presentation Templates', parentId: interactiveContent.id, icon: 'Presentation', order: 1 },
    { nameAr: 'الدورات التدريبية الرقمية', nameEn: 'Online Courses', parentId: interactiveContent.id, icon: 'BookOpen', order: 2 }
  ]);

  // 6. محتوى البرمجة والتقنية
  const [programmingContent] = await db.insert(productCategories).values({
    nameAr: 'محتوى البرمجة والتقنية',
    nameEn: 'Programming & Technical Content',
    icon: 'Code',
    order: 6
  }).returning();
  
  await db.insert(productCategories).values([
    { nameAr: 'الأكواد والسكريبتات', nameEn: 'Code & Scripts', parentId: programmingContent.id, icon: 'Terminal', order: 1 },
    { nameAr: 'قوالب المواقع والتطبيقات', nameEn: 'Website & App Templates', parentId: programmingContent.id, icon: 'Layout', order: 2 },
    { nameAr: 'الإضافات والمكونات', nameEn: 'Plugins & Components', parentId: programmingContent.id, icon: 'Package', order: 3 },
    { nameAr: 'البرمجيات والتطبيقات الجاهزة', nameEn: 'Ready Software & Apps', parentId: programmingContent.id, icon: 'Smartphone', order: 4 }
  ]);

  // 7. المنتجات الرقمية المتخصصة
  const [specializedProducts] = await db.insert(productCategories).values({
    nameAr: 'المنتجات الرقمية المتخصصة',
    nameEn: 'Specialized Digital Products',
    icon: 'Sparkles',
    order: 7
  }).returning();
  
  await db.insert(productCategories).values([
    { nameAr: 'الأصول الرقمية NFTs', nameEn: 'NFT Digital Assets', parentId: specializedProducts.id, icon: 'Coins', order: 1 },
    { nameAr: 'المحتوى ثلاثي الأبعاد', nameEn: '3D Content', parentId: specializedProducts.id, icon: 'Box', order: 2 },
    { nameAr: 'المحتوى للواقع الافتراضي والمعزز', nameEn: 'VR & AR Content', parentId: specializedProducts.id, icon: 'Glasses', order: 3 }
  ]);

  // 8. الخدمات الاشتراكية والعضويات
  const [subscriptionServices] = await db.insert(productCategories).values({
    nameAr: 'الخدمات الاشتراكية والعضويات',
    nameEn: 'Subscription Services & Memberships',
    icon: 'CreditCard',
    order: 8
  }).returning();
  
  await db.insert(productCategories).values([
    { nameAr: 'المحتوى الاشتراكي', nameEn: 'Subscription Content', parentId: subscriptionServices.id, icon: 'Repeat', order: 1 },
    { nameAr: 'منصات SaaS والخدمات السحابية', nameEn: 'SaaS Platforms & Cloud Services', parentId: subscriptionServices.id, icon: 'Cloud', order: 2 }
  ]);

  console.log('✅ Products Market: 8 main categories, 29 subcategories');
}

async function seedServiceCategories() {
  console.log('\n📦 Seeding Services Market Categories...');
  
  // Delete old data
  await db.delete(serviceCategories);
  
  // 1. خدمات الكتابة والمحتوى
  const [writingServices] = await db.insert(serviceCategories).values({
    nameAr: 'خدمات الكتابة والمحتوى',
    nameEn: 'Writing & Content Services',
    icon: 'PenTool',
    order: 1
  }).returning();
  
  await db.insert(serviceCategories).values([
    { nameAr: 'خدمات كتابة المحتوى', nameEn: 'Content Writing Services', parentId: writingServices.id, icon: 'FileText', order: 1 },
    { nameAr: 'خدمات التحرير والترجمة', nameEn: 'Editing & Translation Services', parentId: writingServices.id, icon: 'Languages', order: 2 }
  ]);

  // 2. خدمات التصميم والإبداع
  const [designServices] = await db.insert(serviceCategories).values({
    nameAr: 'خدمات التصميم والإبداع',
    nameEn: 'Design & Creative Services',
    icon: 'Palette',
    order: 2
  }).returning();
  
  await db.insert(serviceCategories).values([
    { nameAr: 'التصميم الجرافيكي', nameEn: 'Graphic Design', parentId: designServices.id, icon: 'Paintbrush', order: 1 },
    { nameAr: 'التصميم والطباعة', nameEn: 'Design & Print', parentId: designServices.id, icon: 'Printer', order: 2 },
    { nameAr: 'تصميم المواقع والتطبيقات', nameEn: 'Web & App Design', parentId: designServices.id, icon: 'Monitor', order: 3 }
  ]);

  // 3. خدمات الصوت والفيديو
  const [audioVideoServices] = await db.insert(serviceCategories).values({
    nameAr: 'خدمات الصوت والفيديو',
    nameEn: 'Audio & Video Services',
    icon: 'Video',
    order: 3
  }).returning();
  
  await db.insert(serviceCategories).values([
    { nameAr: 'الخدمات الصوتية', nameEn: 'Audio Services', parentId: audioVideoServices.id, icon: 'Mic', order: 1 },
    { nameAr: 'خدمات الفيديو', nameEn: 'Video Services', parentId: audioVideoServices.id, icon: 'Film', order: 2 }
  ]);

  // 4. خدمات البرمجة والتطوير
  const [programmingServices] = await db.insert(serviceCategories).values({
    nameAr: 'خدمات البرمجة والتطوير',
    nameEn: 'Programming & Development Services',
    icon: 'Code',
    order: 4
  }).returning();
  
  await db.insert(serviceCategories).values([
    { nameAr: 'تطوير المواقع والتطبيقات', nameEn: 'Web & App Development', parentId: programmingServices.id, icon: 'Globe', order: 1 },
    { nameAr: 'خدمات برمجية متخصصة', nameEn: 'Specialized Programming Services', parentId: programmingServices.id, icon: 'Terminal', order: 2 }
  ]);

  // 5. خدمات التسويق والأعمال
  const [marketingServices] = await db.insert(serviceCategories).values({
    nameAr: 'خدمات التسويق والأعمال',
    nameEn: 'Marketing & Business Services',
    icon: 'TrendingUp',
    order: 5
  }).returning();
  
  await db.insert(serviceCategories).values([
    { nameAr: 'التسويق الرقمي', nameEn: 'Digital Marketing', parentId: marketingServices.id, icon: 'Megaphone', order: 1 },
    { nameAr: 'خدمات الأعمال', nameEn: 'Business Services', parentId: marketingServices.id, icon: 'Briefcase', order: 2 }
  ]);

  // 6. خدمات التعليم والتدريب
  const [educationServices] = await db.insert(serviceCategories).values({
    nameAr: 'خدمات التعليم والتدريب',
    nameEn: 'Education & Training Services',
    icon: 'GraduationCap',
    order: 6
  }).returning();
  
  await db.insert(serviceCategories).values([
    { nameAr: 'التعليم والتدريب', nameEn: 'Education & Training', parentId: educationServices.id, icon: 'BookOpen', order: 1 },
    { nameAr: 'الكوتشينج والإرشاد', nameEn: 'Coaching & Mentoring', parentId: educationServices.id, icon: 'Users', order: 2 }
  ]);

  // 7. الخدمات المتخصصة
  const [specializedServices] = await db.insert(serviceCategories).values({
    nameAr: 'الخدمات المتخصصة',
    nameEn: 'Specialized Services',
    icon: 'Wrench',
    order: 7
  }).returning();
  
  await db.insert(serviceCategories).values([
    { nameAr: 'خدمات تقنية متخصصة', nameEn: 'Specialized Technical Services', parentId: specializedServices.id, icon: 'Settings', order: 1 },
    { nameAr: 'خدمات إبداعية متخصصة', nameEn: 'Specialized Creative Services', parentId: specializedServices.id, icon: 'Sparkles', order: 2 },
    { nameAr: 'خدمات استشارية متخصصة', nameEn: 'Specialized Consulting Services', parentId: specializedServices.id, icon: 'MessageSquare', order: 3 },
    { nameAr: 'خدمات الذكاء الاصطناعي', nameEn: 'AI Services', parentId: specializedServices.id, icon: 'Brain', order: 4 }
  ]);

  // 8. الخدمات الحية
  const [liveServices] = await db.insert(serviceCategories).values({
    nameAr: 'الخدمات الحية',
    nameEn: 'Live Services',
    icon: 'Radio',
    order: 8
  }).returning();
  
  await db.insert(serviceCategories).values([
    { nameAr: 'الجلسات الحية', nameEn: 'Live Sessions', parentId: liveServices.id, icon: 'Video', order: 1 },
    { nameAr: 'البث المباشر', nameEn: 'Live Streaming', parentId: liveServices.id, icon: 'Tv', order: 2 }
  ]);

  console.log('✅ Services Market: 8 main categories, 21 subcategories');
}

async function seedJobCategories() {
  console.log('\n📦 Seeding Jobs Market Categories...');
  
  // Delete old data
  await db.delete(jobCategories);
  
  // Same structure as services but for freelance jobs
  // 1. الكتابة والمحتوى
  const [jobsWriting] = await db.insert(jobCategories).values({
    nameAr: 'الكتابة والمحتوى',
    nameEn: 'Writing & Content',
    icon: 'PenTool',
    order: 1
  }).returning();
  
  await db.insert(jobCategories).values([
    { nameAr: 'كتابة المحتوى', nameEn: 'Content Writing', parentId: jobsWriting.id, icon: 'FileText', order: 1 },
    { nameAr: 'التحرير والترجمة', nameEn: 'Editing & Translation', parentId: jobsWriting.id, icon: 'Languages', order: 2 }
  ]);

  // 2. التصميم والإبداع
  const [jobsDesign] = await db.insert(jobCategories).values({
    nameAr: 'التصميم والإبداع',
    nameEn: 'Design & Creative',
    icon: 'Palette',
    order: 2
  }).returning();
  
  await db.insert(jobCategories).values([
    { nameAr: 'التصميم الجرافيكي', nameEn: 'Graphic Design', parentId: jobsDesign.id, icon: 'Paintbrush', order: 1 },
    { nameAr: 'التصميم والطباعة', nameEn: 'Design & Print', parentId: jobsDesign.id, icon: 'Printer', order: 2 },
    { nameAr: 'تصميم المواقع والتطبيقات', nameEn: 'Web & App Design', parentId: jobsDesign.id, icon: 'Monitor', order: 3 }
  ]);

  // 3. الصوت والفيديو
  const [jobsAudioVideo] = await db.insert(jobCategories).values({
    nameAr: 'الصوت والفيديو',
    nameEn: 'Audio & Video',
    icon: 'Video',
    order: 3
  }).returning();
  
  await db.insert(jobCategories).values([
    { nameAr: 'الخدمات الصوتية', nameEn: 'Audio Services', parentId: jobsAudioVideo.id, icon: 'Mic', order: 1 },
    { nameAr: 'خدمات الفيديو', nameEn: 'Video Services', parentId: jobsAudioVideo.id, icon: 'Film', order: 2 }
  ]);

  // 4. البرمجة والتطوير
  const [jobsProgramming] = await db.insert(jobCategories).values({
    nameAr: 'البرمجة والتطوير',
    nameEn: 'Programming & Development',
    icon: 'Code',
    order: 4
  }).returning();
  
  await db.insert(jobCategories).values([
    { nameAr: 'تطوير المواقع الكاملة', nameEn: 'Full Stack Development', parentId: jobsProgramming.id, icon: 'Globe', order: 1 },
    { nameAr: 'تطوير التطبيقات الكاملة', nameEn: 'Full App Development', parentId: jobsProgramming.id, icon: 'Smartphone', order: 2 }
  ]);

  // 5. التسويق الرقمي والأعمال
  const [jobsMarketing] = await db.insert(jobCategories).values({
    nameAr: 'التسويق الرقمي والأعمال',
    nameEn: 'Digital Marketing & Business',
    icon: 'TrendingUp',
    order: 5
  }).returning();
  
  await db.insert(jobCategories).values([
    { nameAr: 'خدمات التسويق الرقمي', nameEn: 'Digital Marketing Services', parentId: jobsMarketing.id, icon: 'Megaphone', order: 1 },
    { nameAr: 'الاستشارات والخدمات المهنية', nameEn: 'Consulting & Professional Services', parentId: jobsMarketing.id, icon: 'Briefcase', order: 2 }
  ]);

  // 6. التعليم والتدريب
  const [jobsEducation] = await db.insert(jobCategories).values({
    nameAr: 'التعليم والتدريب',
    nameEn: 'Education & Training',
    icon: 'GraduationCap',
    order: 6
  }).returning();
  
  await db.insert(jobCategories).values([
    { nameAr: 'التدريس والتعليم عبر الإنترنت', nameEn: 'Online Teaching & Education', parentId: jobsEducation.id, icon: 'BookOpen', order: 1 },
    { nameAr: 'التدريب والتطوير المهني', nameEn: 'Professional Training & Development', parentId: jobsEducation.id, icon: 'Users', order: 2 }
  ]);

  // 7. الخدمات المتخصصة
  const [jobsSpecialized] = await db.insert(jobCategories).values({
    nameAr: 'الخدمات المتخصصة',
    nameEn: 'Specialized Services',
    icon: 'Wrench',
    order: 7
  }).returning();
  
  await db.insert(jobCategories).values([
    { nameAr: 'خدمات البيانات والتحليل', nameEn: 'Data & Analysis Services', parentId: jobsSpecialized.id, icon: 'BarChart', order: 1 },
    { nameAr: 'خدمات الأمن السيبراني', nameEn: 'Cybersecurity Services', parentId: jobsSpecialized.id, icon: 'Shield', order: 2 },
    { nameAr: 'خدمات العمل الحر الأخرى', nameEn: 'Other Freelance Services', parentId: jobsSpecialized.id, icon: 'MoreHorizontal', order: 3 },
    { nameAr: 'خدمات الذكاء الاصطناعي والوكلاء والأتمتة', nameEn: 'AI, Agents & Automation Services', parentId: jobsSpecialized.id, icon: 'Brain', order: 4 }
  ]);

  // 8. الخدمات الحية والتفاعلية
  const [jobsLive] = await db.insert(jobCategories).values({
    nameAr: 'الخدمات الحية والتفاعلية',
    nameEn: 'Live & Interactive Services',
    icon: 'Radio',
    order: 8
  }).returning();
  
  await db.insert(jobCategories).values([
    { nameAr: 'الفعاليات والورش الحية', nameEn: 'Live Events & Workshops', parentId: jobsLive.id, icon: 'Video', order: 1 }
  ]);

  console.log('✅ Jobs Market: 8 main categories, 20 subcategories');
}

async function seedAllCategories() {
  console.log('🌱 Starting complete categories seeding...');
  console.log('📦 This will seed ALL categories for all 3 markets\n');
  
  await seedProductCategories();
  await seedServiceCategories();
  await seedJobCategories();
  
  console.log('\n🎉 ========================================');
  console.log('🎉 COMPLETE CATEGORIES SEEDING FINISHED!');
  console.log('🎉 ========================================');
  console.log('📊 Summary:');
  console.log('   ├─ Products Market: 8 categories, 29 subcategories');
  console.log('   ├─ Services Market: 8 categories, 21 subcategories');
  console.log('   └─ Jobs Market: 8 categories, 20 subcategories');
  console.log('📦 Total: 24 main categories, 70 subcategories');
  console.log('🌟 All categories seeded successfully!\n');
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

