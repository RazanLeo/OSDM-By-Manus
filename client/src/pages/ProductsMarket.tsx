import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ShoppingBag, Star, Download, Eye, Home } from 'lucide-react';
import CategorySidebar from '../components/CategorySidebar';
import { useLanguage } from '../hooks/useLanguage';

export default function ProductsMarket() {
  const { isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Translations
  const t = {
    title: isRTL ? 'سوق المنتجات الرقمية الجاهزة' : 'Ready Digital Products Market',
    subtitle: isRTL ? 'منتجات رقمية جاهزة للشراء والتحميل الفوري' : 'Ready digital products for instant purchase and download',
    noProducts: isRTL ? 'لا توجد منتجات في هذا التصنيف' : 'No products in this category',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    sar: isRTL ? 'ريال' : 'SAR',
    downloads: isRTL ? 'تحميل' : 'downloads',
    views: isRTL ? 'مشاهدة' : 'views',
  };

  // Load products on mount
  useEffect(() => {
    loadProducts(null);
  }, []);

  // Load products
  const loadProducts = async (categoryId: number | null) => {
    setLoading(true);
    
    try {
      const endpoint = categoryId 
        ? `/api/trpc/products.list?input=${encodeURIComponent(JSON.stringify({ categoryId }))}`
        : '/api/trpc/products.list';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      setProducts(data.result?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    await loadProducts(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#846F9C] to-[#4691A9] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ShoppingBag size={40} />
              <h1 className="text-4xl font-bold">{t.title}</h1>
            </div>
            <Link href="/">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <Home size={20} />
                <span>{isRTL ? 'الصفحة الرئيسية' : 'Home'}</span>
              </button>
            </Link>
          </div>
          <p className="text-xl text-white/90">{t.subtitle}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:sticky md:top-4 md:self-start">
            <CategorySidebar
              marketType="products"
              onCategorySelect={handleCategorySelect}
              selectedCategoryId={selectedCategory}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                        {product.coverImage && (
                          <img
                            src={product.coverImage}
                            alt={isRTL ? product.titleAr : product.titleEn}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {product.rating > 0 && (
                          <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                          {isRTL ? product.titleAr : product.titleEn}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {isRTL ? product.descriptionAr : product.descriptionEn}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Download size={14} />
                              {product.downloads}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {product.views}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-[#4691A9]">
                            {product.price} {t.sar}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-xl text-gray-500 dark:text-gray-400">{t.noProducts}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

