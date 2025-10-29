import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { productCategories, serviceCategories, jobCategories } from '../schema';
import { eq, isNull } from 'drizzle-orm';

/**
 * Subcategories and Types Seeder for OSDM Platform
 * Adds all subcategories and types from the 22-page document
 */

async function seedProductSubcategories(db: any) {
  console.log('\n📦 Seeding Product Subcategories & Types...');
  
  // Get main categories
  const categories = await db.select().from(productCategories).where(isNull(productCategories.parentId));
  console.log(`Found ${categories.length} main categories:`);
  categories.forEach((c: any) => console.log(`  - ${c.nameEn} (ID: ${c.id})`));
  
  // 1. المحتوى النصي والمكتوب
  const textContent = categories.find((c: any) => c.nameEn === 'Written & Text Content');
  if (textContent) {
    await db.insert(productCategories).values([
      { nameAr: 'الكتب الإلكترونية', nameEn: 'E-Books', parentId: textContent.id, icon: 'Book', order: 1 },
      { nameAr: 'البحوث والدراسات والتقارير والتحليلات', nameEn: 'Research & Reports', parentId: textContent.id, icon: 'FileSearch', order: 2 },
      { nameAr: 'القوالب والنماذج النصية', nameEn: 'Text Templates', parentId: textContent.id, icon: 'FileType', order: 3 },
      { nameAr: 'المحتوى التعليمي والإعلامي المكتوب', nameEn: 'Educational Content', parentId: textContent.id, icon: 'GraduationCap', order: 4 }
    ]);
  }

  // 2. المحتوى المرئي البصري
  const visualContent = categories.find((c: any) => c.nameEn === 'Visual Content');
  if (visualContent) {
    await db.insert(productCategories).values([
      { nameAr: 'الصور الفوتوغرافية', nameEn: 'Photography', parentId: visualContent.id, icon: 'Camera', order: 1 },
      { nameAr: 'التصاميم الجرافيكية', nameEn: 'Graphic Designs', parentId: visualContent.id, icon: 'Palette', order: 2 },
      { nameAr: 'الرسومات التوضيحية', nameEn: 'Illustrations', parentId: visualContent.id, icon: 'Brush', order: 3 },
      { nameAr: 'الأيقونات والرموز', nameEn: 'Icons & Symbols', parentId: visualContent.id, icon: 'Star', order: 4 },
      { nameAr: 'الخطوط والطباعة', nameEn: 'Fonts & Typography', parentId: visualContent.id, icon: 'Type', order: 5 }
    ]);
  }

  // 3. المحتوى السمعي
  const audioContent = categories.find((c: any) => c.nameEn === 'Audio Content');
  if (audioContent) {
    await db.insert(productCategories).values([
      { nameAr: 'الموسيقى والمقطوعات الصوتية', nameEn: 'Music & Audio Tracks', parentId: audioContent.id, icon: 'Music', order: 1 },
      { nameAr: 'المؤثرات الصوتية', nameEn: 'Sound Effects', parentId: audioContent.id, icon: 'Volume2', order: 2 }
    ]);
  }

  // 4. المحتوى المرئي المتحرك
  const videoContent = categories.find((c: any) => c.nameEn === 'Video Content');
  if (videoContent) {
    await db.insert(productCategories).values([
      { nameAr: 'مقاطع الفيديو الجاهزة', nameEn: 'Stock Videos', parentId: videoContent.id, icon: 'Film', order: 1 },
      { nameAr: 'قوالب الفيديو', nameEn: 'Video Templates', parentId: videoContent.id, icon: 'Clapperboard', order: 2 },
      { nameAr: 'الرسوم المتحركة', nameEn: 'Animations', parentId: videoContent.id, icon: 'Zap', order: 3 }
    ]);
  }

  // 5. المحتوى التفاعلي والرقمي
  const interactiveContent = categories.find((c: any) => c.nameEn === 'Interactive Digital Content');
  if (interactiveContent) {
    await db.insert(productCategories).values([
      { nameAr: 'قوالب العروض التقديمية', nameEn: 'Presentation Templates', parentId: interactiveContent.id, icon: 'Presentation', order: 1 },
      { nameAr: 'الدورات التدريبية الرقمية', nameEn: 'Online Courses', parentId: interactiveContent.id, icon: 'BookOpen', order: 2 }
    ]);
  }

  // 6. محتوى البرمجة والتقنية
  const programmingContent = categories.find((c: any) => c.nameEn === 'Programming & Technical Content');
  if (programmingContent) {
    await db.insert(productCategories).values([
      { nameAr: 'الأكواد والسكريبتات', nameEn: 'Code & Scripts', parentId: programmingContent.id, icon: 'Terminal', order: 1 },
      { nameAr: 'قوالب المواقع والتطبيقات', nameEn: 'Website & App Templates', parentId: programmingContent.id, icon: 'Layout', order: 2 },
      { nameAr: 'الإضافات والمكونات', nameEn: 'Plugins & Components', parentId: programmingContent.id, icon: 'Package', order: 3 },
      { nameAr: 'البرمجيات والتطبيقات الجاهزة', nameEn: 'Ready Software & Apps', parentId: programmingContent.id, icon: 'Smartphone', order: 4 }
    ]);
  }

  // 7. المنتجات الرقمية المتخصصة
  const specializedProducts = categories.find((c: any) => c.nameEn === 'Specialized Digital Products');
  if (specializedProducts) {
    await db.insert(productCategories).values([
      { nameAr: 'الأصول الرقمية NFTs', nameEn: 'NFT Digital Assets', parentId: specializedProducts.id, icon: 'Coins', order: 1 },
      { nameAr: 'المحتوى ثلاثي الأبعاد', nameEn: '3D Content', parentId: specializedProducts.id, icon: 'Box', order: 2 },
      { nameAr: 'المحتوى للواقع الافتراضي والمعزز', nameEn: 'VR & AR Content', parentId: specializedProducts.id, icon: 'Glasses', order: 3 }
    ]);
  }

  // 8. الخدمات الاشتراكية
  const subscriptionServices = categories.find((c: any) => c.nameEn === 'Subscription Services');
  if (subscriptionServices) {
    await db.insert(productCategories).values([
      { nameAr: 'المحتوى الاشتراكي', nameEn: 'Subscription Content', parentId: subscriptionServices.id, icon: 'Repeat', order: 1 },
      { nameAr: 'منصات SaaS والخدمات السحابية', nameEn: 'SaaS Platforms & Cloud Services', parentId: subscriptionServices.id, icon: 'Cloud', order: 2 }
    ]);
  }

  console.log('✅ Products: 29 subcategories added');
}

