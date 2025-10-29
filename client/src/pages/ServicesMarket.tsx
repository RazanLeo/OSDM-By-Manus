import { useState } from 'react';
import { Link } from 'wouter';
import { Briefcase, Star, Clock, DollarSign } from 'lucide-react';
import CategorySidebar from '../components/CategorySidebar';
import { useLanguage } from '../hooks/useLanguage';

export default function ServicesMarket() {
  const { isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const t = {
    title: isRTL ? 'سوق الخدمات الرقمية المتخصصة' : 'Specialized Digital Services Market',
    subtitle: isRTL ? 'خدمات رقمية متخصصة حسب احتياجك' : 'Specialized digital services tailored to your needs',
    noServices: isRTL ? 'لا توجد خدمات في هذا التصنيف' : 'No services in this category',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    sar: isRTL ? 'ريال' : 'SAR',
    startingAt: isRTL ? 'يبدأ من' : 'Starting at',
    deliveryTime: isRTL ? 'وقت التسليم' : 'Delivery',
    days: isRTL ? 'أيام' : 'days',
  };

  const handleCategorySelect = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    
    try {
      const endpoint = categoryId 
        ? `/api/trpc/services.list?input=${encodeURIComponent(JSON.stringify({ categoryId }))}`
        : '/api/trpc/services.list';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      setServices(data.result?.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-[#4691A9] to-[#89A58F] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase size={40} />
            <h1 className="text-4xl font-bold">{t.title}</h1>
          </div>
          <p className="text-xl text-white/90">{t.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:sticky md:top-4 md:self-start">
            <CategorySidebar
              marketType="services"
              onCategorySelect={handleCategorySelect}
              selectedCategoryId={selectedCategory}
            />
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: any) => (
                  <Link key={service.id} href={`/service/${service.id}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {isRTL ? service.titleAr : service.titleEn}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {isRTL ? service.descriptionAr : service.descriptionEn}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        {service.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold">{service.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <span className="text-sm text-gray-500">({service.reviewsCount})</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{service.deliveryTime} {t.days}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">{t.startingAt}</div>
                          <div className="text-xl font-bold text-[#4691A9]">
                            {service.basePrice} {t.sar}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Briefcase size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-xl text-gray-500 dark:text-gray-400">{t.noServices}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

