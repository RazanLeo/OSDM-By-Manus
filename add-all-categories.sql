-- إضافة كل التصنيفات من البرومبت بشكل منظم
-- أساسي → فرعي → أنواع

-- ========================================
-- 1. المحتوى النصي والمكتوب
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('المحتوى النصي والمكتوب', 'Text and Written Content', NULL, 1);

-- 1.1 الكتب الإلكترونية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الكتب الإلكترونية', 'E-Books', id, 1
FROM product_categories WHERE nameEn = 'Text and Written Content';

-- أنواع الكتب الإلكترونية (28 نوع)
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'كتب علمية وأكاديمية', 'Academic & Scientific Books', id, 1 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'كتب أطفال والناشئين', 'Children & Young Adult Books', id, 2 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'كتب تطوير وتنمية الذات', 'Self-Development Books', id, 3 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'السير الذاتية والمذكرات', 'Biographies & Memoirs', id, 4 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'كتب التاريخ', 'History Books', id, 5 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'كتب الجغرافيا', 'Geography Books', id, 6 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'العلوم والعلوم الطبيعية', 'Science & Natural Sciences', id, 7 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'العلوم الاجتماعية', 'Social Sciences', id, 8 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'أعمال واقتصاد', 'Business & Economics', id, 9 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'دين وفلسفة', 'Religion & Philosophy', id, 10 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الفنون والحرف', 'Arts & Crafts', id, 11 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الموضة والتجميل والعطور', 'Fashion, Beauty & Perfume', id, 12 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الطبخ والطعام', 'Cooking & Food', id, 13 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الطب والصحة', 'Medicine & Health', id, 14 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'التقنية والحاسوب', 'Technology & Computing', id, 15 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'السفر والسياحة', 'Travel & Tourism', id, 16 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'التعليم والكتب المدرسية', 'Education & Textbooks', id, 17 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الرياضة', 'Sports', id, 18 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'القانون', 'Law', id, 19 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'البيئة والطبيعة', 'Environment & Nature', id, 20 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'المراجع', 'References', id, 21 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الروايات والخيال', 'Novels & Fiction', id, 22 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الأدب الكلاسيكي', 'Classic Literature', id, 23 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'القصص القصيرة', 'Short Stories', id, 24 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الروايات المصورة', 'Graphic Novels', id, 25 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'المسرحيات', 'Plays', id, 26 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الشعر', 'Poetry', id, 27 FROM product_categories WHERE nameEn = 'E-Books'
UNION ALL SELECT 'الأساطير والخرافات', 'Myths & Legends', id, 28 FROM product_categories WHERE nameEn = 'E-Books';

-- 1.2 البحوث والدراسات والتقارير
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'البحوث والدراسات والتقارير', 'Research & Reports', id, 2
FROM product_categories WHERE nameEn = 'Text and Written Content';

-- أنواع البحوث والدراسات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'بحوث علمية', 'Scientific Research', id, 1 FROM product_categories WHERE nameEn = 'Research & Reports'
UNION ALL SELECT 'دراسات أكاديمية', 'Academic Studies', id, 2 FROM product_categories WHERE nameEn = 'Research & Reports'
UNION ALL SELECT 'تقارير سوقية', 'Market Reports', id, 3 FROM product_categories WHERE nameEn = 'Research & Reports'
UNION ALL SELECT 'تحليلات اقتصادية', 'Economic Analysis', id, 4 FROM product_categories WHERE nameEn = 'Research & Reports'
UNION ALL SELECT 'دراسات جدوى', 'Feasibility Studies', id, 5 FROM product_categories WHERE nameEn = 'Research & Reports'
UNION ALL SELECT 'تقارير صناعية', 'Industry Reports', id, 6 FROM product_categories WHERE nameEn = 'Research & Reports';

-- 1.3 القوالب والنماذج النصية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'القوالب والنماذج النصية', 'Text Templates', id, 3
FROM product_categories WHERE nameEn = 'Text and Written Content';