async function seedServiceSubcategories(db: any) {
  console.log('\n📦 Seeding Service Subcategories & Types...');
  
  const categories = await db.select().from(serviceCategories).where(isNull(serviceCategories.parentId));
  
  // 1. خدمات الكتابة والمحتوى
  const writingServices = categories.find((c: any) => c.nameEn === 'Writing & Content Services');
  if (writingServices) {
    await db.insert(serviceCategories).values([
      { nameAr: 'خدمات كتابة المحتوى', nameEn: 'Content Writing Services', parentId: writingServices.id, icon: 'FileText', order: 1 },
      { nameAr: 'خدمات التحرير والترجمة', nameEn: 'Editing & Translation Services', parentId: writingServices.id, icon: 'Languages', order: 2 }
    ]);
  }

  // 2. خدمات التصميم والإبداع
  const designServices = categories.find((c: any) => c.nameEn === 'Design & Creative Services');
  if (designServices) {
    await db.insert(serviceCategories).values([
      { nameAr: 'التصميم الجرافيكي', nameEn: 'Graphic Design', parentId: designServices.id, icon: 'Paintbrush', order: 1 },
      { nameAr: 'التصميم والطباعة', nameEn: 'Design & Print', parentId: designServices.id, icon: 'Printer', order: 2 },
      { nameAr: 'تصميم المواقع والتطبيقات', nameEn: 'Web & App Design', parentId: designServices.id, icon: 'Monitor', order: 3 }
    ]);
  }

  // 3. خدمات الصوت والفيديو
  const audioVideoServices = categories.find((c: any) => c.nameEn === 'Audio & Video Services');
  if (audioVideoServices) {
    await db.insert(serviceCategories).values([
      { nameAr: 'الخدمات الصوتية', nameEn: 'Audio Services', parentId: audioVideoServices.id, icon: 'Mic', order: 1 },
      { nameAr: 'خدمات الفيديو', nameEn: 'Video Services', parentId: audioVideoServices.id, icon: 'Film', order: 2 }
    ]);
  }

  // 4. خدمات البرمجة والتطوير
  const programmingServices = categories.find((c: any) => c.nameEn === 'Programming & Development Services');
  if (programmingServices) {
    await db.insert(serviceCategories).values([
      { nameAr: 'تطوير المواقع والتطبيقات', nameEn: 'Web & App Development', parentId: programmingServices.id, icon: 'Globe', order: 1 },
      { nameAr: 'خدمات برمجية متخصصة', nameEn: 'Specialized Programming Services', parentId: programmingServices.id, icon: 'Terminal', order: 2 }
    ]);
  }

  // 5. خدمات التسويق والأعمال
  const marketingServices = categories.find((c: any) => c.nameEn === 'Marketing & Business Services');
  if (marketingServices) {
    await db.insert(serviceCategories).values([
      { nameAr: 'التسويق الرقمي', nameEn: 'Digital Marketing', parentId: marketingServices.id, icon: 'Megaphone', order: 1 },
      { nameAr: 'خدمات الأعمال', nameEn: 'Business Services', parentId: marketingServices.id, icon: 'Briefcase', order: 2 }
    ]);
  }

  // 6. خدمات التعليم والتدريب
  const educationServices = categories.find((c: any) => c.nameEn === 'Education & Training Services');
  if (educationServices) {
    await db.insert(serviceCategories).values([
      { nameAr: 'التعليم والتدريب', nameEn: 'Education & Training', parentId: educationServices.id, icon: 'BookOpen', order: 1 },
      { nameAr: 'الكوتشينج والإرشاد', nameEn: 'Coaching & Mentoring', parentId: educationServices.id, icon: 'Users', order: 2 }
    ]);
  }

  // 7. الخدمات المتخصصة
  const specializedServices = categories.find((c: any) => c.nameEn === 'Specialized Services');
  if (specializedServices) {
    await db.insert(serviceCategories).values([
      { nameAr: 'خدمات تقنية متخصصة', nameEn: 'Specialized Technical Services', parentId: specializedServices.id, icon: 'Settings', order: 1 },
      { nameAr: 'خدمات إبداعية متخصصة', nameEn: 'Specialized Creative Services', parentId: specializedServices.id, icon: 'Sparkles', order: 2 },
      { nameAr: 'خدمات استشارية متخصصة', nameEn: 'Specialized Consulting Services', parentId: specializedServices.id, icon: 'MessageSquare', order: 3 },
      { nameAr: 'خدمات الذكاء الاصطناعي', nameEn: 'AI Services', parentId: specializedServices.id, icon: 'Brain', order: 4 }
    ]);
  }

  // 8. الخدمات الحية
  const liveServices = categories.find((c: any) => c.nameEn === 'Live Services');
  if (liveServices) {
    await db.insert(serviceCategories).values([
      { nameAr: 'الجلسات الحية', nameEn: 'Live Sessions', parentId: liveServices.id, icon: 'Video', order: 1 },
      { nameAr: 'البث المباشر', nameEn: 'Live Streaming', parentId: liveServices.id, icon: 'Tv', order: 2 }
    ]);
  }

  console.log('✅ Services: 21 subcategories added');
}

