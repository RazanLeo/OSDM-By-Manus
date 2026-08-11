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

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

type BidShape = {
  id: number;
  freelancerId: number;
  amount: number;
  currency: string;
  deliveryTime: number;
  proposalAr: string;
  proposalEn: string;
  status: string;
  createdAt: string | Date;
};

function BidRow({
  bid,
  freelancerName,
  isOwner,
  canAccept,
  onAccept,
  accepting,
}: {
  bid: BidShape;
  freelancerName?: string | null;
  isOwner: boolean;
  canAccept: boolean;
  onAccept: (bidId: number) => void;
  accepting: boolean;
}) {
  const { t } = useLanguage();
  const { data: profile } = trpc.jobsExt.public.freelancerProfile.useQuery(
    { userId: bid.freelancerId },
    { enabled: !freelancerName },
  );
  const name = freelancerName ?? profile?.name ?? t('مستقل', 'Freelancer');

  const statusLabel =
    bid.status === 'pending' ? t('قيد الانتظار', 'Pending')
    : bid.status === 'accepted' ? t('مقبول', 'Accepted')
    : bid.status === 'rejected' ? t('مرفوض', 'Rejected')
    : t('مسحوب', 'Withdrawn');

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(bid.createdAt).toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
        <Badge variant={bid.status === 'accepted' ? 'default' : 'secondary'}>{statusLabel}</Badge>
      </div>
      <p className="text-sm whitespace-pre-wrap">{t(bid.proposalAr, bid.proposalEn)}</p>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            {bid.amount} {bid.currency}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {bid.deliveryTime} {t('أيام', 'days')}
          </span>
        </div>
        {isOwner && canAccept && bid.status === 'pending' && (
          <Button
            size="sm"
            className="bg-osdm-green hover:bg-osdm-green/90"
            disabled={accepting}
            onClick={() => onAccept(bid.id)}
          >
            {accepting ? t('جارٍ القبول...', 'Accepting...') : t('قبول العرض', 'Accept Bid')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [bidAmount, setBidAmount] = useState('');
  const [bidDuration, setBidDuration] = useState('');
  const [bidDescription, setBidDescription] = useState('');

  const jobId = parseInt(id!);
  const utils = trpc.useUtils();

  const { data: job, isLoading } = trpc.jobsExt.public.jobDetails.useQuery(
    { jobId },
    { enabled: Number.isFinite(jobId) && jobId > 0, retry: false },
  );
  const { data: me } = trpc.auth.me.useQuery();
  const isOwner = !!me && !!job && me.id === job.employerId;

  const { data: publicBids } = trpc.jobBids.listByJob.useQuery(
    { jobId },
    { enabled: Number.isFinite(jobId) && jobId > 0 && !isOwner },
  );
  const { data: ownerBids, isLoading: ownerBidsLoading } = trpc.jobsExt.employer.jobBids.useQuery(
    { jobId },
    { enabled: isOwner },
  );

  const { data: employerProfile } = trpc.jobsExt.public.freelancerProfile.useQuery(
    { userId: job?.employerId ?? 0 },
    { enabled: !!job },
  );
  const { data: openJobs } = trpc.jobs.list.useQuery(undefined, { enabled: !!job });
  const employerJobsCount =
    openJobs && job ? openJobs.filter((j: { employerId: number }) => j.employerId === job.employerId).length : null;

  const invalidateJob = () => {
    utils.jobsExt.public.jobDetails.invalidate({ jobId });
    utils.jobBids.listByJob.invalidate({ jobId });
    utils.jobsExt.employer.jobBids.invalidate({ jobId });
  };

  const placeBid = trpc.jobsExt.freelancer.placeBid.useMutation({
    onSuccess: () => {
      toast.success(t('تم إرسال العرض', 'Bid submitted'));
      setBidAmount('');
      setBidDuration('');
      setBidDescription('');
      invalidateJob();
    },
    onError: (err) => toast.error(err.message),
  });

  const acceptBid = trpc.jobsExt.employer.acceptBid.useMutation({
    onSuccess: () => {
      toast.success(t('تم قبول العرض وتمويل العقد في الضمان', 'Bid accepted and contract funded in escrow'));
      invalidateJob();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmitBid = () => {
    if (!bidAmount || !bidDuration || !bidDescription) {
      toast.error(t('يرجى ملء جميع الحقول', 'Please fill all fields'));
      return;
    }
    const amount = parseInt(bidAmount);
    const days = parseInt(bidDuration);
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(days) || days <= 0) {
      toast.error(t('قيمة العرض أو المدة غير صالحة', 'Invalid bid amount or duration'));
      return;
    }
    placeBid.mutate({ jobId, amount, deliveryDays: days, coverLetter: bidDescription });
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

  const skills = parseJsonArray(job.skills);
  const attachments = parseJsonArray(job.attachments);
  const employerName = job.employer?.name ?? t('العميل', 'Client');

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

                    {attachments.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">{t('المرفقات', 'Attachments')}</h3>
                        <div className="space-y-2">
                          {attachments.map((url, i) => (
                            <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block">
                              <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                  <p className="font-medium">{t('ملف المشروع', 'Project file')} {i + 1}</p>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="skills" className="mt-4">
                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        {t('لم تُحدد مهارات لهذا المشروع', 'No skills specified for this project')}
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="bids" className="mt-4">
                    {isOwner ? (
                      ownerBidsLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        </div>
                      ) : ownerBids && ownerBids.length > 0 ? (
                        <div className="space-y-4">
                          {ownerBids.map((bid) => (
                            <BidRow
                              key={bid.id}
                              bid={bid}
                              freelancerName={bid.freelancer?.name}
                              isOwner
                              canAccept={job.status === 'open'}
                              onAccept={(bidId) => acceptBid.mutate({ bidId })}
                              accepting={acceptBid.isPending}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          {t('لا توجد عروض بعد', 'No bids yet')}
                        </p>
                      )
                    ) : publicBids && publicBids.length > 0 ? (
                      <div className="space-y-4">
                        {publicBids.map((bid) => (
                          <BidRow
                            key={bid.id}
                            bid={bid}
                            isOwner={false}
                            canAccept={false}
                            onAccept={() => undefined}
                            accepting={false}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        {t('لا توجد عروض بعد', 'No bids yet')}
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submit Bid Card */}
            {job.status === 'open' && !isOwner && (
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
                    disabled={placeBid.isPending}
                  >
                    {placeBid.isPending ? t('جارٍ الإرسال...', 'Submitting...') : t('إرسال العرض', 'Submit Bid')}
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
                    <AvatarFallback>{employerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{employerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('عضو منذ', 'Member since')} {employerProfile ? new Date(employerProfile.memberSince).getFullYear() : ''}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('المشاريع:', 'Projects:')}</span>
                    <span className="font-medium">{employerJobsCount ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('التقييم:', 'Rating:')}</span>
                    <span className="font-medium">{(employerProfile?.avgRating ?? 0).toFixed(1)} ⭐</span>
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
