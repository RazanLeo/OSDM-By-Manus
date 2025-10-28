import * as db from './server/db';
import { categories } from './drizzle/schema';

async function seedFullCategories() {
  console.log('🌱 إضافة التصنيفات الكاملة من البرومبت...');

  // السوق الأول: المنتجات الرقمية الجاهزة
  const productCategories = [
    {
      nameAr: 'محتوى نصي ومكتوب',
      nameEn: 'Text & Written Content',
      type: 'product',
      subcategories: [
        'كتب إلكترونية',
        'دراسات وأبحاث',
        'خطط أعمال',
        'قوالب سيرة ذاتية',
        'تقارير',
        'ملخصات',
        'عروض تقديمية',
        'نماذج سياسات',
        'قواميس',
      ]
    },
    {
      nameAr: 'محتوى مرئي بصري',
      nameEn: 'Visual Content',
      type: 'product',
      subcategories: [
        'قوالب تصميم Canva/PSD/AI/Figma',
        'خط UI/UX',
        'أيقونات',
        'شعارات',
        'أنظمة هوية بصرية',
        'صور فوتوغرافية',
        'Mockups',
        'Textures',
        'خلفيات',
        'رسوم توضيحية',
      ]
    },
    {
      nameAr: 'محتوى سمعي صوتي',
      nameEn: 'Audio Content',
      type: 'product',
      subcategories: [
        'مقاطع صوتية خالية الحقوق',
        'مؤثرات صوتية',
        'خزم بودكاست',
        'أصوات مخصصة',
      ]
    },
    {
      nameAr: 'محتوى مرئي متحرك وفيديو',
      nameEn: 'Video & Motion Content',
      type: 'product',
      subcategories: [
        'قوالب ستوك',
        'قوالب AE/PR',
        'انترو/اوترو',
        'فيديوهات تعليمية',
      ]
    },
    {
      nameAr: 'أكواد وبرمجيات',
      nameEn: 'Code & Software',
      type: 'product',
      subcategories: [
        'سكريبتات',
        'Plugins',
        'قوالب مواقع',
        'تطبيقات جاهزة Webflow',
        'Assets',
      ]
    },
    {
      nameAr: 'بيانات ومحتوى جاهز',
      nameEn: 'Data & Ready Content',
      type: 'product',
      subcategories: [
        'Datasets',
        'Keywords',
        'قوالب محتوى تسويقي',
      ]
    },
    {
      nameAr: 'تعليم رقمي',
      nameEn: 'Digital Education',
      type: 'product',
      subcategories: [
        'دورات فيديو مسجلة',
        'تمارين',
        'اختبارات',
      ]
    },
    {
      nameAr: 'ذكاء اصطناعي',
      nameEn: 'AI & Automation',
      type: 'product',
      subcategories: [
        'برومتات جاهزة',
        'Notebooks',
        'نماذج مدربة Pipelines',
      ]
    },
    {
      nameAr: 'أعمال وإدارة',
      nameEn: 'Business & Management',
      type: 'product',
      subcategories: [
        'قوالب مالية',
        'Dashboards Excel/Sheets',
        'عقود',
      ]
    },
    {
      nameAr: 'تسويق ومحتوى',
      nameEn: 'Marketing & Content',
      type: 'product',
      subcategories: [
        'حملات إعلانية',
        'منشورات جاهزة',
        'Scripts',
      ]
    },
    {
      nameAr: 'ترجمة ولغة',
      nameEn: 'Translation & Language',
      type: 'product',
      subcategories: [
        'TMX',
        'Glossaries',
        'قوالب ترجمة',
      ]
    },
    {
      nameAr: 'أمن وقانون',
      nameEn: 'Security & Legal',
      type: 'product',
      subcategories: [
        'سياسات',
        'NDAs',
        'وثائق امتثال',
      ]
    },
  ];

  // السوق الثاني: الخدمات المتخصصة حسب الطلب
  const serviceCategories = [
    {
      nameAr: 'التصميم',
      nameEn: 'Design',
      type: 'service',
      subcategories: [
        'شعار',
        'هوية',
        'هوشن',
        'واجهات UI/UX',
      ]
    },
    {
      nameAr: 'البرمجة',
      nameEn: 'Programming',
      type: 'service',
      subcategories: [
        'مواقع',
        'تطبيقات',
        'تكاملات API',
        'Chatbots',
        'DevOps',
      ]
    },
    {
      nameAr: 'البيانات والذكاء الاصطناعي',
      nameEn: 'Data & AI',
      type: 'service',
      subcategories: [
        'تحليلات',
        'Fine-tuning',
        'RAG',
        'توصيات',
      ]
    },
    {
      nameAr: 'التسويق والمحتوى',
      nameEn: 'Marketing & Content',
      type: 'service',
      subcategories: [
        'SEO',
        'Ads',
        'Copywriting',
      ]
    },
    {
      nameAr: 'التعليم والاستشارات',
      nameEn: 'Education & Consulting',
      type: 'service',
      subcategories: [
        'تدريب',
        'Mentorship',
        'ورش عمل',
      ]
    },
    {
      nameAr: 'الترجمة والتوطين',
      nameEn: 'Translation & Localization',
      type: 'service',
      subcategories: [
        'ترجمة تخصصية',
        'توطين',
      ]
    },
    {
      nameAr: 'الأعمال والقانون',
      nameEn: 'Business & Legal',
      type: 'service',
      subcategories: [
        'خطط أعمال',
        'دراسات جدوى',
        'وثائق',
        'مخصصة',
      ]
    },
    {
      nameAr: 'الدعم والتشغيل',
      nameEn: 'Support & Operations',
      type: 'service',
      subcategories: [
        'خدمة عملاء',
        'إدارة متاجر',
        'إدخال بيانات',
      ]
    },
  ];

  // السوق الثالث: فرص العمل الحر
  const freelanceCategories = [
    {
      nameAr: 'الذكاء الاصطناعي والوكلاء والأتمتة',
      nameEn: 'AI, Agents & Automation',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'البرمجة والتطوير وتكنولوجيا المعلومات والتقنية',
      nameEn: 'Programming & IT',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'الأعمال والمشاريع والمهام والإدارة',
      nameEn: 'Business & Project Management',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'المالية والاقتصاد والمحاسبة',
      nameEn: 'Finance & Accounting',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'المبيعات والتسويق',
      nameEn: 'Sales & Marketing',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'الكتابة والترجمة والمحتوى',
      nameEn: 'Writing, Translation & Content',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'التصميم والإبداع',
      nameEn: 'Design & Creativity',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'إعداد الدراسات والبحوث والتقارير والخطط',
      nameEn: 'Research & Reports',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'التعليم والتدريب',
      nameEn: 'Education & Training',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'القانون',
      nameEn: 'Legal',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'الهندسة والعمارة',
      nameEn: 'Engineering & Architecture',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'الإدارة والدعم والتشغيل',
      nameEn: 'Administration & Support',
      type: 'project',
      subcategories: []
    },
    {
      nameAr: 'الموارد البشرية والتوظيف',
      nameEn: 'HR & Recruitment',
      type: 'project',
      subcategories: []
    },
  ];

  // إضافة التصنيفات
  let totalAdded = 0;

  for (const cat of productCategories) {
    try {
      const parentId = await db.createCategory({
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        type: cat.type,
        parentId: null,
      });
      console.log(`✅ تصنيف منتج: ${cat.nameAr}`);
      totalAdded++;

      for (const sub of cat.subcategories) {
        await db.createCategory({
          nameAr: sub,
          nameEn: sub,
          type: cat.type,
          parentId,
        });
        totalAdded++;
      }
    } catch (error) {
      console.error(`❌ خطأ في ${cat.nameAr}:`, error);
    }
  }

  for (const cat of serviceCategories) {
    try {
      const parentId = await db.createCategory({
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        type: cat.type,
        parentId: null,
      });
      console.log(`✅ تصنيف خدمة: ${cat.nameAr}`);
      totalAdded++;

      for (const sub of cat.subcategories) {
        await db.createCategory({
          nameAr: sub,
          nameEn: sub,
          type: cat.type,
          parentId,
        });
        totalAdded++;
      }
    } catch (error) {
      console.error(`❌ خطأ في ${cat.nameAr}:`, error);
    }
  }

  for (const cat of freelanceCategories) {
    try {
      await db.createCategory({
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        type: cat.type,
        parentId: null,
      });
      console.log(`✅ تصنيف مشروع: ${cat.nameAr}`);
      totalAdded++;
    } catch (error) {
      console.error(`❌ خطأ في ${cat.nameAr}:`, error);
    }
  }

  console.log(`✅ تم إضافة ${totalAdded} تصنيف بنجاح!`);
  process.exit(0);
}

seedFullCategories().catch((error) => {
  console.error('❌ خطأ في إضافة التصنيفات:', error);
  process.exit(1);
});