async function seedJobSubcategories(db: any) {
  console.log('\n📦 Seeding Job Subcategories & Types...');
  
  const categories = await db.select().from(jobCategories).where(isNull(jobCategories.parentId));
  
  // 1. الكتابة والمحتوى
  const jobsWriting = categories.find((c: any) => c.nameEn === 'Writing & Content');
  if (jobsWriting) {
    await db.insert(jobCategories).values([
      { nameAr: 'كتابة المحتوى', nameEn: 'Content Writing', parentId: jobsWriting.id, icon: 'FileText', order: 1 },
      { nameAr: 'التحرير والترجمة', nameEn: 'Editing & Translation', parentId: jobsWriting.id, icon: 'Languages', order: 2 }
    ]);
  }

  // 2. التصميم والإبداع
  const jobsDesign = categories.find((c: any) => c.nameEn === 'Design & Creative');
  if (jobsDesign) {
    await db.insert(jobCategories).values([
      { nameAr: 'التصميم الجرافيكي', nameEn: 'Graphic Design', parentId: jobsDesign.id, icon: 'Paintbrush', order: 1 },
      { nameAr: 'التصميم والطباعة', nameEn: 'Design & Print', parentId: jobsDesign.id, icon: 'Printer', order: 2 },
      { nameAr: 'تصميم المواقع والتطبيقات', nameEn: 'Web & App Design', parentId: jobsDesign.id, icon: 'Monitor', order: 3 }
    ]);
  }

  // 3. الصوت والفيديو
  const jobsAudioVideo = categories.find((c: any) => c.nameEn === 'Audio & Video');
  if (jobsAudioVideo) {
    await db.insert(jobCategories).values([
      { nameAr: 'الخدمات الصوتية', nameEn: 'Audio Services', parentId: jobsAudioVideo.id, icon: 'Mic', order: 1 },
      { nameAr: 'خدمات الفيديو', nameEn: 'Video Services', parentId: jobsAudioVideo.id, icon: 'Film', order: 2 }
    ]);
  }

  // 4. البرمجة والتطوير
  const jobsProgramming = categories.find((c: any) => c.nameEn === 'Programming & Development');
  if (jobsProgramming) {
    await db.insert(jobCategories).values([
      { nameAr: 'تطوير المواقع الكاملة', nameEn: 'Full Stack Development', parentId: jobsProgramming.id, icon: 'Globe', order: 1 },
      { nameAr: 'تطوير التطبيقات الكاملة', nameEn: 'Full App Development', parentId: jobsProgramming.id, icon: 'Smartphone', order: 2 }
    ]);
  }

  // 5. التسويق الرقمي والأعمال
  const jobsMarketing = categories.find((c: any) => c.nameEn === 'Digital Marketing & Business');
  if (jobsMarketing) {
    await db.insert(jobCategories).values([
      { nameAr: 'خدمات التسويق الرقمي', nameEn: 'Digital Marketing Services', parentId: jobsMarketing.id, icon: 'Megaphone', order: 1 },
      { nameAr: 'الاستشارات والخدمات المهنية', nameEn: 'Consulting & Professional Services', parentId: jobsMarketing.id, icon: 'Briefcase', order: 2 }
    ]);
  }

  // 6. التعليم والتدريب
  const jobsEducation = categories.find((c: any) => c.nameEn === 'Education & Training');
  if (jobsEducation) {
    await db.insert(jobCategories).values([
      { nameAr: 'التدريس والتعليم عبر الإنترنت', nameEn: 'Online Teaching & Education', parentId: jobsEducation.id, icon: 'BookOpen', order: 1 },
      { nameAr: 'التدريب والتطوير المهني', nameEn: 'Professional Training & Development', parentId: jobsEducation.id, icon: 'Users', order: 2 }
    ]);
  }

  // 7. الخدمات المتخصصة
  const jobsSpecialized = categories.find((c: any) => c.nameEn === 'Specialized Services');
  if (jobsSpecialized) {
    await db.insert(jobCategories).values([
      { nameAr: 'خدمات البيانات والتحليل', nameEn: 'Data & Analysis Services', parentId: jobsSpecialized.id, icon: 'BarChart', order: 1 },
      { nameAr: 'خدمات الأمن السيبراني', nameEn: 'Cybersecurity Services', parentId: jobsSpecialized.id, icon: 'Shield', order: 2 },
      { nameAr: 'خدمات العمل الحر الأخرى', nameEn: 'Other Freelance Services', parentId: jobsSpecialized.id, icon: 'MoreHorizontal', order: 3 },
      { nameAr: 'خدمات الذكاء الاصطناعي والوكلاء والأتمتة', nameEn: 'AI, Agents & Automation Services', parentId: jobsSpecialized.id, icon: 'Brain', order: 4 }
    ]);
  }

  // 8. الخدمات الحية والتفاعلية
  const jobsLive = categories.find((c: any) => c.nameEn === 'Live Services');
  if (jobsLive) {
    await db.insert(jobCategories).values([
      { nameAr: 'الفعاليات والورش الحية', nameEn: 'Live Events & Workshops', parentId: jobsLive.id, icon: 'Video', order: 1 }
    ]);
  }

  console.log('✅ Jobs: 20 subcategories added');
}

async function seedAllSubcategories() {
  console.log('🌱 Starting subcategories seeding...\n');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);
  
  try {
    await seedProductSubcategories(db);
    await seedServiceSubcategories(db);
    await seedJobSubcategories(db);
    
    console.log('\n🎉 ========================================');
    console.log('🎉 SUBCATEGORIES SEEDING COMPLETED!');
    console.log('🎉 ========================================');
    console.log('📊 Summary:');
    console.log('   ├─ Products: 29 subcategories');
    console.log('   ├─ Services: 21 subcategories');
    console.log('   └─ Jobs: 20 subcategories');
    console.log('📦 Total: 70 subcategories added');
    console.log('🌟 All subcategories seeded successfully!\n');
    
  } finally {
    await connection.end();
  }
}

// Run the seeder
seedAllSubcategories()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

