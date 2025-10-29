import { useState } from 'react';
import { Link } from 'wouter';
import { Laptop, MapPin, DollarSign, Clock } from 'lucide-react';
import CategorySidebar from '../components/CategorySidebar';
import { useLanguage } from '../hooks/useLanguage';

export default function JobsMarket() {
  const { isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const t = {
    title: isRTL ? 'سوق فرص العمل الحر الرقمي عن بعد' : 'Remote Freelance Digital Work Opportunities Market',
    subtitle: isRTL ? 'فرص عمل حر تربط المستقلين بالشركات لتنفيذ المهام والأعمال والمشاريع بكافة أنواعها وأحجامها' : 'Freelance opportunities connecting freelancers with companies for all types and sizes of tasks and projects',
    noJobs: isRTL ? 'لا توجد وظائف في هذا التصنيف' : 'No jobs in this category',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    sar: isRTL ? 'ريال' : 'SAR',
    budget: isRTL ? 'الميزانية' : 'Budget',
    duration: isRTL ? 'المدة' : 'Duration',
    days: isRTL ? 'أيام' : 'days',
    proposals: isRTL ? 'عرض' : 'proposals',
    remote: isRTL ? 'عن بعد' : 'Remote',
  };

  const handleCategorySelect = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    
    try {
      const endpoint = categoryId 
        ? `/api/trpc/jobs.list?input=${encodeURIComponent(JSON.stringify({ categoryId }))}`
        : '/api/trpc/jobs.list';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      setJobs(data.result?.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-[#89A58F] to-[#846F9C] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Laptop size={40} />
            <h1 className="text-4xl font-bold">{t.title}</h1>
          </div>
          <p className="text-xl text-white/90">{t.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:sticky md:top-4 md:self-start">
            <CategorySidebar
              marketType="jobs"
              onCategorySelect={handleCategorySelect}
              selectedCategoryId={selectedCategory}
            />
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                    <div className="flex gap-4">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job: any) => (
                  <Link key={job.id} href={`/job/${job.id}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">
                            {isRTL ? job.titleAr : job.titleEn}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                            {isRTL ? job.descriptionAr : job.descriptionEn}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign size={16} className="text-gray-500" />
                          <span className="font-semibold">{job.budget} {t.sar}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={16} />
                          <span>{job.duration} {t.days}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={16} />
                          <span>{t.remote}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-500">
                          {job.proposalsCount} {t.proposals}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Laptop size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-xl text-gray-500 dark:text-gray-400">{t.noJobs}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