-- أنواع القوالب النصية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب العقود', 'Contract Templates', id, 1 FROM product_categories WHERE nameEn = 'Text Templates'
UNION ALL SELECT 'قوالب السير الذاتية', 'Resume Templates', id, 2 FROM product_categories WHERE nameEn = 'Text Templates'
UNION ALL SELECT 'قوالب الرسائل', 'Letter Templates', id, 3 FROM product_categories WHERE nameEn = 'Text Templates'
UNION ALL SELECT 'قوالب التقارير', 'Report Templates', id, 4 FROM product_categories WHERE nameEn = 'Text Templates'
UNION ALL SELECT 'قوالب خطط العمل', 'Business Plan Templates', id, 5 FROM product_categories WHERE nameEn = 'Text Templates'
UNION ALL SELECT 'قوالب المقترحات', 'Proposal Templates', id, 6 FROM product_categories WHERE nameEn = 'Text Templates';

-- 1.4 المحتوى التعليمي المكتوب
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'المحتوى التعليمي المكتوب', 'Educational Content', id, 4
FROM product_categories WHERE nameEn = 'Text and Written Content';

-- أنواع المحتوى التعليمي
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'مذكرات دراسية', 'Study Notes', id, 1 FROM product_categories WHERE nameEn = 'Educational Content'
UNION ALL SELECT 'ملخصات تعليمية', 'Educational Summaries', id, 2 FROM product_categories WHERE nameEn = 'Educational Content'
UNION ALL SELECT 'أوراق عمل', 'Worksheets', id, 3 FROM product_categories WHERE nameEn = 'Educational Content'
UNION ALL SELECT 'اختبارات وتمارين', 'Tests & Exercises', id, 4 FROM product_categories WHERE nameEn = 'Educational Content'
UNION ALL SELECT 'أدلة دراسية', 'Study Guides', id, 5 FROM product_categories WHERE nameEn = 'Educational Content';

-- ========================================
-- 2. المحتوى المرئي البصري
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('المحتوى المرئي البصري', 'Visual Content', NULL, 2);

-- 2.1 قوالب التصميم الجرافيكي
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب التصميم الجرافيكي', 'Graphic Design Templates', id, 1
FROM product_categories WHERE nameEn = 'Visual Content';

-- أنواع قوالب التصميم
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب الشعارات', 'Logo Templates', id, 1 FROM product_categories WHERE nameEn = 'Graphic Design Templates'
UNION ALL SELECT 'قوالب الهوية البصرية', 'Brand Identity Templates', id, 2 FROM product_categories WHERE nameEn = 'Graphic Design Templates'
UNION ALL SELECT 'قوالب البوسترات', 'Poster Templates', id, 3 FROM product_categories WHERE nameEn = 'Graphic Design Templates'
UNION ALL SELECT 'قوالب البروشورات', 'Brochure Templates', id, 4 FROM product_categories WHERE nameEn = 'Graphic Design Templates'
UNION ALL SELECT 'قوالب الفلاير', 'Flyer Templates', id, 5 FROM product_categories WHERE nameEn = 'Graphic Design Templates'
UNION ALL SELECT 'قوالب بطاقات العمل', 'Business Card Templates', id, 6 FROM product_categories WHERE nameEn = 'Graphic Design Templates'
UNION ALL SELECT 'قوالب السوشيال ميديا', 'Social Media Templates', id, 7 FROM product_categories WHERE nameEn = 'Graphic Design Templates'
UNION ALL SELECT 'قوالب الإنفوجرافيك', 'Infographic Templates', id, 8 FROM product_categories WHERE nameEn = 'Graphic Design Templates';

-- 2.2 الصور والرسومات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الصور والرسومات', 'Images & Graphics', id, 2
FROM product_categories WHERE nameEn = 'Visual Content';

