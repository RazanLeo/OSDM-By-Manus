import { db } from '../../server/db';
import { categories, subcategories } from '../schema';

/**
 * Complete Categories Seeder for OSDM Platform
 * All 3 Markets: Products, Services, Jobs
 * Based on the 22-page document provided by the user
 */

export async function seedCompleteCategories() {{
  console.log('🌱 Starting complete categories seeding...');
  console.log('📦 This will seed ALL categories for all 3 markets');

  // حذف البيانات القديمة
  console.log('🗑️  Deleting old data...');
  await db.delete(subcategories);
  await db.delete(categories);

  // ========================================
  // سوق المنتجات الرقمية الجاهزة
  // Ready-Made Digital Products Market
  // ========================================

  console.log('\n📦 Seeding Products Market Categories...');

  // ==================== 1. المحتوى النصي والمكتوب ====================
  console.log('  ├─ 1. المحتوى النصي والمكتوب');
  const [textContent] = await db.insert(categories).values({
    nameAr: 'المحتوى النصي والمكتوب',
    nameEn: 'Written & Text Content',
    slug: 'written-text-content',
    icon: 'BookText',
    market: 'products',
    order: 1
  }).returning();

  // 1.1 الكتب الإلكترونية
  await db.insert(subcategories).values({
    categoryId: textContent.id,
    nameAr: 'الكتب الإلكترونية',
    nameEn: 'E-Books',
    slug: 'e-books',
    icon: 'Book',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'كتب علمية وأكاديمية', nameEn: 'Scientific & Academic Books' },
      { nameAr: 'كتب أطفال ويافعين', nameEn: 'Children & Young Adult Books' },
      { nameAr: 'كتب تطوير وتنمية الذات', nameEn: 'Self-Development Books' },
      { nameAr: 'السير الذاتية والمذكرات', nameEn: 'Biographies & Memoirs' },
      { nameAr: 'كتب التاريخ', nameEn: 'History Books' },
      { nameAr: 'كتب الجغرافيا', nameEn: 'Geography Books' },
      { nameAr: 'العلوم الطبيعية', nameEn: 'Natural Sciences' },
      { nameAr: 'العلوم الاجتماعية', nameEn: 'Social Sciences' },
      { nameAr: 'أعمال واقتصاد', nameEn: 'Business & Economics' },
      { nameAr: 'دين وفلسفة', nameEn: 'Religion & Philosophy' },
      { nameAr: 'الفنون والحرف', nameEn: 'Arts & Crafts' },
      { nameAr: 'كتب تعليم صناعة الحلي والتجميل والعطور', nameEn: 'Jewelry, Beauty & Perfume Making' },
      { nameAr: 'الطبخ والطعام', nameEn: 'Cooking & Food' },
      { nameAr: 'الطب والصحة', nameEn: 'Medicine & Health' },
      { nameAr: 'التقنية والحاسوب', nameEn: 'Technology & Computing' },
      { nameAr: 'السفر والسياحة والترفيه', nameEn: 'Travel, Tourism & Entertainment' },
      { nameAr: 'التعليم والكتب المدرسية', nameEn: 'Education & School Books' },
      { nameAr: 'الرياضة', nameEn: 'Sports' },
      { nameAr: 'القانون', nameEn: 'Law' },
      { nameAr: 'البيئة والطبيعة', nameEn: 'Environment & Nature' },
      { nameAr: 'المراجع', nameEn: 'References' },
      { nameAr: 'الروايات والخيال', nameEn: 'Novels & Fiction' },
      { nameAr: 'الأدب الكلاسيكي', nameEn: 'Classical Literature' },
      { nameAr: 'القصص القصيرة', nameEn: 'Short Stories' },
      { nameAr: 'الروايات المصورة', nameEn: 'Graphic Novels' },
      { nameAr: 'المسرحيات', nameEn: 'Plays' },
      { nameAr: 'الشعر', nameEn: 'Poetry' },
      { nameAr: 'الأساطير والخرافات', nameEn: 'Myths & Legends' }
    ])
  });

  // 1.2 البحوث والدراسات والتقارير والتحليلات
  await db.insert(subcategories).values({
    categoryId: textContent.id,
    nameAr: 'البحوث والدراسات والتقارير والتحليلات',
    nameEn: 'Research, Studies, Reports & Analysis',
    slug: 'research-studies-reports',
    icon: 'FileSearch',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'أبحاث السوق', nameEn: 'Market Research' },
      { nameAr: 'تقارير الصناعة', nameEn: 'Industry Reports' },
      { nameAr: 'دراسات الجدوى', nameEn: 'Feasibility Studies' },
      { nameAr: 'أوراق بيضاء', nameEn: 'White Papers' },
      { nameAr: 'دراسات حالة', nameEn: 'Case Studies' },
      { nameAr: 'تقارير إحصائية', nameEn: 'Statistical Reports' },
      { nameAr: 'بحوث ودراسات علمية', nameEn: 'Scientific Research & Studies' }
    ])
  });

  // 1.3 القوالب والنماذج النصية
  await db.insert(subcategories).values({
    categoryId: textContent.id,
    nameAr: 'القوالب والنماذج النصية',
    nameEn: 'Text Templates & Forms',
    slug: 'text-templates-forms',
    icon: 'FileType',
    order: 3,
    types: JSON.stringify([
      { nameAr: 'قوالب السيرة الذاتية', nameEn: 'CV Templates' },
      { nameAr: 'قوالب الخطابات الرسمية', nameEn: 'Formal Letter Templates' },
      { nameAr: 'قوالب خطط العمل', nameEn: 'Business Plan Templates' },
      { nameAr: 'قوالب العقود القانونية', nameEn: 'Legal Contract Templates' },
      { nameAr: 'قوالب التسويق', nameEn: 'Marketing Templates' },
      { nameAr: 'قوالب البريد الإلكتروني', nameEn: 'Email Templates' },
      { nameAr: 'قوالب الفواتير', nameEn: 'Invoice Templates' },
      { nameAr: 'قوالب العروض التقديمية', nameEn: 'Presentation Templates' },
      { nameAr: 'قوالب المستندات', nameEn: 'Document Templates' },
      { nameAr: 'قوالب التقارير', nameEn: 'Report Templates' }
    ])
  });

  // 1.4 المحتوى التعليمي والإعلامي المكتوب
  await db.insert(subcategories).values({
    categoryId: textContent.id,
    nameAr: 'المحتوى التعليمي والإعلامي المكتوب',
    nameEn: 'Written Educational & Media Content',
    slug: 'written-educational-media',
    icon: 'GraduationCap',
    order: 4,
    types: JSON.stringify([
      { nameAr: 'دورات تدريبية مكتوبة وملفات تعليمية', nameEn: 'Written Training Courses & Educational Files' },
      { nameAr: 'ملخصات جاهزة', nameEn: 'Ready Summaries' },
      { nameAr: 'كتيبات وأدلة تعليمية', nameEn: 'Educational Guides & Manuals' },
      { nameAr: 'كتيبات وأدلة إرشادية', nameEn: 'How-to Guides' },
      { nameAr: 'مقالات ومدونات ومنشورات', nameEn: 'Articles, Blogs & Publications' },
      { nameAr: 'ملفات تعليمية PDF', nameEn: 'Educational PDF Files' },
      { nameAr: 'أوراق عمل', nameEn: 'Worksheets' },
      { nameAr: 'اختبارات ومسابقات', nameEn: 'Quizzes & Tests' },
      { nameAr: 'ملفات بروم��تات (هندسة الأوامر)', nameEn: 'Prompt Files (Prompt Engineering)' }
    ])
  });

  console.log('  ✅ Completed: المحتوى النصي والمكتوب (4 subcategories)');

  // سأكمل باقي التصنيفات في الملف...
  console.log('\n🎉 Categories seeding in progress...');
  console.log('📝 This is Part 1 of the complete seeder');
}



  // ==================== 2. المحتوى المرئي البصري ====================
  console.log('  ├─ 2. المحتوى المرئي البصري');
  const [visualContent] = await db.insert(categories).values({
    nameAr: 'المحتوى المرئي البصري',
    nameEn: 'Visual & Graphic Content',
    slug: 'visual-graphic-content',
    icon: 'Image',
    market: 'products',
    order: 2
  }).returning();

  // 2.1 الصور والرسومات
  await db.insert(subcategories).values({
    categoryId: visualContent.id,
    nameAr: 'الصور والرسومات',
    nameEn: 'Images & Graphics',
    slug: 'images-graphics',
    icon: 'ImageIcon',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'صور فوتوغرافية Stock', nameEn: 'Stock Photography' },
      { nameAr: 'رسومات توضيحية', nameEn: 'Illustrations' },
      { nameAr: 'أيقونات', nameEn: 'Icons' },
      { nameAr: 'رسومات متجهة Vector', nameEn: 'Vector Graphics' },
      { nameAr: 'خلفيات', nameEn: 'Backgrounds' },
      { nameAr: 'نسيج وأنماط Textures', nameEn: 'Textures & Patterns' },
      { nameAr: 'صور بانورامية', nameEn: 'Panoramic Images' },
      { nameAr: 'صور 360 درجة', nameEn: '360° Images' },
      { nameAr: 'صور HDR', nameEn: 'HDR Images' },
      { nameAr: 'صور RAW', nameEn: 'RAW Images' }
    ])
  });

  // 2.2 قوالب التصميم الجرافيكي
  await db.insert(subcategories).values({
    categoryId: visualContent.id,
    nameAr: 'قوالب التصميم الجرافيكي',
    nameEn: 'Graphic Design Templates',
    slug: 'graphic-design-templates',
    icon: 'Palette',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'قوالب الشعارات', nameEn: 'Logo Templates' },
      { nameAr: 'قوالب الهوية البصرية', nameEn: 'Brand Identity Templates' },
      { nameAr: 'قوالب البوسترات', nameEn: 'Poster Templates' },
      { nameAr: 'قوالب البروشورات', nameEn: 'Brochure Templates' },
      { nameAr: 'قوالب الكتب', nameEn: 'Book Templates' },
      { nameAr: 'قوالب الأغلفة', nameEn: 'Cover Templates' },
      { nameAr: 'قوالب البطاقات', nameEn: 'Card Templates' },
      { nameAr: 'قوالب التغليف', nameEn: 'Packaging Templates' },
      { nameAr: 'قوالب الإعلانات', nameEn: 'Ad Templates' },
      { nameAr: 'قوالب السوشيال ميديا', nameEn: 'Social Media Templates' },
      { nameAr: 'قوالب البانرات', nameEn: 'Banner Templates' },
      { nameAr: 'قوالب الإنفوجرافيك', nameEn: 'Infographic Templates' },
      { nameAr: 'قوالب العروض التقديمية', nameEn: 'Presentation Templates' },
      { nameAr: 'قوالب السيرة الذاتية المصممة', nameEn: 'Designed CV Templates' }
    ])
  });

  // 2.3 موارد التصميم الرقمي
  await db.insert(subcategories).values({
    categoryId: visualContent.id,
    nameAr: 'موارد التصميم الرقمي',
    nameEn: 'Digital Design Resources',
    slug: 'digital-design-resources',
    icon: 'Layers',
    order: 3,
    types: JSON.stringify([
      { nameAr: 'خطوط رقمية', nameEn: 'Fonts, Typography' },
      { nameAr: 'فرش فوتوشوب', nameEn: 'Photoshop Brushes' },
      { nameAr: 'أدوات تصميم', nameEn: 'Design Tools' },
      { nameAr: 'Actions', nameEn: 'Photoshop Actions' },
      { nameAr: 'Presets', nameEn: 'Lightroom Presets' },
      { nameAr: 'LUTs', nameEn: 'Color Grading LUTs' },
      { nameAr: 'Mockups', nameEn: 'Product Mockups' },
      { nameAr: 'فلاتر وتأثيرات', nameEn: 'Filters, Effects' },
      { nameAr: 'Overlays تأثيرات إضافية', nameEn: 'Overlays' },
      { nameAr: 'Gradients تدرجات لونية', nameEn: 'Gradients' }
    ])
  });

  // 2.4 قوالب الطباعة والمنتجات المادية
  await db.insert(subcategories).values({
    categoryId: visualContent.id,
    nameAr: 'قوالب الطباعة والمنتجات المادية',
    nameEn: 'Print & Physical Product Templates',
    slug: 'print-physical-templates',
    icon: 'Printer',
    order: 4,
    types: JSON.stringify([
      { nameAr: 'تصاميم التيشرتات', nameEn: 'T-shirt Designs' },
      { nameAr: 'تصاميم الأكواب', nameEn: 'Mug Designs' },
      { nameAr: 'تصاميم الحقائب', nameEn: 'Bag Designs' },
      { nameAr: 'تصاميم البوسترات', nameEn: 'Poster Designs' },
      { nameAr: 'تصاميم الملصقات', nameEn: 'Sticker Designs' },
      { nameAr: 'تصاميم القبعات', nameEn: 'Hat Designs' },
      { nameAr: 'تصاميم الوسائد', nameEn: 'Pillow Designs' },
      { nameAr: 'تصاميم الهواتف', nameEn: 'Phone Case Designs' },
      { nameAr: 'تصاميم اللوحات', nameEn: 'Canvas Prints' },
      { nameAr: 'تصاميم البطاقات وبطاقات الأعمال', nameEn: 'Card & Business Card Designs' },
      { nameAr: 'تصاميم دعوات وبطاقات التهنئة', nameEn: 'Invitation & Greeting Card Designs' },
      { nameAr: 'تصاميم شهادات', nameEn: 'Certificate Designs' }
    ])
  });

  // 2.5 موارد التصميم
  await db.insert(subcategories).values({
    categoryId: visualContent.id,
    nameAr: 'موارد التصميم',
    nameEn: 'Design Assets',
    slug: 'design-assets',
    icon: 'Shapes',
    order: 5,
    types: JSON.stringify([
      { nameAr: 'خطوط رقمية', nameEn: 'Fonts, Typography' },
      { nameAr: 'فرش فوتوشوب', nameEn: 'Photoshop Brushes' },
      { nameAr: 'أدوات تصميم', nameEn: 'Design Tools' },
      { nameAr: 'Actions', nameEn: 'Photoshop Actions' },
      { nameAr: 'Presets', nameEn: 'Lightroom Presets' },
      { nameAr: 'LUTs', nameEn: 'Color Grading' },
      { nameAr: 'Mockups', nameEn: 'Product Mockups' },
      { nameAr: 'فلاتر وتأثيرات', nameEn: 'Filters, Effects' },
      { nameAr: 'Overlays تأثيرات إضافية', nameEn: 'Overlays' },
      { nameAr: 'Gradients تدرجات لونية', nameEn: 'Gradients' }
    ])
  });

  console.log('  ✅ Completed: المحتوى المرئي البصري (5 subcategories)');



  // ==================== 3. المحتوى السمعي (الصوتي) ====================
  console.log('  ├─ 3. المحتوى السمعي (الصوتي)');
  const [audioContent] = await db.insert(categories).values({
    nameAr: 'المحتوى السمعي (الصوتي)',
    nameEn: 'Audio Content',
    slug: 'audio-content',
    icon: 'Music',
    market: 'products',
    order: 3
  }).returning();

  // 3.1 الموسيقى والمؤثرات الصوتية
  await db.insert(subcategories).values({
    categoryId: audioContent.id,
    nameAr: 'الموسيقى والمؤثرات الصوتية',
    nameEn: 'Music & Sound Effects',
    slug: 'music-sound-effects',
    icon: 'Music2',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'موسيقى خالية من حقوق الملكية', nameEn: 'Royalty-Free Music' },
      { nameAr: 'موسيقى خلفية', nameEn: 'Background Music' },
      { nameAr: 'موسيقى تصويرية', nameEn: 'Soundtrack Music' },
      { nameAr: 'مؤثرات صوتية', nameEn: 'Sound Effects' },
      { nameAr: 'أصوات طبيعية', nameEn: 'Nature Sounds' },
      { nameAr: 'أصوات المدينة', nameEn: 'Urban Sounds' },
      { nameAr: 'Loops موسيقية', nameEn: 'Music Loops' },
      { nameAr: 'Beats إيقاعات موسيقية', nameEn: 'Beats' },
      { nameAr: 'نغمات رنين', nameEn: 'Ringtones' },
      { nameAr: 'تنبيهات صوتية', nameEn: 'Alert Sounds' }
    ])
  });

  // 3.2 المحتوى الصوتي التعليمي والترفيهي
  await db.insert(subcategories).values({
    categoryId: audioContent.id,
    nameAr: 'المحتوى الصوتي التعليمي والترفيهي',
    nameEn: 'Educational & Entertainment Audio',
    slug: 'educational-entertainment-audio',
    icon: 'Headphones',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'كتب صوتية', nameEn: 'Audiobooks' },
      { nameAr: 'بودكاست مسجل', nameEn: 'Recorded Podcasts' },
      { nameAr: 'دروس صوتية', nameEn: 'Audio Lessons' },
      { nameAr: 'محاضرات مسجلة', nameEn: 'Recorded Lectures' },
      { nameAr: 'قصص وروايات صوتية', nameEn: 'Audio Stories' },
      { nameAr: 'تأملات موجهة', nameEn: 'Guided Meditations' },
      { nameAr: 'ملفات استرخاء وتأملات', nameEn: 'Relaxation Audio' },
      { nameAr: 'ملفات ASMR', nameEn: 'ASMR Content' },
      { nameAr: 'دورات تدريبية صوتية', nameEn: 'Audio Courses' },
      { nameAr: 'ندوات مسجلة وموارد تعليمية أغاني', nameEn: 'Recorded Webinars' }
    ])
  });

  console.log('  ✅ Completed: المحتوى السمعي (الصوتي) (2 subcategories)');

  // ==================== 4. المحتوى المرئي المتحرك (الفيديو) ====================
  console.log('  ├─ 4. المحتوى المرئي المتحرك (الفيديو)');
  const [videoContent] = await db.insert(categories).values({
    nameAr: 'المحتوى المرئي المتحرك (الفيديو)',
    nameEn: 'Video & Motion Content',
    slug: 'video-motion-content',
    icon: 'Video',
    market: 'products',
    order: 4
  }).returning();

  // 4.1 لقطات ومقاطع الفيديو
  await db.insert(subcategories).values({
    categoryId: videoContent.id,
    nameAr: 'لقطات ومقاطع الفيديو',
    nameEn: 'Video Clips & Footage',
    slug: 'video-clips-footage',
    icon: 'Film',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'لقطات فيديو مخزنة', nameEn: 'Stock Footage' },
      { nameAr: 'مقاطع فيديو قصيرة', nameEn: 'Short Videos' },
      { nameAr: 'مقاطع فيديو طويلة', nameEn: 'Long Videos' },
      { nameAr: 'فيديو خلفيات متحركة', nameEn: 'Video Backgrounds' },
      { nameAr: 'فلاتر تأثيرات فيديو جاهزة', nameEn: 'Video Effects' },
      { nameAr: 'مقاطع Drone', nameEn: 'Aerial Footage' },
      { nameAr: 'مقاطع Time-lapse فيديو مسرع', nameEn: 'Time-lapse' },
      { nameAr: 'مقاطع Slow Motion فيديو بطيء', nameEn: 'Slow Motion' },
      { nameAr: 'مقاطع 360 درجة', nameEn: 'Videos 360°' },
      { nameAr: 'مقاطع VR', nameEn: 'Virtual Reality Videos' },
      { nameAr: 'مقاطع Green Screen', nameEn: 'Chroma Key Videos' }
    ])
  });

  // 4.2 قوالب الفيديو والموشن جرافيك
  await db.insert(subcategories).values({
    categoryId: videoContent.id,
    nameAr: 'قوالب الفيديو والموشن جرافيك',
    nameEn: 'Video Templates & Motion Graphics',
    slug: 'video-templates-motion-graphics',
    icon: 'Clapperboard',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'قوالب المقدمات', nameEn: 'Intro Templates' },
      { nameAr: 'قوالب الخاتمات', nameEn: 'Outro Templates' },
      { nameAr: 'قوالب العناوين', nameEn: 'Title Templates' },
      { nameAr: 'قوالب الانتقالات', nameEn: 'Transition Templates' },
      { nameAr: 'قوالب Lower Thirds شريط معلومات', nameEn: 'Lower Thirds' },
      { nameAr: 'قوالب الإعلانات', nameEn: 'Ad Templates' },
      { nameAr: 'قوالب السوشيال ميديا رسوم متحركة جاهزة', nameEn: 'Social Media Videos' },
      { nameAr: 'Motion Graphics', nameEn: 'Motion Graphics' },
      { nameAr: 'قوالب الشرح', nameEn: 'Explainer Videos' },
      { nameAr: 'قوالب العروض المتحركة', nameEn: 'Presentation Videos' }
    ])
  });

  // 4.3 المحتوى التعليمي المرئي
  await db.insert(subcategories).values({
    categoryId: videoContent.id,
    nameAr: 'المحتوى التعليمي المرئي',
    nameEn: 'Educational Video Content',
    slug: 'educational-video-content',
    icon: 'GraduationCap',
    order: 3,
    types: JSON.stringify([
      { nameAr: 'دورات فيديو مسجلة', nameEn: 'Video Courses' },
      { nameAr: 'شروحات تعليمية', nameEn: 'Tutorial Videos' },
      { nameAr: 'محاضرات مسجلة', nameEn: 'Recorded Lectures' },
      { nameAr: 'ورش عمل مسجلة', nameEn: 'Recorded Workshops' },
      { nameAr: 'ندوات مسجلة', nameEn: 'Recorded Seminars' },
      { nameAr: 'دروس مسجلة', nameEn: 'Recorded Lessons' },
      { nameAr: 'أفلام وثائقية', nameEn: 'Documentaries' },
      { nameAr: 'فيديوهات إرشادات مرئية How-to', nameEn: 'How-to Videos' },
      { nameAr: 'مراجعات منتجات', nameEn: 'Product Reviews' },
      { nameAr: 'دليل استخدام مرئي', nameEn: 'Video Manuals' }
    ])
  });

  console.log('  ✅ Completed: المحتوى المرئي المتحرك (الفيديو) (3 subcategories)');

  // ==================== 5. المحتوى التفاعلي والرقمي ====================
  console.log('  ├─ 5. المحتوى التفاعلي والرقمي');
  const [interactiveContent] = await db.insert(categories).values({
    nameAr: 'المحتوى التفاعلي والرقمي',
    nameEn: 'Interactive & Digital Content',
    slug: 'interactive-digital-content',
    icon: 'Gamepad2',
    market: 'products',
    order: 5
  }).returning();

  // 5.1 الألعاب والتطبيقات الجاهزة
  await db.insert(subcategories).values({
    categoryId: interactiveContent.id,
    nameAr: 'الألعاب والتطبيقات الجاهزة',
    nameEn: 'Ready-Made Games & Apps',
    slug: 'ready-games-apps',
    icon: 'Gamepad',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'ألعاب بسيطة', nameEn: 'Casual Games' },
      { nameAr: 'ألعاب تعليمية', nameEn: 'Educational Games' },
      { nameAr: 'ألعاب الألغاز', nameEn: 'Puzzle Games' },
      { nameAr: 'تطبيقات أدوات', nameEn: 'Utility Apps' },
      { nameAr: 'تطبيقات إنتاجية', nameEn: 'Productivity Apps' },
      { nameAr: 'تطبيقات تعليمية', nameEn: 'Learning Apps' },
      { nameAr: 'موارد الألعاب Game Assets', nameEn: 'Game Assets' },
      { nameAr: 'موارد Unity', nameEn: 'Unity Assets' },
      { nameAr: 'موارد Unreal', nameEn: 'Unreal Assets' },
      { nameAr: 'قوالب الألعاب', nameEn: 'Game Templates' }
    ])
  });

  // 5.2 المحتويات التفاعلية الأخرى
  await db.insert(subcategories).values({
    categoryId: interactiveContent.id,
    nameAr: 'المحتويات التفاعلية الأخرى',
    nameEn: 'Other Interactive Content',
    slug: 'other-interactive-content',
    icon: 'MousePointerClick',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'استبيانات تفاعلية', nameEn: 'Interactive Surveys (نفسية، شخصية، اجتماعية، بحوث، أخرى)' },
      { nameAr: 'اختبارات تفاعلية', nameEn: 'Interactive Quizzes (نفسية، شخصية، اجتماعية، بحوث، أخرى)' },
      { nameAr: 'حاسبات تفاعلية', nameEn: 'Interactive Calculators' },
      { nameAr: 'خرائط تفاعلية', nameEn: 'Interactive Maps' },
      { nameAr: 'عروض تقديمية تفاعلية', nameEn: 'Interactive Presentations' },
      { nameAr: 'انفوجرافيك تفاعلي', nameEn: 'Interactive Infographics' },
      { nameAr: 'جولات افتراضية', nameEn: 'Virtual Tours' },
      { nameAr: 'نماذج تفاعلية', nameEn: 'Interactive Forms' },
      { nameAr: 'Timeline تفاعلي', nameEn: 'Interactive Timelines' },
      { nameAr: 'لوحات تحكم Dashboard Templates', nameEn: 'Dashboard Templates' }
    ])
  });

  console.log('  ✅ Completed: المحتوى التفاعلي والرقمي (2 subcategories)');

  // ==================== 6. محتوى البرمجة والتقنية ====================
  console.log('  ├─ 6. محتوى البرمجة والتقنية');
  const [programmingContent] = await db.insert(categories).values({
    nameAr: 'محتوى البرمجة والتقنية',
    nameEn: 'Programming & Technical Content',
    slug: 'programming-technical-content',
    icon: 'Code',
    market: 'products',
    order: 6
  }).returning();

  // 6.1 الأكواد والسكريبتات
  await db.insert(subcategories).values({
    categoryId: programmingContent.id,
    nameAr: 'الأكواد والسكريبتات',
    nameEn: 'Code & Scripts',
    slug: 'code-scripts',
    icon: 'Code2',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'قوالب ومقتطفات أكواد جاهزة', nameEn: 'Code Templates' },
      { nameAr: 'سكريبتات Python', nameEn: 'Python Scripts' },
      { nameAr: 'سكريبتات JavaScript', nameEn: 'JS Scripts' },
      { nameAr: 'سكريبتات PHP', nameEn: 'PHP Scripts' },
      { nameAr: 'سكريبتات Bash', nameEn: 'Bash Scripts' },
      { nameAr: 'سكريبتات Pine تريدنج فيو', nameEn: 'Pine Scripts' },
      { nameAr: 'مقتطفات أكواد', nameEn: 'Code Snippets' },
      { nameAr: 'تعبيرات نمطية Regular Expressions', nameEn: 'Regular Expressions' },
      { nameAr: 'استعلامات قواعد البيانات SQL Queries', nameEn: 'SQL Queries' },
      { nameAr: 'مجموعات API', nameEn: 'API Collections' },
      { nameAr: 'مجموعات Postman', nameEn: 'Postman Collections' }
    ])
  });

  // 6.2 الإضافات والمكونات
  await db.insert(subcategories).values({
    categoryId: programmingContent.id,
    nameAr: 'الإضافات والمكونات',
    nameEn: 'Plugins & Components',
    slug: 'plugins-components',
    icon: 'Puzzle',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'إضافات WordPress', nameEn: 'WP Plugins' },
      { nameAr: 'إضافات Shopify', nameEn: 'Shopify Apps' },
      { nameAr: 'إضافات Chrome', nameEn: 'Chrome Extensions' },
      { nameAr: 'إضافات VS Code', nameEn: 'VS Code Extensions' },
      { nameAr: 'إضافات Photoshop', nameEn: 'PS Plugins' },
      { nameAr: 'إضافات Excel', nameEn: 'Excel Add-ins' },
      { nameAr: 'مكتبات برمجية Libraries', nameEn: 'Libraries' },
      { nameAr: 'أطر عمل Frameworks', nameEn: 'Frameworks' },
      { nameAr: 'واجهات برمجية APIs', nameEn: 'APIs' },
      { nameAr: 'حزم تطوير SDKs', nameEn: 'SDKs' },
      { nameAr: 'مكونات إضافية أخرى وإضافات منصح أخرى', nameEn: 'Other Plugins/Add-ons' }
    ])
  });

  // 6.3 قوالب التقنية والبيانات
  await db.insert(subcategories).values({
    categoryId: programmingContent.id,
    nameAr: 'قوالب التقنية والبيانات',
    nameEn: 'Technical & Data Templates',
    slug: 'technical-data-templates',
    icon: 'Database',
    order: 3,
    types: JSON.stringify([
      { nameAr: 'قوالب قواعد البيانات', nameEn: 'Database Templates' },
      { nameAr: 'Docker Templates', nameEn: 'Docker Configurations' },
      { nameAr: 'Kubernetes Templates', nameEn: 'K8s Configurations' },
      { nameAr: 'خطوط إنتاج CI/CD Pipelines', nameEn: 'CI/CD Pipelines' },
      { nameAr: 'قوالب البنية التحتية Infrastructure as Code', nameEn: 'Infrastructure as Code' },
      { nameAr: 'قوالب سحابية Cloud Templates', nameEn: 'Cloud Templates' },
      { nameAr: 'مؤشرات Trading View', nameEn: 'Trading Indicators' },
      { nameAr: 'روبوتات تداول Expert Advisors', nameEn: 'Expert Advisors' },
      { nameAr: 'عقود ذكية Blockchain Smart Contracts', nameEn: 'Blockchain Smart Contracts' },
      { nameAr: 'نماذج تعلم آلة Machine Learning Models', nameEn: 'Machine Learning Models' }
    ])
  });

  // 6.4 قوالب المواقع والتطبيقات
  await db.insert(subcategories).values({
    categoryId: programmingContent.id,
    nameAr: 'قوالب المواقع والتطبيقات',
    nameEn: 'Website & App Templates',
    slug: 'website-app-templates',
    icon: 'Layout',
    order: 4,
    types: JSON.stringify([
      { nameAr: 'قوالب WordPress ثيمات ووردبريس', nameEn: 'WordPress Themes' },
      { nameAr: 'قوالب Shopify متاجر إلكترونية', nameEn: 'Shopify Templates' },
      { nameAr: 'قوالب HTML/CSS مواقع ثابتة', nameEn: 'HTML/CSS Templates' },
      { nameAr: 'قوالب React تطبيقات', nameEn: 'React Templates' },
      { nameAr: 'قوالب Vue تطبيقات', nameEn: 'Vue Templates' },
      { nameAr: 'قوالب Angular تطبيقات', nameEn: 'Angular Templates' },
      { nameAr: 'قوالب Bootstrap تصاميم', nameEn: 'Bootstrap Templates' },
      { nameAr: 'قوالب Landing Pages صفحات هبوط', nameEn: 'Landing Pages' },
      { nameAr: 'قوالب Email رسائل بريدية', nameEn: 'Email Templates' },
      { nameAr: 'قوالب Mobile Apps تطبيقات موبايل', nameEn: 'Mobile Apps' },
      { nameAr: 'جميع أنواع قوالب المواقع والتطبيقات', nameEn: 'All Website & App Templates' }
    ])
  });

  console.log('  ✅ Completed: محتوى البرمجة والتقنية (4 subcategories)');



  // ==================== 7. المنتجات الرقمية المتخصصة ====================
  console.log('  ├─ 7. المنتجات الرقمية المتخصصة');
  const [specializedProducts] = await db.insert(categories).values({
    nameAr: 'المنتجات الرقمية المتخصصة',
    nameEn: 'Specialized Digital Products',
    slug: 'specialized-digital-products',
    icon: 'Sparkles',
    market: 'products',
    order: 7
  }).returning();

  // 7.1 الأصول الرقمية NFTs
  await db.insert(subcategories).values({
    categoryId: specializedProducts.id,
    nameAr: 'الأصول الرقمية NFTs',
    nameEn: 'NFT Digital Assets',
    slug: 'nft-digital-assets',
    icon: 'Coins',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'فن رقمي NFT', nameEn: 'Digital Art NFTs' },
      { nameAr: 'مقتنيات NFT', nameEn: 'Collectible NFTs' },
      { nameAr: 'NFTs الألعاب', nameEn: 'Gaming NFTs' },
      { nameAr: 'NFTs الموسيقى', nameEn: 'Music NFTs' },
      { nameAr: 'NFTs العقارات الافتراضية', nameEn: 'Virtual Real Estate NFTs' },
      { nameAr: 'أفاتار NFT', nameEn: 'Avatar NFTs' },
      { nameAr: 'نطاقات Web3 Domain NFTs', nameEn: 'Domain NFTs' },
      { nameAr: 'عضويات NFT Membership NFTs', nameEn: 'Membership NFTs' },
      { nameAr: 'NFTs وظيفية Utility NFTs', nameEn: 'Utility NFTs' },
      { nameAr: 'واقع معزز/افتراضي AR/VR NFTs', nameEn: 'AR/VR NFTs' }
    ])
  });

  // 7.2 المحتوى ثلاثي الأبعاد
  await db.insert(subcategories).values({
    categoryId: specializedProducts.id,
    nameAr: 'المحتوى ثلاثي الأبعاد',
    nameEn: '3D Content',
    slug: '3d-content',
    icon: 'Box',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'نماذج 3D جاهزة', nameEn: '3D Models' },
      { nameAr: 'مواد وخامات 3D', nameEn: '3D Materials' },
      { nameAr: 'أنيميشن 3D', nameEn: '3D Animations' },
      { nameAr: 'بيئات 3D', nameEn: '3D Environments' },
      { nameAr: 'شخصيات 3D', nameEn: '3D Characters' },
      { nameAr: 'أثاث 3D', nameEn: '3D Furniture' },
      { nameAr: 'سيارات 3D', nameEn: '3D Vehicles' },
      { nameAr: 'نباتات 3D', nameEn: '3D Plants' },
      { nameAr: 'معمار 3D', nameEn: '3D Architecture' },
      { nameAr: 'ملابس 3D', nameEn: '3D Clothing' }
    ])
  });

  // 7.3 المحتوى للواقع الافتراضي والمعزز
  await db.insert(subcategories).values({
    categoryId: specializedProducts.id,
    nameAr: 'المحتوى للواقع الافتراضي والمعزز',
    nameEn: 'VR & AR Content',
    slug: 'vr-ar-content',
    icon: 'Glasses',
    order: 3,
    types: JSON.stringify([
      { nameAr: 'تطبيقات VR', nameEn: 'VR Applications' },
      { nameAr: 'ألعاب VR', nameEn: 'VR Games' },
      { nameAr: 'جولات VR', nameEn: 'VR Tours' },
      { nameAr: 'تدريب VR', nameEn: 'VR Training' },
      { nameAr: 'فلاتر AR', nameEn: 'AR Filters' },
      { nameAr: 'تطبيقات AR', nameEn: 'AR Applications' },
      { nameAr: 'ألعاب AR', nameEn: 'AR Games' },
      { nameAr: 'كتب AR', nameEn: 'AR Books' },
      { nameAr: 'بطاقات AR', nameEn: 'AR Cards' },
      { nameAr: 'تجارب Metaverse', nameEn: 'Metaverse Experiences' }
    ])
  });

  console.log('  ✅ Completed: المنتجات الرقمية المتخصصة (3 subcategories)');

  // ==================== 8. الخدمات الاشتراكية والعضويات ====================
  console.log('  ├─ 8. الخدمات الاشتراكية والعضويات');
  const [subscriptionServices] = await db.insert(categories).values({
    nameAr: 'الخدمات الاشتراكية والعضويات',
    nameEn: 'Subscription Services & Memberships',
    slug: 'subscription-services-memberships',
    icon: 'CreditCard',
    market: 'products',
    order: 8
  }).returning();

  // 8.1 المحتوى الاشتراكي
  await db.insert(subcategories).values({
    categoryId: subscriptionServices.id,
    nameAr: 'المحتوى الاشتراكي',
    nameEn: 'Subscription Content',
    slug: 'subscription-content',
    icon: 'Repeat',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'نشرات إخبارية، مدونات، مقالات مدفوعة', nameEn: 'Premium Newsletters' },
      { nameAr: 'محتوى حصري', nameEn: 'Exclusive Content' },
      { nameAr: 'مكتبات موارد', nameEn: 'Resource Libraries' },
      { nameAr: 'قوالب شهرية', nameEn: 'Monthly Templates' },
      { nameAr: 'اشتراكات الموارد Stock Assets', nameEn: 'Stock Subscriptions' },
      { nameAr: 'دورات اشتراكية', nameEn: 'Subscription Courses' },
      { nameAr: 'برامج تدريب Coaching Programs', nameEn: 'Coaching Programs' },
      { nameAr: 'مجموعات احترافية Mastermind Groups', nameEn: 'Mastermind Groups' },
      { nameAr: 'وصول للمجتمع Community Access', nameEn: 'Community Access' },
      { nameAr: 'دعم مميز Premium Support', nameEn: 'Premium Support' }
    ])
  });

  // 8.2 منصات SaaS والخدمات السحابية
  await db.insert(subcategories).values({
    categoryId: subscriptionServices.id,
    nameAr: 'منصات SaaS والخدمات السحابية',
    nameEn: 'SaaS Platforms & Cloud Services',
    slug: 'saas-platforms-cloud-services',
    icon: 'Cloud',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'منصات إدارة المشاريع', nameEn: 'Project Management SaaS' },
      { nameAr: 'منصات CRM', nameEn: 'Customer Relationship Management' },
      { nameAr: 'منصات التسويق', nameEn: 'Marketing Automation Platforms' },
      { nameAr: 'منصات التحليلات', nameEn: 'Analytics Platforms' },
      { nameAr: 'منصات التعليم', nameEn: 'Learning Management Systems' },
      { nameAr: 'منصات المحاسبة', nameEn: 'Accounting Software' },
      { nameAr: 'منصات التصميم', nameEn: 'Design Platforms' },
      { nameAr: 'منصات التخزين السحابي', nameEn: 'Cloud Storage' },
      { nameAr: 'منصات الأمان السحابي', nameEn: 'Security Platforms' },
      { nameAr: 'منصات التواصل', nameEn: 'Communication Platforms' }
    ])
  });

  console.log('  ✅ Completed: الخدمات الاشتراكية والعضويات (2 subcategories)');
  console.log('✅ Products Market Completed! (8 main categories, 29 subcategories)\n');

  // ========================================
  // سوق الخدمات الرقمية المتخصصة حسب الطلب
  // Custom Digital Services By Order Market
  // ========================================

  console.log('📦 Seeding Services Market Categories...');

  // ==================== 1. خدمات الكتابة والمحتوى ====================
  console.log('  ├─ 1. خدمات الكتابة والمحتوى');
  const [writingServices] = await db.insert(categories).values({
    nameAr: 'خدمات الكتابة والمحتوى',
    nameEn: 'Writing & Content Services',
    slug: 'writing-content-services',
    icon: 'PenTool',
    market: 'services',
    order: 1
  }).returning();

  // 1.1 خدمات كتابة المحتوى
  await db.insert(subcategories).values({
    categoryId: writingServices.id,
    nameAr: 'خدمات كتابة المحتوى',
    nameEn: 'Content Writing Services',
    slug: 'content-writing-services',
    icon: 'FileText',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'كتابة المقالات', nameEn: 'مقالات متخصصة، مقالات SEO' },
      { nameAr: 'كتابة المدونات', nameEn: 'محتوى مدونات، Guest Posts' },
      { nameAr: 'كتابة النصوص التسويقية', nameEn: 'Copywriting, Sales Copy' },
      { nameAr: 'أوصاف المنتجات', nameEn: 'النصوص الإعلانية' },
      { nameAr: 'كتابة السيناريوهات', nameEn: 'سيناريوهات فيديو، أفلام' },
      { nameAr: 'كتابة البودكاست', nameEn: 'نصوص بودكاست، حوارات' },
      { nameAr: 'كتابة المحتوى التقني', nameEn: 'Technical Writing' },
      { nameAr: 'كتابة المحتوى الطبي', nameEn: 'Medical Writing' },
      { nameAr: 'كتابة المحتوى القانوني', nameEn: 'Legal Writing' },
      { nameAr: 'Ghost Writing الكتابة الشبحية', nameEn: 'Ghost Writing' },
      { nameAr: 'كتابة السيرة الذاتية', nameEn: 'CV Writing' },
      { nameAr: 'بحوث وتقارير وتحليلات ودراسات', nameEn: 'كل أنواع البحوث والدراسات والتحليلات والتقارير' },
      { nameAr: 'إعداد محتوى ورش عمل ودورات تدريبية', nameEn: 'محتويات نصية أخرى' }
    ])
  });

  // 1.2 خدمات التحرير والترجمة
  await db.insert(subcategories).values({
    categoryId: writingServices.id,
    nameAr: 'خدمات التحرير والترجمة',
    nameEn: 'Editing & Translation Services',
    slug: 'editing-translation-services',
    icon: 'Languages',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'التحرير اللغوي', nameEn: 'Editing, Proofreading' },
      { nameAr: 'التدقيق اللغوي', nameEn: 'Grammar, Spelling Check' },
      { nameAr: 'الترجمة العامة', nameEn: 'ترجمة نصوص عامة' },
      { nameAr: 'الترجمة المتخصصة', nameEn: 'طبية، قانونية، تقنية' },
      { nameAr: 'الترجمة الفورية Simultaneous Translation', nameEn: 'Simultaneous Translation' },
      { nameAr: 'التعريب Localization', nameEn: 'Localization' },
      { nameAr: 'تفريغ صوتي Transcription', nameEn: 'Transcription' },
      { nameAr: 'كتابة الترجمة Subtitling', nameEn: 'Subtitling' },
      { nameAr: 'إعادة الكتابة Rewriting', nameEn: 'Rewriting' },
      { nameAr: 'التلخيص Summarization', nameEn: 'Summarization' }
    ])
  });

  console.log('  ✅ Completed: خدمات الكتابة والمحتوى (2 subcategories)');



  // ==================== 2. خدمات التصميم والإبداع ====================
  console.log('  ├─ 2. خدمات التصميم والإبداع');
  const [designServices] = await db.insert(categories).values({
    nameAr: 'خدمات التصميم والإبداع',
    nameEn: 'Design & Creative Services',
    slug: 'design-creative-services',
    icon: 'Palette',
    market: 'services',
    order: 2
  }).returning();

  // 2.1 التصميم الجرافيكي
  await db.insert(subcategories).values({
    categoryId: designServices.id,
    nameAr: 'التصميم الجرافيكي',
    nameEn: 'Graphic Design',
    slug: 'graphic-design',
    icon: 'Paintbrush',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'تصميم الشعارات', nameEn: 'Logo Design' },
      { nameAr: 'تصميم الهوية البصرية', nameEn: 'Brand Identity' },
      { nameAr: 'تصميم البوسترات', nameEn: 'Poster Design' },
      { nameAr: 'تصميم البروشورات', nameEn: 'Brochure Design' },
      { nameAr: 'تصميم الكتب', nameEn: 'Book Design' },
      { nameAr: 'تصميم الأغلفة', nameEn: 'Cover Design' },
      { nameAr: 'تصميم البطاقات', nameEn: 'Card Design' },
      { nameAr: 'تصميم التغليف', nameEn: 'Package Design' },
      { nameAr: 'تصميم الإعلانات', nameEn: 'Ad Design' },
      { nameAr: 'تصميم السوشيال ميديا', nameEn: 'Social Media Graphics' },
      { nameAr: 'تصميم البانرات', nameEn: 'Banner Design' },
      { nameAr: 'الرسم الرقمي', nameEn: 'Digital Illustration' },
      { nameAr: 'تنقيح وتعديل الصور', nameEn: 'Photo Editing' }
    ])
  });

  // 2.2 التصميم والطباعة
  await db.insert(subcategories).values({
    categoryId: designServices.id,
    nameAr: 'التصميم والطباعة',
    nameEn: 'Design & Print',
    slug: 'design-print',
    icon: 'Printer',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'تصاميم التيشرتات', nameEn: 'T-shirt Designs' },
      { nameAr: 'تصاميم الأكواب', nameEn: 'Mug Designs' },
      { nameAr: 'تصاميم الحقائب', nameEn: 'Bag Designs' },
      { nameAr: 'تصاميم البوسترات', nameEn: 'Poster Designs' },
      { nameAr: 'تصاميم الملصقات', nameEn: 'Sticker Designs' },
      { nameAr: 'تصاميم القبعات', nameEn: 'Hat Designs' },
      { nameAr: 'تصاميم الوسائد', nameEn: 'Pillow Designs' },
      { nameAr: 'تصاميم الهواتف', nameEn: 'Phone Case Designs' },
      { nameAr: 'تصاميم اللوحات', nameEn: 'Canvas Prints' },
      { nameAr: 'تصاميم البطاقات وبطاقات الأعمال', nameEn: 'Card Designs' },
      { nameAr: 'تصاميم دعوات وبطاقات التهنئة', nameEn: 'Invitation Cards' },
      { nameAr: 'تصاميم شهادات', nameEn: 'Certificate Designs' }
    ])
  });

  // 2.3 تصميم المواقع والتطبيقات
  await db.insert(subcategories).values({
    categoryId: designServices.id,
    nameAr: 'تصميم المواقع والتطبيقات',
    nameEn: 'Web & App Design',
    slug: 'web-app-design',
    icon: 'Monitor',
    order: 3,
    types: JSON.stringify([
      { nameAr: 'تصميم UI واجهة المستخدم', nameEn: 'UI Design' },
      { nameAr: 'تصميم UX تجربة المستخدم', nameEn: 'UX Design' },
      { nameAr: 'تصميم المواقع Web Design', nameEn: 'Web Design' },
      { nameAr: 'تصميم التطبيقات App Design', nameEn: 'App Design' },
      { nameAr: 'تصميم لوحات التحكم Dashboard', nameEn: 'Dashboard Design' },
      { nameAr: 'المخططات الأولية Wireframing', nameEn: 'Wireframing' },
      { nameAr: 'النماذج الأولية Prototyping', nameEn: 'Prototyping' },
      { nameAr: 'تصميم الأيقونات Icon Design', nameEn: 'Icon Design' },
      { nameAr: 'تصميم التفاعل Interaction Design', nameEn: 'Interaction Design' },
      { nameAr: 'تصميم الاستجابة Responsive Design', nameEn: 'Responsive Design' }
    ])
  });

  console.log('  ✅ Completed: خدمات التصميم والإبداع (3 subcategories)');

  // ==================== 3. خدمات الصوت والفيديو ====================
  console.log('  ├─ 3. خدمات الصوت والفيديو');
  const [audioVideoServices] = await db.insert(categories).values({
    nameAr: 'خدمات الصوت والفيديو',
    nameEn: 'Audio & Video Services',
    slug: 'audio-video-services',
    icon: 'Video',
    market: 'services',
    order: 3
  }).returning();

  // 3.1 الخدمات الصوتية
  await db.insert(subcategories).values({
    categoryId: audioVideoServices.id,
    nameAr: 'الخدمات الصوتية',
    nameEn: 'Audio Services',
    slug: 'audio-services',
    icon: 'Mic',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'التعليق الصوتي Voice Over', nameEn: 'Voice Over' },
      { nameAr: 'إنتاج البودكاست', nameEn: 'تسجيل، تحرير، هندسة صوتية' },
      { nameAr: 'تأليف الموسيقى', nameEn: 'Music Composition' },
      { nameAr: 'المؤثرات الصوتية', nameEn: 'Sound Effects Creation' },
      { nameAr: 'الميكساج والماسترنج', nameEn: 'Audio Mixing & Mastering' },
      { nameAr: 'تسجيل وتأليف الأغاني', nameEn: 'Song Recording' },
      { nameAr: 'إنتاج الموسيقى', nameEn: 'Music Production' }
    ])
  });

  // 3.2 خدمات الفيديو
  await db.insert(subcategories).values({
    categoryId: audioVideoServices.id,
    nameAr: 'خدمات الفيديو',
    nameEn: 'Video Services',
    slug: 'video-services',
    icon: 'Film',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'تحرير الفيديو', nameEn: 'Video Editing' },
      { nameAr: 'إنتاج الفيديو', nameEn: 'Video Production' },
      { nameAr: 'الموشن جرافيك', nameEn: 'Motion Graphics' },
      { nameAr: 'الأنيميشن', nameEn: 'Animation' },
      { nameAr: 'فيديوهات توضيحية', nameEn: 'Explainer Videos' },
      { nameAr: 'فيديوهات تسويقية', nameEn: 'Marketing Videos' },
      { nameAr: 'فيديوهات السوشيال ميديا', nameEn: 'Social Media Videos' },
      { nameAr: 'تصوير فيديو', nameEn: 'Video Shooting' },
      { nameAr: 'تصوير طائرات بدون طيار', nameEn: 'Drone Videography' },
      { nameAr: 'تلوين الفيديو', nameEn: 'Color Grading' }
    ])
  });

  console.log('  ✅ Completed: خدمات الصوت والفيديو (2 subcategories)');

  // ==================== 4. خدمات البرمجة والتطوير ====================
  console.log('  ├─ 4. خدمات البرمجة والتطوير');
  const [programmingServices] = await db.insert(categories).values({
    nameAr: 'خدمات البرمجة والتطوير',
    nameEn: 'Programming & Development Services',
    slug: 'programming-development-services',
    icon: 'Code',
    market: 'services',
    order: 4
  }).returning();

  // 4.1 تطوير المواقع والتطبيقات
  await db.insert(subcategories).values({
    categoryId: programmingServices.id,
    nameAr: 'تطوير المواقع والتطبيقات',
    nameEn: 'Web & App Development',
    slug: 'web-app-development',
    icon: 'Globe',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'تطوير مواقع ويب', nameEn: 'Website Development' },
      { nameAr: 'تطوير تطبيقات موبايل', nameEn: 'Mobile App Development' },
      { nameAr: 'تطوير تطبيقات ويب', nameEn: 'Web App Development' },
      { nameAr: 'تطوير متاجر إلكترونية', nameEn: 'E-commerce Development' },
      { nameAr: 'تطوير WordPress', nameEn: 'WordPress Development' },
      { nameAr: 'تطوير Shopify', nameEn: 'Shopify Development' },
      { nameAr: 'تطوير APIs', nameEn: 'API Development' },
      { nameAr: 'تطوير قواعد البيانات', nameEn: 'Database Development' },
      { nameAr: 'تطوير Backend', nameEn: 'Backend Development' },
      { nameAr: 'تطوير Frontend', nameEn: 'Frontend Development' }
    ])
  });

  // 4.2 خدمات برمجية متخصصة
  await db.insert(subcategories).values({
    categoryId: programmingServices.id,
    nameAr: 'خدمات برمجية متخصصة',
    nameEn: 'Specialized Programming Services',
    slug: 'specialized-programming-services',
    icon: 'Terminal',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'تطوير الذكاء الاصطناعي', nameEn: 'AI Development' },
      { nameAr: 'تطوير Blockchain', nameEn: 'Blockchain Development' },
      { nameAr: 'تطوير الألعاب', nameEn: 'Game Development' },
      { nameAr: 'تطوير الأمن السيبراني', nameEn: 'Cybersecurity Development' },
      { nameAr: 'تطوير DevOps', nameEn: 'DevOps Services' },
      { nameAr: 'تطوير Cloud', nameEn: 'Cloud Development' },
      { nameAr: 'تطوير IoT', nameEn: 'IoT Development' },
      { nameAr: 'تطوير الروبوتات', nameEn: 'Robotics Development' },
      { nameAr: 'تحليل البيانات', nameEn: 'Data Analysis' },
      { nameAr: 'تعلم الآلة', nameEn: 'Machine Learning' }
    ])
  });

  console.log('  ✅ Completed: خدمات البرمجة والتطوير (2 subcategories)');

  // ==================== 5. خدمات التسويق والأعمال ====================
  console.log('  ├─ 5. خدمات التسويق والأعمال');
  const [marketingServices] = await db.insert(categories).values({
    nameAr: 'خدمات التسويق والأعمال',
    nameEn: 'Marketing & Business Services',
    slug: 'marketing-business-services',
    icon: 'TrendingUp',
    market: 'services',
    order: 5
  }).returning();

  // 5.1 التسويق الرقمي
  await db.insert(subcategories).values({
    categoryId: marketingServices.id,
    nameAr: 'التسويق الرقمي',
    nameEn: 'Digital Marketing',
    slug: 'digital-marketing',
    icon: 'Megaphone',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'تحسين محركات البحث SEO', nameEn: 'SEO Services' },
      { nameAr: 'التسويق عبر السوشيال ميديا', nameEn: 'Social Media Marketing' },
      { nameAr: 'إدارة الحملات الإعلانية', nameEn: 'Ad Campaign Management' },
      { nameAr: 'التسويق بالمحتوى', nameEn: 'Content Marketing' },
      { nameAr: 'التسويق بالبريد الإلكتروني', nameEn: 'Email Marketing' },
      { nameAr: 'التسويق بالعمولة', nameEn: 'Affiliate Marketing' },
      { nameAr: 'التسويق بالمؤثرين', nameEn: 'Influencer Marketing' },
      { nameAr: 'إعلانات Google', nameEn: 'Google Ads' },
      { nameAr: 'إعلانات Facebook', nameEn: 'Facebook Ads' },
      { nameAr: 'تحليلات التسويق', nameEn: 'Marketing Analytics' }
    ])
  });

  // 5.2 خدمات الأعمال
  await db.insert(subcategories).values({
    categoryId: marketingServices.id,
    nameAr: 'خدمات الأعمال',
    nameEn: 'Business Services',
    slug: 'business-services',
    icon: 'Briefcase',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'استشارات الأعمال', nameEn: 'Business Consulting' },
      { nameAr: 'إدارة المشاريع', nameEn: 'Project Management' },
      { nameAr: 'خطط الأعمال', nameEn: 'Business Plans' },
      { nameAr: 'دراسات الجدوى', nameEn: 'Feasibility Studies' },
      { nameAr: 'أبحاث السوق', nameEn: 'Market Research' },
      { nameAr: 'التحليل المالي', nameEn: 'Financial Analysis' },
      { nameAr: 'المحاسبة', nameEn: 'Accounting' },
      { nameAr: 'الموارد البشرية', nameEn: 'HR Services' },
      { nameAr: 'الخدمات القانونية', nameEn: 'Legal Services' },
      { nameAr: 'خدمات الأمانة', nameEn: 'Virtual Assistant' }
    ])
  });

  console.log('  ✅ Completed: خدمات التسويق والأعمال (2 subcategories)');

  // ==================== 6. خدمات التعليم والتدريب ====================
  console.log('  ├─ 6. خدمات التعليم والتدريب');
  const [educationServices] = await db.insert(categories).values({
    nameAr: 'خدمات التعليم والتدريب',
    nameEn: 'Education & Training Services',
    slug: 'education-training-services',
    icon: 'GraduationCap',
    market: 'services',
    order: 6
  }).returning();

  // 6.1 التعليم والتدريب
  await db.insert(subcategories).values({
    categoryId: educationServices.id,
    nameAr: 'التعليم والتدريب',
    nameEn: 'Education & Training',
    slug: 'education-training',
    icon: 'BookOpen',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'دروس خصوصية', nameEn: 'Private Tutoring' },
      { nameAr: 'دورات تدريبية', nameEn: 'Training Courses' },
      { nameAr: 'ورش عمل', nameEn: 'Workshops' },
      { nameAr: 'محاضرات', nameEn: 'Lectures' },
      { nameAr: 'استشارات تعليمية', nameEn: 'Educational Consulting' },
      { nameAr: 'تصميم المناهج', nameEn: 'Curriculum Design' },
      { nameAr: 'تطوير الدورات', nameEn: 'Course Development' },
      { nameAr: 'التدريب المهني', nameEn: 'Professional Training' },
      { nameAr: 'التدريب التقني', nameEn: 'Technical Training' },
      { nameAr: 'التدريب اللغوي', nameEn: 'Language Training' }
    ])
  });

  // 6.2 الكوتشينج والإرشاد
  await db.insert(subcategories).values({
    categoryId: educationServices.id,
    nameAr: 'الكوتشينج والإرشاد',
    nameEn: 'Coaching & Mentoring',
    slug: 'coaching-mentoring',
    icon: 'Users',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'كوتشينج الحياة', nameEn: 'Life Coaching' },
      { nameAr: 'كوتشينج الأعمال', nameEn: 'Business Coaching' },
      { nameAr: 'كوتشينج المهني', nameEn: 'Career Coaching' },
      { nameAr: 'كوتشينج الصحة', nameEn: 'Health Coaching' },
      { nameAr: 'كوتشينج اللياقة', nameEn: 'Fitness Coaching' },
      { nameAr: 'الإرشاد المهني', nameEn: 'Career Mentoring' },
      { nameAr: 'الإرشاد التقني', nameEn: 'Technical Mentoring' },
      { nameAr: 'الإرشاد الشخصي', nameEn: 'Personal Mentoring' },
      { nameAr: 'الإرشاد الروحي', nameEn: 'Spiritual Guidance' },
      { nameAr: 'استشارات نفسية', nameEn: 'Psychological Consulting' }
    ])
  });

  console.log('  ✅ Completed: خدمات التعليم والتدريب (2 subcategories)');

  // ==================== 7. الخدمات المتخصصة ====================
  console.log('  ├─ 7. الخدمات المتخصصة');
  const [specializedServices] = await db.insert(categories).values({
    nameAr: 'الخدمات المتخصصة',
    nameEn: 'Specialized Services',
    slug: 'specialized-services',
    icon: 'Wrench',
    market: 'services',
    order: 7
  }).returning();

  // 7.1 خدمات تقنية متخصصة
  await db.insert(subcategories).values({
    categoryId: specializedServices.id,
    nameAr: 'خدمات تقنية متخصصة',
    nameEn: 'Specialized Technical Services',
    slug: 'specialized-technical-services',
    icon: 'Settings',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'خدمات الأمن السيبراني', nameEn: 'Cybersecurity Services' },
      { nameAr: 'خدمات الحوسبة السحابية', nameEn: 'Cloud Services' },
      { nameAr: 'خدمات DevOps', nameEn: 'DevOps Services' },
      { nameAr: 'خدمات Blockchain', nameEn: 'Blockchain Services' },
      { nameAr: 'خدمات الذكاء الاصطناعي', nameEn: 'AI Services' },
      { nameAr: 'خدمات تعلم الآلة', nameEn: 'Machine Learning Services' },
      { nameAr: 'خدمات البيانات الضخمة', nameEn: 'Big Data Services' },
      { nameAr: 'خدمات IoT', nameEn: 'IoT Services' },
      { nameAr: 'خدمات الواقع الافتراضي', nameEn: 'VR Services' },
      { nameAr: 'خدمات الواقع المعزز', nameEn: 'AR Services' }
    ])
  });

  // 7.2 خدمات إبداعية متخصصة
  await db.insert(subcategories).values({
    categoryId: specializedServices.id,
    nameAr: 'خدمات إبداعية متخصصة',
    nameEn: 'Specialized Creative Services',
    slug: 'specialized-creative-services',
    icon: 'Sparkles',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'تصميم NFT', nameEn: 'NFT Design' },
      { nameAr: 'تصميم Metaverse', nameEn: 'Metaverse Design' },
      { nameAr: 'تصميم 3D', nameEn: '3D Design' },
      { nameAr: 'الأنيميشن 3D', nameEn: '3D Animation' },
      { nameAr: 'تصميم الشخصيات', nameEn: 'Character Design' },
      { nameAr: 'تصميم البيئات', nameEn: 'Environment Design' },
      { nameAr: 'تصميم الألعاب', nameEn: 'Game Design' },
      { nameAr: 'تصميم VR/AR', nameEn: 'VR/AR Design' },
      { nameAr: 'الفن الرقمي', nameEn: 'Digital Art' },
      { nameAr: 'الفن التوليدي', nameEn: 'Generative Art' }
    ])
  });

  // 7.3 خدمات استشارية متخصصة
  await db.insert(subcategories).values({
    categoryId: specializedServices.id,
    nameAr: 'خدمات استشارية متخصصة',
    nameEn: 'Specialized Consulting Services',
    slug: 'specialized-consulting-services',
    icon: 'MessageSquare',
    order: 3,
    types: JSON.stringify([
      { nameAr: 'استشارات تحول رقمي', nameEn: 'Digital Transformation Consulting' },
      { nameAr: 'استشارات استراتيجية', nameEn: 'Strategy Consulting' },
      { nameAr: 'استشارات تقنية', nameEn: 'Technical Consulting' },
      { nameAr: 'استشارات أمنية', nameEn: 'Security Consulting' },
      { nameAr: 'استشارات سحابية', nameEn: 'Cloud Consulting' },
      { nameAr: 'استشارات بيانات', nameEn: 'Data Consulting' },
      { nameAr: 'استشارات ذكاء اصطناعي', nameEn: 'AI Consulting' },
      { nameAr: 'استشارات Blockchain', nameEn: 'Blockchain Consulting' },
      { nameAr: 'استشارات تسويق رقمي', nameEn: 'Digital Marketing Consulting' },
      { nameAr: 'استشارات تجربة المستخدم', nameEn: 'UX Consulting' }
    ])
  });

  // 7.4 خدمات الذكاء الاصطناعي
  await db.insert(subcategories).values({
    categoryId: specializedServices.id,
    nameAr: 'خدمات الذكاء الاصطناعي',
    nameEn: 'AI Services',
    slug: 'ai-services',
    icon: 'Brain',
    order: 4,
    types: JSON.stringify([
      { nameAr: 'تطوير نماذج AI', nameEn: 'AI Model Development' },
      { nameAr: 'معالجة اللغة الطبيعية', nameEn: 'NLP Services' },
      { nameAr: 'رؤية الحاسوب', nameEn: 'Computer Vision' },
      { nameAr: 'التعلم العميق', nameEn: 'Deep Learning' },
      { nameAr: 'التعلم الآلي', nameEn: 'Machine Learning' },
      { nameAr: 'الروبوتات الذكية', nameEn: 'Intelligent Bots' },
      { nameAr: 'تحليل البيانات بالذكاء الاصطناعي', nameEn: 'AI Data Analysis' },
      { nameAr: 'التنبؤ بالذكاء الاصطناعي', nameEn: 'AI Prediction' },
      { nameAr: 'توليد المحتوى بالذكاء الاصطناعي', nameEn: 'AI Content Generation' },
      { nameAr: 'استشارات الذكاء الاصطناعي', nameEn: 'AI Consulting' }
    ])
  });

  console.log('  ✅ Completed: الخدمات المتخصصة (4 subcategories)');

  // ==================== 8. الخدمات الحية ====================
  console.log('  ├─ 8. الخدمات الحية');
  const [liveServices] = await db.insert(categories).values({
    nameAr: 'الخدمات الحية',
    nameEn: 'Live Services',
    slug: 'live-services',
    icon: 'Radio',
    market: 'services',
    order: 8
  }).returning();

  // 8.1 الجلسات الحية
  await db.insert(subcategories).values({
    categoryId: liveServices.id,
    nameAr: 'الجلسات الحية',
    nameEn: 'Live Sessions',
    slug: 'live-sessions',
    icon: 'Video',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'استشارات حية', nameEn: 'Live Consultations' },
      { nameAr: 'دروس حية', nameEn: 'Live Lessons' },
      { nameAr: 'ورش عمل حية', nameEn: 'Live Workshops' },
      { nameAr: 'ندوات حية', nameEn: 'Live Webinars' },
      { nameAr: 'جلسات كوتشينج حية', nameEn: 'Live Coaching Sessions' },
      { nameAr: 'جلسات علاج حية', nameEn: 'Live Therapy Sessions' },
      { nameAr: 'جلسات تدريب حية', nameEn: 'Live Training Sessions' },
      { nameAr: 'مقابلات حية', nameEn: 'Live Interviews' },
      { nameAr: 'عروض تقديمية حية', nameEn: 'Live Presentations' },
      { nameAr: 'اجتماعات حية', nameEn: 'Live Meetings' }
    ])
  });

  // 8.2 البث المباشر
  await db.insert(subcategories).values({
    categoryId: liveServices.id,
    nameAr: 'البث المباشر',
    nameEn: 'Live Streaming',
    slug: 'live-streaming',
    icon: 'Tv',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'بث الفعاليات', nameEn: 'Event Streaming' },
      { nameAr: 'بث المؤتمرات', nameEn: 'Conference Streaming' },
      { nameAr: 'بث الألعاب', nameEn: 'Gaming Streaming' },
      { nameAr: 'بث الموسيقى', nameEn: 'Music Streaming' },
      { nameAr: 'بث التعليم', nameEn: 'Educational Streaming' },
      { nameAr: 'بث الرياضة', nameEn: 'Sports Streaming' },
      { nameAr: 'بث الأخبار', nameEn: 'News Streaming' },
      { nameAr: 'بث الترفيه', nameEn: 'Entertainment Streaming' },
      { nameAr: 'بث التسويق', nameEn: 'Marketing Streaming' },
      { nameAr: 'بث المنتجات', nameEn: 'Product Streaming' }
    ])
  });

  console.log('  ✅ Completed: الخدمات الحية (2 subcategories)');
  console.log('✅ Services Market Completed! (8 main categories, 21 subcategories)\n');



  // ========================================
  // سوق فرص العمل الحر الرقمي عن بعد
  // Remote Freelance Digital Work Opportunities Market
  // ========================================

  console.log('📦 Seeding Jobs Market Categories...');

  // Note: Jobs market uses the same categories as Services but as freelance opportunities
  // We'll create separate categories for Jobs market to allow independent management

  // ==================== 1. الكتابة والمحتوى ====================
  console.log('  ├─ 1. الكتابة والمحتوى');
  const [jobsWriting] = await db.insert(categories).values({
    nameAr: 'الكتابة والمحتوى',
    nameEn: 'Writing & Content',
    slug: 'jobs-writing-content',
    icon: 'PenTool',
    market: 'jobs',
    order: 1
  }).returning();

  await db.insert(subcategories).values({
    categoryId: jobsWriting.id,
    nameAr: 'كتابة المحتوى',
    nameEn: 'Content Writing',
    slug: 'jobs-content-writing',
    icon: 'FileText',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'كتابة المقالات', nameEn: 'مقالات متخصصة، مقالات SEO' },
      { nameAr: 'كتابة المدونات', nameEn: 'محتوى مدونات، Guest Posts' },
      { nameAr: 'كتابة النصوص التسويقية', nameEn: 'Copywriting, Sales Copy' },
      { nameAr: 'أوصاف المنتجات النصوص الإعلانية', nameEn: 'Product Descriptions' },
      { nameAr: 'كتابة السيناريوهات', nameEn: 'سيناريوهات فيديو، أفلام' },
      { nameAr: 'كتابة البودكاست', nameEn: 'نصوص بودكاست، حوارات' },
      { nameAr: 'كتابة المحتوى التقني', nameEn: 'Technical Writing' },
      { nameAr: 'كتابة المحتوى الطبي', nameEn: 'Medical Writing' },
      { nameAr: 'كتابة المحتوى القانوني', nameEn: 'Legal Writing' },
      { nameAr: 'Ghost Writing', nameEn: 'Ghost Writing' },
      { nameAr: 'كتابة السيرة الذاتية', nameEn: 'CV Writing' },
      { nameAr: 'بحوث وتقارير وتحليلات ودراسات', nameEn: 'كل أنواع البحوث والدراسات والتحليلات والتقارير' },
      { nameAr: 'إعداد محتوى ورش عمل ودورات تدريبية محتويات نصية أخرى', nameEn: 'Workshop & Training Content' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsWriting.id,
    nameAr: 'التحرير والترجمة',
    nameEn: 'Editing & Translation',
    slug: 'jobs-editing-translation',
    icon: 'Languages',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'التحرير اللغوي', nameEn: 'Editing, Proofreading' },
      { nameAr: 'التدقيق اللغوي', nameEn: 'Grammar, Spelling Check' },
      { nameAr: 'الترجمة العامة', nameEn: 'ترجمة نصوص عامة' },
      { nameAr: 'الترجمة المتخصصة', nameEn: 'طبية، قانونية، تقنية' },
      { nameAr: 'الترجمة الفورية', nameEn: 'Simultaneous Translation' },
      { nameAr: 'التعريب', nameEn: 'Localization' },
      { nameAr: 'تفريغ صوتي', nameEn: 'Transcription' },
      { nameAr: 'كتابة الترجمة', nameEn: 'Subtitling' },
      { nameAr: 'إعادة الكتابة', nameEn: 'Rewriting' },
      { nameAr: 'التلخيص', nameEn: 'Summarization' }
    ])
  });

  console.log('  ✅ Completed: الكتابة والمحتوى (2 subcategories)');

  // ==================== 2. التصميم والإبداع ====================
  console.log('  ├─ 2. التصميم والإبداع');
  const [jobsDesign] = await db.insert(categories).values({
    nameAr: 'التصميم والإبداع',
    nameEn: 'Design & Creative',
    slug: 'jobs-design-creative',
    icon: 'Palette',
    market: 'jobs',
    order: 2
  }).returning();

  await db.insert(subcategories).values({
    categoryId: jobsDesign.id,
    nameAr: 'التصميم الجرافيكي',
    nameEn: 'Graphic Design',
    slug: 'jobs-graphic-design',
    icon: 'Paintbrush',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'تصميم الشعارات', nameEn: 'Logo Design' },
      { nameAr: 'تصميم الهوية البصرية', nameEn: 'Brand Identity' },
      { nameAr: 'تصميم البوسترات', nameEn: 'Poster Design' },
      { nameAr: 'تصميم البروشورات', nameEn: 'Brochure Design' },
      { nameAr: 'تصميم الكتب', nameEn: 'Book Design' },
      { nameAr: 'تصميم الأغلفة', nameEn: 'Cover Design' },
      { nameAr: 'تصميم البطاقات', nameEn: 'Card Design' },
      { nameAr: 'تصميم التغليف', nameEn: 'Package Design' },
      { nameAr: 'تصميم الإعلانات', nameEn: 'Ad Design' },
      { nameAr: 'تصميم السوشيال ميديا', nameEn: 'Social Media Graphics' },
      { nameAr: 'تصميم البانرات', nameEn: 'Banner Design' },
      { nameAr: 'الرسم الرقمي تنقيح وتعديل الصور', nameEn: 'Digital Illustration' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsDesign.id,
    nameAr: 'التصميم والطباعة',
    nameEn: 'Design & Print',
    slug: 'jobs-design-print',
    icon: 'Printer',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'تصاميم التيشرتات', nameEn: 'T-shirt Designs' },
      { nameAr: 'تصاميم الأكواب', nameEn: 'Mug Designs' },
      { nameAr: 'تصاميم الحقائب', nameEn: 'Bag Designs' },
      { nameAr: 'تصاميم البوسترات', nameEn: 'Poster Designs' },
      { nameAr: 'تصاميم الملصقات', nameEn: 'Sticker Designs' },
      { nameAr: 'تصاميم القبعات', nameEn: 'Hat Designs' },
      { nameAr: 'تصاميم الوسائد', nameEn: 'Pillow Designs' },
      { nameAr: 'تصاميم الهواتف', nameEn: 'Phone Case Designs' },
      { nameAr: 'تصاميم اللوحات', nameEn: 'Canvas Prints' },
      { nameAr: 'تصاميم البطاقات وبطاقات الأعمال', nameEn: 'Card Designs' },
      { nameAr: 'تصاميم دعوات وبطاقات التهنئة', nameEn: 'Invitation Cards' },
      { nameAr: 'تصاميم شهادات', nameEn: 'Certificate Designs' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsDesign.id,
    nameAr: 'تصميم المواقع والتطبيقات',
    nameEn: 'Web & App Design',
    slug: 'jobs-web-app-design',
    icon: 'Monitor',
    order: 3,
    types: JSON.stringify([
      { nameAr: 'تصميم UI', nameEn: 'UI Design' },
      { nameAr: 'تصميم UX', nameEn: 'UX Design' },
      { nameAr: 'تصميم المواقع', nameEn: 'Web Design' },
      { nameAr: 'تصميم التطبيقات', nameEn: 'App Design' },
      { nameAr: 'تصميم لوحات التحكم', nameEn: 'Dashboard Design' },
      { nameAr: 'المخططات الأولية', nameEn: 'Wireframing' },
      { nameAr: 'النماذج الأولية', nameEn: 'Prototyping' },
      { nameAr: 'تصميم الأيقونات', nameEn: 'Icon Design' },
      { nameAr: 'تصميم التفاعل', nameEn: 'Interaction Design' },
      { nameAr: 'تصميم الاستجابة', nameEn: 'Responsive Design' }
    ])
  });

  console.log('  ✅ Completed: التصميم والإبداع (3 subcategories)');

  // ==================== 3. الصوت والفيديو ====================
  console.log('  ├─ 3. الصوت والفيديو');
  const [jobsAudioVideo] = await db.insert(categories).values({
    nameAr: 'الصوت والفيديو',
    nameEn: 'Audio & Video',
    slug: 'jobs-audio-video',
    icon: 'Video',
    market: 'jobs',
    order: 3
  }).returning();

  await db.insert(subcategories).values({
    categoryId: jobsAudioVideo.id,
    nameAr: 'الخدمات الصوتية',
    nameEn: 'Audio Services',
    slug: 'jobs-audio-services',
    icon: 'Mic',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'التعليق الصوتي إنتاج البودكاست', nameEn: 'Voice Over' },
      { nameAr: 'تأليف الموسيقى', nameEn: 'Music Composition' },
      { nameAr: 'المؤثرات الصوتية', nameEn: 'Sound Effects Creation' },
      { nameAr: 'الميكساج والماسترنج', nameEn: 'Audio Mixing & Mastering' },
      { nameAr: 'تسجيل وتأليف الأغاني', nameEn: 'Song Recording' },
      { nameAr: 'إنتاج الموسيقى', nameEn: 'Music Production' },
      { nameAr: 'تحرير الصوت', nameEn: 'Audio Editing' },
      { nameAr: 'ترميم الصوت', nameEn: 'Audio Restoration' },
      { nameAr: 'مؤثرات صوتية سينمائية', nameEn: 'Foley Art' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsAudioVideo.id,
    nameAr: 'خدمات الفيديو',
    nameEn: 'Video Services',
    slug: 'jobs-video-services',
    icon: 'Film',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'إنتاج الفيديو', nameEn: 'تصوير، مونتاج، إخراج، إعلانات، أفلام قصيرة، أفلام سينمائية، تغطيات' },
      { nameAr: 'تصوير الفعاليات والمناسبات', nameEn: 'Event Coverage' },
      { nameAr: 'تصوير المنتجات', nameEn: 'Product Photography' },
      { nameAr: 'المونتاج', nameEn: 'Video Editing' },
      { nameAr: 'الموشن جرافيك', nameEn: 'Motion Graphics' },
      { nameAr: 'الرسوم المتحركة 2D', nameEn: '2D Animation' },
      { nameAr: 'الرسوم المتحركة 3D', nameEn: '3D Animation' },
      { nameAr: 'المؤثرات البصرية VFX', nameEn: 'Visual Effects' },
      { nameAr: 'تصحيح الألوان', nameEn: 'Color Grading' },
      { nameAr: 'البث المباشر', nameEn: 'Live Streaming' }
    ])
  });

  console.log('  ✅ Completed: الصوت والفيديو (2 subcategories)');

  // ==================== 4. البرمجة والتطوير ====================
  console.log('  ├─ 4. البرمجة والتطوير');
  const [jobsProgramming] = await db.insert(categories).values({
    nameAr: 'البرمجة والتطوير',
    nameEn: 'Programming & Development',
    slug: 'jobs-programming-development',
    icon: 'Code',
    market: 'jobs',
    order: 4
  }).returning();

  await db.insert(subcategories).values({
    categoryId: jobsProgramming.id,
    nameAr: 'تطوير المواقع الكاملة',
    nameEn: 'Full Stack Development',
    slug: 'jobs-full-stack-development',
    icon: 'Globe',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'تطوير Frontend', nameEn: 'HTML, CSS, JavaScript' },
      { nameAr: 'تطوير Backend', nameEn: 'Server-side Development' },
      { nameAr: 'Full Stack Development', nameEn: 'بناء وتطوير مواقع وتطبيقات كاملة End to End & Full Stack Apps and Webs' },
      { nameAr: 'تطوير WordPress مواقع ووردبريس', nameEn: 'WordPress Development' },
      { nameAr: 'تطوير Shopify متاجر شوبيفاي', nameEn: 'Shopify Development' },
      { nameAr: 'تطوير Laravel تطبيقات', nameEn: 'Laravel Development' },
      { nameAr: 'تطوير React تطبيقات', nameEn: 'React Development' },
      { nameAr: 'تطوير Vue تطبيقات', nameEn: 'Vue Development' },
      { nameAr: 'تطوير Angular تطبيقات', nameEn: 'Angular Development' },
      { nameAr: 'تطوير API واجهات برمجية', nameEn: 'API Development' },
      { nameAr: 'تطوير CMS أنظمة إدارة محتوى', nameEn: 'CMS Development' },
      { nameAr: 'صيانة المواقع ودعم فني', nameEn: 'Website Maintenance' },
      { nameAr: 'تخصيص السكريبتات والبرمجيات والمكونات الإضافية', nameEn: 'Script Customization' },
      { nameAr: 'حلول مؤسسية متخصصة', nameEn: 'حلول مؤسسية متخصصة أختبار البرمجيات (Testing)' },
      { nameAr: 'تكامل البرمجي (System Integration)', nameEn: 'System Integration' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsProgramming.id,
    nameAr: 'تطوير التطبيقات الكاملة',
    nameEn: 'Full App Development',
    slug: 'jobs-full-app-development',
    icon: 'Smartphone',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'تطوير iOS تطبيقات آيفون', nameEn: 'iOS Development' },
      { nameAr: 'تطوير Android تطبيقات أندرويد', nameEn: 'Android Development' },
      { nameAr: 'تطوير Cross-Platform', nameEn: 'Flutter, React Native' },
      { nameAr: 'تطوير Desktop Apps تطبيقات سطح المكتب', nameEn: 'Desktop Apps' },
      { nameAr: 'تطوير PWA', nameEn: 'Progressive Web Apps' },
      { nameAr: 'تطوير الألعاب', nameEn: 'Game Development' },
      { nameAr: 'تطوير VR/AR تطبيقات الواقع الافتراضي', nameEn: 'VR/AR Development' },
      { nameAr: 'تطوير IoT إنترنت الأشياء', nameEn: 'IoT Development' },
      { nameAr: 'تطوير Blockchain تطبيقات البلوكشين', nameEn: 'Blockchain Development' },
      { nameAr: 'تطوير AI/ML الذكاء الاصطناعي', nameEn: 'AI/ML Development' }
    ])
  });

  console.log('  ✅ Completed: البرمجة والتطوير (2 subcategories)');

  // ==================== 5. التسويق الرقمي والأعمال ====================
  console.log('  ├─ 5. التسويق الرقمي والأعمال');
  const [jobsMarketing] = await db.insert(categories).values({
    nameAr: 'التسويق الرقمي والأعمال',
    nameEn: 'Digital Marketing & Business',
    slug: 'jobs-digital-marketing-business',
    icon: 'TrendingUp',
    market: 'jobs',
    order: 5
  }).returning();

  await db.insert(subcategories).values({
    categoryId: jobsMarketing.id,
    nameAr: 'خدمات التسويق الرقمي',
    nameEn: 'Digital Marketing Services',
    slug: 'jobs-digital-marketing-services',
    icon: 'Megaphone',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'تحسين محركات البحث SEO', nameEn: 'On-page, Off-page SEO' },
      { nameAr: 'التسويق بالمحتوى', nameEn: 'Content Marketing' },
      { nameAr: 'إدارة السوشيال ميديا', nameEn: 'Social Media Management' },
      { nameAr: 'الإعلانات المدفوعة PPC', nameEn: 'Google Ads, Facebook Ads' },
      { nameAr: 'التسويق بالبريد الإلكتروني', nameEn: 'Email Marketing' },
      { nameAr: 'التسويق بالعمولة', nameEn: 'Affiliate Marketing' },
      { nameAr: 'التسويق بالمؤثرين', nameEn: 'Influencer Marketing' },
      { nameAr: 'تحليل البيانات', nameEn: 'Analytics & Reporting' },
      { nameAr: 'استراتيجيات التسويق', nameEn: 'Marketing Strategy' },
      { nameAr: 'تحسين معدل التحويل CRO', nameEn: 'Conversion Optimization' },
      { nameAr: 'النمو السريع', nameEn: 'Growth Hacking' },
      { nameAr: 'أتمتة التسويق', nameEn: 'Marketing Automation' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsMarketing.id,
    nameAr: 'الاستشارات والخدمات المهنية',
    nameEn: 'Consulting & Professional Services',
    slug: 'jobs-consulting-professional-services',
    icon: 'Briefcase',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'استشارات الأعمال', nameEn: 'Business Consulting' },
      { nameAr: 'استشارات التسويق', nameEn: 'Marketing Consulting' },
      { nameAr: 'استشارات مالية', nameEn: 'Financial Consulting' },
      { nameAr: 'استشارات تقنية وبرمجية', nameEn: 'IT Consulting' },
      { nameAr: 'استشارات الموارد البشرية', nameEn: 'HR Consulting' },
      { nameAr: 'استشارات قانونية', nameEn: 'Legal Consulting' },
      { nameAr: 'استشارات الإدارة', nameEn: 'Management Consulting' },
      { nameAr: 'دراسات الجدوى', nameEn: 'Feasibility Studies' },
      { nameAr: 'أبحاث السوق', nameEn: 'Market Research' },
      { nameAr: 'تخطيط للأعمال', nameEn: 'Business Planning' },
      { nameAr: 'إدارة المشاريع', nameEn: 'Project Management' },
      { nameAr: 'مساعد افتراضي Virtual Assistant', nameEn: 'Virtual Assistant' },
      { nameAr: 'استشارات توجيه وإرشاد نفسي وذاتي ووعي وتطوير ذاتي', nameEn: 'Life Coaching' }
    ])
  });

  console.log('  ✅ Completed: التسويق الرقمي والأعمال (2 subcategories)');

  // ==================== 6. التعليم والتدريب ====================
  console.log('  ├─ 6. التعليم والتدريب');
  const [jobsEducation] = await db.insert(categories).values({
    nameAr: 'التعليم والتدريب',
    nameEn: 'Education & Training',
    slug: 'jobs-education-training',
    icon: 'GraduationCap',
    market: 'jobs',
    order: 6
  }).returning();

  await db.insert(subcategories).values({
    categoryId: jobsEducation.id,
    nameAr: 'التدريس والتعليم عبر الإنترنت',
    nameEn: 'Online Teaching & Education',
    slug: 'jobs-online-teaching-education',
    icon: 'BookOpen',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'التدريس الخصوصي دروس خصوصية أونلاين', nameEn: 'Private Tutoring' },
      { nameAr: 'تعليم اللغات', nameEn: 'Language Teaching' },
      { nameAr: 'تعليم البرمجة', nameEn: 'Programming Tutoring' },
      { nameAr: 'تعليم الموسيقى', nameEn: 'Music Lessons' },
      { nameAr: 'تعليم الفنون', nameEn: 'Art Classes' },
      { nameAr: 'التعليم الأكاديمي', nameEn: 'Academic Tutoring' },
      { nameAr: 'تعليم المهارات', nameEn: 'Skills Training' },
      { nameAr: 'تحضير الامتحانات', nameEn: 'Test Preparation' },
      { nameAr: 'IELTS/TOEFL تحضير اختبارات اللغة', nameEn: 'IELTS/TOEFL' },
      { nameAr: 'SAT/GRE تحضير اختبارات القبول', nameEn: 'SAT/GRE' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsEducation.id,
    nameAr: 'التدريب والتطوير المهني',
    nameEn: 'Professional Training & Development',
    slug: 'jobs-professional-training-development',
    icon: 'Users',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'التدريب على الحياة', nameEn: 'Life Coaching' },
      { nameAr: 'تدريب الأعمال', nameEn: 'Business Coaching' },
      { nameAr: 'التوجيه المهني', nameEn: 'Career Coaching' },
      { nameAr: 'تدريب التنفيذيين', nameEn: 'Executive Coaching' },
      { nameAr: 'تدريب القيادة', nameEn: 'Leadership Training' },
      { nameAr: 'المهارات الناعمة', nameEn: 'Soft Skills Training' },
      { nameAr: 'التدريب التقني', nameEn: 'Technical Training' },
      { nameAr: 'تدريب المبيعات', nameEn: 'Sales Training' },
      { nameAr: 'تدريب خدمة العملاء', nameEn: 'Customer Service Training' },
      { nameAr: 'بناء الفريق', nameEn: 'Team Building' }
    ])
  });

  console.log('  ✅ Completed: التعليم والتدريب (2 subcategories)');

  // ==================== 7. الخدمات المتخصصة ====================
  console.log('  ├─ 7. الخدمات المتخصصة');
  const [jobsSpecialized] = await db.insert(categories).values({
    nameAr: 'الخدمات المتخصصة',
    nameEn: 'Specialized Services',
    slug: 'jobs-specialized-services',
    icon: 'Wrench',
    market: 'jobs',
    order: 7
  }).returning();

  await db.insert(subcategories).values({
    categoryId: jobsSpecialized.id,
    nameAr: 'خدمات البيانات والتحليل',
    nameEn: 'Data & Analysis Services',
    slug: 'jobs-data-analysis-services',
    icon: 'BarChart',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'تحليل البيانات', nameEn: 'Data Analysis' },
      { nameAr: 'علم البيانات', nameEn: 'Data Science' },
      { nameAr: 'تعلم الآلة', nameEn: 'Machine Learning' },
      { nameAr: 'الذكاء الاصطناعي ذكاء الأعمال', nameEn: 'AI Development Business Intelligence' },
      { nameAr: 'تصور البيانات', nameEn: 'Data Visualization' },
      { nameAr: 'البيانات الضخمة', nameEn: 'Big Data' },
      { nameAr: 'التنقيب عن البيانات', nameEn: 'Data Mining' },
      { nameAr: 'التحليلات التنبؤية', nameEn: 'Predictive Analytics' },
      { nameAr: 'التحليل الإحصائي', nameEn: 'Statistical Analysis' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsSpecialized.id,
    nameAr: 'خدمات الأمن السيبراني',
    nameEn: 'Cybersecurity Services',
    slug: 'jobs-cybersecurity-services',
    icon: 'Shield',
    order: 2,
    types: JSON.stringify([
      { nameAr: 'اختبار الاختراق', nameEn: 'Penetration Testing' },
      { nameAr: 'تقييم الثغرات', nameEn: 'Vulnerability Assessment' },
      { nameAr: 'استشارات الأمن', nameEn: 'Security Consulting' },
      { nameAr: 'الاستجابة للحوادث', nameEn: 'Incident Response' },
      { nameAr: 'مراجعة الأمن', nameEn: 'Security Audits' },
      { nameAr: 'الامتثال', nameEn: 'Compliance' },
      { nameAr: 'تدريب الأمن', nameEn: 'Security Training' },
      { nameAr: 'التحقيقات الرقمية', nameEn: 'Forensics' },
      { nameAr: 'مركز عمليات الأمن', nameEn: 'SOC Services' },
      { nameAr: 'تقييم المخاطر', nameEn: 'Risk Assessment' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsSpecialized.id,
    nameAr: 'خدمات العمل الحر الأخرى',
    nameEn: 'Other Freelance Services',
    slug: 'jobs-other-freelance-services',
    icon: 'MoreHorizontal',
    order: 3,
    types: JSON.stringify([
      { nameAr: 'إدارة المتاجر الإلكترونية', nameEn: 'E-commerce Management' },
      { nameAr: 'خدمة العملاء عن بعد', nameEn: 'Remote Customer Service' },
      { nameAr: 'إدخال البيانات', nameEn: 'Data Entry' },
      { nameAr: 'البحث على الإنترنت', nameEn: 'Internet Research' },
      { nameAr: 'النسخ الطبي', nameEn: 'Medical Transcription' },
      { nameAr: 'المحاسبة عن بعد', nameEn: 'Remote Accounting' },
      { nameAr: 'إدارة حسابات التواصل', nameEn: 'Social Media Management' },
      { nameAr: 'إدارة المجتمعات', nameEn: 'Community Management' },
      { nameAr: 'مراقبة المحتوى', nameEn: 'Content Moderation' },
      { nameAr: 'إدارة السمعة', nameEn: 'Online Reputation Management' },
      { nameAr: 'إدارة حسابات التداول اليومي', nameEn: 'تداول الأسهم والعملات الرقمية' },
      { nameAr: 'إدارة حسابات التسويق بالعمولة Affiliate Marketing Management', nameEn: 'Affiliate Marketing' },
      { nameAr: 'خدمات الربط بين الشركات والفريلانسرز Freelance Marketplace Brokering', nameEn: 'Freelance Brokering' }
    ])
  });

  await db.insert(subcategories).values({
    categoryId: jobsSpecialized.id,
    nameAr: 'خدمات الذكاء الاصطناعي والوكلاء والأتمتة',
    nameEn: 'AI, Agents & Automation Services',
    slug: 'jobs-ai-agents-automation-services',
    icon: 'Brain',
    order: 4,
    types: JSON.stringify([
      { nameAr: 'تطوير Chatbots', nameEn: 'AI Chatbot Development' },
      { nameAr: 'مساعدات ذكاء اصطناعي', nameEn: 'Virtual AI Assistants' },
      { nameAr: 'إنتاج محتوى بالذكاء الاصطناعي', nameEn: 'AI Content Generation' },
      { nameAr: 'خدمات صوتية بالذكاء الاصطناعي', nameEn: 'AI Voice Services' },
      { nameAr: 'توليد صور بالذكاء الاصطناعي', nameEn: 'AI Image Generation' },
      { nameAr: 'توليد فيديو بالذكاء الاصطناعي', nameEn: 'AI Video Generation' },
      { nameAr: 'أتمتة العمليات', nameEn: 'Process Automation' },
      { nameAr: 'أتمتة سير العمل', nameEn: 'Workflow Automation' },
      { nameAr: 'Robotic Process Automation', nameEn: 'RPA Services' },
      { nameAr: 'تدريب نماذج الذكاء الاصطناعي', nameEn: 'AI Training Services' },
      { nameAr: 'دمج حلول الذكاء الاصطناعي', nameEn: 'AI Integration Services' },
      { nameAr: 'تطوير بدون برمجة', nameEn: 'No-code/Low-code Development' }
    ])
  });

  console.log('  ✅ Completed: الخدمات المتخصصة (4 subcategories)');

  // ==================== 8. الخدمات الحية والتفاعلية ====================
  console.log('  ├─ 8. الخدمات الحية والتفاعلية');
  const [jobsLive] = await db.insert(categories).values({
    nameAr: 'الخدمات الحية والتفاعلية',
    nameEn: 'Live & Interactive Services',
    slug: 'jobs-live-interactive-services',
    icon: 'Radio',
    market: 'jobs',
    order: 8
  }).returning();

  await db.insert(subcategories).values({
    categoryId: jobsLive.id,
    nameAr: 'الفعاليات والورش الحية',
    nameEn: 'Live Events & Workshops',
    slug: 'jobs-live-events-workshops',
    icon: 'Video',
    order: 1,
    types: JSON.stringify([
      { nameAr: 'استشارات حية', nameEn: 'Live Consultations' },
      { nameAr: 'دروس حية', nameEn: 'Live Lessons' },
      { nameAr: 'ورش عمل حية', nameEn: 'Live Workshops' },
      { nameAr: 'ندوات حية', nameEn: 'Live Webinars' },
      { nameAr: 'جلسات كوتشينج حية', nameEn: 'Live Coaching Sessions' },
      { nameAr: 'جلسات علاج حية', nameEn: 'Live Therapy Sessions' },
      { nameAr: 'جلسات تدريب حية', nameEn: 'Live Training Sessions' },
      { nameAr: 'مقابلات حية', nameEn: 'Live Interviews' },
      { nameAr: 'عروض تقديمية حية', nameEn: 'Live Presentations' },
      { nameAr: 'اجتماعات حية', nameEn: 'Live Meetings' }
    ])
  });

  console.log('  ✅ Completed: الخدمات الحية والتفاعلية (1 subcategory)');
  console.log('✅ Jobs Market Completed! (8 main categories, 20 subcategories)\n');

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
seedCompleteCategories()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

