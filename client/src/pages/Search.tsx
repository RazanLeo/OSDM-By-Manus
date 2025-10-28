import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search as SearchIcon, Filter, X } from 'lucide-react';

export default function Search() {
  const [location] = useLocation();
  const { t, direction } = useLanguage();
  const dir = direction;
  
  // Get search query from URL
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Search queries
  const { data: products, isLoading: loadingProducts } = trpc.products.list.useQuery({
    search: searchQuery,
  });
  
  const { data: services, isLoading: loadingServices } = trpc.services.list.useQuery({
    search: searchQuery,
  });
  
  const { data: jobs, isLoading: loadingJobs } = trpc.jobs.list.useQuery({
    search: searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const clearFilters = () => {
    setCategory('all');
    setType('all');
    setMinPrice(0);
    setMaxPrice(10000);
    setRating(0);
    setSortBy('relevance');
  };

  // Filter results based on type
  const filteredResults = {
    products: type === 'all' || type === 'products' ? (products || []) : [],
    services: type === 'all' || type === 'services' ? (services || []) : [],
    jobs: type === 'all' || type === 'jobs' ? (jobs || []) : [],
  };

  const totalResults = 
    filteredResults.products.length + 
    filteredResults.services.length + 
    filteredResults.jobs.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent"
            style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
          >
            {t('نتائج البحث', 'Search Results')}
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5`} />
              <Input
                type="text"
                placeholder={t('ابحث عن منتجات، خدمات، أو فرص عمل...', 'Search for products, services, or jobs...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${dir === 'rtl' ? 'pr-10' : 'pl-10'} h-12`}
                style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
              />
            </div>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-[#846F9C] to-[#4691A9] hover:opacity-90"
              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
            >
              {t('بحث', 'Search')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
            >
              <Filter className="h-4 w-4" />
              {t('فلاتر', 'Filters')}
            </Button>
          </form>

          {/* Results Count */}
          <p 
            className="mt-4 text-gray-600"
            style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
          >
            {t(`تم العثور على ${totalResults} نتيجة`, `Found ${totalResults} results`)}
            {searchQuery && ` ${t('لـ', 'for')} "${searchQuery}"`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 
                      className="font-semibold"
                      style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                    >
                      {t('الفلاتر', 'Filters')}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label 
                      className="text-sm font-medium mb-2 block"
                      style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                    >
                      {t('النوع', 'Type')}
                    </label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('الكل', 'All')}</SelectItem>
                        <SelectItem value="products">{t('منتجات', 'Products')}</SelectItem>
                        <SelectItem value="services">{t('خدمات', 'Services')}</SelectItem>
                        <SelectItem value="jobs">{t('فرص عمل', 'Jobs')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label 
                      className="text-sm font-medium mb-2 block"
                      style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                    >
                      {t('نطاق السعر', 'Price Range')}
                    </label>
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={10000}
                        step={100}
                        value={[minPrice, maxPrice]}
                        onValueChange={([min, max]) => {
                          setMinPrice(min);
                          setMaxPrice(max);
                        }}
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                          ${minPrice}
                        </span>
                        <span style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                          ${maxPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label 
                      className="text-sm font-medium mb-2 block"
                      style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                    >
                      {t('التقييم', 'Rating')}
                    </label>
                    <Select value={rating.toString()} onValueChange={(v) => setRating(Number(v))}>
                      <SelectTrigger style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">{t('الكل', 'All')}</SelectItem>
                        <SelectItem value="4">4+ ⭐</SelectItem>
                        <SelectItem value="3">3+ ⭐</SelectItem>
                        <SelectItem value="2">2+ ⭐</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label 
                      className="text-sm font-medium mb-2 block"
                      style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                    >
                      {t('ترتيب حسب', 'Sort By')}
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">{t('الأكثر صلة', 'Most Relevant')}</SelectItem>
                        <SelectItem value="price-low">{t('السعر: من الأقل للأعلى', 'Price: Low to High')}</SelectItem>
                        <SelectItem value="price-high">{t('السعر: من الأعلى للأقل', 'Price: High to Low')}</SelectItem>
                        <SelectItem value="rating">{t('الأعلى تقييماً', 'Highest Rated')}</SelectItem>
                        <SelectItem value="newest">{t('الأحدث', 'Newest')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {loadingProducts || loadingServices || loadingJobs ? (
              <div className="text-center py-12">
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('جاري البحث...', 'Searching...')}
                </p>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-12">
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('لم يتم العثور على نتائج', 'No results found')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Products */}
                {filteredResults.products.length > 0 && (
                  <div>
                    <h2 
                      className="text-xl font-semibold mb-4"
                      style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                    >
                      {t('المنتجات', 'Products')} ({filteredResults.products.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredResults.products.map((product: any) => (
                        <Card key={product.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <h3 
                              className="font-semibold mb-2"
                              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                            >
                              {dir === 'rtl' ? product.nameAr : product.nameEn}
                            </h3>
                            <p 
                              className="text-sm text-gray-600 mb-2"
                              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                            >
                              {dir === 'rtl' ? product.descriptionAr : product.descriptionEn}
                            </p>
                            <p 
                              className="text-lg font-bold text-[#4691A9]"
                              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                            >
                              ${product.price}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services */}
                {filteredResults.services.length > 0 && (
                  <div>
                    <h2 
                      className="text-xl font-semibold mb-4"
                      style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                    >
                      {t('الخدمات', 'Services')} ({filteredResults.services.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredResults.services.map((service: any) => (
                        <Card key={service.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <h3 
                              className="font-semibold mb-2"
                              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                            >
                              {dir === 'rtl' ? service.titleAr : service.titleEn}
                            </h3>
                            <p 
                              className="text-sm text-gray-600 mb-2"
                              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                            >
                              {dir === 'rtl' ? service.descriptionAr : service.descriptionEn}
                            </p>
                            <p 
                              className="text-lg font-bold text-[#4691A9]"
                              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                            >
                              {t('يبدأ من', 'Starting from')} ${service.startingPrice}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jobs */}
                {filteredResults.jobs.length > 0 && (
                  <div>
                    <h2 
                      className="text-xl font-semibold mb-4"
                      style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                    >
                      {t('فرص العمل', 'Jobs')} ({filteredResults.jobs.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredResults.jobs.map((job: any) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <h3 
                              className="font-semibold mb-2"
                              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                            >
                              {dir === 'rtl' ? job.titleAr : job.titleEn}
                            </h3>
                            <p 
                              className="text-sm text-gray-600 mb-2"
                              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                            >
                              {dir === 'rtl' ? job.descriptionAr : job.descriptionEn}
                            </p>
                            <p 
                              className="text-lg font-bold text-[#4691A9]"
                              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                            >
                              ${job.budget}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

