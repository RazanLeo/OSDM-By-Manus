import { useRef, useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { t, direction } = useLanguage();
  const dir = direction;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
          await videoRef.current.play();
          setIsMuted(false);
          setIsPlaying(true);
        } catch (err) {
          try {
            videoRef.current.muted = true;
            await videoRef.current.play();
            setIsMuted(true);
            setIsPlaying(true);
          } catch (err2) {
            console.error('Video play failed:', err2);
          }
        }
      }
    };

    const timer = setTimeout(playVideo, 200);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-white py-16 md:py-20 overflow-hidden">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className={`flex flex-col gap-6 ${dir === 'rtl' ? 'lg:order-1' : 'lg:order-1'}`}>
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src="/logo.png"
                alt="OSDM Logo"
                className="h-48 w-48 md:h-56 md:w-56 object-contain"
              />
            </div>

            {/* Platform Name */}
            <h1 
              className="text-4xl md:text-5xl font-bold text-center"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              <span className="bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent">
                OSDM
              </span>
            </h1>

            {/* Tagline */}
            <h2 
              className="text-xl md:text-2xl font-semibold text-center bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
            >
              {t('السوق الرقمي ذو المحطة الواحدة', 'One Stop Digital Market')}
            </h2>

            {/* Description */}
            <p 
              className="text-base md:text-lg text-center leading-relaxed bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent font-medium"
              style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
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
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('استكشف الآن', 'Explore Now')}
                </Button>
              </a>
              <Link href="/auth/register">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 py-6 font-semibold bg-gradient-to-r from-[#4691A9] to-[#89A58F] hover:opacity-90 transition-opacity text-white shadow-lg"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
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
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  +200
                </div>
                <div 
                  className="text-sm md:text-base text-gray-600 mt-1"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('منتج رقمي', 'Digital Product')}
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#4691A9] to-[#89A58F] bg-clip-text text-transparent"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  +500
                </div>
                <div 
                  className="text-sm md:text-base text-gray-600 mt-1"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('خدمة متخصصة', 'Specialized Service')}
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#846F9C] to-[#89A58F] bg-clip-text text-transparent"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  +1000
                </div>
                <div 
                  className="text-sm md:text-base text-gray-600 mt-1"
                  style={{ fontFamily: dir === 'rtl' ? 'Cairo, Tajawal, sans-serif' : 'Inter, sans-serif' }}
                >
                  {t('فرصة عمل', 'Job Opportunity')}
                </div>
              </div>
            </div>
          </div>

          {/* Video Side - LARGE SIZE */}
          <div className={`relative ${dir === 'rtl' ? 'lg:order-2' : 'lg:order-2'}`}>
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
              onClick={togglePlayPause}
            >
              <video
                ref={videoRef}
                className="w-full h-auto rounded-2xl"
                loop
                playsInline
                autoPlay
                preload="auto"
                muted={isMuted}
              >
                <source src="/hero-video.mov" type="video/mp4" />
                <source src="/hero-video.mov" type="video/quicktime" />
              </video>

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-white/90 rounded-full p-6 shadow-xl">
                    <Play className="h-12 w-12 text-[#4691A9]" />
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6 text-[#846F9C]" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-[#4691A9]" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                  className="p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-[#89A58F]" />
                  ) : (
                    <Play className="h-6 w-6 text-[#89A58F]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#846F9C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4691A9]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#89A58F]/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}

