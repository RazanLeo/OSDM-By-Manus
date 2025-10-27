import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Wallet as WalletIcon, Plus, CreditCard } from 'lucide-react';

export default function BuyerWallet() {
  const { t } = useLanguage();
  const { data: wallet, isLoading } = trpc.wallet.get.useQuery();

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
                  {wallet?.balance || 0} {wallet?.currency || 'SAR'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="secondary" className="flex-1">
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
                <div className="text-center py-8 text-muted-foreground">
                  {t('لا توجد طرق دفع محفوظة', 'No saved payment methods')}
                </div>
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
                <div className="text-center py-8 text-muted-foreground">
                  {t('لا توجد معاملات حتى الآن', 'No transactions yet')}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </OSDMDashboardLayout>
  );
}

