import { useState } from 'react';
import { Link } from 'wouter';
import { Wrench, Star, Clock, Home } from 'lucide-react';
import CategorySidebar from '../components/CategorySidebar';
import { useLanguage } from '../hooks/useLanguage';
import { trpc } from '../lib/trpc';

export default function ServicesMarket() {
  const { isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Translations
  const t = {
    title: isRTL ? 'سوق المنتجات والخدمات الرقمية المتخصصة حسب الطلب' : 'Specialized Digital Products & Services Market',
    subtitle: isRTL ? 'خدمات رقمية متخصصة حسب احتياجك' : 'Specialized digital services tailored to your needs',
    noServices: isRTL ? 'لا توجد خدمات في هذا التصنيف' : 'No services in this category',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    sar: isRTL ? 'ريال' : 'SAR',
    startingFrom: isRTL ? 'يبدأ من' : 'Starting from',
    deliveryTime: isRTL ? 'مدة التسليم' : 'Delivery time',
    days: isRTL ? 'أيام' : 'days',
    home: isRTL ? 'الصفحة الرئيسية' : 'Home',
  };

  // Load services using trpc
  const { data: services = [], isLoading } = trpc.services.list.useQuery(
    selectedCategory ? { categoryId: selectedCategory } : undefined
  );

  // Handle category selection
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#4691A9] to-[#89A58F] text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <Link href="/">
            <button className="mb-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
              <span>{t.home}</span>
            </button>
          </Link>
          <div className="flex items-center gap-4">
            <Wrench className="w-12 h-12" />
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
              marketType="services"
              onCategorySelect={handleCategorySelect}
              primaryColor="#4691A9"
              secondaryColor="#89A58F"
            />
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">{t.loading}</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">{t.noServices}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: any) => (
                  <Link key={service.id} href={`/markets/services/${service.id}`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 cursor-pointer">
                      {service.imageUrl && (
                        <img
                          src={service.imageUrl}
                          alt={isRTL ? service.titleAr : service.titleEn}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {isRTL ? service.titleAr : service.titleEn}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {isRTL ? service.descriptionAr : service.descriptionEn}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{t.startingFrom}</span>
                        <span className="text-2xl font-bold text-[#4691A9]">
                          {service.basePrice} {t.sar}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.deliveryTime} {t.days}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{service.rating || 5.0}</span>
                        </div>
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

