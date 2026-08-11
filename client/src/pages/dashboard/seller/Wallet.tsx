import { useState } from 'react';
import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Wallet as WalletIcon, TrendingUp, DollarSign } from 'lucide-react';

export default function SellerWallet() {
  const { t, language } = useLanguage();
  const utils = trpc.useUtils();
  const { data: wallet, isLoading } = trpc.finance.wallet.useQuery();
  const { data: transactions = [], isLoading: txLoading } = trpc.finance.transactions.useQuery({ limit: 50 });

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    method: 'bank_transfer',
    bankName: '',
    iban: '',
    paypalEmail: '',
  });

  const withdrawMutation = trpc.finance.requestWithdrawal.useMutation({
    onSuccess: () => {
      toast.success(t('تم إرسال طلب السحب بنجاح', 'Withdrawal request submitted successfully'));
      setWithdrawOpen(false);
      setForm({ amount: '', method: 'bank_transfer', bankName: '', iban: '', paypalEmail: '' });
      utils.finance.wallet.invalidate();
      utils.finance.transactions.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t('فشل طلب السحب', 'Withdrawal request failed'));
    },
  });

  const handleWithdraw = () => {
    const amount = parseInt(form.amount, 10);
    if (!amount || amount <= 0) {
      toast.error(t('يرجى إدخال مبلغ صحيح', 'Please enter a valid amount'));
      return;
    }
    withdrawMutation.mutate({
      amount,
      method: form.method as 'bank_transfer' | 'paypal' | 'stripe',
      bankName: form.bankName || undefined,
      iban: form.iban || undefined,
      paypalEmail: form.paypalEmail || undefined,
    });
  };

  const isCredit = (type: string) => type === 'deposit' || type === 'sale' || type === 'refund';
  const formatDate = (d: string | Date) =>
    new Date(d).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t('المحفظة والأرباح', 'Wallet & Earnings')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('إدارة رصيدك وأرباحك ومعاملاتك المالية', 'Manage your balance, earnings, and financial transactions')}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-[#846F9C] to-[#846F9C]/80 text-white">
                <CardHeader>
                  <CardDescription className="text-white/80">
                    {t('الرصيد المتاح', 'Available Balance')}
                  </CardDescription>
                  <CardTitle className="text-3xl flex items-center gap-2">
                    <WalletIcon className="h-8 w-8" />
                    {wallet?.available || 0} {wallet?.currency || 'SAR'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full" onClick={() => setWithdrawOpen(true)}>
                    {t('سحب الأرباح', 'Withdraw')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>{t('الرصيد المعلق', 'Pending Balance')}</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-[#4691A9]" />
                    {(wallet?.escrowHeld || 0) + (wallet?.pendingWithdrawal || 0)} {wallet?.currency || 'SAR'}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t('ضمان (Escrow)', 'Escrow')}: {wallet?.escrowHeld || 0} · {t('سحب قيد الانتظار', 'Pending withdrawal')}: {wallet?.pendingWithdrawal || 0}
                  </p>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>{t('إجمالي الأرباح', 'Total Earnings')}</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-[#89A58F]" />
                    {wallet?.totalEarnings || 0} {wallet?.currency || 'SAR'}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('المعاملات الأخيرة', 'Recent Transactions')}</CardTitle>
                <CardDescription>
                  {t('آخر المعاملات المالية في حسابك', 'Latest financial transactions in your account')}
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

        {/* Withdrawal Request Dialog */}
        <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('طلب سحب الأرباح', 'Withdrawal Request')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('المبلغ (ر.س)', 'Amount (SAR)')}</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('طريقة السحب', 'Withdrawal Method')}</Label>
                <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('اختر الطريقة', 'Select method')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">{t('تحويل بنكي', 'Bank Transfer')}</SelectItem>
                    <SelectItem value="paypal">{t('باي بال', 'PayPal')}</SelectItem>
                    <SelectItem value="stripe">{t('سترايب', 'Stripe')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.method === 'bank_transfer' && (
                <>
                  <div className="space-y-2">
                    <Label>{t('اسم البنك', 'Bank Name')}</Label>
                    <Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('رقم الآيبان', 'IBAN')}</Label>
                    <Input value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value })} />
                  </div>
                </>
              )}
              {form.method === 'paypal' && (
                <div className="space-y-2">
                  <Label>{t('بريد باي بال', 'PayPal Email')}</Label>
                  <Input
                    type="email"
                    value={form.paypalEmail}
                    onChange={(e) => setForm({ ...form, paypalEmail: e.target.value })}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button
                className="bg-osdm-purple hover:bg-osdm-purple/90"
                onClick={handleWithdraw}
                disabled={withdrawMutation.isPending}
              >
                {t('إرسال الطلب', 'Submit Request')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OSDMDashboardLayout>
  );
}
