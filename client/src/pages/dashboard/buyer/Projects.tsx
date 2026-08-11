import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Briefcase, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

function useJobStatusLabel() {
  const { t } = useLanguage();
  return (status: string) => {
    switch (status) {
      case 'draft': return t('مسودة', 'Draft');
      case 'open': return t('مفتوح', 'Open');
      case 'in_progress': return t('قيد التنفيذ', 'In Progress');
      case 'completed': return t('مكتمل', 'Completed');
      case 'cancelled': return t('ملغي', 'Cancelled');
      case 'closed': return t('مغلق', 'Closed');
      default: return status;
    }
  };
}

function useContractStatusLabel() {
  const { t } = useLanguage();
  return (status: string) => {
    switch (status) {
      case 'active': return t('نشط', 'Active');
      case 'in_progress': return t('قيد التنفيذ', 'In Progress');
      case 'delivered': return t('تم التسليم', 'Delivered');
      case 'completed': return t('مكتمل', 'Completed');
      case 'cancelled': return t('ملغي', 'Cancelled');
      case 'disputed': return t('متنازع عليه', 'Disputed');
      default: return status;
    }
  };
}

function useMilestoneStatusLabel() {
  const { t } = useLanguage();
  return (status: string) => {
    switch (status) {
      case 'pending': return t('قيد الانتظار', 'Pending');
      case 'in_progress': return t('قيد التنفيذ', 'In Progress');
      case 'completed': return t('معتمدة', 'Approved');
      case 'paid': return t('مدفوعة', 'Paid');
      default: return status;
    }
  };
}

type MilestoneDraft = { title: string; amount: string };