-- أنواع الصور والرسومات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'صور فوتوغرافية', 'Stock Photos', id, 1 FROM product_categories WHERE nameEn = 'Images & Graphics'
UNION ALL SELECT 'رسومات فيكتور', 'Vector Graphics', id, 2 FROM product_categories WHERE nameEn = 'Images & Graphics'
UNION ALL SELECT 'أيقونات', 'Icons', id, 3 FROM product_categories WHERE nameEn = 'Images & Graphics'
UNION ALL SELECT 'رسوم توضيحية', 'Illustrations', id, 4 FROM product_categories WHERE nameEn = 'Images & Graphics'
UNION ALL SELECT 'خلفيات', 'Backgrounds', id, 5 FROM product_categories WHERE nameEn = 'Images & Graphics'
UNION ALL SELECT 'أنماط وتكسترات', 'Patterns & Textures', id, 6 FROM product_categories WHERE nameEn = 'Images & Graphics';

-- 2.3 تصاميم الطباعة
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'تصاميم الطباعة', 'Print Designs', id, 3
FROM product_categories WHERE nameEn = 'Visual Content';

-- أنواع تصاميم الطباعة
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'تصاميم التيشيرتات', 'T-Shirt Designs', id, 1 FROM product_categories WHERE nameEn = 'Print Designs'
UNION ALL SELECT 'تصاميم الأكواب', 'Mug Designs', id, 2 FROM product_categories WHERE nameEn = 'Print Designs'
UNION ALL SELECT 'تصاميم الملصقات', 'Sticker Designs', id, 3 FROM product_categories WHERE nameEn = 'Print Designs'
UNION ALL SELECT 'تصاميم الدفاتر', 'Notebook Designs', id, 4 FROM product_categories WHERE nameEn = 'Print Designs'
UNION ALL SELECT 'تصاميم التقويمات', 'Calendar Designs', id, 5 FROM product_categories WHERE nameEn = 'Print Designs';

-- 2.4 قوالب الأعمال والإنتاجية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب الأعمال والإنتاجية', 'Business & Productivity Templates', id, 4
FROM product_categories WHERE nameEn = 'Visual Content';

-- أنواع قوالب الأعمال
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب العروض التقديمية', 'Presentation Templates', id, 1 FROM product_categories WHERE nameEn = 'Business & Productivity Templates'
UNION ALL SELECT 'قوالب الجداول', 'Spreadsheet Templates', id, 2 FROM product_categories WHERE nameEn = 'Business & Productivity Templates'
UNION ALL SELECT 'قوالب المخططات', 'Chart Templates', id, 3 FROM product_categories WHERE nameEn = 'Business & Productivity Templates'
UNION ALL SELECT 'قوالب الجداول الزمنية', 'Timeline Templates', id, 4 FROM product_categories WHERE nameEn = 'Business & Productivity Templates'
UNION ALL SELECT 'قوالب المنظمات', 'Planner Templates', id, 5 FROM product_categories WHERE nameEn = 'Business & Productivity Templates';

-- 2.5 موارد التصميم
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'موارد التصميم', 'Design Resources', id, 5
FROM product_categories WHERE nameEn = 'Visual Content';

-- أنواع موارد التصميم
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'خطوط', 'Fonts', id, 1 FROM product_categories WHERE nameEn = 'Design Resources'
UNION ALL SELECT 'فرش فوتوشوب', 'Photoshop Brushes', id, 2 FROM product_categories WHERE nameEn = 'Design Resources'
UNION ALL SELECT 'إجراءات فوتوشوب', 'Photoshop Actions', id, 3 FROM product_categories WHERE nameEn = 'Design Resources'
UNION ALL SELECT 'ملفات PSD', 'PSD Files', id, 4 FROM product_categories WHERE nameEn = 'Design Resources'
UNION ALL SELECT 'ملفات AI', 'AI Files', id, 5 FROM product_categories WHERE nameEn = 'Design Resources'
UNION ALL SELECT 'موكاب', 'Mockups', id, 6 FROM product_categories WHERE nameEn = 'Design Resources';

-- ========================================
-- 3. المحتوى السمعي الصوتي
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('المحتوى السمعي الصوتي', 'Audio Content', NULL, 3);

-- 3.1 الموسيقى والمؤثرات الصوتية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الموسيقى والمؤثرات الصوتية', 'Music & Sound Effects', id, 1
FROM product_categories WHERE nameEn = 'Audio Content';

