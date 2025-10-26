import { getDb } from './server/db';
import { jobs } from './drizzle/schema';

async function seedJobs() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    return;
  }

  console.log('Seeding jobs...');

  const jobData = [
    {
      employerId: 1,
      categoryId: 1,
      titleAr: 'مطلوب مطور ويب لبناء منصة تعليمية متكاملة',
      titleEn: 'Web Developer Needed for Complete Educational Platform',
      descriptionAr: 'نحتاج مطور ويب محترف لبناء منصة تعليمية كاملة تشمل: نظام الدورات، الفيديوهات، الاختبارات، الشهادات، ونظام الدفع. المنصة يجب أن تكون متجاوبة وسريعة.',
      descriptionEn: 'We need a professional web developer to build a complete educational platform including: course system, videos, quizzes, certificates, and payment system. Platform must be responsive and fast.',
      budget: 15000,
      currency: 'SAR',
      duration: 90,
      skillsRequired: 'React, Node.js, MongoDB, AWS, Payment Integration',
      status: 'open',
      bidsCount: 8,
      views: 156,
      createdAt: new Date()
    },
    {
      employerId: 1,
      categoryId: 2,
      titleAr: 'مصمم جرافيك لتصميم هوية تجارية كاملة لشركة ناشئة',
      titleEn: 'Graphic Designer for Complete Brand Identity for Startup',
      descriptionAr: 'نبحث عن مصمم جرافيك محترف لتصميم هوية تجارية كاملة لشركة ناشئة في مجال التقنية. يشمل: الشعار، الألوان، الخطوط، بطاقات العمل، الأوراق الرسمية، ودليل الهوية.',
      descriptionEn: 'Looking for professional graphic designer for complete brand identity for tech startup. Includes: logo, colors, fonts, business cards, letterheads, and brand guide.',
      budget: 3000,
      currency: 'SAR',
      duration: 30,
      skillsRequired: 'Adobe Illustrator, Photoshop, Brand Design, Creative Thinking',
      status: 'open',
      bidsCount: 15,
      views: 234,
      createdAt: new Date()
    },
    {
      employerId: 1,
      categoryId: 3,
      titleAr: 'كاتب محتوى متخصص في التقنية لمدونة تقنية',
      titleEn: 'Tech Content Writer for Technology Blog',
      descriptionAr: 'نحتاج كاتب محتوى محترف متخصص في التقنية للكتابة في مدونة تقنية. المطلوب: 20 مقال شهرياً، كل مقال 1000 كلمة، محسّن لمحركات البحث SEO.',
      descriptionEn: 'We need professional tech content writer for technology blog. Required: 20 articles/month, 1000 words each, SEO-optimized.',
      budget: 2000,
      currency: 'SAR',
      duration: 60,
      skillsRequired: 'Arabic Writing, SEO, Technology Knowledge, Research Skills',
      status: 'open',
      bidsCount: 23,
      views: 189,
      createdAt: new Date()
    },
    {
      employerId: 1,
      categoryId: 4,
      titleAr: 'مطور تطبيقات جوال لبناء تطبيق توصيل طعام',
      titleEn: 'Mobile Developer for Food Delivery App',
      descriptionAr: 'مطلوب مطور تطبيقات جوال محترف لبناء تطبيق توصيل طعام كامل لنظامي iOS و Android. يشمل: تطبيق العميل، تطبيق المطعم، تطبيق السائق، ولوحة تحكم إدارية.',
      descriptionEn: 'Professional mobile developer needed for complete food delivery app for iOS and Android. Includes: customer app, restaurant app, driver app, and admin dashboard.',
      budget: 25000,
      currency: 'SAR',
      duration: 120,
      skillsRequired: 'React Native, Flutter, Firebase, Google Maps API, Payment Integration',
      status: 'open',
      bidsCount: 12,
      views: 278,
      createdAt: new Date()
    },
    {
      employerId: 1,
      categoryId: 5,
      titleAr: 'مسوق رقمي لإدارة حملات إعلانية على جوجل وفيسبوك',
      titleEn: 'Digital Marketer for Google & Facebook Ad Campaigns',
      descriptionAr: 'نبحث عن مسوق رقمي محترف لإدارة حملات إعلانية على جوجل وفيسبوك لمتجر إلكتروني. المطلوب: إعداد الحملات، المتابعة اليومية، التحسين المستمر، وتقارير أسبوعية.',
      descriptionEn: 'Looking for professional digital marketer to manage Google and Facebook ad campaigns for e-commerce store. Required: campaign setup, daily monitoring, continuous optimization, and weekly reports.',
      budget: 5000,
      currency: 'SAR',
      duration: 90,
      skillsRequired: 'Google Ads, Facebook Ads, Analytics, ROI Optimization, Reporting',
      status: 'open',
      bidsCount: 19,
      views: 312,
      createdAt: new Date()
    }
  ];

  for (const job of jobData) {
    try {
      await db.insert(jobs).values(job);
      console.log(`✓ Added: ${job.titleEn}`);
    } catch (error) {
      console.error(`✗ Failed to add ${job.titleEn}:`, error);
    }
  }

  console.log(`\nSeeded ${jobData.length} jobs successfully!`);
}

seedJobs().catch(console.error).finally(() => process.exit(0));
