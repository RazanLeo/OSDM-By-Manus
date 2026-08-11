import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const { t, direction } = useLanguage();
  const dir = direction;
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast({
        title: t('تم تسجيل الدخول بنجاح', 'Login successful'),
        description: t(`مرحباً ${data.user.name}`, `Welcome ${data.user.name}`),
      });
      // Reload to update user context
      window.location.href = '/';
    },
    onError: (error) => {
      toast({
        title: t('خطأ في تسجيل الدخول', 'Login error'),
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    loginMutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="OSDM Logo"
            className="h-32 w-32 mx-auto mb-4"
          />
          <span
            className="text-5xl font-bold block"
            style={{ 
              background: 'linear-gradient(90deg, #846F9C 0%, #4691A9 50%, #89A58F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif'
            }}
          >
            OSDM
          </span>
          <p 
            className="text-gray-600 mt-2"
            style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
          >
            {t('السوق الرقمي ذو المحطة الواحدة', 'One Stop Digital Market')}
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle 
              className="text-center text-2xl"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('تسجيل الدخول', 'Login')}
            </CardTitle>
            <CardDescription 
              className="text-center"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('أدخل بياناتك للدخول إلى حسابك', 'Enter your credentials to access your account')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                  {t('البريد الإلكتروني', 'Email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('example@email.com', 'example@email.com')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-right"
                  dir={dir}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                  {t('كلمة المرور', 'Password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('••••••••', '••••••••')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-right"
                  dir={dir}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] hover:opacity-90 text-white py-6 text-lg"
                disabled={isLoading}
                style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
              >
                {isLoading ? t('جاري تسجيل الدخول...', 'Logging in...') : t('تسجيل الدخول', 'Login')}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600" style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                {t('ليس لديك حساب؟', "Don't have an account?")}{' '}
                <button
                  onClick={() => setLocation('/auth/register')}
                  className="text-[#4691A9] hover:underline font-semibold"
                >
                  {t('إنشاء حساب جديد', 'Create new account')}
                </button>
              </p>
            </div>

            {/* Test Accounts Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-2" style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                {t('حسابات تجريبية:', 'Test Accounts:')}
              </p>
              <div className="space-y-1 text-xs text-blue-800" style={{ fontFamily: 'monospace' }}>
                <p>👤 Guest: Guest@osdm.sa / guest@123456</p>
                <p>👑 Admin: admin@osdm.sa / admin@123456</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="text-gray-600 hover:text-gray-900"
            style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
          >
            {t('← العودة للصفحة الرئيسية', '← Back to Home')}
          </Button>
        </div>
      </div>
    </div>
  );
}