-- أنواع الموسيقى والمؤثرات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'موسيقى خلفية', 'Background Music', id, 1 FROM product_categories WHERE nameEn = 'Music & Sound Effects'
UNION ALL SELECT 'مؤثرات صوتية', 'Sound Effects', id, 2 FROM product_categories WHERE nameEn = 'Music & Sound Effects'
UNION ALL SELECT 'موسيقى بدون حقوق', 'Royalty-Free Music', id, 3 FROM product_categories WHERE nameEn = 'Music & Sound Effects'
UNION ALL SELECT 'لوبات موسيقية', 'Music Loops', id, 4 FROM product_categories WHERE nameEn = 'Music & Sound Effects'
UNION ALL SELECT 'موسيقى سينمائية', 'Cinematic Music', id, 5 FROM product_categories WHERE nameEn = 'Music & Sound Effects';

-- 3.2 المحتوى الصوتي التعليمي والترفيهي
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'المحتوى الصوتي التعليمي والترفيهي', 'Educational & Entertainment Audio', id, 2
FROM product_categories WHERE nameEn = 'Audio Content';

-- أنواع المحتوى الصوتي
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'كتب صوتية', 'Audiobooks', id, 1 FROM product_categories WHERE nameEn = 'Educational & Entertainment Audio'
UNION ALL SELECT 'بودكاست', 'Podcasts', id, 2 FROM product_categories WHERE nameEn = 'Educational & Entertainment Audio'
UNION ALL SELECT 'محاضرات صوتية', 'Audio Lectures', id, 3 FROM product_categories WHERE nameEn = 'Educational & Entertainment Audio'
UNION ALL SELECT 'تأملات موجهة', 'Guided Meditations', id, 4 FROM product_categories WHERE nameEn = 'Educational & Entertainment Audio'
UNION ALL SELECT 'قصص صوتية', 'Audio Stories', id, 5 FROM product_categories WHERE nameEn = 'Educational & Entertainment Audio';

-- ========================================
-- 4. المحتوى المرئي المتحرك والفيديو
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('المحتوى المرئي المتحرك والفيديو', 'Video Content', NULL, 4);

-- 4.1 لقطات ومقاطع الفيديو
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'لقطات ومقاطع الفيديو', 'Stock Videos', id, 1
FROM product_categories WHERE nameEn = 'Video Content';

-- أنواع مقاطع الفيديو
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'فيديو خلفيات', 'Background Videos', id, 1 FROM product_categories WHERE nameEn = 'Stock Videos'
UNION ALL SELECT 'فيديو طبيعة', 'Nature Videos', id, 2 FROM product_categories WHERE nameEn = 'Stock Videos'
UNION ALL SELECT 'فيديو أعمال', 'Business Videos', id, 3 FROM product_categories WHERE nameEn = 'Stock Videos'
UNION ALL SELECT 'فيديو تقنية', 'Technology Videos', id, 4 FROM product_categories WHERE nameEn = 'Stock Videos'
UNION ALL SELECT 'فيديو بطيء', 'Slow Motion Videos', id, 5 FROM product_categories WHERE nameEn = 'Stock Videos';

-- 4.2 قوالب الفيديو والموشن جرافيك
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب الفيديو والموشن جرافيك', 'Video & Motion Graphics Templates', id, 2
FROM product_categories WHERE nameEn = 'Video Content';

-- أنواع قوالب الفيديو
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب After Effects', 'After Effects Templates', id, 1 FROM product_categories WHERE nameEn = 'Video & Motion Graphics Templates'
UNION ALL SELECT 'قوالب Premiere Pro', 'Premiere Pro Templates', id, 2 FROM product_categories WHERE nameEn = 'Video & Motion Graphics Templates'
UNION ALL SELECT 'قوالب الإنترو', 'Intro Templates', id, 3 FROM product_categories WHERE nameEn = 'Video & Motion Graphics Templates'
UNION ALL SELECT 'قوالب الأوترو', 'Outro Templates', id, 4 FROM product_categories WHERE nameEn = 'Video & Motion Graphics Templates'
UNION ALL SELECT 'قوالب الشعارات المتحركة', 'Logo Animation Templates', id, 5 FROM product_categories WHERE nameEn = 'Video & Motion Graphics Templates'
UNION ALL SELECT 'قوالب النصوص المتحركة', 'Text Animation Templates', id, 6 FROM product_categories WHERE nameEn = 'Video & Motion Graphics Templates';

