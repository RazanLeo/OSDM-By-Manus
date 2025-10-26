import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Search, Clock, DollarSign, Users, MapPin } from 'lucide-react';
import { Link } from 'wouter';

export default function JobsMarket() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: categories = [] } = trpc.jobCategories.list.useQuery();
  const { data: jobs = [], isLoading } = trpc.jobs.list.useQuery({
    categoryId: selectedCategory === 'all' ? undefined : parseInt(selectedCategory),
    search: searchQuery || undefined,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('سوق فرص العمل الحر الرقمي عن بعد', 'Remote Work Opportunities for Freelancers Market')}
            </h1>
            <p className="text-xl mb-8">
              {t(
                'اعثر على فرص عمل حر مميزة أو انشر مشروعك واستقبل عروض المستقلين',
                'Find premium freelance opportunities or post your project and receive bids from freelancers'
              )}
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t('ابحث عن مشاريع...', 'Search for projects...')}
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
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.icon} {t(cat.nameAr, cat.nameEn)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container py-8">
          <div className="flex gap-3 overflow-x-auto pb-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-osdm-green' : ''}
            >
              {t('الكل', 'All')}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id.toString() ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={selectedCategory === cat.id.toString() ? 'bg-osdm-green' : ''}
              >
                {cat.icon} {t(cat.nameAr, cat.nameEn)}
              </Button>
            ))}
          </div>
        </section>

        {/* Jobs Grid */}
        <section className="container py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t('لا توجد مشاريع متاحة حالياً', 'No projects available at the moment')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {t(job.titleAr, job.titleEn)}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {t(job.descriptionAr, job.descriptionEn)}
                        </CardDescription>
                      </div>
                      <Badge className="bg-osdm-green text-white shrink-0">
                        {t('مفتوح', 'Open')}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Budget */}
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <DollarSign className="h-5 w-5 text-osdm-green" />
                      <span>
                        {job.budget} {job.currency}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {job.duration} {t(
                            job.durationUnit === 'hours' ? 'ساعة' : job.durationUnit === 'days' ? 'يوم' : job.durationUnit === 'weeks' ? 'أسبوع' : 'شهر',
                            job.durationUnit === 'hours' ? 'hour' : job.durationUnit === 'days' ? 'day' : job.durationUnit === 'weeks' ? 'week' : 'month'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{job.bidsCount || 0} {t('عرض', 'bid')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{t('عن بعد', 'Remote')}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skills && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.split(',').slice(0, 5).map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Link href={`/markets/jobs/${job.id}`} className="w-full">
                      <Button className="w-full bg-osdm-green hover:bg-osdm-green/90">
                        {t('عرض التفاصيل وتقديم عرض', 'View Details & Submit Bid')}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

