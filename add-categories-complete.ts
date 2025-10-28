/**
 * سكريبت لإضافة كل التصنيفات من البرومبت
 * يتم تنفيذه عبر APIs بدلاً من SQL مباشرة
 */

import { createCategory } from './server/db';

async function main() {
  console.log('🚀 بدء إضافة التصنيفات الكاملة من البرومبت...');
  
  try {
    // حذف التصنيفات القديمة
    console.log('🗑️ حذف التصنيفات القديمة...');
    
    // 1. المحتوى النصي والمكتوب
    console.log('📝 إضافة تصنيفات المحتوى النصي...');
    const textContent = await createCategory({
      nameAr: 'المحتوى النصي والمكتوب',
      nameEn: 'Text and Written Content',
      parentId: null,
      order: 1
    });
    
    // 1.1 الكتب الإلكترونية
    const ebooks = await createCategory({
      nameAr: 'الكتب الإلكترونية',
      nameEn: 'E-Books',
      parentId: textContent.id,
      order: 1
    });
    
    // أنواع الكتب (28 نوع)
    const ebookTypes = [
      'كتب علمية وأكاديمية|Academic & Scientific Books',
      'كتب أطفال والناشئين|Children & Young Adult Books',
      'كتب تطوير وتنمية الذات|Self-Development Books',
      'السير الذاتية والمذكرات|Biographies & Memoirs',
      'كتب التاريخ|History Books',
      'كتب الجغرافيا|Geography Books',
      'العلوم والعلوم الطبيعية|Science & Natural Sciences',
      'العلوم الاجتماعية|Social Sciences',
      'أعمال واقتصاد|Business & Economics',
      'دين وفلسفة|Religion & Philosophy',
      'الفنون والحرف|Arts & Crafts',
      'الموضة والتجميل والعطور|Fashion, Beauty & Perfume',
      'الطبخ والطعام|Cooking & Food',
      'الطب والصحة|Medicine & Health',
      'التقنية والحاسوب|Technology & Computing',
      'السفر والسياحة|Travel & Tourism',
      'التعليم والكتب المدرسية|Education & Textbooks',
      'الرياضة|Sports',
      'القانون|Law',
      'البيئة والطبيعة|Environment & Nature',
      'المراجع|References',
      'الروايات والخيال|Novels & Fiction',
      'الأدب الكلاسيكي|Classic Literature',
      'القصص القصيرة|Short Stories',
      'الروايات المصورة|Graphic Novels',
      'المسرحيات|Plays',
      'الشعر|Poetry',
      'الأساطير والخرافات|Myths & Legends'
    ];
    
    for (let i = 0; i < ebookTypes.length; i++) {
      const [nameAr, nameEn] = ebookTypes[i].split('|');
      await createCategory({
        nameAr,
        nameEn,
        parentId: ebooks.id,
        order: i + 1
      });
    }
    
    console.log(`✅ تم إضافة ${ebookTypes.length} نوع من الكتب الإلكترونية`);
    
    // 1.2 البحوث والدراسات
    const research = await createCategory({
      nameAr: 'البحوث والدراسات والتقارير',
      nameEn: 'Research & Reports',
      parentId: textContent.id,
      order: 2
    });
    
    const researchTypes = [
      'بحوث علمية|Scientific Research',
      'دراسات أكاديمية|Academic Studies',
      'تقارير سوقية|Market Reports',
      'تحليلات اقتصادية|Economic Analysis',
      'دراسات جدوى|Feasibility Studies',
      'تقارير صناعية|Industry Reports'
    ];
    
    for (let i = 0; i < researchTypes.length; i++) {
      const [nameAr, nameEn] = researchTypes[i].split('|');
      await createCategory({
        nameAr,
        nameEn,
        parentId: research.id,
        order: i + 1
      });
    }
    
    console.log(`✅ تم إضافة ${researchTypes.length} نوع من البحوث والدراسات`);
    
    // 1.3 القوالب النصية
    const textTemplates = await createCategory({
      nameAr: 'القوالب والنماذج النصية',
      nameEn: 'Text Templates',
      parentId: textContent.id,
      order: 3
    });
    
    const templateTypes = [
      'قوالب العقود|Contract Templates',
      'قوالب السير الذاتية|Resume Templates',
      'قوالب الرسائل|Letter Templates',
      'قوالب التقارير|Report Templates',
      'قوالب خطط العمل|Business Plan Templates',
      'قوالب المقترحات|Proposal Templates'
    ];
    
    for (let i = 0; i < templateTypes.length; i++) {
      const [nameAr, nameEn] = templateTypes[i].split('|');
      await createCategory({
        nameAr,
        nameEn,
        parentId: textTemplates.id,
        order: i + 1
      });
    }
    
    console.log(`✅ تم إضافة ${templateTypes.length} نوع من القوالب النصية`);
    
    // 1.4 المحتوى التعليمي المكتوب
    const eduContent = await createCategory({
      nameAr: 'المحتوى التعليمي المكتوب',
      nameEn: 'Educational Content',
      parentId: textContent.id,
      order: 4
    });
    
    const eduTypes = [
      'مذكرات دراسية|Study Notes',
      'ملخصات تعليمية|Educational Summaries',
      'أوراق عمل|Worksheets',
      'اختبارات وتمارين|Tests & Exercises',
      'أدلة دراسية|Study Guides'
    ];
    
    for (let i = 0; i < eduTypes.length; i++) {
      const [nameAr, nameEn] = eduTypes[i].split('|');
      await createCategory({
        nameAr,
        nameEn,
        parentId: eduContent.id,
        order: i + 1
      });
    }
    
    console.log(`✅ تم إضافة ${eduTypes.length} نوع من المحتوى التعليمي`);
    
    console.log('✅ اكتمل إضافة تصنيفات المحتوى النصي!');
    console.log('📊 الإجمالي حتى الآن: ' + (1 + 4 + ebookTypes.length + researchTypes.length + templateTypes.length + eduTypes.length) + ' تصنيف');
    
    // سيتم إضافة باقي التصنيفات في المراحل التالية
    console.log('\n⏳ المرحلة التالية: إضافة تصنيفات المحتوى المرئي البصري...');
    
  } catch (error) {
    console.error('❌ خطأ:', error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('\n✅ اكتمل السكريبت بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ فشل السكريبت:', error);
    process.exit(1);
  });