-- 4.3 المحتوى التعليمي المرئي
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'المحتوى التعليمي المرئي', 'Educational Videos', id, 3
FROM product_categories WHERE nameEn = 'Video Content';

-- أنواع المحتوى التعليمي المرئي
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'دورات فيديو', 'Video Courses', id, 1 FROM product_categories WHERE nameEn = 'Educational Videos'
UNION ALL SELECT 'شروحات فيديو', 'Video Tutorials', id, 2 FROM product_categories WHERE nameEn = 'Educational Videos'
UNION ALL SELECT 'ورش عمل مسجلة', 'Recorded Workshops', id, 3 FROM product_categories WHERE nameEn = 'Educational Videos'
UNION ALL SELECT 'محاضرات مسجلة', 'Recorded Lectures', id, 4 FROM product_categories WHERE nameEn = 'Educational Videos';

-- ========================================
-- 5. المحتوى التفاعلي والرقمي
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('المحتوى التفاعلي والرقمي', 'Interactive Digital Content', NULL, 5);

-- 5.1 الألعاب والتطبيقات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الألعاب والتطبيقات', 'Games & Apps', id, 1
FROM product_categories WHERE nameEn = 'Interactive Digital Content';

-- أنواع الألعاب والتطبيقات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'ألعاب موبايل', 'Mobile Games', id, 1 FROM product_categories WHERE nameEn = 'Games & Apps'
UNION ALL SELECT 'ألعاب ويب', 'Web Games', id, 2 FROM product_categories WHERE nameEn = 'Games & Apps'
UNION ALL SELECT 'تطبيقات تعليمية', 'Educational Apps', id, 3 FROM product_categories WHERE nameEn = 'Games & Apps'
UNION ALL SELECT 'تطبيقات إنتاجية', 'Productivity Apps', id, 4 FROM product_categories WHERE nameEn = 'Games & Apps';

-- 5.2 الكتب التفاعلية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الكتب التفاعلية', 'Interactive Books', id, 2
FROM product_categories WHERE nameEn = 'Interactive Digital Content';

-- 5.3 الدورات التفاعلية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الدورات التفاعلية', 'Interactive Courses', id, 3
FROM product_categories WHERE nameEn = 'Interactive Digital Content';

-- 5.4 الاختبارات والتقييمات التفاعلية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الاختبارات والتقييمات التفاعلية', 'Interactive Tests & Assessments', id, 4
FROM product_categories WHERE nameEn = 'Interactive Digital Content';

-- ========================================
-- 6. الأدوات والبرمجيات
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('الأدوات والبرمجيات', 'Tools & Software', NULL, 6);

-- 6.1 الإضافات والمكونات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الإضافات والمكونات', 'Plugins & Extensions', id, 1
FROM product_categories WHERE nameEn = 'Tools & Software';

-- أنواع الإضافات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'إضافات WordPress', 'WordPress Plugins', id, 1 FROM product_categories WHERE nameEn = 'Plugins & Extensions'
UNION ALL SELECT 'إضافات Shopify', 'Shopify Apps', id, 2 FROM product_categories WHERE nameEn = 'Plugins & Extensions'
UNION ALL SELECT 'إضافات Chrome', 'Chrome Extensions', id, 3 FROM product_categories WHERE nameEn = 'Plugins & Extensions'
UNION ALL SELECT 'إضافات Figma', 'Figma Plugins', id, 4 FROM product_categories WHERE nameEn = 'Plugins & Extensions';

-- 6.2 السكريبتات والأكواد
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'السكريبتات والأكواد', 'Scripts & Code', id, 2
FROM product_categories WHERE nameEn = 'Tools & Software';

