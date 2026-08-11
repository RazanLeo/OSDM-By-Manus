import { useState } from 'react';
import { Link } from 'wouter';
import { Briefcase, Star, Clock, DollarSign, Home } from 'lucide-react';
import CategorySidebar from '../components/CategorySidebar';
import { useLanguage } from '../hooks/useLanguage';
import { trpc } from '../lib/trpc';

export default function JobsMarket() {
  const { isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Translations
  const t = {
    title: isRTL ? 'سوق فرص العمل الحر الرقمي عن بعد' : 'Remote Freelance Digital Work Opportunities Market',
    subtitle: isRTL ? 'فرص عمل حر تربط المستقلين بالشركات لتنفيذ المهام والأعمال والمشاريع بكافة أنواعها وأحجامها' : 'Freelance opportunities connecting freelancers with companies for all types and sizes of tasks and projects',
    noJobs: isRTL ? 'لا توجد فرص عمل في هذا التصنيف' : 'No job opportunities in this category',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    sar: isRTL ? 'ريال' : 'SAR',
    budget: isRTL ? 'الميزانية' : 'Budget',
    duration: isRTL ? 'المدة' : 'Duration',
    days: isRTL ? 'أيام' : 'days',
    home: isRTL ? 'الصفحة الرئيسية' : 'Home',
    proposals: isRTL ? 'عرض' : 'proposals',
  };

  // Load jobs using trpc
  const { data: jobs = [], isLoading } = trpc.jobs.list.useQuery(
    selectedCategory ? { categoryId: selectedCategory } : undefined
  );

  // Handle category selection
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#89A58F] to-[#846F9C] text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <Link href="/">
            <button className="mb-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
              <span>{t.home}</span>
            </button>
          </Link>
          <div className="flex items-center gap-4">
            <Briefcase className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold">{t.title}</h1>
              <p className="text-white/90 mt-1">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <CategorySidebar
              marketType="jobs"
              onCategorySelect={handleCategorySelect}
              primaryColor="#89A58F"
              secondaryColor="#846F9C"
            />
          </div>

          {/* Jobs Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">{t.loading}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">{t.noJobs}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {jobs.map((job: any) => (
                  <Link key={job.id} href={`/markets/jobs/${job.id}`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer">
                      <h3 className="font-bold text-xl mb-3">
                        {isRTL ? job.titleAr : job.titleEn}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {isRTL ? job.descriptionAr : job.descriptionEn}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-[#4691A9]">
                            {job.budget} {t.sar}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.duration} {t.days}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.bidsCount || 0} {t.proposals}</span>
                        </div>
                        {job.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{job.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

