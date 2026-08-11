import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { FileText, Star, Check, RotateCcw, ListChecks, Wallet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BuyerOrders() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();

  const { data: orders = [], isLoading } = trpc.serviceOrders.myOrders.useQuery({ type: 'buyer' });

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const { data: milestones = [], isLoading: milestonesLoading } = trpc.servicesExt.milestones.useQuery(
    { orderId: expandedOrderId ?? 0 },
    { enabled: expandedOrderId !== null },
  );

  const [revisionOrderId, setRevisionOrderId] = useState<number | null>(null);
  const [revisionNote, setRevisionNote] = useState('');

  const invalidateOrders = () => utils.serviceOrders.myOrders.invalidate({ type: 'buyer' });
  const invalidateMilestones = () => {
    if (expandedOrderId !== null) {
      utils.servicesExt.milestones.invalidate({ orderId: expandedOrderId });
    }
  };

  const acceptDeliveryMutation = trpc.servicesExt.acceptDelivery.useMutation({
    onSuccess: () => {
      toast.success(
        t('تم قبول التسليم وتحويل المبلغ للبائع من الضمان', 'Delivery accepted, escrow released to seller'),
      );
      invalidateOrders();
    },
    onError: (e) => toast.error(e.message),
  });
  const requestRevisionMutation = trpc.servicesExt.requestRevision.useMutation({
    onSuccess: (data) => {
      toast.success(
        t(
          `تم إرسال طلب التعديل (${data.revisionsUsed}/${data.revisionsAllowed})`,
          `Revision request sent (${data.revisionsUsed}/${data.revisionsAllowed})`,
        ),
      );
      setRevisionOrderId(null);
      setRevisionNote('');
      invalidateOrders();
    },
    onError: (e) => toast.error(e.message),
  });
  const approveMilestonesMutation = trpc.servicesExt.approveMilestones.useMutation({
    onSuccess: () => {
      toast.success(
        t('تم اعتماد خطة المراحل وتحويل الضمان لكل مرحلة', 'Milestone plan approved, escrow converted per milestone'),
      );
      invalidateOrders();
      invalidateMilestones();
    },
    onError: (e) => toast.error(e.message),
  });
  const fundMilestoneMutation = trpc.servicesExt.fundMilestone.useMutation({
    onSuccess: () => {
      toast.success(t('تم حجز مبلغ المرحلة في الضمان', 'Milestone amount held in escrow'));
      invalidateMilestones();
    },
    onError: (e) => toast.error(e.message),
  });
  const acceptMilestoneMutation = trpc.servicesExt.acceptMilestone.useMutation({
    onSuccess: (data) => {
      toast.success(
        data.orderCompleted
          ? t('تم قبول المرحلة واكتمل الطلب بالكامل', 'Milestone accepted, order fully completed')
          : t('تم قبول المرحلة وتحويل مبلغها للبائع', 'Milestone accepted, amount released to seller'),
      );
      invalidateOrders();
      invalidateMilestones();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleAcceptDelivery = (orderId: number) => {
    if (
      confirm(
        t(
          'هل أنت متأكد من قبول التسليم؟ سيتم تحويل المبلغ للبائع من الضمان.',
          'Are you sure you accept the delivery? The escrow amount will be released to the seller.',
        ),
      )
    ) {
      acceptDeliveryMutation.mutate({ orderId });
    }
  };

  const handleSendRevision = () => {
    if (revisionOrderId === null) return;
    if (!revisionNote.trim()) {
      toast.error(t('اكتب ملاحظات التعديل المطلوبة', 'Write the requested revision notes'));
      return;
    }
    requestRevisionMutation.mutate({ orderId: revisionOrderId, note: revisionNote.trim() });
  };

  const getOrderStatusBadge = (status: string) => {
    const statusMap: Record<string, { labelAr: string; labelEn: string; className: string }> = {
      pending: { labelAr: 'بانتظار قبول البائع', labelEn: 'Awaiting Seller', className: 'bg-[#4691A9]' },
      in_progress: { labelAr: 'قيد التنفيذ', labelEn: 'In Progress', className: 'bg-[#4691A9]' },
      revision: { labelAr: 'طلب تعديل', labelEn: 'Revision Requested', className: 'bg-[#846F9C]' },
      delivered: { labelAr: 'تم التسليم — بانتظار قبولك', labelEn: 'Delivered — Awaiting Your Acceptance', className: 'bg-[#89A58F]' },
      completed: { labelAr: 'مكتمل', labelEn: 'Completed', className: 'bg-[#89A58F]' },
      cancelled: { labelAr: 'ملغي', labelEn: 'Cancelled', className: 'bg-[#846F9C]/70' },
      disputed: { labelAr: 'نزاع مفتوح', labelEn: 'Disputed', className: 'bg-[#846F9C]/70' },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <Badge className={`${statusInfo.className} text-white`}>
        {t(statusInfo.labelAr, statusInfo.labelEn)}
      </Badge>
    );
  };

  const getMilestoneStatusBadge = (status: string) => {
    const statusMap: Record<string, { labelAr: string; labelEn: string; className: string }> = {
      pending: { labelAr: 'مقترحة', labelEn: 'Proposed', className: 'bg-[#846F9C]' },
      in_progress: { labelAr: 'قيد التنفيذ', labelEn: 'In Progress', className: 'bg-[#4691A9]' },
      completed: { labelAr: 'مكتملة', labelEn: 'Completed', className: 'bg-[#89A58F]' },
      cancelled: { labelAr: 'ملغاة', labelEn: 'Cancelled', className: 'bg-[#846F9C]/70' },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <Badge className={`${statusInfo.className} text-white`}>
        {t(statusInfo.labelAr, statusInfo.labelEn)}
      </Badge>
    );
  };

  const hasProposedMilestones = milestones.some((m) => m.status === 'pending');

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {t('الخدمات المستلمة', 'Received Services')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('الخدمات الرقمية التي تم تسليمها لك', 'Digital services delivered to you')}
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
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t('لا توجد خدمات مستلمة حتى الآن', 'No received services yet')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{t(order.titleAr, order.titleEn)}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {t(order.descriptionAr, order.descriptionEn)}
                      </p>
                    </div>
                    {getOrderStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{t('السعر:', 'Price:')}</span>
                      <span>
                        {order.price} {order.currency}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{t('رقم الطلب:', 'Order #:')}</span>
                      <span>{order.id}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{t('تاريخ الطلب:', 'Ordered:')}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {order.status === 'delivered' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcceptDelivery(order.id)}
                          disabled={acceptDeliveryMutation.isPending}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t('قبول التسليم', 'Accept Delivery')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRevisionOrderId(order.id)}
                          disabled={requestRevisionMutation.isPending}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          {t('طلب تعديل', 'Request Revision')}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                      }
                    >
                      <ListChecks className="h-4 w-4 mr-1" />
                      {expandedOrderId === order.id
                        ? t('إخفاء المراحل', 'Hide Milestones')
                        : t('عرض المراحل', 'View Milestones')}
                    </Button>
                  </div>

                  {expandedOrderId === order.id && (
                    <div className="space-y-3 pt-2">
                      {milestonesLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        </div>
                      ) : milestones.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          {t('لا توجد مراحل لهذا الطلب', 'No milestones for this order')}
                        </p>
                      ) : (
                        <>
                          {hasProposedMilestones && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => approveMilestonesMutation.mutate({ orderId: order.id })}
                              disabled={approveMilestonesMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {t('اعتماد خطة المراحل', 'Approve Milestone Plan')}
                            </Button>
                          )}
                          {milestones.map((m) => (
                            <Card key={m.id}>
                              <CardContent className="py-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="font-semibold">{t(m.titleAr, m.titleEn)}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {m.amount} {t('ريال', 'SAR')}
                                      {' — '}
                                      {m.funded
                                        ? t('ممولة في الضمان', 'Funded in escrow')
                                        : t('غير ممولة بعد', 'Not funded yet')}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getMilestoneStatusBadge(m.status)}
                                    {m.status === 'in_progress' && !m.funded && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          fundMilestoneMutation.mutate({ milestoneId: m.id })
                                        }
                                        disabled={fundMilestoneMutation.isPending}
                                      >
                                        <Wallet className="h-4 w-4 mr-1" />
                                        {t('تمويل المرحلة', 'Fund Milestone')}
                                      </Button>
                                    )}
                                    {m.status === 'in_progress' && m.funded && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          acceptMilestoneMutation.mutate({ milestoneId: m.id })
                                        }
                                        disabled={acceptMilestoneMutation.isPending}
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        {t('قبول تسليم المرحلة', 'Accept Milestone Delivery')}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Request revision dialog */}
      <Dialog open={revisionOrderId !== null} onOpenChange={(open) => !open && setRevisionOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('طلب تعديل', 'Request Revision')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>{t('ملاحظات التعديل', 'Revision Notes')}</Label>
            <Textarea
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder={t('اشرح التعديلات المطلوبة على التسليم', 'Explain the changes you need on the delivery')}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevisionOrderId(null)}>
              {t('إلغاء', 'Cancel')}
            </Button>
            <Button
              className="gradient-bg text-white"
              onClick={handleSendRevision}
              disabled={requestRevisionMutation.isPending}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('إرسال طلب التعديل', 'Send Revision Request')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OSDMDashboardLayout>
  );
}
