import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Register() {
  const [, setLocation] = useLocation();
  const { t, direction } = useLanguage();
  const dir = direction;

  const handleOAuthRegister = () => {
    // Redirect to OAuth registration
    window.location.href = '/api/auth/login?register=true';
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
          <svg width="150" height="60" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <defs>
              <linearGradient id="osdm-gradient-register" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#846F9C', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#4691A9', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#89A58F', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="42"
              fill="url(#osdm-gradient-register)"
              fontSize="42"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily={dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif'}
            >
              OSDM
            </text>
          </svg>
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
              className="text-center"
              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
            >
              {t('إنشاء حساب جديد', 'Create New Account')}
            </CardTitle>
            <CardDescription 
              className="text-center"
              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
            >
              {t('انضم إلى منصة OSDM وابدأ رحلتك الرقمية', 'Join OSDM Platform and start your digital journey')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OAuth Register Button */}
            <Button
              onClick={handleOAuthRegister}
              className="w-full bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] hover:opacity-90 text-white py-6 text-lg"
              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
            >
              {t('إنشاء حساب جديد', 'Create New Account')}
            </Button>

            {/* Features */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#846F9C] to-[#4691A9] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('بيع وشراء المنتجات الرقمية', 'Buy and sell digital products')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#4691A9] to-[#89A58F] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('تقديم وطلب الخدمات المتخصصة', 'Offer and request specialized services')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#846F9C] to-[#89A58F] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p 
                  className="text-sm text-gray-600"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('إيجاد فرص العمل الحر', 'Find freelance job opportunities')}
                </p>
              </div>
            </div>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p 
                className="text-sm text-gray-600"
                style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
              >
                {t('لديك حساب بالفعل؟', 'Already have an account?')}{' '}
                <Button
                  variant="link"
                  onClick={() => setLocation('/auth/login')}
                  className="p-0 h-auto text-[#4691A9] hover:text-[#846F9C]"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('تسجيل الدخول', 'Login')}
                </Button>
              </p>
            </div>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p 
                className="text-xs text-gray-500 text-center"
                style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
              >
                {t(
                  'تسجيلك آمن ومحمي. نحن نحترم خصوصيتك ونحمي بياناتك',
                  'Your registration is secure and protected. We respect your privacy and protect your data'
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="text-gray-600 hover:text-gray-900"
            style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
          >
            {t('← العودة للصفحة الرئيسية', '← Back to Home')}
          </Button>
        </div>
      </div>
    </div>
  );
}