-- أنواع السكريبتات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'سكريبتات PHP', 'PHP Scripts', id, 1 FROM product_categories WHERE nameEn = 'Scripts & Code'
UNION ALL SELECT 'سكريبتات JavaScript', 'JavaScript Scripts', id, 2 FROM product_categories WHERE nameEn = 'Scripts & Code'
UNION ALL SELECT 'سكريبتات Python', 'Python Scripts', id, 3 FROM product_categories WHERE nameEn = 'Scripts & Code'
UNION ALL SELECT 'مكتبات برمجية', 'Code Libraries', id, 4 FROM product_categories WHERE nameEn = 'Scripts & Code';

-- 6.3 البرمجيات والتطبيقات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'البرمجيات والتطبيقات', 'Software & Applications', id, 3
FROM product_categories WHERE nameEn = 'Tools & Software';

-- أنواع البرمجيات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'برامج سطح المكتب', 'Desktop Software', id, 1 FROM product_categories WHERE nameEn = 'Software & Applications'
UNION ALL SELECT 'تطبيقات SaaS', 'SaaS Applications', id, 2 FROM product_categories WHERE nameEn = 'Software & Applications'
UNION ALL SELECT 'أدوات أتمتة', 'Automation Tools', id, 3 FROM product_categories WHERE nameEn = 'Software & Applications'
UNION ALL SELECT 'أدوات تحليل', 'Analytics Tools', id, 4 FROM product_categories WHERE nameEn = 'Software & Applications';

-- 6.4 الأنظمة الكاملة
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الأنظمة الكاملة', 'Complete Systems', id, 4
FROM product_categories WHERE nameEn = 'Tools & Software';

-- أنواع الأنظمة
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'أنظمة إدارة المحتوى', 'CMS Systems', id, 1 FROM product_categories WHERE nameEn = 'Complete Systems'
UNION ALL SELECT 'أنظمة التجارة الإلكترونية', 'E-commerce Systems', id, 2 FROM product_categories WHERE nameEn = 'Complete Systems'
UNION ALL SELECT 'أنظمة إدارة المشاريع', 'Project Management Systems', id, 3 FROM product_categories WHERE nameEn = 'Complete Systems'
UNION ALL SELECT 'أنظمة CRM', 'CRM Systems', id, 4 FROM product_categories WHERE nameEn = 'Complete Systems';

-- ========================================
-- 7. الدورات والبرامج التدريبية
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('الدورات والبرامج التدريبية', 'Courses & Training Programs', NULL, 7);

-- 7.1 دورات البرمجة والتطوير
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'دورات البرمجة والتطوير', 'Programming & Development Courses', id, 1
FROM product_categories WHERE nameEn = 'Courses & Training Programs';

-- 7.2 دورات التصميم والإبداع
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'دورات التصميم والإبداع', 'Design & Creative Courses', id, 2
FROM product_categories WHERE nameEn = 'Courses & Training Programs';

-- 7.3 دورات الأعمال والتسويق
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'دورات الأعمال والتسويق', 'Business & Marketing Courses', id, 3
FROM product_categories WHERE nameEn = 'Courses & Training Programs';

-- 7.4 دورات التطوير الشخصي
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'دورات التطوير الشخصي', 'Personal Development Courses', id, 4
FROM product_categories WHERE nameEn = 'Courses & Training Programs';

-- 7.5 دورات اللغات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'دورات اللغات', 'Language Courses', id, 5
FROM product_categories WHERE nameEn = 'Courses & Training Programs';

-- ========================================
-- 8. الخدمات الرقمية
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('الخدمات الرقمية', 'Digital Services', NULL, 8);

-- 8.1 خدمات الاستشارات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'خدمات الاستشارات', 'Consulting Services', id, 1
FROM product_categories WHERE nameEn = 'Digital Services';

-- 8.2 خدمات التدريب الشخصي
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'خدمات التدريب الشخصي', 'Personal Coaching Services', id, 2
FROM product_categories WHERE nameEn = 'Digital Services';

-- 8.3 خدمات المراجعة والتقييم
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'خدمات المراجعة والتقييم', 'Review & Assessment Services', id, 3
FROM product_categories WHERE nameEn = 'Digital Services';

-- ========================================
-- 9. القوالب الجاهزة
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('القوالب الجاهزة', 'Ready-Made Templates', NULL, 9);

