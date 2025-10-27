import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { User, Mail, Phone, MapPin, Globe, Lock, Bell, CreditCard } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', icon: User, labelAr: 'الملف الشخصي', labelEn: 'Profile' },
    { id: 'security', icon: Lock, labelAr: 'الأمان', labelEn: 'Security' },
    { id: 'notifications', icon: Bell, labelAr: 'الإشعارات', labelEn: 'Notifications' },
    { id: 'payment', icon: CreditCard, labelAr: 'الدفع', labelEn: 'Payment' },
  ];

  return (
    <OSDMDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t('الإعدادات', 'Settings')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('إدارة حسابك وتفضيلاتك', 'Manage your account and preferences')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={activeTab === tab.id ? 'gradient-bg text-white' : ''}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {t(tab.labelAr, tab.labelEn)}
              </Button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('المعلومات الأساسية', 'Basic Information')}</CardTitle>
                <CardDescription>
                  {t('قم بتحديث معلوماتك الشخصية', 'Update your personal information')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('الاسم الكامل', 'Full Name')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      defaultValue={user?.name || ''}
                      className="pl-10"
                      placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('البريد الإلكتروني', 'Email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || ''}
                      className="pl-10"
                      placeholder={t('أدخل بريدك الإلكتروني', 'Enter your email')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('رقم الهاتف', 'Phone Number')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      placeholder={t('أدخل رقم هاتفك', 'Enter your phone number')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t('نبذة عنك', 'Bio')}</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder={t('اكتب نبذة مختصرة عنك', 'Write a brief bio about yourself')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">{t('الموقع', 'Location')}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      className="pl-10"
                      placeholder={t('المدينة، البلد', 'City, Country')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">{t('الموقع الإلكتروني', 'Website')}</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      className="pl-10"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <Button className="gradient-bg text-white">
                  {t('حفظ التغييرات', 'Save Changes')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('تغيير كلمة المرور', 'Change Password')}</CardTitle>
                <CardDescription>
                  {t('قم بتحديث كلمة المرور الخاصة بك', 'Update your password')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{t('كلمة المرور الحالية', 'Current Password')}</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder={t('أدخل كلمة المرور الحالية', 'Enter current password')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('كلمة المرور الجديدة', 'New Password')}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder={t('أدخل كلمة المرور الجديدة', 'Enter new password')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('تأكيد كلمة المرور', 'Confirm Password')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder={t('أعد إدخال كلمة المرور الجديدة', 'Re-enter new password')}
                  />
                </div>

                <Button className="gradient-bg text-white">
                  {t('تحديث كلمة المرور', 'Update Password')}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('المصادقة الثنائية', 'Two-Factor Authentication')}</CardTitle>
                <CardDescription>
                  {t('قم بتفعيل المصادقة الثنائية لحماية حسابك', 'Enable two-factor authentication to secure your account')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">
                  {t('تفعيل المصادقة الثنائية', 'Enable 2FA')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('تفضيلات الإشعارات', 'Notification Preferences')}</CardTitle>
              <CardDescription>
                {t('اختر الإشعارات التي تريد استلامها', 'Choose which notifications you want to receive')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('إشعارات البريد الإلكتروني', 'Email Notifications')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('استلام الإشعارات عبر البريد الإلكتروني', 'Receive notifications via email')}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('تفعيل', 'Enable')}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('إشعارات الطلبات', 'Order Notifications')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('إشعارات عند استلام طلبات جديدة', 'Notifications when you receive new orders')}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('تفعيل', 'Enable')}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('إشعارات الرسائل', 'Message Notifications')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('إشعارات عند استلام رسائل جديدة', 'Notifications when you receive new messages')}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t('تفعيل', 'Enable')}
                </Button>
              </div>

              <Button className="gradient-bg text-white">
                {t('حفظ التفضيلات', 'Save Preferences')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('طرق الدفع', 'Payment Methods')}</CardTitle>
                <CardDescription>
                  {t('إدارة طرق الدفع الخاصة بك', 'Manage your payment methods')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  {t('لا توجد طرق دفع مضافة', 'No payment methods added')}
                </div>
                <Button className="gradient-bg text-white w-full">
                  {t('إضافة طريقة دفع', 'Add Payment Method')}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('معلومات الحساب البنكي', 'Bank Account Information')}</CardTitle>
                <CardDescription>
                  {t('أضف معلومات حسابك البنكي لاستلام الأرباح', 'Add your bank account information to receive earnings')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">{t('اسم البنك', 'Bank Name')}</Label>
                  <Input
                    id="bank-name"
                    placeholder={t('أدخل اسم البنك', 'Enter bank name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-number">{t('رقم الحساب', 'Account Number')}</Label>
                  <Input
                    id="account-number"
                    placeholder={t('أدخل رقم الحساب', 'Enter account number')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="iban">{t('رقم الآيبان (IBAN)', 'IBAN')}</Label>
                  <Input
                    id="iban"
                    placeholder="SA00 0000 0000 0000 0000 0000"
                  />
                </div>

                <Button className="gradient-bg text-white">
                  {t('حفظ المعلومات', 'Save Information')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </OSDMDashboardLayout>
  );
}

