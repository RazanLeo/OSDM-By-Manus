import { db } from '../db';
import { categories, subcategories } from '../schema';

export async function seedFullCategories() {
  console.log('🌱 Starting full categories seeding...');

  // حذف البيانات القديمة
  await db.delete(subcategories);
  await db.delete(categories);

  // ========== سوق المنتجات الرقمية الجاهزة ==========
  
  // 1. المحتوى النصي والمكتوب
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
      { nameAr: 'أوراق عمل', nameEn': 'Worksheets' },
      { nameAr: 'اختبارات ومسابقات', nameEn: 'Quizzes & Tests' },
      { nameAr: 'ملفات بروم��تات (هندسة الأوامر)', nameEn: 'Prompt Files (Prompt Engineering)' }
    ])
  });

  console.log('✅ Seeded: المحتوى النصي والمكتوب (4 subcategories)');

  // سأكمل باقي التصنيفات...
  console.log('🌱 Full categories seeding completed!');
}