-- 9.1 قوالب المواقع
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب المواقع', 'Website Templates', id, 1
FROM product_categories WHERE nameEn = 'Ready-Made Templates';

-- أنواع قوالب المواقع
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب HTML', 'HTML Templates', id, 1 FROM product_categories WHERE nameEn = 'Website Templates'
UNION ALL SELECT 'قوالب WordPress', 'WordPress Themes', id, 2 FROM product_categories WHERE nameEn = 'Website Templates'
UNION ALL SELECT 'قوالب Shopify', 'Shopify Themes', id, 3 FROM product_categories WHERE nameEn = 'Website Templates'
UNION ALL SELECT 'قوالب Wix', 'Wix Templates', id, 4 FROM product_categories WHERE nameEn = 'Website Templates'
UNION ALL SELECT 'قوالب Webflow', 'Webflow Templates', id, 5 FROM product_categories WHERE nameEn = 'Website Templates';

-- 9.2 قوالب التطبيقات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب التطبيقات', 'App Templates', id, 2
FROM product_categories WHERE nameEn = 'Ready-Made Templates';

-- أنواع قوالب التطبيقات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب React Native', 'React Native Templates', id, 1 FROM product_categories WHERE nameEn = 'App Templates'
UNION ALL SELECT 'قوالب Flutter', 'Flutter Templates', id, 2 FROM product_categories WHERE nameEn = 'App Templates'
UNION ALL SELECT 'قوالب iOS', 'iOS Templates', id, 3 FROM product_categories WHERE nameEn = 'App Templates'
UNION ALL SELECT 'قوالب Android', 'Android Templates', id, 4 FROM product_categories WHERE nameEn = 'App Templates';

-- 9.3 قوالب البريد الإلكتروني
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'قوالب البريد الإلكتروني', 'Email Templates', id, 3
FROM product_categories WHERE nameEn = 'Ready-Made Templates';

-- ========================================
-- 10. الموارد التعليمية
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('الموارد التعليمية', 'Educational Resources', NULL, 10);

-- 10.1 خطط الدروس
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'خطط الدروس', 'Lesson Plans', id, 1
FROM product_categories WHERE nameEn = 'Educational Resources';

-- 10.2 المناهج التعليمية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'المناهج التعليمية', 'Educational Curricula', id, 2
FROM product_categories WHERE nameEn = 'Educational Resources';

-- 10.3 الأنشطة التعليمية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'الأنشطة التعليمية', 'Educational Activities', id, 3
FROM product_categories WHERE nameEn = 'Educational Resources';

-- ========================================
-- 11. الاشتراكات والعضويات
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('الاشتراكات والعضويات', 'Subscriptions & Memberships', NULL, 11);

-- 11.1 اشتراكات شهرية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'اشتراكات شهرية', 'Monthly Subscriptions', id, 1
FROM product_categories WHERE nameEn = 'Subscriptions & Memberships';

-- 11.2 اشتراكات سنوية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'اشتراكات سنوية', 'Annual Subscriptions', id, 2
FROM product_categories WHERE nameEn = 'Subscriptions & Memberships';

-- 11.3 عضويات حصرية
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'عضويات حصرية', 'Exclusive Memberships', id, 3
FROM product_categories WHERE nameEn = 'Subscriptions & Memberships';

-- ========================================
-- 12. الحزم والباقات
-- ========================================
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
VALUES ('الحزم والباقات', 'Bundles & Packages', NULL, 12);

-- 12.1 حزم المنتجات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'حزم المنتجات', 'Product Bundles', id, 1
FROM product_categories WHERE nameEn = 'Bundles & Packages';

-- 12.2 حزم الدورات
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'حزم الدورات', 'Course Bundles', id, 2
FROM product_categories WHERE nameEn = 'Bundles & Packages';

-- 12.3 حزم الموارد
INSERT INTO product_categories (nameAr, nameEn, parentId, `order`) 
SELECT 'حزم الموارد', 'Resource Bundles', id, 3
FROM product_categories WHERE nameEn = 'Bundles & Packages';

-- عرض الإجمالي
SELECT COUNT(*) as total_categories FROM product_categories;