function EmployerContractCard({ contractId }: { contractId: number }) {
  const { t } = useLanguage();
  const contractStatusLabel = useContractStatusLabel();
  const milestoneStatusLabel = useMilestoneStatusLabel();
  const utils = trpc.useUtils();
  const [drafts, setDrafts] = useState<MilestoneDraft[]>([{ title: '', amount: '' }]);
  const [revisionNotes, setRevisionNotes] = useState<Record<number, string>>({});

  const { data: detail, isLoading } = trpc.jobsExt.contracts.getById.useQuery({ contractId });

  const invalidate = () => {
    utils.jobsExt.contracts.getById.invalidate({ contractId });
    utils.contracts.myContracts.invalidate();
    utils.jobsExt.employer.myJobs.invalidate();
  };

  const defineMilestones = trpc.jobsExt.employer.defineMilestones.useMutation({
    onSuccess: () => {
      toast.success(t('تم تحديد مراحل العقد', 'Contract milestones defined'));
      setDrafts([{ title: '', amount: '' }]);
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const approveMilestone = trpc.jobsExt.employer.approveMilestone.useMutation({
    onSuccess: (res) => {
      toast.success(
        res.contractCompleted
          ? t('اعتُمدت المرحلة الأخيرة وتم تحرير المبلغ من الضمان للمستقل', 'Final milestone approved — escrow released to the freelancer')
          : t('تم اعتماد المرحلة', 'Milestone approved'),
      );
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const acceptDelivery = trpc.jobsExt.employer.acceptDelivery.useMutation({
    onSuccess: () => {
      toast.success(t('تم قبول التسليم وتحرير المبلغ من الضمان للمستقل', 'Delivery accepted — escrow released to the freelancer'));
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const requestRevision = trpc.jobsExt.employer.requestRevision.useMutation({
    onSuccess: () => {
      toast.success(t('تم طلب التعديل', 'Revision requested'));
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading || !detail) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  const inProgress = detail.status === 'active' || detail.status === 'in_progress';
  const hasMilestones = detail.milestones.length > 0;
  const draftsTotal = drafts.reduce((sum, d) => sum + (parseInt(d.amount) || 0), 0);
  const contractDeliveries = detail.deliveries.filter(
    (d) => d.deliveryType === 'contract' && d.status === 'pending_review',
  );

  const handleDefineMilestones = () => {
    const cleaned = drafts
      .map((d) => ({ title: d.title.trim(), amount: parseInt(d.amount) }))
      .filter((d) => d.title && Number.isFinite(d.amount) && d.amount > 0);
    if (cleaned.length === 0) {
      toast.error(t('أضف مرحلة واحدة على الأقل بعنوان ومبلغ صالحين', 'Add at least one milestone with a valid title and amount'));
      return;
    }
    if (cleaned.length !== drafts.length) {
      toast.error(t('يرجى إكمال جميع المراحل بعنوان ومبلغ صالحين', 'Please complete all milestones with a valid title and amount'));
      return;
    }
    defineMilestones.mutate({
      contractId,
      milestones: cleaned.map((d) => ({ titleAr: d.title, titleEn: d.title, amount: d.amount })),
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>{t(detail.titleAr, detail.titleEn)}</CardTitle>
            <CardDescription className="mt-2">
              {t('قيمة العقد:', 'Contract amount:')} {detail.amount} {detail.currency}
            </CardDescription>
          </div>
          <Badge variant={detail.status === 'completed' ? 'default' : 'secondary'}>
            {contractStatusLabel(detail.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasMilestones && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('التقدم', 'Progress')}</span>
              <span className="font-medium">
                {detail.progress.approved}/{detail.progress.total} ({detail.progress.percentage}%)
              </span>
            </div>
            <Progress value={detail.progress.percentage} />
          </div>
        )}

        {!hasMilestones && inProgress && (
          <div className="p-4 border rounded-lg space-y-3">
            <p className="font-medium">{t('تحديد مراحل العقد', 'Define Contract Milestones')}</p>
            <p className="text-sm text-muted-foreground">
              {t('مجموع المراحل يجب أن يساوي قيمة العقد', 'Milestones total must equal the contract amount')}
              {' '}({draftsTotal}/{detail.amount} {detail.currency})
            </p>
            {drafts.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder={t('عنوان المرحلة', 'Milestone title')}
                  value={d.title}
                  onChange={(e) =>
                    setDrafts((prev) => prev.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                  }
                />
                <Input
                  type="number"
                  placeholder={t('المبلغ', 'Amount')}
                  className="w-32"
                  value={d.amount}
                  onChange={(e) =>
                    setDrafts((prev) => prev.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)))
                  }
                />
                {drafts.length > 1 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setDrafts((prev) => prev.filter((_, j) => j !== i))}
                  >
                    {t('حذف', 'Remove')}
                  </Button>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setDrafts((prev) => [...prev, { title: '', amount: '' }])}
              >
                {t('إضافة مرحلة', 'Add Milestone')}
              </Button>
              <Button
                size="sm"
                className="gradient-bg text-white"
                disabled={defineMilestones.isPending}
                onClick={handleDefineMilestones}
              >
                {defineMilestones.isPending
                  ? t('جارٍ الحفظ...', 'Saving...')
                  : t('اعتماد المراحل', 'Save Milestones')}
              </Button>
            </div>
          </div>
        )}

        {hasMilestones && (
          <div className="space-y-3">
            {detail.milestones.map((m) => {
              const pendingDelivery = detail.deliveries.find(
                (d) => d.milestoneId === m.id && d.deliveryType === 'milestone' && d.status === 'pending_review',
              );
              return (
                <div key={m.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{t(m.titleAr, m.titleEn)}</p>
                      <p className="text-sm text-muted-foreground">{m.amount} {m.currency}</p>
                    </div>
                    <Badge variant={m.status === 'completed' || m.status === 'paid' ? 'default' : 'secondary'}>
                      {pendingDelivery ? t('بانتظار مراجعتك', 'Awaiting your review') : milestoneStatusLabel(m.status)}
                    </Badge>
                  </div>
                  {pendingDelivery && (
                    <div className="space-y-2">
                      {(pendingDelivery.messageAr || pendingDelivery.messageEn) && (
                        <p className="text-sm whitespace-pre-wrap">
                          {t(pendingDelivery.messageAr ?? '', pendingDelivery.messageEn ?? '')}
                        </p>
                      )}
                      <Textarea
                        placeholder={t('ملاحظات طلب التعديل...', 'Revision request notes...')}
                        rows={2}
                        value={revisionNotes[pendingDelivery.id] ?? ''}
                        onChange={(e) =>
                          setRevisionNotes((prev) => ({ ...prev, [pendingDelivery.id]: e.target.value }))
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="gradient-bg text-white"
                          disabled={approveMilestone.isPending}
                          onClick={() => approveMilestone.mutate({ milestoneId: m.id })}
                        >
                          {approveMilestone.isPending
                            ? t('جارٍ الاعتماد...', 'Approving...')
                            : t('اعتماد المرحلة وتحرير الدفعة', 'Approve Milestone & Release')}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={requestRevision.isPending || !(revisionNotes[pendingDelivery.id] ?? '').trim()}
                          onClick={() =>
                            requestRevision.mutate({
                              deliveryId: pendingDelivery.id,
                              note: (revisionNotes[pendingDelivery.id] ?? '').trim(),
                            })
                          }
                        >
                          {t('طلب تعديل', 'Request Revision')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {contractDeliveries.map((d) => (
          <div key={d.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start justify-between gap-4">
              <p className="font-medium">{t('تسليم العمل الكامل', 'Full work delivery')}</p>
              <Badge variant="secondary">{t('بانتظار مراجعتك', 'Awaiting your review')}</Badge>
            </div>
            {(d.messageAr || d.messageEn) && (
              <p className="text-sm whitespace-pre-wrap">{t(d.messageAr ?? '', d.messageEn ?? '')}</p>
            )}
            <Textarea
              placeholder={t('ملاحظات طلب التعديل...', 'Revision request notes...')}
              rows={2}
              value={revisionNotes[d.id] ?? ''}
              onChange={(e) => setRevisionNotes((prev) => ({ ...prev, [d.id]: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="gradient-bg text-white"
                disabled={acceptDelivery.isPending}
                onClick={() => acceptDelivery.mutate({ deliveryId: d.id })}
              >
                {acceptDelivery.isPending
                  ? t('جارٍ القبول...', 'Accepting...')
                  : t('قبول التسليم وتحرير الدفعة', 'Accept Delivery & Release')}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={requestRevision.isPending || !(revisionNotes[d.id] ?? '').trim()}
                onClick={() =>
                  requestRevision.mutate({ deliveryId: d.id, note: (revisionNotes[d.id] ?? '').trim() })
                }
              >
                {t('طلب تعديل', 'Request Revision')}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function BuyerProjects() {
  const { t } = useLanguage();
  const jobStatusLabel = useJobStatusLabel();
  const { data: myJobs, isLoading: jobsLoading } = trpc.jobsExt.employer.myJobs.useQuery();
  const { data: contracts, isLoading: contractsLoading } = trpc.contracts.myContracts.useQuery({ type: 'employer' });

  const isLoading = jobsLoading || contractsLoading;
  const isEmpty = (!myJobs || myJobs.length === 0) && (!contracts || contracts.length === 0);

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('المشاريع المستلمة', 'Received Projects')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('المشاريع التي تم تسليمها لك من المستقلين', 'Projects delivered to you by freelancers')}
            </p>
          </div>
          <Button className="gradient-bg text-white" onClick={() => window.location.href = '/add-review'}>
            <Star className="h-4 w-4 mr-2" />
            {t('إضافة تقييم', 'Add Review')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : isEmpty ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t('لا توجد مشاريع مستلمة حتى الآن', 'No received projects yet')}
              </p>
              <Button className="mt-4 gradient-bg text-white" onClick={() => window.location.href = '/markets/jobs'}>
                {t('تصفح المشاريع', 'Browse Projects')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {myJobs && myJobs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('مشاريعي المنشورة', 'My Posted Jobs')}</CardTitle>
                  <CardDescription>
                    {t('المشاريع التي نشرتها وعروض المستقلين عليها', 'Jobs you posted and freelancer bids on them')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{t(job.titleAr, job.titleEn)}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.budget} {job.currency} · {job.bidsCount || 0} {t('عرض', 'bids')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                          {jobStatusLabel(job.status)}
                        </Badge>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.location.href = `/markets/jobs/${job.id}`}
                        >
                          {t('عرض العروض', 'View Bids')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {contracts && contracts.length > 0 && (
              <div className="space-y-6">
                {contracts.map((contract) => (
                  <EmployerContractCard key={contract.id} contractId={contract.id} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </OSDMDashboardLayout>
  );
}
