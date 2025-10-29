import { db } from '../db';
import { productCategories, serviceCategories } from '../schema';

/**
 * Seeder كامل لجميع التصنيفات الأساسية والفرعية والأنواع
 * للأسواق الثلاثة (المنتجات الجاهزة + الخدمات المتخصصة + فرص العمل)
 */

export async function seedCompleteCategories() {
  console.log('🌱 بدء إضافة التصنيفات الكاملة...');

  // ============================================
  // A - سوق المنتجات الرقمية الجاهزة
  // ============================================
  
  // 1. المحتوى النصي والمكتوب
  const textContent = await db.insert(productCategories).values({
    nameAr: 'المحتوى النصي والمكتوب',
    nameEn: 'Written & Text Content',
    descriptionAr: 'كتب إلكترونية، بحوث، دراسات، قوالب نصية، ومحتوى تعليمي مكتوب',
    descriptionEn: 'E-books, research, studies, text templates, and written educational content',
    icon: 'BookText',
    parentId: null,
    order: 1,
  });

  const textContentId = textContent.insertId;

  // 1.1 الكتب الإلكترونية
  const ebooks = await db.insert(productCategories).values({
    nameAr: 'الكتب الإلكترونية',
    nameEn: 'E-Books',
    descriptionAr: 'كتب رقمية في جميع المجالات',
    descriptionEn: 'Digital books in all fields',
    icon: 'Book',
    parentId: textContentId,
    order: 1,
  });

  const ebooksId = ebooks.insertId;

  // أنواع الكتب الإلكترونية
  await db.insert(productCategories).values([
    {
      nameAr: 'كتب علمية وأكاديمية',
      nameEn: 'Scientific & Academic Books',
      descriptionAr: 'كتب في الرياضيات، الفيزياء، الكيمياء، الأحياء، العلوم الطبيعية',
      descriptionEn: 'Books in mathematics, physics, chemistry, biology, natural sciences',
      icon: 'GraduationCap',
      parentId: ebooksId,
      order: 1,
    },
    {
      nameAr: 'كتب أطفال ويافعين',
      nameEn: 'Children & Young Adult Books',
      descriptionAr: 'قصص مصورة، كتب تعليمية، حكايات، كتب تلوين رقمية',
      descriptionEn: 'Illustrated stories, educational books, tales, digital coloring books',
      icon: 'Baby',
      parentId: ebooksId,
      order: 2,
    },
    {
      nameAr: 'كتب تطوير وتنمية الذات',
      nameEn: 'Self-Development Books',
      descriptionAr: 'التحفيز، الإنتاجية، العادات، النجاح، السعادة',
      descriptionEn: 'Motivation, productivity, habits, success, happiness',
      icon: 'TrendingUp',
      parentId: ebooksId,
      order: 3,
    },
    {
      nameAr: 'السير الذاتية والمذكرات',
      nameEn: 'Biographies & Memoirs',
      descriptionAr: 'سير شخصيات مشهورة، قصص حياة، مذكرات شخصية',
      descriptionEn: 'Famous personalities biographies, life stories, personal memoirs',
      icon: 'User',
      parentId: ebooksId,
      order: 4,
    },
    {
      nameAr: 'كتب التاريخ',
      nameEn: 'History Books',
      descriptionAr: 'تاريخ عام، تاريخ البلدان، تاريخ الحضارات',
      descriptionEn: 'General history, countries history, civilizations history',
      icon: 'Clock',
      parentId: ebooksId,
      order: 5,
    },
    {
      nameAr: 'كتب الجغرافيا',
      nameEn: 'Geography Books',
      descriptionAr: 'أطلس، جغرافيا بشرية، جغرافيا طبيعية',
      descriptionEn: 'Atlas, human geography, physical geography',
      icon: 'Map',
      parentId: ebooksId,
      order: 6,
    },
    {
      nameAr: 'العلوم الطبيعية',
      nameEn: 'Natural Sciences',
      descriptionAr: 'فيزياء، كيمياء، رياضيات، أحياء، فلك، جيولوجيا',
      descriptionEn: 'Physics, chemistry, mathematics, biology, astronomy, geology',
      icon: 'Atom',
      parentId: ebooksId,
      order: 7,
    },
    {
      nameAr: 'العلوم الاجتماعية',
      nameEn: 'Social Sciences',
      descriptionAr: 'علم نفس، علم اجتماع، اقتصاد سلوكي، سياسة، أنثروبولوجيا',
      descriptionEn: 'Psychology, sociology, behavioral economics, politics, anthropology',
      icon: 'Users',
      parentId: ebooksId,
      order: 8,
    },
    {
      nameAr: 'أعمال واقتصاد',
      nameEn: 'Business & Economics',
      descriptionAr: 'إدارة، تسويق، مالية، ريادة وإدارة أعمال، اقتصاد، محاسبة، تجارة إلكترونية، موارد بشرية',
      descriptionEn: 'Management, marketing, finance, entrepreneurship, economics, accounting, e-commerce, HR',
      icon: 'Briefcase',
      parentId: ebooksId,
      order: 9,
    },
    {
      nameAr: 'دين وفلسفة',
      nameEn: 'Religion & Philosophy',
      descriptionAr: 'كتب دينية، فلسفة دينية، روحانيات',
      descriptionEn: 'Religious books, religious philosophy, spirituality',
      icon: 'BookOpen',
      parentId: ebooksId,
      order: 10,
    },
    {
      nameAr: 'الفنون والحرف',
      nameEn: 'Arts & Crafts',
      descriptionAr: 'رسم، نحت، تصوير، حرف يدوية',
      descriptionEn: 'Drawing, sculpture, photography, handicrafts',
      icon: 'Palette',
      parentId: ebooksId,
      order: 11,
    },
    {
      nameAr: 'كتب تعليم صناعة الحلي والتجميل والعطور',
      nameEn: 'Jewelry, Beauty & Perfume Making Books',
      descriptionAr: 'أزياء، مكياج، مستحضرات تجميل وعناية بالبشرة، عطور، مجوهرات وأحجار كريمة',
      descriptionEn: 'Fashion, makeup, beauty and skincare products, perfumes, jewelry and gemstones',
      icon: 'Sparkles',
      parentId: ebooksId,
      order: 12,
    },
    {
      nameAr: 'الطبخ والطعام',
      nameEn: 'Cooking & Food',
      descriptionAr: 'كتب طبخ، وصفات، تغذية، حميات',
      descriptionEn: 'Cooking books, recipes, nutrition, diets',
      icon: 'ChefHat',
      parentId: ebooksId,
      order: 13,
    },
    {
      nameAr: 'الطب والصحة',
      nameEn: 'Medicine & Health',
      descriptionAr: 'صحة عامة، لياقة بدنية، صحة نفسية، طب بديل',
      descriptionEn: 'General health, fitness, mental health, alternative medicine',
      icon: 'Heart',
      parentId: ebooksId,
      order: 14,
    },
    {
      nameAr: 'التقنية والحاسوب',
      nameEn: 'Technology & Computing',
      descriptionAr: 'برمجة، شبكات، أمن معلومات، ذكاء اصطناعي',
      descriptionEn: 'Programming, networks, information security, artificial intelligence',
      icon: 'Laptop',
      parentId: ebooksId,
      order: 15,
    },
    {
      nameAr: 'السفر والسياحة والترفيه',
      nameEn: 'Travel, Tourism & Entertainment',
      descriptionAr: 'أدلة سياحية، رحلات، ثقافات',
      descriptionEn: 'Tourist guides, trips, cultures',
      icon: 'Plane',
      parentId: ebooksId,
      order: 16,
    },
    {
      nameAr: 'التعليم والكتب المدرسية',
      nameEn: 'Education & School Books',
      descriptionAr: 'مناهج، كتب تعليمية، موارد تعليمية',
      descriptionEn: 'Curricula, educational books, educational resources',
      icon: 'School',
      parentId: ebooksId,
      order: 17,
    },
    {
      nameAr: 'الرياضة',
      nameEn: 'Sports',
      descriptionAr: 'تدريب رياضي، قواعد اللعب، تاريخ الرياضة',
      descriptionEn: 'Sports training, game rules, sports history',
      icon: 'Trophy',
      parentId: ebooksId,
      order: 18,
    },
    {
      nameAr: 'القانون',
      nameEn: 'Law',
      descriptionAr: 'قوانين، لوائح، دراسات قانونية',
      descriptionEn: 'Laws, regulations, legal studies',
      icon: 'Scale',
      parentId: ebooksId,
      order: 19,
    },
    {
      nameAr: 'البيئة والطبيعة',
      nameEn: 'Environment & Nature',
      descriptionAr: 'علوم بيئية، استدامة، حماية البيئة',
      descriptionEn: 'Environmental sciences, sustainability, environmental protection',
      icon: 'Leaf',
      parentId: ebooksId,
      order: 20,
    },
    {
      nameAr: 'المراجع',
      nameEn: 'References',
      descriptionAr: 'قواميس، موسوعات، أطلس، معاجم، مخطوطات',
      descriptionEn: 'Dictionaries, encyclopedias, atlas, lexicons, manuscripts',
      icon: 'Library',
      parentId: ebooksId,
      order: 21,
    },
    {
      nameAr: 'الروايات والخيال',
      nameEn: 'Novels & Fiction',
      descriptionAr: 'خيال علمي، فانتازيا، رعب، إثارة وتشويق، جريمة، رومانسية، دراما، كوميديا، تاريخية، ديستوبيا يوتوبيا',
      descriptionEn: 'Sci-fi, fantasy, horror, thriller, crime, romance, drama, comedy, historical, dystopia utopia',
      icon: 'BookMarked',
      parentId: ebooksId,
      order: 22,
    },
    {
      nameAr: 'الأدب الكلاسيكي',
      nameEn: 'Classical Literature',
      descriptionAr: 'أعمال كلاسيكية، أدب عالمي',
      descriptionEn: 'Classical works, world literature',
      icon: 'BookCopy',
      parentId: ebooksId,
      order: 23,
    },
    {
      nameAr: 'القصص القصيرة',
      nameEn: 'Short Stories',
      descriptionAr: 'مجموعات قصصية، قصص قصيرة',
      descriptionEn: 'Story collections, short stories',
      icon: 'FileText',
      parentId: ebooksId,
      order: 24,
    },
    {
      nameAr: 'الروايات المصورة',
      nameEn: 'Graphic Novels',
      descriptionAr: 'كوميكس، مانجا، روايات مصورة',
      descriptionEn: 'Comics, manga, graphic novels',
      icon: 'Image',
      parentId: ebooksId,
      order: 25,
    },
    {
      nameAr: 'المسرحيات',
      nameEn: 'Plays',
      descriptionAr: 'نصوص مسرحية، دراما',
      descriptionEn: 'Play scripts, drama',
      icon: 'Theater',
      parentId: ebooksId,
      order: 26,
    },
    {
      nameAr: 'الشعر',
      nameEn: 'Poetry',
      descriptionAr: 'دواوين شعرية، قصائد',
      descriptionEn: 'Poetry collections, poems',
      icon: 'Feather',
      parentId: ebooksId,
      order: 27,
    },
    {
      nameAr: 'الأساطير والخرافات',
      nameEn: 'Myths & Legends',
      descriptionAr: 'حكايات شعبية، أساطير',
      descriptionEn: 'Folk tales, myths',
      icon: 'Wand',
      parentId: ebooksId,
      order: 28,
    },
  ]);

  console.log('✅ تم إضافة أنواع الكتب الإلكترونية');

  // يتبع في الملف التالي...
  return { success: true };
}

