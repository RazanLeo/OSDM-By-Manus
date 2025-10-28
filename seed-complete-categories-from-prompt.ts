// سيتم استخدام webdev_execute_sql بدلاً من هذا السكريبت
// هذا الملف للمرجعية فقط

async function main() {
  console.log('🚀 بدء إضافة التصنيفات الكاملة من البرومبت...');

  // ========================================
  // 1. تصنيفات المنتجات الرقمية الجاهزة
  // ========================================
  
  console.log('\n📦 إضافة تصنيفات المنتجات...');
  
  // 1.1 المحتوى النصي والمكتوب
  const textContentId = await db.insert(productCategories).values({
    nameAr: 'المحتوى النصي والمكتوب',
    nameEn: 'Text and Written Content',
    slug: 'text-content',
    type: 'digital_product',
    parentId: null,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  // 1.1.1 الكتب الإلكترونية
  const ebooksId = await db.insert(productCategories).values({
    nameAr: 'الكتب الإلكترونية',
    nameEn: 'E-Books',
    slug: 'e-books',
    type: 'digital_product',
    parentId: textContentId,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  // أنواع الكتب الإلكترونية
  const ebookTypes = [
    { ar: 'كتب علمية وأكاديمية', en: 'Academic & Scientific Books' },
    { ar: 'كتب أطفال والناشئين', en: 'Children & Young Adult Books' },
    { ar: 'كتب تطوير وتنمية الذات', en: 'Self-Development Books' },
    { ar: 'السير الذاتية والمذكرات', en: 'Biographies & Memoirs' },
    { ar: 'كتب التاريخ', en: 'History Books' },
    { ar: 'كتب الجغرافيا', en: 'Geography Books' },
    { ar: 'العلوم والعلوم الطبيعية', en: 'Science & Natural Sciences' },
    { ar: 'العلوم الاجتماعية', en: 'Social Sciences' },
    { ar: 'أعمال واقتصاد', en: 'Business & Economics' },
    { ar: 'دين وفلسفة', en: 'Religion & Philosophy' },
    { ar: 'الفنون والحرف', en: 'Arts & Crafts' },
    { ar: 'كتب تعلم الموضة والتجميل وصناعة الحلي والعطور', en: 'Fashion, Beauty & Perfume Making' },
    { ar: 'الطبخ والطعام', en: 'Cooking & Food' },
    { ar: 'الطب والصحة', en: 'Medicine & Health' },
    { ar: 'التقنية والحاسوب', en: 'Technology & Computing' },
    { ar: 'السفر والسياحة والترفيه', en: 'Travel, Tourism & Entertainment' },
    { ar: 'التعليم والكتب المدرسية', en: 'Education & Textbooks' },
    { ar: 'الرياضة', en: 'Sports' },
    { ar: 'القانون', en: 'Law' },
    { ar: 'البيئة والطبيعة', en: 'Environment & Nature' },
    { ar: 'المراجع', en: 'References' },
    { ar: 'الروايات والخيال', en: 'Novels & Fiction' },
    { ar: 'الأدب الكلاسيكي', en: 'Classic Literature' },
    { ar: 'القصص القصيرة', en: 'Short Stories' },
    { ar: 'الروايات المصورة', en: 'Graphic Novels' },
    { ar: 'المسرحيات', en: 'Plays' },
    { ar: 'الشعر', en: 'Poetry' },
    { ar: 'الأساطير والخرافات', en: 'Myths & Legends' },
  ];

  for (const type of ebookTypes) {
    await db.insert(productCategories).values({
      nameAr: type.ar,
      nameEn: type.en,
      slug: type.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'digital_product',
      parentId: ebooksId,
    });
  }

  // 1.1.2 البحوث والدراسات والتقارير والتحليلات
  const researchId = await db.insert(productCategories).values({
    nameAr: 'البحوث والدراسات والتقارير والتحليلات',
    nameEn: 'Research, Studies, Reports & Analysis',
    slug: 'research-reports',
    type: 'digital_product',
    parentId: textContentId,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  const researchTypes = [
    { ar: 'أبحاث السوق', en: 'Market Research' },
    { ar: 'تقارير الصناعة', en: 'Industry Reports' },
    { ar: 'دراسات الجدوى', en: 'Feasibility Studies' },
    { ar: 'أوراق بيضاء', en: 'White Papers' },
    { ar: 'دراسات حالة', en: 'Case Studies' },
    { ar: 'تقارير إحصائية', en: 'Statistical Reports' },
    { ar: 'بحوث علمية ودراسات علمية', en: 'Scientific Research & Studies' },
  ];

  for (const type of researchTypes) {
    await db.insert(productCategories).values({
      nameAr: type.ar,
      nameEn: type.en,
      slug: type.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'digital_product',
      parentId: researchId,
    });
  }

  // 1.1.3 القوالب والنماذج النصية
  const templatesId = await db.insert(productCategories).values({
    nameAr: 'القوالب والنماذج النصية',
    nameEn: 'Text Templates & Forms',
    slug: 'text-templates',
    type: 'digital_product',
    parentId: textContentId,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  const templateTypes = [
    { ar: 'قوالب السيرة الذاتية', en: 'CV Templates' },
    { ar: 'قوالب الخطابات الرسمية', en: 'Formal Letter Templates' },
    { ar: 'قوالب خطط العمل', en: 'Business Plan Templates' },
    { ar: 'قوالب العقود القانونية', en: 'Legal Contract Templates' },
    { ar: 'قوالب التسويق', en: 'Marketing Templates' },
    { ar: 'قوالب البريد الإلكتروني', en: 'Email Templates' },
    { ar: 'قوالب القوائس', en: 'List Templates' },
    { ar: 'قوالب العروض التقديمية', en: 'Presentation Templates' },
    { ar: 'قوالب المستندات', en: 'Document Templates' },
    { ar: 'قوالب التقارير', en: 'Report Templates' },
  ];

  for (const type of templateTypes) {
    await db.insert(productCategories).values({
      nameAr: type.ar,
      nameEn: type.en,
      slug: type.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'digital_product',
      parentId: templatesId,
    });
  }

  // 1.1.4 المحتوى التعليمي والإعلامي المكتوب
  const educationalContentId = await db.insert(productCategories).values({
    nameAr: 'المحتوى التعليمي والإعلامي المكتوب',
    nameEn: 'Educational & Informational Written Content',
    slug: 'educational-content',
    type: 'digital_product',
    parentId: textContentId,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  const educationalTypes = [
    { ar: 'دورات تدريسية مكتوبة وملفات تعليمية', en: 'Written Courses & Educational Files' },
    { ar: 'ملخصات جاهزة', en: 'Ready Summaries' },
    { ar: 'كتيبات وأدلة تعليمية', en: 'Educational Booklets & Guides' },
    { ar: 'كتيبات وأدلة إرشادية', en: 'Instruction Manuals' },
    { ar: 'مقالات ومدونات', en: 'Articles & Blogs' },
    { ar: 'ملفات تعليمية PDF', en: 'Educational PDF Files' },
    { ar: 'أوراق عمل Worksheets', en: 'Worksheets' },
    { ar: 'اختبارات ومسابقات', en: 'Quizzes & Tests' },
    { ar: 'ملفات (بروميتات) يومسنات جاهزة - هندسة الأوامر', en: 'Ready Prompts - Prompt Engineering' },
  ];

  for (const type of educationalTypes) {
    await db.insert(productCategories).values({
      nameAr: type.ar,
      nameEn: type.en,
      slug: type.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'digital_product',
      parentId: educationalContentId,
    });
  }

  // 1.2 المحتوى المرئي (البصري)
  const visualContentId = await db.insert(productCategories).values({
    nameAr: 'المحتوى المرئي (البصري)',
    nameEn: 'Visual Content',
    slug: 'visual-content',
    type: 'digital_product',
    parentId: null,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  // 2.1 قوالب التصميم الجرافيكي
  const designTemplatesId = await db.insert(productCategories).values({
    nameAr: 'قوالب التصميم الجرافيكي',
    nameEn: 'Graphic Design Templates',
    slug: 'design-templates',
    type: 'digital_product',
    parentId: visualContentId,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  const designTemplateTypes = [
    { ar: 'قوالب Canva', en: 'Canva Templates' },
    { ar: 'قوالب Photoshop', en: 'Photoshop Templates' },
    { ar: 'قوالب Illustrator', en: 'Illustrator Templates' },
    { ar: 'قوالب InDesign', en: 'InDesign Templates' },
    { ar: 'قوالب Figma', en: 'Figma Templates' },
    { ar: 'قوالب Sketch', en: 'Sketch Templates' },
    { ar: 'قوالب After Effects', en: 'After Effects Templates' },
    { ar: 'قوالب Premiere Pro', en: 'Premiere Pro Templates' },
  ];

  for (const type of designTemplateTypes) {
    await db.insert(productCategories).values({
      nameAr: type.ar,
      nameEn: type.en,
      slug: type.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'digital_product',
      parentId: designTemplatesId,
    });
  }

  // 2.2 الصور والرسومات
  const imagesId = await db.insert(productCategories).values({
    nameAr: 'الصور والرسومات',
    nameEn: 'Images & Graphics',
    slug: 'images-graphics',
    type: 'digital_product',
    parentId: visualContentId,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  const imageTypes = [
    { ar: 'صور فوتوغرافية مخزنة Stock Photos', en: 'Stock Photos' },
    { ar: 'رسوم توضيحية Illustrations', en: 'Illustrations' },
    { ar: 'الأيقونات Icons Sets', en: 'Icon Sets' },
    { ar: 'شخصيات كرتونية Characters, Mascots', en: 'Characters & Mascots' },
    { ar: 'رسومات فنية Digital Art', en: 'Digital Art' },
    { ar: 'انفوجرافيك', en: 'Infographics' },
    { ar: 'رسوم بيانية', en: 'Charts & Graphs' },
    { ar: 'خلفيات', en: 'Backgrounds & Wallpapers' },
    { ar: 'أنماط', en: 'Patterns & Textures' },
    { ar: 'ملصقات رقمية', en: 'Digital Stickers' },
    { ar: 'صور PNG شفافة', en: 'Transparent PNG Images' },
    { ar: 'صور Vector', en: 'Vector Images' },
    { ar: 'تصاميم ديكورات جاهزة', en: 'Ready Decoration Designs' },
  ];

  for (const type of imageTypes) {
    await db.insert(productCategories).values({
      nameAr: type.ar,
      nameEn: type.en,
      slug: type.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'digital_product',
      parentId: imagesId,
    });
  }

  // 2.3 تصاميم الطباعة
  const printDesignsId = await db.insert(productCategories).values({
    nameAr: 'تصاميم الطباعة',
    nameEn: 'Print Designs',
    slug: 'print-designs',
    type: 'digital_product',
    parentId: visualContentId,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  const printTypes = [
    { ar: 'تصاميم التيشرتات', en: 'T-shirt Designs' },
    { ar: 'تصاميم الأكواب', en: 'Mug Designs' },
    { ar: 'تصاميم الحقائب', en: 'Bag Designs' },
    { ar: 'تصاميم البوسترات', en: 'Poster Designs' },
    { ar: 'تصاميم الملصقات', en: 'Sticker Designs' },
    { ar: 'تصاميم القبعات', en: 'Hat Designs' },
    { ar: 'تصاميم الوسائد', en: 'Pillow Designs' },
    { ar: 'تصاميم الهواتف', en: 'Phone Case Designs' },
    { ar: 'تصاميم اللوحات', en: 'Canvas Prints' },
    { ar: 'تصاميم البطاقات وبطاقات الأعمال', en: 'Card & Business Card Designs' },
    { ar: 'تصاميم دعوات وبطاقات التقنية', en: 'Invitation & Greeting Card Designs' },
    { ar: 'تصاميم شهادات', en: 'Certificate Designs' },
  ];

  for (const type of printTypes) {
    await db.insert(productCategories).values({
      nameAr: type.ar,
      nameEn: type.en,
      slug: type.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'digital_product',
      parentId: printDesignsId,
    });
  }

  // 2.4 قوالب الأعمال والإنتاجية
  const businessTemplatesId = await db.insert(productCategories).values({
    nameAr: 'قوالب الأعمال والإنتاجية',
    nameEn: 'Business & Productivity Templates',
    slug: 'business-templates',
    type: 'digital_product',
    parentId: visualContentId,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  const businessTemplateTypes = [
    { ar: 'قوالب Excel', en: 'Excel Templates' },
    { ar: 'قوالب Google Sheets', en: 'Google Sheets Templates' },
    { ar: 'قوالب Notion', en: 'Notion Templates' },
    { ar: 'قوالب Airtable', en: 'Airtable Templates' },
    { ar: 'قوالب Monday', en: 'Monday Templates' },
    { ar: 'قوالب Trello', en: 'Trello Templates' },
    { ar: 'قوالب Asana', en: 'Asana Templates' },
    { ar: 'Digital Planners', en: 'Digital Planners' },
    { ar: 'قوالب التقويم', en: 'Calendar Templates' },
    { ar: 'قوالب الميزانية', en: 'Budget Templates' },
  ];

  for (const type of businessTemplateTypes) {
    await db.insert(productCategories).values({
      nameAr: type.ar,
      nameEn: type.en,
      slug: type.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'digital_product',
      parentId: businessTemplatesId,
    });
  }

  // 2.5 موارد التصميم
  const designResourcesId = await db.insert(productCategories).values({
    nameAr: 'موارد التصميم',
    nameEn: 'Design Resources',
    slug: 'design-resources',
    type: 'digital_product',
    parentId: visualContentId,
  }).returning({ id: productCategories.id }).then(r => r[0]?.id);

  const designResourceTypes = [
    { ar: 'خطوط رقمية Fonts, Typography', en: 'Fonts & Typography' },
    { ar: 'فرش فوتوشوب Photoshop Brushes', en: 'Photoshop Brushes' },
    { ar: 'أدوات تصميم Design Tools', en: 'Design Tools' },
    { ar: 'Actions Presets', en: 'Photoshop Actions & Lightroom Presets' },
  ];

  for (const type of designResourceTypes) {
    await db.insert(productCategories).values({
      nameAr: type.ar,
      nameEn: type.en,
      slug: type.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'digital_product',
      parentId: designResourcesId,
    });
  }

  console.log('✅ تم إضافة تصنيفات المنتجات بنجاح!');
  console.log('✅ اكتمل إضافة التصنيفات الكاملة من البرومبت!');
}

main()
  .then(() => {
    console.log('✅ تم الانتهاء بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطأ:', error);
    process.exit(1);
  });

