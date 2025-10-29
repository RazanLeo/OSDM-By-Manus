import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  parentId: number | null;
  icon?: string;
  order: number;
}

interface CategorySidebarProps {
  marketType: 'products' | 'services' | 'jobs';
  onCategorySelect: (categoryId: number | null) => void;
  selectedCategoryId?: number | null;
}

export default function CategorySidebar({ 
  marketType, 
  onCategorySelect,
  selectedCategoryId 
}: CategorySidebarProps) {
  const { language, isRTL } = useLanguage();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Translations
  const t = {
    title: isRTL ? 'التصنيفات' : 'Categories',
    search: isRTL ? 'ابحث في التصنيفات...' : 'Search categories...',
    all: isRTL ? 'جميع التصنيفات' : 'All Categories',
    noResults: isRTL ? 'لا توجد نتائج' : 'No results found',
    total: isRTL ? 'إجمالي التصنيفات' : 'Total Categories',
  };

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, [marketType]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const endpoint = marketType === 'products' ? '/api/trpc/productCategories.list' :
                      marketType === 'services' ? '/api/trpc/serviceCategories.list' :
                      '/api/trpc/jobCategories.list';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      setCategories(data.result?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get main categories (parentId === null)
  const mainCategories = categories.filter(cat => cat.parentId === null);

  // Get subcategories for a parent
  const getSubcategories = (parentId: number) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter categories based on search
  const filterCategories = (cats: Category[]) => {
    if (!searchQuery.trim()) return cats;
    
    const query = searchQuery.toLowerCase();
    return cats.filter(cat => 
      cat.nameAr.toLowerCase().includes(query) ||
      cat.nameEn.toLowerCase().includes(query)
    );
  };

  // Render category item
  const renderCategory = (category: Category, level: number = 0) => {
    const subcategories = getSubcategories(category.id);
    const hasSubcategories = subcategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategoryId === category.id;
    
    const categoryName = isRTL ? category.nameAr : category.nameEn;
    
    return (
      <div key={category.id} className={`${level > 0 ? (isRTL ? 'mr-4' : 'ml-4') : ''}`}>
        <div
          className={`
            flex items-center justify-between p-3 rounded-lg cursor-pointer
            transition-all duration-200 group
            ${isSelected 
              ? 'bg-gradient-to-r from-[#846F9C] to-[#4691A9] text-white shadow-md' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }
            ${level === 0 ? 'font-semibold' : level === 1 ? 'font-medium text-sm' : 'text-sm'}
          `}
          onClick={() => {
            if (hasSubcategories) {
              toggleCategory(category.id);
            }
            onCategorySelect(category.id);
          }}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasSubcategories && (
              <span className={`${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
            {!hasSubcategories && level > 0 && (
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-300 dark:bg-gray-700'} flex-shrink-0`} />
            )}
            <span className={`${isSelected ? 'text-white' : ''}`}>
              {categoryName}
            </span>
          </div>
          
          {hasSubcategories && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              isSelected 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}>
              {subcategories.length}
            </span>
          )}
        </div>

        {/* Render subcategories */}
        {hasSubcategories && isExpanded && (
          <div className="mt-1 space-y-1">
            {filterCategories(subcategories).map(subcat => 
              renderCategory(subcat, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full md:w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-[#846F9C] to-[#4691A9]">
        <h2 className="text-xl font-bold text-white mb-4">
          {t.title}
        </h2>
        
        {/* Search Box */}
        <div className="relative">
          <Search 
            className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-white/70`} 
            size={20} 
          />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 ${isRTL ? 'pr-10' : 'pl-10'} rounded-lg bg-white/20 backdrop-blur-sm
                     text-white placeholder-white/70 border border-white/30
                     focus:outline-none focus:ring-2 focus:ring-white/50`}
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto space-y-2">
        {/* All Categories Option */}
        <div
          className={`
            flex items-center justify-between p-3 rounded-lg cursor-pointer
            transition-all duration-200
            ${selectedCategoryId === null
              ? 'bg-gradient-to-r from-[#846F9C] to-[#4691A9] text-white shadow-md'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
          onClick={() => onCategorySelect(null)}
        >
          <span className="font-semibold">
            {t.all}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            selectedCategoryId === null
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}>
            {categories.length}
          </span>
        </div>

        {/* Main Categories */}
        {filterCategories(mainCategories).map(category => 
          renderCategory(category, 0)
        )}

        {/* No Results */}
        {searchQuery && filterCategories(mainCategories).length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>{t.noResults}</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{t.total}</span>
          <span className="font-semibold">{categories.length}</span>
        </div>
      </div>
    </div>
  );
}

