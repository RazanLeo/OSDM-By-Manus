import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [, setLocation] = useLocation();
  const { t, direction } = useLanguage();
  const dir = direction;
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      toast({
        title: t('تم إنشاء الحساب بنجاح', 'Account created successfully'),
        description: t(`مرحباً ${data.user.name}`, `Welcome ${data.user.name}`),
      });
      window.location.href = '/';
    },
    onError: (error) => {
      toast({
        title: t('خطأ في إنشاء الحساب', 'Registration error'),
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('كلمات المرور غير متطابقة', 'Passwords do not match'),
        variant: 'destructive',
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: t('خطأ', 'Error'),
        description: t('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    registerMutation.mutate({
      name,
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
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
              {t('إنشاء حساب جديد', 'Create New Account')}
            </CardTitle>
            <CardDescription 
              className="text-center"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('انضم إلى منصة OSDM وابدأ رحلتك الرقمية', 'Join OSDM platform and start your digital journey')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                  {t('الاسم الكامل', 'Full Name')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-right"
                  dir={dir}
                />
              </div>

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
                  placeholder={t('6 أحرف على الأقل', 'At least 6 characters')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-right"
                  dir={dir}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                  {t('تأكيد كلمة المرور', 'Confirm Password')}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('أعد إدخال كلمة المرور', 'Re-enter password')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? t('جاري إنشاء الحساب...', 'Creating account...') : t('إنشاء حساب', 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600" style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}>
                {t('لديك حساب بالفعل؟', 'Already have an account?')}{' '}
                <button
                  onClick={() => setLocation('/auth/login')}
                  className="text-[#4691A9] hover:underline font-semibold"
                >
                  {t('تسجيل الدخول', 'Login')}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

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

