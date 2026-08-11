import { useState } from 'react';
import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Wallet as WalletIcon, Plus, CreditCard } from 'lucide-react';

export default function BuyerWallet() {
  const { t, language } = useLanguage();
  const utils = trpc.useUtils();
  const { data: wallet, isLoading } = trpc.finance.wallet.useQuery();
  const { data: transactions = [], isLoading: txLoading } = trpc.finance.transactions.useQuery({ limit: 50 });
  const { data: gateways = [] } = trpc.finance.gateways.useQuery();

  const [topUpOpen, setTopUpOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const topUpMutation = trpc.finance.topUp.useMutation({
    onSuccess: () => {
      toast.success(t('تم شحن الرصيد بنجاح', 'Funds added successfully'));
      setTopUpOpen(false);
      setAmount('');
      utils.finance.wallet.invalidate();
      utils.finance.transactions.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t('فشل شحن الرصيد', 'Failed to add funds'));
    },
  });

  const handleTopUp = () => {
    const value = parseInt(amount, 10);
    if (!value || value <= 0) {
      toast.error(t('يرجى إدخال مبلغ صحيح', 'Please enter a valid amount'));
      return;
    }
    topUpMutation.mutate({ amount: value, gateway: 'sandbox' });
  };

  const isCredit = (type: string) => type === 'deposit' || type === 'sale' || type === 'refund';
  const formatDate = (d: string | Date) =>
    new Date(d).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const gatewayLabel = (name: string) =>
    name === 'paytabs'
      ? t('باي تابس', 'PayTabs')
      : name === 'moyasar'
        ? t('ميسر', 'Moyasar')
        : name === 'stcpay'
          ? t('إس تي سي باي', 'STC Pay')
          : t('بيئة تجريبية', 'Sandbox');

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t('المحفظة والمدفوعات', 'Wallet & Payments')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('إدارة رصيدك ومدفوعاتك', 'Manage your balance and payments')}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-[#4691A9] to-[#846F9C] text-white">
              <CardHeader>
                <CardDescription className="text-white/80">
                  {t('رصيد المحفظة', 'Wallet Balance')}
                </CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <WalletIcon className="h-8 w-8" />
                  {wallet?.available || 0} {wallet?.currency || 'SAR'}
                </CardTitle>
                <p className="text-white/80 text-sm">
                  {t('محجوز في الضمان (Escrow)', 'Held in escrow')}: {wallet?.escrowHeld || 0} {wallet?.currency || 'SAR'}
                </p>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => setTopUpOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('شحن الرصيد', 'Add Funds')}
                </Button>
                <Button variant="secondary" className="flex-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('البطاقات', 'Cards')}
                </Button>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>{t('طرق الدفع', 'Payment Methods')}</CardTitle>
                <CardDescription>
                  {t('إدارة بطاقاتك وطرق الدفع المحفوظة', 'Manage your saved cards and payment methods')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {gateways.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('لا توجد طرق دفع محفوظة', 'No saved payment methods')}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gateways.map((gw) => (
                      <div key={gw.name} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <p className="font-medium">{gatewayLabel(gw.name)}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {gw.configured ? t('متاحة', 'Available') : t('غير مهيأة', 'Not configured')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('المعاملات الأخيرة', 'Recent Transactions')}</CardTitle>
                <CardDescription>
                  {t('آخر المدفوعات والمشتريات', 'Latest payments and purchases')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {txLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('لا توجد معاملات حتى الآن', 'No transactions yet')}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{t(tx.descriptionAr || '', tx.descriptionEn || '')}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`font-semibold ${isCredit(tx.type) ? 'text-[#89A58F]' : 'text-destructive'}`}>
                            {isCredit(tx.type) ? '+' : '-'}{tx.amount} {tx.currency || 'SAR'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.status === 'pending'
                              ? t('قيد الانتظار', 'Pending')
                              : tx.status === 'completed'
                                ? t('مكتملة', 'Completed')
                                : tx.status === 'cancelled'
                                  ? t('ملغاة', 'Cancelled')
                                  : t('فاشلة', 'Failed')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Top-up Dialog (sandbox gateway) */}
        <Dialog open={topUpOpen} onOpenChange={setTopUpOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('شحن رصيد المحفظة', 'Add Funds to Wallet')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('المبلغ (ر.س)', 'Amount (SAR)')}</Label>
                <Input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t(
                  'سيتم الشحن عبر البوابة التجريبية (Sandbox) حتى يتم تفعيل بوابات الدفع الحقيقية',
                  'Funds are added via the sandbox gateway until real payment gateways are activated',
                )}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTopUpOpen(false)}>
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button
                className="bg-osdm-purple hover:bg-osdm-purple/90"
                onClick={handleTopUp}
                disabled={topUpMutation.isPending}
              >
                {t('شحن الرصيد', 'Add Funds')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OSDMDashboardLayout>
  );
}
