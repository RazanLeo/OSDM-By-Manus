import { useState } from 'react';
import { Link } from 'wouter';
import { ShoppingBag, Star, Download, Eye, Home } from 'lucide-react';
import CategorySidebar from '../components/CategorySidebar';
import { useLanguage } from '../hooks/useLanguage';
import { trpc } from '../lib/trpc';

export default function ProductsMarket() {
  const { isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Translations
  const t = {
    title: isRTL ? 'سوق المنتجات الرقمية الجاهزة' : 'Ready Digital Products Market',
    subtitle: isRTL ? 'منتجات رقمية جاهزة للشراء والتحميل الفوري' : 'Ready digital products for instant purchase and download',
    noProducts: isRTL ? 'لا توجد منتجات في هذا التصنيف' : 'No products in this category',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    sar: isRTL ? 'ريال' : 'SAR',
    downloads: isRTL ? 'تحميل' : 'downloads',
    views: isRTL ? 'مشاهدة' : 'views',
    home: isRTL ? 'الصفحة الرئيسية' : 'Home',
  };

  // Load products using trpc
  const { data: products = [], isLoading } = trpc.products.list.useQuery(
    selectedCategory ? { categoryId: selectedCategory } : undefined
  );

  // Handle category selection
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#846F9C] to-[#4691A9] text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <Link href="/">
            <button className="mb-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
              <span>{t.home}</span>
            </button>
          </Link>
          <div className="flex items-center gap-4">
            <ShoppingBag className="w-12 h-12" />
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
              marketType="products"
              onCategorySelect={handleCategorySelect}
              primaryColor="#846F9C"
              secondaryColor="#4691A9"
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">{t.loading}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">{t.noProducts}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Link key={product.id} href={`/markets/products/${product.id}`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 cursor-pointer">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={isRTL ? product.titleAr : product.titleEn}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {isRTL ? product.titleAr : product.titleEn}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {isRTL ? product.descriptionAr : product.descriptionEn}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#4691A9]">
                          {product.price} {t.sar}
                        </span>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating || 5.0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            <span>{product.downloads || 0}</span>
                          </div>
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

