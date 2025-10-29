import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { productCategories, serviceCategories, jobCategories } from '../schema';
import { isNull } from 'drizzle-orm';

/**
 * Complete Hierarchy Seeder for OSDM Platform
 * Adds ALL subcategories and types from the 22-page document
 */

async function seedCompleteProductHierarchy(db: any) {
  console.log('\n📦 Seeding COMPLETE Product Hierarchy...');
  
  // Get main categories
  const mainCategories = await db.select().from(productCategories).where(isNull(productCategories.parentId));
  console.log(`Found ${mainCategories.length} main product categories`);
  
  let totalSubcategories = 0;
  let totalTypes = 0;
  
  // 1. المحتوى النصي والمكتوب - Written & Text Content
  const textContent = mainCategories.find((c: any) => c.nameEn === 'Written & Text Content');
  if (textContent) {
    console.log(`\n  Processing: ${textContent.nameEn}`);
    
    // Subcategory 1: الكتب الإلكترونية - E-Books
    const [eBooksResult] = await db.insert(productCategories).values({
      nameAr: 'الكتب الإلكترونية',
      nameEn: 'E-Books',
      parentId: textContent.id,
      icon: 'Book',
      order: 1
    });
    const eBooksId = eBooksResult.insertId;
    totalSubcategories++;
    
    // Types for E-Books (28 types)
    const eBooksTypes = [
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
    ];
    
    for (let i = 0; i < eBooksTypes.length; i++) {
      await db.insert(productCategories).values({
        ...eBooksTypes[i],
        parentId: eBooksId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ E-Books: ${eBooksTypes.length} types`);
    
    // Subcategory 2: البحوث والدراسات - Research & Reports
    const [researchResult] = await db.insert(productCategories).values({
      nameAr: 'البحوث والدراسات والتقارير والتحليلات',
      nameEn: 'Research, Studies, Reports & Analysis',
      parentId: textContent.id,
      icon: 'FileSearch',
      order: 2
    });
    const researchId = researchResult.insertId;
    totalSubcategories++;
    
    const researchTypes = [
      { nameAr: 'أبحاث السوق', nameEn: 'Market Research' },
      { nameAr: 'تقارير الصناعة', nameEn: 'Industry Reports' },
      { nameAr: 'دراسات الجدوى', nameEn: 'Feasibility Studies' },
      { nameAr: 'أوراق بيضاء', nameEn: 'White Papers' },
      { nameAr: 'دراسات حالة', nameEn: 'Case Studies' },
      { nameAr: 'تقارير إحصائية', nameEn: 'Statistical Reports' },
      { nameAr: 'بحوث ودراسات علمية', nameEn: 'Scientific Research & Studies' }
    ];
    
    for (let i = 0; i < researchTypes.length; i++) {
      await db.insert(productCategories).values({
        ...researchTypes[i],
        parentId: researchId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Research: ${researchTypes.length} types`);
    
    // Subcategory 3: القوالب والنماذج النصية - Text Templates
    const [templatesResult] = await db.insert(productCategories).values({
      nameAr: 'القوالب والنماذج النصية',
      nameEn: 'Text Templates & Forms',
      parentId: textContent.id,
      icon: 'FileType',
      order: 3
    });
    const templatesId = templatesResult.insertId;
    totalSubcategories++;
    
    const templateTypes = [
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
    ];
    
    for (let i = 0; i < templateTypes.length; i++) {
      await db.insert(productCategories).values({
        ...templateTypes[i],
        parentId: templatesId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Templates: ${templateTypes.length} types`);
    
    // Subcategory 4: المحتوى التعليمي - Educational Content
    const [eduContentResult] = await db.insert(productCategories).values({
      nameAr: 'المحتوى التعليمي والإعلامي المكتوب',
      nameEn: 'Written Educational & Media Content',
      parentId: textContent.id,
      icon: 'GraduationCap',
      order: 4
    });
    const eduContentId = eduContentResult.insertId;
    totalSubcategories++;
    
    const eduContentTypes = [
      { nameAr: 'دورات تدريبية مكتوبة وملفات تعليمية', nameEn: 'Written Training Courses & Educational Files' },
      { nameAr: 'ملخصات جاهزة', nameEn: 'Ready Summaries' },
      { nameAr: 'كتيبات وأدلة تعليمية', nameEn: 'Educational Guides & Manuals' },
      { nameAr: 'كتيبات وأدلة إرشادية', nameEn: 'How-to Guides' },
      { nameAr: 'مقالات ومدونات ومنشورات', nameEn: 'Articles, Blogs & Publications' },
      { nameAr: 'ملفات تعليمية PDF', nameEn: 'Educational PDF Files' },
      { nameAr: 'أوراق عمل', nameEn: 'Worksheets' },
      { nameAr: 'اختبارات ومسابقات', nameEn: 'Quizzes & Tests' },
      { nameAr: 'ملفات بروم��تات (هندسة الأوامر)', nameEn: 'Prompt Files (Prompt Engineering)' }
    ];
    
    for (let i = 0; i < eduContentTypes.length; i++) {
      await db.insert(productCategories).values({
        ...eduContentTypes[i],
        parentId: eduContentId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Educational Content: ${eduContentTypes.length} types`);
  }
  
  // 2. المحتوى المرئي البصري - Visual Content
  const visualContent = mainCategories.find((c: any) => c.nameEn === 'Visual Content');
  if (visualContent) {
    console.log(`\n  Processing: ${visualContent.nameEn}`);
    
    // Subcategory 1: الصور الفوتوغرافية - Photography
    const [photoResult] = await db.insert(productCategories).values({
      nameAr: 'الصور الفوتوغرافية',
      nameEn: 'Photography',
      parentId: visualContent.id,
      icon: 'Camera',
      order: 1
    });
    const photoId = photoResult.insertId;
    totalSubcategories++;
    
    const photoTypes = [
      { nameAr: 'صور طبيعية ومناظر', nameEn: 'Nature & Landscape Photos' },
      { nameAr: 'صور أشخاص وبورتريه', nameEn: 'People & Portrait Photos' },
      { nameAr: 'صور أعمال ومكاتب', nameEn: 'Business & Office Photos' },
      { nameAr: 'صور طعام ومشروبات', nameEn: 'Food & Beverage Photos' },
      { nameAr: 'صور سفر وسياحة', nameEn: 'Travel & Tourism Photos' },
      { nameAr: 'صور رياضة ولياقة', nameEn: 'Sports & Fitness Photos' },
      { nameAr: 'صور تقنية وحاسوب', nameEn: 'Technology & Computing Photos' },
      { nameAr: 'صور طبية وصحية', nameEn: 'Medical & Health Photos' },
      { nameAr: 'صور تعليمية', nameEn: 'Educational Photos' },
      { nameAr: 'صور فنية وإبداعية', nameEn: 'Artistic & Creative Photos' },
      { nameAr: 'صور حيوانات وحياة برية', nameEn: 'Animals & Wildlife Photos' },
      { nameAr: 'صور معمارية وعقارات', nameEn: 'Architecture & Real Estate Photos' },
      { nameAr: 'صور أزياء وموضة', nameEn: 'Fashion & Style Photos' },
      { nameAr: 'صور منتجات', nameEn: 'Product Photos' },
      { nameAr: 'صور خلفيات', nameEn: 'Background Photos' },
      { nameAr: 'صور نسيجية وخامات', nameEn: 'Texture & Material Photos' }
    ];
    
    for (let i = 0; i < photoTypes.length; i++) {
      await db.insert(productCategories).values({
        ...photoTypes[i],
        parentId: photoId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Photography: ${photoTypes.length} types`);
    
    // Subcategory 2: التصاميم الجرافيكية - Graphic Designs
    const [graphicResult] = await db.insert(productCategories).values({
      nameAr: 'التصاميم الجرافيكية',
      nameEn: 'Graphic Designs',
      parentId: visualContent.id,
      icon: 'Palette',
      order: 2
    });
    const graphicId = graphicResult.insertId;
    totalSubcategories++;
    
    const graphicTypes = [
      { nameAr: 'تصاميم شعارات', nameEn: 'Logo Designs' },
      { nameAr: 'تصاميم هوية بصرية', nameEn: 'Brand Identity Designs' },
      { nameAr: 'تصاميم بطاقات عمل', nameEn: 'Business Card Designs' },
      { nameAr: 'تصاميم منشورات سوشيال ميديا', nameEn: 'Social Media Post Designs' },
      { nameAr: 'تصاميم بروشورات ومطبوعات', nameEn: 'Brochure & Print Designs' },
      { nameAr: 'تصاميم إعلانات', nameEn: 'Advertisement Designs' },
      { nameAr: 'تصاميم بانرات وملصقات', nameEn: 'Banner & Poster Designs' },
      { nameAr: 'تصاميم أغلفة كتب', nameEn: 'Book Cover Designs' },
      { nameAr: 'تصاميم تغليف منتجات', nameEn: 'Product Packaging Designs' },
      { nameAr: 'تصاميم قوائم طعام', nameEn: 'Menu Designs' },
      { nameAr: 'تصاميم شهادات', nameEn: 'Certificate Designs' },
      { nameAr: 'تصاميم دعوات', nameEn: 'Invitation Designs' },
      { nameAr: 'تصاميم إنفوجرافيك', nameEn: 'Infographic Designs' },
      { nameAr: 'تصاميم عروض تقديمية', nameEn: 'Presentation Designs' }
    ];
    
    for (let i = 0; i < graphicTypes.length; i++) {
      await db.insert(productCategories).values({
        ...graphicTypes[i],
        parentId: graphicId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Graphic Designs: ${graphicTypes.length} types`);
    
    // Subcategory 3: الرسومات التوضيحية - Illustrations
    const [illustrationResult] = await db.insert(productCategories).values({
      nameAr: 'الرسومات التوضيحية',
      nameEn: 'Illustrations',
      parentId: visualContent.id,
      icon: 'Brush',
      order: 3
    });
    const illustrationId = illustrationResult.insertId;
    totalSubcategories++;
    
    const illustrationTypes = [
      { nameAr: 'رسومات رقمية', nameEn: 'Digital Illustrations' },
      { nameAr: 'رسومات كرتونية', nameEn: 'Cartoon Illustrations' },
      { nameAr: 'رسومات أطفال', nameEn: 'Children Illustrations' },
      { nameAr: 'رسومات شخصيات', nameEn: 'Character Illustrations' },
      { nameAr: 'رسومات توضيحية علمية', nameEn: 'Scientific Illustrations' },
      { nameAr: 'رسومات توضيحية طبية', nameEn: 'Medical Illustrations' },
      { nameAr: 'رسومات تقنية', nameEn: 'Technical Illustrations' },
      { nameAr: 'رسومات فنية', nameEn: 'Artistic Illustrations' },
      { nameAr: 'رسومات متجهة (Vector)', nameEn: 'Vector Illustrations' }
    ];
    
    for (let i = 0; i < illustrationTypes.length; i++) {
      await db.insert(productCategories).values({
        ...illustrationTypes[i],
        parentId: illustrationId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Illustrations: ${illustrationTypes.length} types`);
    
    // Subcategory 4: الأيقونات والرموز - Icons & Symbols
    const [iconResult] = await db.insert(productCategories).values({
      nameAr: 'الأيقونات والرموز',
      nameEn: 'Icons & Symbols',
      parentId: visualContent.id,
      icon: 'Star',
      order: 4
    });
    const iconId = iconResult.insertId;
    totalSubcategories++;
    
    const iconTypes = [
      { nameAr: 'أيقونات واجهات المستخدم', nameEn: 'UI Icons' },
      { nameAr: 'أيقونات تطبيقات', nameEn: 'App Icons' },
      { nameAr: 'أيقونات سوشيال ميديا', nameEn: 'Social Media Icons' },
      { nameAr: 'أيقونات أعمال', nameEn: 'Business Icons' },
      { nameAr: 'أيقونات تقنية', nameEn: 'Technology Icons' },
      { nameAr: 'رموز وإيموجي', nameEn: 'Symbols & Emoji' }
    ];
    
    for (let i = 0; i < iconTypes.length; i++) {
      await db.insert(productCategories).values({
        ...iconTypes[i],
        parentId: iconId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Icons: ${iconTypes.length} types`);
    
    // Subcategory 5: الخطوط والطباعة - Fonts & Typography
    const [fontResult] = await db.insert(productCategories).values({
      nameAr: 'الخطوط والطباعة',
      nameEn: 'Fonts & Typography',
      parentId: visualContent.id,
      icon: 'Type',
      order: 5
    });
    const fontId = fontResult.insertId;
    totalSubcategories++;
    
    const fontTypes = [
      { nameAr: 'خطوط عربية', nameEn: 'Arabic Fonts' },
      { nameAr: 'خطوط إنجليزية', nameEn: 'English Fonts' },
      { nameAr: 'خطوط زخرفية', nameEn: 'Decorative Fonts' },
      { nameAr: 'خطوط حديثة', nameEn: 'Modern Fonts' },
      { nameAr: 'خطوط كلاسيكية', nameEn: 'Classic Fonts' },
      { nameAr: 'خطوط مخطوطة', nameEn: 'Script Fonts' }
    ];
    
    for (let i = 0; i < fontTypes.length; i++) {
      await db.insert(productCategories).values({
        ...fontTypes[i],
        parentId: fontId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Fonts: ${fontTypes.length} types`);
  }
  
  // 3. المحتوى السمعي - Audio Content
  const audioContent = mainCategories.find((c: any) => c.nameEn === 'Audio Content');
  if (audioContent) {
    console.log(`\n  Processing: ${audioContent.nameEn}`);
    
    // Subcategory 1: الموسيقى والمقطوعات - Music & Audio Tracks
    const [musicResult] = await db.insert(productCategories).values({
      nameAr: 'الموسيقى والمقطوعات الصوتية',
      nameEn: 'Music & Audio Tracks',
      parentId: audioContent.id,
      icon: 'Music',
      order: 1
    });
    const musicId = musicResult.insertId;
    totalSubcategories++;
    
    const musicTypes = [
      { nameAr: 'موسيقى خلفية', nameEn: 'Background Music' },
      { nameAr: 'موسيقى سينمائية', nameEn: 'Cinematic Music' },
      { nameAr: 'موسيقى إلكترونية', nameEn: 'Electronic Music' },
      { nameAr: 'موسيقى كلاسيكية', nameEn: 'Classical Music' },
      { nameAr: 'موسيقى شرقية', nameEn: 'Oriental Music' },
      { nameAr: 'موسيقى بوب وروك', nameEn: 'Pop & Rock Music' },
      { nameAr: 'موسيقى هادئة واسترخاء', nameEn: 'Calm & Relaxation Music' },
      { nameAr: 'موسيقى حماسية', nameEn: 'Motivational Music' },
      { nameAr: 'موسيقى أطفال', nameEn: 'Children Music' },
      { nameAr: 'موسيقى إعلانات', nameEn: 'Commercial Music' }
    ];
    
    for (let i = 0; i < musicTypes.length; i++) {
      await db.insert(productCategories).values({
        ...musicTypes[i],
        parentId: musicId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Music: ${musicTypes.length} types`);
    
    // Subcategory 2: المؤثرات الصوتية - Sound Effects
    const [sfxResult] = await db.insert(productCategories).values({
      nameAr: 'المؤثرات الصوتية',
      nameEn: 'Sound Effects',
      parentId: audioContent.id,
      icon: 'Volume2',
      order: 2
    });
    const sfxId = sfxResult.insertId;
    totalSubcategories++;
    
    const sfxTypes = [
      { nameAr: 'مؤثرات طبيعية', nameEn: 'Nature Sound Effects' },
      { nameAr: 'مؤثرات حضرية', nameEn: 'Urban Sound Effects' },
      { nameAr: 'مؤثرات تقنية', nameEn: 'Technology Sound Effects' },
      { nameAr: 'مؤثرات بشرية', nameEn: 'Human Sound Effects' },
      { nameAr: 'مؤثرات حيوانات', nameEn: 'Animal Sound Effects' },
      { nameAr: 'مؤثرات ألعاب', nameEn: 'Game Sound Effects' },
      { nameAr: 'مؤثرات سينمائية', nameEn: 'Cinematic Sound Effects' }
    ];
    
    for (let i = 0; i < sfxTypes.length; i++) {
      await db.insert(productCategories).values({
        ...sfxTypes[i],
        parentId: sfxId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Sound Effects: ${sfxTypes.length} types`);
  }
  
  // 4. المحتوى المرئي المتحرك - Video Content
  const videoContent = mainCategories.find((c: any) => c.nameEn === 'Video Content');
  if (videoContent) {
    console.log(`\n  Processing: ${videoContent.nameEn}`);
    
    // Subcategory 1: مقاطع الفيديو الجاهزة - Stock Videos
    const [stockVideoResult] = await db.insert(productCategories).values({
      nameAr: 'مقاطع الفيديو الجاهزة',
      nameEn: 'Stock Videos',
      parentId: videoContent.id,
      icon: 'Film',
      order: 1
    });
    const stockVideoId = stockVideoResult.insertId;
    totalSubcategories++;
    
    const stockVideoTypes = [
      { nameAr: 'فيديوهات طبيعية', nameEn: 'Nature Videos' },
      { nameAr: 'فيديوهات أعمال', nameEn: 'Business Videos' },
      { nameAr: 'فيديوهات تقنية', nameEn: 'Technology Videos' },
      { nameAr: 'فيديوهات أشخاص', nameEn: 'People Videos' },
      { nameAr: 'فيديوهات سفر', nameEn: 'Travel Videos' },
      { nameAr: 'فيديوهات طعام', nameEn: 'Food Videos' },
      { nameAr: 'فيديوهات رياضة', nameEn: 'Sports Videos' },
      { nameAr: 'فيديوهات خلفيات', nameEn: 'Background Videos' },
      { nameAr: 'فيديوهات جوية (Drone)', nameEn: 'Aerial (Drone) Videos' },
      { nameAr: 'فيديوهات حركة بطيئة', nameEn: 'Slow Motion Videos' }
    ];
    
    for (let i = 0; i < stockVideoTypes.length; i++) {
      await db.insert(productCategories).values({
        ...stockVideoTypes[i],
        parentId: stockVideoId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Stock Videos: ${stockVideoTypes.length} types`);
    
    // Subcategory 2: قوالب الفيديو - Video Templates
    const [videoTemplateResult] = await db.insert(productCategories).values({
      nameAr: 'قوالب الفيديو',
      nameEn: 'Video Templates',
      parentId: videoContent.id,
      icon: 'Clapperboard',
      order: 2
    });
    const videoTemplateId = videoTemplateResult.insertId;
    totalSubcategories++;
    
    const videoTemplateTypes = [
      { nameAr: 'قوالب إنترو وأوترو', nameEn: 'Intro & Outro Templates' },
      { nameAr: 'قوالب إعلانات', nameEn: 'Advertisement Templates' },
      { nameAr: 'قوالب سوشيال ميديا', nameEn: 'Social Media Templates' },
      { nameAr: 'قوالب عروض تقديمية', nameEn: 'Presentation Templates' },
      { nameAr: 'قوالب شعارات متحركة', nameEn: 'Logo Animation Templates' },
      { nameAr: 'قوالب تايتل وترجمة', nameEn: 'Title & Subtitle Templates' },
      { nameAr: 'قوالب انتقالات', nameEn: 'Transition Templates' }
    ];
    
    for (let i = 0; i < videoTemplateTypes.length; i++) {
      await db.insert(productCategories).values({
        ...videoTemplateTypes[i],
        parentId: videoTemplateId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Video Templates: ${videoTemplateTypes.length} types`);
    
    // Subcategory 3: الرسوم المتحركة - Animations
    const [animationResult] = await db.insert(productCategories).values({
      nameAr: 'الرسوم المتحركة',
      nameEn: 'Animations',
      parentId: videoContent.id,
      icon: 'Zap',
      order: 3
    });
    const animationId = animationResult.insertId;
    totalSubcategories++;
    
    const animationTypes = [
      { nameAr: 'رسوم متحركة 2D', nameEn: '2D Animations' },
      { nameAr: 'رسوم متحركة 3D', nameEn: '3D Animations' },
      { nameAr: 'موشن جرافيك', nameEn: 'Motion Graphics' },
      { nameAr: 'رسوم متحركة توضيحية', nameEn: 'Explainer Animations' },
      { nameAr: 'رسوم متحركة شخصيات', nameEn: 'Character Animations' },
      { nameAr: 'رسوم متحركة نصية', nameEn: 'Text Animations' },
      { nameAr: 'رسوم متحركة لوجو', nameEn: 'Logo Animations' }
    ];
    
    for (let i = 0; i < animationTypes.length; i++) {
      await db.insert(productCategories).values({
        ...animationTypes[i],
        parentId: animationId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Animations: ${animationTypes.length} types`);
  }
  
  // 5. المحتوى التفاعلي والرقمي - Interactive Digital Content
  const interactiveContent = mainCategories.find((c: any) => c.nameEn === 'Interactive Digital Content');
  if (interactiveContent) {
    console.log(`\n  Processing: ${interactiveContent.nameEn}`);
    
    // Subcategory 1: قوالب العروض التقديمية - Presentation Templates
    const [presentationResult] = await db.insert(productCategories).values({
      nameAr: 'قوالب العروض التقديمية',
      nameEn: 'Presentation Templates',
      parentId: interactiveContent.id,
      icon: 'Presentation',
      order: 1
    });
    const presentationId = presentationResult.insertId;
    totalSubcategories++;
    
    const presentationTypes = [
      { nameAr: 'قوالب PowerPoint', nameEn: 'PowerPoint Templates' },
      { nameAr: 'قوالب Google Slides', nameEn: 'Google Slides Templates' },
      { nameAr: 'قوالب Keynote', nameEn: 'Keynote Templates' },
      { nameAr: 'قوالب عروض أعمال', nameEn: 'Business Presentation Templates' },
      { nameAr: 'قوالب عروض تعليمية', nameEn: 'Educational Presentation Templates' },
      { nameAr: 'قوالب عروض تسويقية', nameEn: 'Marketing Presentation Templates' },
      { nameAr: 'قوالب عروض إبداعية', nameEn: 'Creative Presentation Templates' }
    ];
    
    for (let i = 0; i < presentationTypes.length; i++) {
      await db.insert(productCategories).values({
        ...presentationTypes[i],
        parentId: presentationId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Presentations: ${presentationTypes.length} types`);
    
    // Subcategory 2: الدورات التدريبية الرقمية - Online Courses
    const [coursesResult] = await db.insert(productCategories).values({
      nameAr: 'الدورات التدريبية الرقمية',
      nameEn: 'Online Courses',
      parentId: interactiveContent.id,
      icon: 'BookOpen',
      order: 2
    });
    const coursesId = coursesResult.insertId;
    totalSubcategories++;
    
    const coursesTypes = [
      { nameAr: 'دورات برمجة', nameEn: 'Programming Courses' },
      { nameAr: 'دورات تصميم', nameEn: 'Design Courses' },
      { nameAr: 'دورات تسويق', nameEn: 'Marketing Courses' },
      { nameAr: 'دورات أعمال', nameEn: 'Business Courses' },
      { nameAr: 'دورات لغات', nameEn: 'Language Courses' },
      { nameAr: 'دورات تطوير ذات', nameEn: 'Self-Development Courses' },
      { nameAr: 'دورات تقنية', nameEn: 'Technology Courses' },
      { nameAr: 'دورات فنون', nameEn: 'Arts Courses' }
    ];
    
    for (let i = 0; i < coursesTypes.length; i++) {
      await db.insert(productCategories).values({
        ...coursesTypes[i],
        parentId: coursesId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Online Courses: ${coursesTypes.length} types`);
  }
  
  // 6. محتوى البرمجة والتقنية - Programming & Technical Content
  const programmingContent = mainCategories.find((c: any) => c.nameEn === 'Programming & Technical Content');
  if (programmingContent) {
    console.log(`\n  Processing: ${programmingContent.nameEn}`);
    
    // Subcategory 1: الأكواد والسكريبتات - Code & Scripts
    const [codeResult] = await db.insert(productCategories).values({
      nameAr: 'الأكواد والسكريبتات',
      nameEn: 'Code & Scripts',
      parentId: programmingContent.id,
      icon: 'Terminal',
      order: 1
    });
    const codeId = codeResult.insertId;
    totalSubcategories++;
    
    const codeTypes = [
      { nameAr: 'سكريبتات PHP', nameEn: 'PHP Scripts' },
      { nameAr: 'سكريبتات Python', nameEn: 'Python Scripts' },
      { nameAr: 'سكريبتات JavaScript', nameEn: 'JavaScript Scripts' },
      { nameAr: 'سكريبتات WordPress', nameEn: 'WordPress Scripts' },
      { nameAr: 'أكواد CSS', nameEn: 'CSS Code' },
      { nameAr: 'أكواد HTML', nameEn: 'HTML Code' },
      { nameAr: 'سكريبتات أتمتة', nameEn: 'Automation Scripts' }
    ];
    
    for (let i = 0; i < codeTypes.length; i++) {
      await db.insert(productCategories).values({
        ...codeTypes[i],
        parentId: codeId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Code & Scripts: ${codeTypes.length} types`);
    
    // Subcategory 2: قوالب المواقع والتطبيقات - Website & App Templates
    const [webTemplateResult] = await db.insert(productCategories).values({
      nameAr: 'قوالب المواقع والتطبيقات',
      nameEn: 'Website & App Templates',
      parentId: programmingContent.id,
      icon: 'Layout',
      order: 2
    });
    const webTemplateId = webTemplateResult.insertId;
    totalSubcategories++;
    
    const webTemplateTypes = [
      { nameAr: 'قوالب HTML/CSS', nameEn: 'HTML/CSS Templates' },
      { nameAr: 'قوالب WordPress', nameEn: 'WordPress Templates' },
      { nameAr: 'قوالب React', nameEn: 'React Templates' },
      { nameAr: 'قوالب Bootstrap', nameEn: 'Bootstrap Templates' },
      { nameAr: 'قوالب متاجر إلكترونية', nameEn: 'E-commerce Templates' },
      { nameAr: 'قوالب لوحات تحكم', nameEn: 'Dashboard Templates' },
      { nameAr: 'قوالب صفحات هبوط', nameEn: 'Landing Page Templates' },
      { nameAr: 'قوالب تطبيقات موبايل', nameEn: 'Mobile App Templates' }
    ];
    
    for (let i = 0; i < webTemplateTypes.length; i++) {
      await db.insert(productCategories).values({
        ...webTemplateTypes[i],
        parentId: webTemplateId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Web Templates: ${webTemplateTypes.length} types`);
    
    // Subcategory 3: الإضافات والمكونات - Plugins & Components
    const [pluginResult] = await db.insert(productCategories).values({
      nameAr: 'الإضافات والمكونات',
      nameEn: 'Plugins & Components',
      parentId: programmingContent.id,
      icon: 'Package',
      order: 3
    });
    const pluginId = pluginResult.insertId;
    totalSubcategories++;
    
    const pluginTypes = [
      { nameAr: 'إضافات WordPress', nameEn: 'WordPress Plugins' },
      { nameAr: 'مكونات React', nameEn: 'React Components' },
      { nameAr: 'مكونات Vue', nameEn: 'Vue Components' },
      { nameAr: 'مكتبات JavaScript', nameEn: 'JavaScript Libraries' },
      { nameAr: 'إضافات jQuery', nameEn: 'jQuery Plugins' },
      { nameAr: 'مكونات UI', nameEn: 'UI Components' }
    ];
    
    for (let i = 0; i < pluginTypes.length; i++) {
      await db.insert(productCategories).values({
        ...pluginTypes[i],
        parentId: pluginId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Plugins: ${pluginTypes.length} types`);
    
    // Subcategory 4: البرمجيات والتطبيقات الجاهزة - Ready Software & Apps
    const [softwareResult] = await db.insert(productCategories).values({
      nameAr: 'البرمجيات والتطبيقات الجاهزة',
      nameEn: 'Ready Software & Apps',
      parentId: programmingContent.id,
      icon: 'Smartphone',
      order: 4
    });
    const softwareId = softwareResult.insertId;
    totalSubcategories++;
    
    const softwareTypes = [
      { nameAr: 'تطبيقات موبايل جاهزة', nameEn: 'Ready Mobile Apps' },
      { nameAr: 'تطبيقات ويب جاهزة', nameEn: 'Ready Web Apps' },
      { nameAr: 'تطبيقات سطح مكتب', nameEn: 'Desktop Applications' },
      { nameAr: 'أنظمة إدارة محتوى', nameEn: 'CMS Systems' },
      { nameAr: 'أنظمة CRM', nameEn: 'CRM Systems' },
      { nameAr: 'أنظمة ERP', nameEn: 'ERP Systems' }
    ];
    
    for (let i = 0; i < softwareTypes.length; i++) {
      await db.insert(productCategories).values({
        ...softwareTypes[i],
        parentId: softwareId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Software: ${softwareTypes.length} types`);
  }
  
  // 7. المنتجات الرقمية المتخصصة - Specialized Digital Products
  const specializedProducts = mainCategories.find((c: any) => c.nameEn === 'Specialized Digital Products');
  if (specializedProducts) {
    console.log(`\n  Processing: ${specializedProducts.nameEn}`);
    
    // Subcategory 1: الأصول الرقمية NFTs - NFT Digital Assets
    const [nftResult] = await db.insert(productCategories).values({
      nameAr: 'الأصول الرقمية NFTs',
      nameEn: 'NFT Digital Assets',
      parentId: specializedProducts.id,
      icon: 'Coins',
      order: 1
    });
    const nftId = nftResult.insertId;
    totalSubcategories++;
    
    const nftTypes = [
      { nameAr: 'فنون رقمية NFT', nameEn: 'NFT Digital Art' },
      { nameAr: 'مقتنيات رقمية', nameEn: 'Digital Collectibles' },
      { nameAr: 'موسيقى NFT', nameEn: 'NFT Music' },
      { nameAr: 'أصول ألعاب', nameEn: 'Gaming Assets' }
    ];
    
    for (let i = 0; i < nftTypes.length; i++) {
      await db.insert(productCategories).values({
        ...nftTypes[i],
        parentId: nftId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ NFTs: ${nftTypes.length} types`);
    
    // Subcategory 2: المحتوى ثلاثي الأبعاد - 3D Content
    const [content3dResult] = await db.insert(productCategories).values({
      nameAr: 'المحتوى ثلاثي الأبعاد',
      nameEn: '3D Content',
      parentId: specializedProducts.id,
      icon: 'Box',
      order: 2
    });
    const content3dId = content3dResult.insertId;
    totalSubcategories++;
    
    const content3dTypes = [
      { nameAr: 'نماذج ثلاثية الأبعاد', nameEn: '3D Models' },
      { nameAr: 'مشاهد ثلاثية الأبعاد', nameEn: '3D Scenes' },
      { nameAr: 'شخصيات ثلاثية الأبعاد', nameEn: '3D Characters' },
      { nameAr: 'خامات ومواد ثلاثية الأبعاد', nameEn: '3D Materials & Textures' },
      { nameAr: 'رسوم متحركة ثلاثية الأبعاد', nameEn: '3D Animations' }
    ];
    
    for (let i = 0; i < content3dTypes.length; i++) {
      await db.insert(productCategories).values({
        ...content3dTypes[i],
        parentId: content3dId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ 3D Content: ${content3dTypes.length} types`);
    
    // Subcategory 3: محتوى الواقع الافتراضي والمعزز - VR & AR Content
    const [vrArResult] = await db.insert(productCategories).values({
      nameAr: 'المحتوى للواقع الافتراضي والمعزز',
      nameEn: 'VR & AR Content',
      parentId: specializedProducts.id,
      icon: 'Glasses',
      order: 3
    });
    const vrArId = vrArResult.insertId;
    totalSubcategories++;
    
    const vrArTypes = [
      { nameAr: 'تطبيقات الواقع الافتراضي', nameEn: 'VR Applications' },
      { nameAr: 'تطبيقات الواقع المعزز', nameEn: 'AR Applications' },
      { nameAr: 'بيئات VR', nameEn: 'VR Environments' },
      { nameAr: 'فلاتر AR', nameEn: 'AR Filters' }
    ];
    
    for (let i = 0; i < vrArTypes.length; i++) {
      await db.insert(productCategories).values({
        ...vrArTypes[i],
        parentId: vrArId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ VR/AR: ${vrArTypes.length} types`);
  }
  
  // 8. الخدمات الاشتراكية - Subscription Services
  const subscriptionServices = mainCategories.find((c: any) => c.nameEn === 'Subscription Services');
  if (subscriptionServices) {
    console.log(`\n  Processing: ${subscriptionServices.nameEn}`);
    
    // Subcategory 1: المحتوى الاشتراكي - Subscription Content
    const [subContentResult] = await db.insert(productCategories).values({
      nameAr: 'المحتوى الاشتراكي',
      nameEn: 'Subscription Content',
      parentId: subscriptionServices.id,
      icon: 'Repeat',
      order: 1
    });
    const subContentId = subContentResult.insertId;
    totalSubcategories++;
    
    const subContentTypes = [
      { nameAr: 'اشتراكات محتوى شهرية', nameEn: 'Monthly Content Subscriptions' },
      { nameAr: 'اشتراكات تحديثات', nameEn: 'Update Subscriptions' },
      { nameAr: 'اشتراكات دعم', nameEn: 'Support Subscriptions' }
    ];
    
    for (let i = 0; i < subContentTypes.length; i++) {
      await db.insert(productCategories).values({
        ...subContentTypes[i],
        parentId: subContentId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ Subscription Content: ${subContentTypes.length} types`);
    
    // Subcategory 2: منصات SaaS - SaaS Platforms
    const [saasResult] = await db.insert(productCategories).values({
      nameAr: 'منصات SaaS والخدمات السحابية',
      nameEn: 'SaaS Platforms & Cloud Services',
      parentId: subscriptionServices.id,
      icon: 'Cloud',
      order: 2
    });
    const saasId = saasResult.insertId;
    totalSubcategories++;
    
    const saasTypes = [
      { nameAr: 'أدوات إنتاجية', nameEn: 'Productivity Tools' },
      { nameAr: 'أدوات تسويق', nameEn: 'Marketing Tools' },
      { nameAr: 'أدوات تصميم', nameEn: 'Design Tools' },
      { nameAr: 'أدوات تطوير', nameEn: 'Development Tools' },
      { nameAr: 'أدوات تحليل', nameEn: 'Analytics Tools' },
      { nameAr: 'خدمات استضافة', nameEn: 'Hosting Services' }
    ];
    
    for (let i = 0; i < saasTypes.length; i++) {
      await db.insert(productCategories).values({
        ...saasTypes[i],
        parentId: saasId,
        order: i + 1
      });
      totalTypes++;
    }
    console.log(`    ✓ SaaS: ${saasTypes.length} types`);
  }
  
  console.log(`\n✅ Products Complete: ${totalSubcategories} subcategories, ${totalTypes} types`);
  return { subcategories: totalSubcategories, types: totalTypes };
}

async function seedAll() {
  console.log('🌱 Starting COMPLETE hierarchy seeding...\n');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);
  
  try {
    const productStats = await seedCompleteProductHierarchy(db);
    
    console.log('\n🎉 ========================================');
    console.log('🎉 COMPLETE HIERARCHY SEEDING DONE!');
    console.log('🎉 ========================================');
    console.log('📊 Final Summary:');
    console.log(`   └─ Products: ${productStats.subcategories} subcategories, ${productStats.types} types`);
    console.log('🌟 All categories seeded successfully!\n');
    
  } finally {
    await connection.end();
  }
}

// Run the seeder
seedAll()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

