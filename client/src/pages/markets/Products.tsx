import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Search, ShoppingCart, Eye, Download, Star, Heart, Grid3x3, List, Filter, SlidersHorizontal, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { Link } from 'wouter';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'popular' | 'price-low' | 'price-high' | 'rating' | 'downloads';

export default function ProductsMarket() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: categories = [] } = trpc.productCategories.list.useQuery();
  const { data: allProducts = [], isLoading } = trpc.products.list.useQuery({
    categoryId: selectedCategory === 'all' ? undefined : parseInt(selectedCategory),
    search: searchQuery || undefined,
    status: 'active',
  });

  // Get parent categories only
  const parentCategories = categories.filter(cat => !cat.parentId);
  
  // Get subcategories for selected parent
  const subcategories = selectedCategory !== 'all' 
    ? categories.filter(cat => cat.parentId === parseInt(selectedCategory))
    : [];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'downloads':
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
    }

    return filtered;
  }, [allProducts, priceRange, sortBy]);

  const sortOptions = [
    { value: 'newest', label: t('الأحدث', 'Newest'), icon: Clock },
    { value: 'popular', label: t('الأكثر مشاهدة', 'Most Viewed'), icon: TrendingUp },
    { value: 'price-low', label: t('السعر: من الأقل للأعلى', 'Price: Low to High'), icon: DollarSign },
    { value: 'price-high', label: t('السعر: من الأعلى للأقل', 'Price: High to Low'), icon: DollarSign },
    { value: 'rating', label: t('الأعلى تقييماً', 'Highest Rated'), icon: Star },
    { value: 'downloads', label: t('الأكثر تحميلاً', 'Most Downloaded'), icon: Download },
  ];

  const ProductCard = ({ product, isListView = false }: { product: any; isListView?: boolean }) => {
    if (isListView) {
      return (
        <Card className="hover:shadow-xl transition-shadow overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-64 aspect-video md:aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.coverImage || '/placeholder.png'}
                alt={t(product.titleAr, product.titleEn)}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
              <Badge className="absolute top-2 right-2 bg-purple-600">
                {product.price} {product.currency}
              </Badge>
            </div>

            <div className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">
                  {t(product.titleAr, product.titleEn)}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {t(product.descriptionAr, product.descriptionEn)}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags?.split(',').slice(0, 5).map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{product.rating || 0}</span>
                    <span>({product.reviewsCount || 0})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{product.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{product.downloads || 0}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Link href={`/markets/products/${product.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    {t('عرض التفاصيل', 'View Details')}
                  </Button>
                </Link>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('شراء', 'Buy')}
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="hover:shadow-xl transition-shadow overflow-hidden group">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={product.coverImage || '/placeholder.png'}
            alt={t(product.titleAr, product.titleEn)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge className="bg-purple-600 text-white">
              {product.price} {product.currency}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-2 text-lg">
            {t(product.titleAr, product.titleEn)}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {t(product.descriptionAr, product.descriptionEn)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{product.rating || 0}</span>
              <span className="text-xs">({product.reviewsCount || 0})</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{product.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{product.downloads || 0}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {product.tags?.split(',').slice(0, 3).map((tag: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Link href={`/markets/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              {t('عرض', 'View')}
            </Button>
          </Link>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('سوق المنتجات الرقمية الجاهزة', 'Ready Made Digital Products Market')}
            </h1>
            <p className="text-xl mb-8">
              {t(
                'اكتشف آلاف المنتجات الرقمية الجاهزة للشراء والتحميل الفوري',
                'Discover thousands of ready-made digital products for instant purchase and download'
              )}
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t('ابحث عن منتجات...', 'Search for products...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white text-gray-900"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64 bg-white text-gray-900">
                  <SelectValue placeholder={t('جميع التصنيفات', 'All Categories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('جميع التصنيفات', 'All Categories')}</SelectItem>
                  {parentCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.icon} {t(cat.nameAr, cat.nameEn)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Categories Tabs */}
        <section className="container py-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                {t('الكل', 'All')}
              </TabsTrigger>
              {parentCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id.toString()}
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {cat.icon} {t(cat.nameAr, cat.nameEn)}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {subcategories.map((subCat) => (
                  <Button
                    key={subCat.id}
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {t(subCat.nameAr, subCat.nameEn)}
                  </Button>
                ))}
              </div>
            )}
          </Tabs>
        </section>

        {/* Filters and Products */}
        <section className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {t('الفلاتر', 'Filters')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      {t('نطاق السعر', 'Price Range')}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      step={100}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{priceRange[0]} SAR</span>
                      <span>{priceRange[1]} SAR</span>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      {t('التقييم', 'Rating')}
                    </label>
                    <div className="space-y-2">
                      {[5, 4, 3].map((rating) => (
                        <Button key={rating} variant="ghost" className="w-full justify-start">
                          <div className="flex items-center gap-2">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm">{t('فأعلى', '& Up')}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t('عرض', 'Showing')} {filteredProducts.length} {t('منتج', 'products')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        {t('ترتيب', 'Sort')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>{t('ترتيب حسب', 'Sort By')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {sortOptions.map((option) => (
                        <DropdownMenuCheckboxItem
                          key={option.value}
                          checked={sortBy === option.value}
                          onCheckedChange={() => setSortBy(option.value as SortBy)}
                        >
                          <option.icon className="h-4 w-4 mr-2" />
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* View Mode Toggle */}
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' ? 'bg-purple-600' : ''}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' ? 'bg-purple-600' : ''}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {t('لا توجد منتجات متاحة حالياً', 'No products available at the moment')}
                  </p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
                }>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} isListView={viewMode === 'list'} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

