import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function SellerWallet() {
  const { t } = useLanguage();
  const { data: wallet, isLoading } = trpc.wallet.get.useQuery();

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
              <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                <CardHeader>
                  <CardDescription className="text-purple-100">
                    {t('الرصيد المتاح', 'Available Balance')}
                  </CardDescription>
                  <CardTitle className="text-3xl flex items-center gap-2">
                    <WalletIcon className="h-8 w-8" />
                    {wallet?.balance || 0} {wallet?.currency || 'SAR'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">
                    {t('سحب الأرباح', 'Withdraw')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>{t('الرصيد المعلق', 'Pending Balance')}</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-yellow-500" />
                    {wallet?.pendingBalance || 0} {wallet?.currency || 'SAR'}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>{t('إجمالي الأرباح', 'Total Earnings')}</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-500" />
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

