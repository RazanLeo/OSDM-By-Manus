import * as db from './server/db';

async function seedFullContent() {
  console.log('🌱 إضافة محتوى حقيقي كامل...');

  // الحصول على البائعين
  const sellers = [
    { openId: 'picalica_test', name: 'بيكاليكا' },
    { openId: 'khamsat_test', name: 'خمسات' },
    { openId: 'mustaqil_test', name: 'مستقل' },
  ];

  // إضافة 20 منتج رقمي
  const products = [
    {
      title: 'قالب WordPress احترافي للمتاجر الإلكترونية',
      description: 'قالب متجاوب وسريع مع دعم WooCommerce كامل',
      price: 299,
      categoryId: 1,
      sellerId: 1,
      images: ['/images/products/wp-template.jpg'],
      files: ['/files/products/wp-template.zip'],
    },
    {
      title: 'كتاب إلكتروني: دليل التسويق الرقمي 2025',
      description: 'دليل شامل للتسويق الرقمي مع أمثلة عملية',
      price: 49,
      categoryId: 1,
      sellerId: 1,
      images: ['/images/products/marketing-book.jpg'],
      files: ['/files/products/marketing-book.pdf'],
    },
    {
      title: 'حزمة تصاميم سوشيال ميديا (500 قالب)',
      description: 'قوالب جاهزة لجميع منصات التواصل الاجتماعي',
      price: 149,
      categoryId: 2,
      sellerId: 1,
      images: ['/images/products/social-templates.jpg'],
      files: ['/files/products/social-templates.zip'],
    },
    {
      title: 'مكتبة أيقونات SVG (1000+ أيقونة)',
      description: 'أيقونات احترافية قابلة للتخصيص',
      price: 79,
      categoryId: 2,
      sellerId: 1,
      images: ['/images/products/icons.jpg'],
      files: ['/files/products/icons.zip'],
    },
    {
      title: 'مؤثرات صوتية خالية من الحقوق (200 ملف)',
      description: 'مؤثرات صوتية عالية الجودة لمشاريعك',
      price: 99,
      categoryId: 3,
      sellerId: 1,
      images: ['/images/products/sound-effects.jpg'],
      files: ['/files/products/sound-effects.zip'],
    },
    {
      title: 'قوالب After Effects للموشن جرافيك',
      description: '50 قالب احترافي جاهز للاستخدام',
      price: 199,
      categoryId: 4,
      sellerId: 1,
      images: ['/images/products/ae-templates.jpg'],
      files: ['/files/products/ae-templates.zip'],
    },
    {
      title: 'سكريبت Python لتحليل البيانات',
      description: 'أداة قوية لتحليل وتصور البيانات',
      price: 129,
      categoryId: 5,
      sellerId: 1,
      images: ['/images/products/python-script.jpg'],
      files: ['/files/products/python-script.zip'],
    },
    {
      title: 'Plugin WordPress للحجوزات',
      description: 'نظام حجوزات متكامل لموقعك',
      price: 179,
      categoryId: 5,
      sellerId: 1,
      images: ['/images/products/booking-plugin.jpg'],
      files: ['/files/products/booking-plugin.zip'],
    },
    {
      title: 'قاعدة بيانات Keywords للـ SEO',
      description: '10,000 كلمة مفتاحية في مجالات مختلفة',
      price: 89,
      categoryId: 6,
      sellerId: 1,
      images: ['/images/products/keywords-db.jpg'],
      files: ['/files/products/keywords-db.xlsx'],
    },
    {
      title: 'دورة فيديو: تعلم React من الصفر',
      description: '50 ساعة فيديو + مشاريع عملية',
      price: 399,
      categoryId: 7,
      sellerId: 1,
      images: ['/images/products/react-course.jpg'],
      files: ['/files/products/react-course-info.pdf'],
    },
    {
      title: 'مجموعة Prompts للذكاء الاصطناعي',
      description: '500+ prompt جاهز لـ ChatGPT و Midjourney',
      price: 59,
      categoryId: 8,
      sellerId: 1,
      images: ['/images/products/ai-prompts.jpg'],
      files: ['/files/products/ai-prompts.pdf'],
    },
    {
      title: 'قوالب Excel للإدارة المالية',
      description: 'قوالب احترافية للميزانية والتقارير المالية',
      price: 69,
      categoryId: 9,
      sellerId: 1,
      images: ['/images/products/excel-templates.jpg'],
      files: ['/files/products/excel-templates.zip'],
    },
    {
      title: 'حملة إعلانية جاهزة للفيسبوك',
      description: 'تصاميم + نصوص إعلانية + استراتيجية',
      price: 119,
      categoryId: 10,
      sellerId: 1,
      images: ['/images/products/fb-campaign.jpg'],
      files: ['/files/products/fb-campaign.zip'],
    },
    {
      title: 'قاموس مصطلحات تقنية (عربي-إنجليزي)',
      description: '5000+ مصطلح تقني مترجم',
      price: 49,
      categoryId: 11,
      sellerId: 1,
      images: ['/images/products/tech-dictionary.jpg'],
      files: ['/files/products/tech-dictionary.pdf'],
    },
    {
      title: 'عقود عمل حر جاهزة (10 نماذج)',
      description: 'عقود قانونية محكمة للعمل الحر',
      price: 99,
      categoryId: 12,
      sellerId: 1,
      images: ['/images/products/contracts.jpg'],
      files: ['/files/products/contracts.zip'],
    },
    {
      title: 'نظام إدارة محتوى كامل بـ Laravel',
      description: 'CMS متكامل جاهز للتخصيص',
      price: 499,
      categoryId: 5,
      sellerId: 1,
      images: ['/images/products/laravel-cms.jpg'],
      files: ['/files/products/laravel-cms.zip'],
    },
    {
      title: 'مكتبة صور فوتوغرافية (500 صورة)',
      description: 'صور عالية الدقة خالية من الحقوق',
      price: 149,
      categoryId: 2,
      sellerId: 1,
      images: ['/images/products/photos.jpg'],
      files: ['/files/products/photos-info.pdf'],
    },
    {
      title: 'قوالب Figma للتطبيقات (20 قالب)',
      description: 'تصاميم UI/UX احترافية جاهزة',
      price: 179,
      categoryId: 2,
      sellerId: 1,
      images: ['/images/products/figma-templates.jpg'],
      files: ['/files/products/figma-templates.fig'],
    },
    {
      title: 'دليل شامل لإنشاء متجر Shopify',
      description: 'خطوة بخطوة من الصفر للاحتراف',
      price: 79,
      categoryId: 1,
      sellerId: 1,
      images: ['/images/products/shopify-guide.jpg'],
      files: ['/files/products/shopify-guide.pdf'],
    },
    {
      title: 'أدوات تحليل المنافسين (Excel + Scripts)',
      description: 'أدوات متقدمة لتحليل المنافسة',
      price: 129,
      categoryId: 9,
      sellerId: 1,
      images: ['/images/products/competitor-analysis.jpg'],
      files: ['/files/products/competitor-analysis.zip'],
    },
  ];

  // إضافة 20 خدمة مصغرة
  const services = [
    {
      title: 'تصميم شعار احترافي',
      description: 'تصميم شعار فريد يعبر عن هويتك',
      categoryId: 1,
      sellerId: 2,
      images: ['/images/services/logo-design.jpg'],
      deliveryDays: 3,
    },
    {
      title: 'تطوير موقع WordPress',
      description: 'موقع احترافي متجاوب وسريع',
      categoryId: 2,
      sellerId: 2,
      images: ['/images/services/wp-dev.jpg'],
      deliveryDays: 7,
    },
    {
      title: 'تحليل بيانات باستخدام Python',
      description: 'تحليل متقدم وتقارير مفصلة',
      categoryId: 3,
      sellerId: 2,
      images: ['/images/services/data-analysis.jpg'],
      deliveryDays: 5,
    },
    {
      title: 'كتابة محتوى SEO',
      description: 'محتوى محسن لمحركات البحث',
      categoryId: 4,
      sellerId: 2,
      images: ['/images/services/seo-content.jpg'],
      deliveryDays: 2,
    },
    {
      title: 'تدريب على التسويق الرقمي',
      description: 'جلسات تدريبية مباشرة',
      categoryId: 5,
      sellerId: 2,
      images: ['/images/services/training.jpg'],
      deliveryDays: 1,
    },
    {
      title: 'ترجمة احترافية (عربي-إنجليزي)',
      description: 'ترجمة دقيقة مع مراجعة لغوية',
      categoryId: 6,
      sellerId: 2,
      images: ['/images/services/translation.jpg'],
      deliveryDays: 2,
    },
    {
      title: 'إعداد خطة عمل',
      description: 'خطة عمل شاملة لمشروعك',
      categoryId: 7,
      sellerId: 2,
      images: ['/images/services/business-plan.jpg'],
      deliveryDays: 5,
    },
    {
      title: 'إدارة حسابات السوشيال ميديا',
      description: 'إدارة احترافية لحساباتك',
      categoryId: 8,
      sellerId: 2,
      images: ['/images/services/social-management.jpg'],
      deliveryDays: 30,
    },
    {
      title: 'تصميم هوية بصرية كاملة',
      description: 'شعار + بطاقة + ورق رسمي + دليل',
      categoryId: 1,
      sellerId: 2,
      images: ['/images/services/brand-identity.jpg'],
      deliveryDays: 10,
    },
    {
      title: 'تطوير تطبيق React Native',
      description: 'تطبيق جوال لـ iOS و Android',
      categoryId: 2,
      sellerId: 2,
      images: ['/images/services/mobile-app.jpg'],
      deliveryDays: 14,
    },
    {
      title: 'بناء نموذج Machine Learning',
      description: 'نموذج ذكاء اصطناعي مخصص',
      categoryId: 3,
      sellerId: 2,
      images: ['/images/services/ml-model.jpg'],
      deliveryDays: 7,
    },
    {
      title: 'إدارة حملات Google Ads',
      description: 'حملات إعلانية فعالة',
      categoryId: 4,
      sellerId: 2,
      images: ['/images/services/google-ads.jpg'],
      deliveryDays: 30,
    },
    {
      title: 'استشارة تقنية (ساعة)',
      description: 'استشارة متخصصة في مجالك',
      categoryId: 5,
      sellerId: 2,
      images: ['/images/services/consultation.jpg'],
      deliveryDays: 1,
    },
    {
      title: 'توطين تطبيق أو موقع',
      description: 'ترجمة وتكييف ثقافي كامل',
      categoryId: 6,
      sellerId: 2,
      images: ['/images/services/localization.jpg'],
      deliveryDays: 7,
    },
    {
      title: 'مراجعة عقد قانوني',
      description: 'مراجعة قانونية متخصصة',
      categoryId: 7,
      sellerId: 2,
      images: ['/images/services/legal-review.jpg'],
      deliveryDays: 3,
    },
    {
      title: 'إدخال بيانات (1000 سجل)',
      description: 'إدخال بيانات دقيق وسريع',
      categoryId: 8,
      sellerId: 2,
      images: ['/images/services/data-entry.jpg'],
      deliveryDays: 2,
    },
    {
      title: 'تصميم واجهة UI/UX',
      description: 'تصميم تفاعلي احترافي',
      categoryId: 1,
      sellerId: 2,
      images: ['/images/services/ui-ux.jpg'],
      deliveryDays: 5,
    },
    {
      title: 'تطوير API متكامل',
      description: 'API RESTful موثق بالكامل',
      categoryId: 2,
      sellerId: 2,
      images: ['/images/services/api-dev.jpg'],
      deliveryDays: 7,
    },
    {
      title: 'تحسين أداء موقع (SEO Technical)',
      description: 'تحسين تقني شامل للموقع',
      categoryId: 4,
      sellerId: 2,
      images: ['/images/services/seo-technical.jpg'],
      deliveryDays: 5,
    },
    {
      title: 'إنشاء Chatbot ذكي',
      description: 'روبوت محادثة بالذكاء الاصطناعي',
      categoryId: 3,
      sellerId: 2,
      images: ['/images/services/chatbot.jpg'],
      deliveryDays: 7,
    },
  ];

  // إضافة 20 مشروع
  const projects = [
    {
      title: 'تطوير تطبيق جوال لتوصيل الطعام',
      description: 'تطبيق كامل مع لوحة تحكم للمطاعم',
      budget: 15000,
      duration: 60,
      categoryId: 1,
      clientId: 1,
      skills: ['React Native', 'Node.js', 'MongoDB'],
    },
    {
      title: 'تصميم هوية بصرية لشركة ناشئة',
      description: 'هوية كاملة مع دليل استخدام',
      budget: 3000,
      duration: 14,
      categoryId: 7,
      clientId: 1,
      skills: ['Illustrator', 'Photoshop', 'Brand Design'],
    },
    {
      title: 'كتابة محتوى لموقع تقني (50 مقال)',
      description: 'محتوى SEO احترافي',
      budget: 5000,
      duration: 30,
      categoryId: 6,
      clientId: 1,
      skills: ['Content Writing', 'SEO', 'Technical Writing'],
    },
    {
      title: 'بناء نظام CRM مخصص',
      description: 'نظام إدارة علاقات العملاء',
      budget: 20000,
      duration: 90,
      categoryId: 2,
      clientId: 1,
      skills: ['Laravel', 'Vue.js', 'MySQL'],
    },
    {
      title: 'حملة تسويقية متكاملة',
      description: 'حملة على جميع المنصات',
      budget: 8000,
      duration: 30,
      categoryId: 5,
      clientId: 1,
      skills: ['Digital Marketing', 'Social Media', 'Content Creation'],
    },
    {
      title: 'ترجمة موقع إلكتروني (10 صفحات)',
      description: 'ترجمة من الإنجليزية للعربية',
      budget: 1500,
      duration: 7,
      categoryId: 6,
      clientId: 1,
      skills: ['Translation', 'Localization', 'Arabic'],
    },
    {
      title: 'إعداد دراسة جدوى لمشروع',
      description: 'دراسة شاملة مع تحليل السوق',
      budget: 4000,
      duration: 14,
      categoryId: 8,
      clientId: 1,
      skills: ['Business Analysis', 'Market Research', 'Financial Planning'],
    },
    {
      title: 'تطوير موقع تجارة إلكترونية',
      description: 'متجر كامل مع نظام دفع',
      budget: 12000,
      duration: 45,
      categoryId: 2,
      clientId: 1,
      skills: ['WooCommerce', 'PHP', 'Payment Integration'],
    },
    {
      title: 'تدريب فريق على Agile',
      description: 'ورش عمل وتدريب عملي',
      budget: 6000,
      duration: 10,
      categoryId: 9,
      clientId: 1,
      skills: ['Agile', 'Scrum', 'Training'],
    },
    {
      title: 'مراجعة قانونية لعقود الشركة',
      description: 'مراجعة 20 عقد',
      budget: 5000,
      duration: 14,
      categoryId: 10,
      clientId: 1,
      skills: ['Legal', 'Contract Law', 'Arabic'],
    },
    {
      title: 'تصميم معماري لمبنى سكني',
      description: 'تصميم كامل مع المخططات',
      budget: 10000,
      duration: 30,
      categoryId: 11,
      clientId: 1,
      skills: ['Architecture', 'AutoCAD', '3D Modeling'],
    },
    {
      title: 'إدارة مشروع تقني (6 أشهر)',
      description: 'إدارة كاملة للمشروع',
      budget: 18000,
      duration: 180,
      categoryId: 12,
      clientId: 1,
      skills: ['Project Management', 'Agile', 'Leadership'],
    },
    {
      title: 'توظيف 10 موظفين تقنيين',
      description: 'بحث وتوظيف كامل',
      budget: 7000,
      duration: 60,
      categoryId: 13,
      clientId: 1,
      skills: ['Recruitment', 'HR', 'Technical Hiring'],
    },
    {
      title: 'بناء نموذج AI للتنبؤ',
      description: 'نموذج تعلم آلي مخصص',
      budget: 15000,
      duration: 45,
      categoryId: 1,
      clientId: 1,
      skills: ['Machine Learning', 'Python', 'TensorFlow'],
    },
    {
      title: 'تطوير Dashboard تحليلي',
      description: 'لوحة تحكم بيانات تفاعلية',
      budget: 8000,
      duration: 30,
      categoryId: 2,
      clientId: 1,
      skills: ['React', 'D3.js', 'Data Visualization'],
    },
    {
      title: 'استشارات مالية لشركة ناشئة',
      description: 'استشارات شهرية (3 أشهر)',
      budget: 9000,
      duration: 90,
      categoryId: 4,
      clientId: 1,
      skills: ['Financial Planning', 'Accounting', 'Consulting'],
    },
    {
      title: 'حملة إعلانات ممولة (إدارة)',
      description: 'إدارة حملات بميزانية 50,000',
      budget: 10000,
      duration: 60,
      categoryId: 5,
      clientId: 1,
      skills: ['Facebook Ads', 'Google Ads', 'Analytics'],
    },
    {
      title: 'كتابة كتاب إلكتروني (100 صفحة)',
      description: 'كتاب احترافي مع تصميم',
      budget: 6000,
      duration: 45,
      categoryId: 6,
      clientId: 1,
      skills: ['Writing', 'Editing', 'Publishing'],
    },
    {
      title: 'تطوير نظام حجوزات فندقي',
      description: 'نظام متكامل مع تطبيق',
      budget: 25000,
      duration: 90,
      categoryId: 2,
      clientId: 1,
      skills: ['Full Stack', 'React Native', 'Payment Systems'],
    },
    {
      title: 'إنتاج فيديو ترويجي احترافي',
      description: 'فيديو 3 دقائق مع موشن جرافيك',
      budget: 4000,
      duration: 14,
      categoryId: 7,
      clientId: 1,
      skills: ['Video Production', 'Motion Graphics', 'After Effects'],
    },
  ];

  // إضافة المنتجات
  let totalAdded = 0;
  for (const product of products) {
    try {
      await db.createProduct({
        title: product.title,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        sellerId: product.sellerId,
        images: product.images,
        files: product.files,
        isActive: true,
      });
      console.log(`✅ منتج: ${product.title}`);
      totalAdded++;
    } catch (error) {
      console.error(`❌ خطأ في ${product.title}:`, error);
    }
  }

  // إضافة الخدمات
  for (const service of services) {
    try {
      await db.createService({
        title: service.title,
        description: service.description,
        categoryId: service.categoryId,
        sellerId: service.sellerId,
        images: service.images,
        deliveryDays: service.deliveryDays,
        isActive: true,
      });
      console.log(`✅ خدمة: ${service.title}`);
      totalAdded++;
    } catch (error) {
      console.error(`❌ خطأ في ${service.title}:`, error);
    }
  }

  // إضافة المشاريع
  for (const project of projects) {
    try {
      await db.createJob({
        title: project.title,
        description: project.description,
        budget: project.budget,
        duration: project.duration,
        categoryId: project.categoryId,
        clientId: project.clientId,
        skills: project.skills,
        isActive: true,
      });
      console.log(`✅ مشروع: ${project.title}`);
      totalAdded++;
    } catch (error) {
      console.error(`❌ خطأ في ${project.title}:`, error);
    }
  }

  console.log(`✅ تم إضافة ${totalAdded} عنصر بنجاح!`);
  process.exit(0);
}

seedFullContent().catch((error) => {
  console.error('❌ خطأ في إضافة المحتوى:', error);
  process.exit(1);
});

