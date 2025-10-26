import { useParams, Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Clock, DollarSign, Users, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function JobDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [bidAmount, setBidAmount] = useState('');
  const [bidDuration, setBidDuration] = useState('');
  const [bidDescription, setBidDescription] = useState('');
  
  const { data: job, isLoading } = trpc.jobs.getById.useQuery({ id: parseInt(id!) });

  const handleSubmitBid = () => {
    if (!bidAmount || !bidDuration || !bidDescription) {
      toast.error(t('يرجى ملء جميع الحقول', 'Please fill all fields'));
      return;
    }
    toast.success(t('تم إرسال العرض', 'Bid submitted'));
    setBidAmount('');
    setBidDuration('');
    setBidDescription('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('المشروع غير موجود', 'Project not found')}</h1>
            <Link href="/markets/jobs">
              <Button>{t('العودة إلى السوق', 'Back to Market')}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">
                      {t(job.titleAr, job.titleEn)}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.budget} {job.currency}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.duration} {t('أيام', 'days')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{job.bidsCount || 0} {t('عرض', 'bids')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(job.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                    {job.status === 'open' ? t('مفتوح', 'Open') : t('مغلق', 'Closed')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">
                      {t('الوصف', 'Description')}
                    </TabsTrigger>
                    <TabsTrigger value="skills">
                      {t('المهارات المطلوبة', 'Required Skills')}
                    </TabsTrigger>
                    <TabsTrigger value="bids">
                      {t('العروض', 'Bids')} ({job.bidsCount || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">
                        {t(job.descriptionAr, job.descriptionEn)}
                      </p>
                    </div>

                    {job.attachments && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">{t('المرفقات', 'Attachments')}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{t('ملف المشروع', 'Project file')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="skills" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'].map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="bids" className="mt-4">
                    <p className="text-muted-foreground text-center py-8">
                      {t('لا توجد عروض بعد', 'No bids yet')}
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submit Bid Card */}
            {job.status === 'open' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('قدم عرضك', 'Submit Your Bid')}</CardTitle>
                  <CardDescription>
                    {t('قدم عرضك للحصول على هذا المشروع', 'Submit your bid to get this project')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('قيمة العرض', 'Bid Amount')} ({job.currency})
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('مدة التنفيذ (أيام)', 'Duration (days)')}
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={bidDuration}
                      onChange={(e) => setBidDuration(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('وصف العرض', 'Bid Description')}
                    </label>
                    <Textarea
                      placeholder={t('اشرح كيف ستنفذ المشروع...', 'Explain how you will execute the project...')}
                      rows={4}
                      value={bidDescription}
                      onChange={(e) => setBidDescription(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full bg-osdm-green hover:bg-osdm-green/90"
                    onClick={handleSubmitBid}
                  >
                    {t('إرسال العرض', 'Submit Bid')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Client Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('صاحب المشروع', 'Project Owner')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{t('العميل', 'Client')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('عضو منذ', 'Member since')} 2024
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('المشاريع:', 'Projects:')}</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('التقييم:', 'Rating:')}</span>
                    <span className="font-medium">5.0 ⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('معلومات المشروع', 'Project Info')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('الميزانية:', 'Budget:')}</span>
                  <span className="font-medium">{job.budget} {job.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('المدة:', 'Duration:')}</span>
                  <span className="font-medium">{job.duration} {t('أيام', 'days')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('العروض:', 'Bids:')}</span>
                  <span className="font-medium">{job.bidsCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('الحالة:', 'Status:')}</span>
                  <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                    {job.status === 'open' ? t('مفتوح', 'Open') : t('مغلق', 'Closed')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

