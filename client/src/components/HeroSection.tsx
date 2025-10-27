import { useRef, useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { t, direction } = useLanguage();
  const dir = direction;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false); // Start with sound ON as per requirements

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Auto-play prevented:', err);
        // If autoplay is blocked, mute and try again
        videoRef.current!.muted = true;
        setIsMuted(true);
        videoRef.current!.play();
      });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-white py-16 md:py-20 overflow-hidden">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Right Side (Arabic) / Left Side (English) - Content */}
          <div className={`flex flex-col gap-6 ${dir === 'rtl' ? 'lg:order-1' : 'lg:order-1'}`}>
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <img
                src="/logo.png"
                alt="OSDM Logo"
                className="h-32 w-32 object-contain"
              />
            </div>

            {/* Platform Name - Centered */}
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-center"
              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
            >
              <span className="bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent">
                OSDM
              </span>
            </h1>

            {/* Tagline - With gradient colors */}
            <h2 
              className="text-2xl md:text-3xl font-semibold text-center bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent"
              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
            >
              {t('السوق الرقمي ذو المحطة الواحدة', 'One Stop Digital Market')}
            </h2>

            {/* Description - With gradient colors */}
            <p 
              className="text-lg md:text-xl text-center leading-relaxed bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent font-medium"
              style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
            >
              {t(
                'منصة سعودية رائدة تجمع كل ما تحتاجه من منتجات وخدمات وفرص عمل رقمية تحت سقف واحد',
                'A leading Saudi platform that brings together all your digital products, services, and job opportunities under one roof'
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#markets">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 py-6 font-semibold bg-gradient-to-r from-[#846F9C] to-[#4691A9] hover:opacity-90 transition-opacity text-white shadow-lg"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('استكشف الآن', 'Explore Now')}
                </Button>
              </a>
              <Link href="/auth/register">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 py-6 font-semibold bg-gradient-to-r from-[#4691A9] to-[#89A58F] hover:opacity-90 transition-opacity text-white shadow-lg"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('ابدأ البيع والشراء', 'Start Selling & Buying')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 mt-4">
              <div className="text-center">
                <div 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#846F9C] to-[#4691A9] bg-clip-text text-transparent"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  +200
                </div>
                <div 
                  className="text-sm md:text-base text-gray-600 mt-1"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('منتج رقمي', 'Digital Product')}
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#4691A9] to-[#89A58F] bg-clip-text text-transparent"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  +500
                </div>
                <div 
                  className="text-sm md:text-base text-gray-600 mt-1"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('خدمة متخصصة', 'Specialized Service')}
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#846F9C] to-[#89A58F] bg-clip-text text-transparent"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  +1000
                </div>
                <div 
                  className="text-sm md:text-base text-gray-600 mt-1"
                  style={{ fontFamily: dir === 'rtl' ? 'DIN Next LT Arabic, sans-serif' : 'DIN Next LT Pro, sans-serif' }}
                >
                  {t('فرصة عمل', 'Job Opportunity')}
                </div>
              </div>
            </div>
          </div>

          {/* Left Side (Arabic) / Right Side (English) - Video */}
          <div className={`relative ${dir === 'rtl' ? 'lg:order-2' : 'lg:order-2'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full h-auto rounded-2xl"
                loop
                playsInline
                muted={isMuted}
                onEnded={() => {
                  // Restart video when it ends (backup for loop)
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                  }
                }}
              >
                <source src="/hero-video.mov" type="video/mp4" />
                <source src="/hero-video.mov" type="video/quicktime" />
                {t('متصفحك لا يدعم تشغيل الفيديو', 'Your browser does not support video playback')}
              </video>

              {/* Mute/Unmute Button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
                title={isMuted ? t('تفعيل الصوت', 'Unmute') : t('كتم الصوت', 'Mute')}
              >
                {isMuted ? (
                  <VolumeX className="h-6 w-6 text-[#846F9C]" />
                ) : (
                  <Volume2 className="h-6 w-6 text-[#4691A9]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#846F9C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4691A9]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#89A58F]/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}

