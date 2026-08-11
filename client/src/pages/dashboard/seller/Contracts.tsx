import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Briefcase, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

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

function FreelancerContractCard({ contractId }: { contractId: number }) {
  const { t } = useLanguage();
  const contractStatusLabel = useContractStatusLabel();
  const milestoneStatusLabel = useMilestoneStatusLabel();
  const utils = trpc.useUtils();
  const [milestoneNotes, setMilestoneNotes] = useState<Record<number, string>>({});
  const [workNote, setWorkNote] = useState('');
  const [progressNote, setProgressNote] = useState('');

  const { data: detail, isLoading } = trpc.jobsExt.contracts.getById.useQuery({ contractId });

  const invalidate = () => {
    utils.jobsExt.contracts.getById.invalidate({ contractId });
    utils.contracts.myContracts.invalidate();
  };

  const deliverMilestone = trpc.jobsExt.freelancer.deliverMilestone.useMutation({
    onSuccess: () => {
      toast.success(t('تم تسليم المرحلة وهي بانتظار مراجعة صاحب العمل', 'Milestone delivered — awaiting employer review'));
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deliverWork = trpc.jobsExt.freelancer.deliverWork.useMutation({
    onSuccess: () => {
      toast.success(t('تم تسليم العمل وهو بانتظار مراجعة صاحب العمل', 'Work delivered — awaiting employer review'));
      setWorkNote('');
      invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateProgress = trpc.jobsExt.freelancer.updateProgress.useMutation({
    onSuccess: () => {
      toast.success(t('تم إرسال تحديث التقدم', 'Progress update sent'));
      setProgressNote('');
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

        {hasMilestones ? (
          <div className="space-y-3">
            {detail.milestones.map((m) => {
              const pendingDelivery = detail.deliveries.find(
                (d) => d.milestoneId === m.id && d.deliveryType === 'milestone' && d.status === 'pending_review',
              );
              const canDeliver =
                inProgress && !pendingDelivery && m.status !== 'completed' && m.status !== 'paid';
              return (
                <div key={m.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{t(m.titleAr, m.titleEn)}</p>
                      <p className="text-sm text-muted-foreground">{m.amount} {m.currency}</p>
                    </div>
                    <Badge variant={m.status === 'completed' || m.status === 'paid' ? 'default' : 'secondary'}>
                      {pendingDelivery ? t('بانتظار المراجعة', 'Pending review') : milestoneStatusLabel(m.status)}
                    </Badge>
                  </div>
                  {canDeliver && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder={t('ملاحظات التسليم (اختياري)...', 'Delivery notes (optional)...')}
                        rows={2}
                        value={milestoneNotes[m.id] ?? ''}
                        onChange={(e) => setMilestoneNotes((prev) => ({ ...prev, [m.id]: e.target.value }))}
                      />
                      <Button
                        size="sm"
                        className="gradient-bg text-white"
                        disabled={deliverMilestone.isPending}
                        onClick={() =>
                          deliverMilestone.mutate({
                            milestoneId: m.id,
                            messageAr: milestoneNotes[m.id] || undefined,
                            messageEn: milestoneNotes[m.id] || undefined,
                          })
                        }
                      >
                        {deliverMilestone.isPending
                          ? t('جارٍ التسليم...', 'Delivering...')
                          : t('تسليم المرحلة', 'Deliver Milestone')}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          inProgress && (
            <div className="space-y-2">
              <Textarea
                placeholder={t('ملاحظات التسليم (اختياري)...', 'Delivery notes (optional)...')}
                rows={2}
                value={workNote}
                onChange={(e) => setWorkNote(e.target.value)}
              />
              <Button
                size="sm"
                className="gradient-bg text-white"
                disabled={deliverWork.isPending}
                onClick={() =>
                  deliverWork.mutate({
                    contractId,
                    messageAr: workNote || undefined,
                    messageEn: workNote || undefined,
                  })
                }
              >
                {deliverWork.isPending ? t('جارٍ التسليم...', 'Delivering...') : t('تسليم العمل', 'Deliver Work')}
              </Button>
            </div>
          )
        )}

        {(inProgress || detail.status === 'delivered') && (
          <div className="space-y-2">
            <Textarea
              placeholder={t('اكتب تحديث تقدم لصاحب العمل...', 'Write a progress update for the employer...')}
              rows={2}
              value={progressNote}
              onChange={(e) => setProgressNote(e.target.value)}
            />
            <Button
              size="sm"
              variant="secondary"
              disabled={updateProgress.isPending || !progressNote.trim()}
              onClick={() => updateProgress.mutate({ contractId, note: progressNote.trim() })}
            >
              {updateProgress.isPending
                ? t('جارٍ الإرسال...', 'Sending...')
                : t('إرسال تحديث التقدم', 'Send Progress Update')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SellerContracts() {
  const { t } = useLanguage();
  const { data: contracts, isLoading } = trpc.contracts.myContracts.useQuery({ type: 'freelancer' });

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('عقودي ومشاريعي', 'My Contracts & Projects')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('إدارة عقودك والمشاريع التي تعمل عليها', 'Manage your contracts and ongoing projects')}
            </p>
          </div>
          <Button className="gradient-bg text-white" onClick={() => window.location.href = '/markets/jobs'}>
            <Plus className="h-4 w-4 mr-2" />
            {t('إضافة مشروع', 'Add Project')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : !contracts || contracts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t('لا توجد عقود أو مشاريع حالياً', 'No contracts or projects at the moment')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {contracts.map((contract) => (
              <FreelancerContractCard key={contract.id} contractId={contract.id} />
            ))}
          </div>
        )}
      </div>
    </OSDMDashboardLayout>
  );
}
