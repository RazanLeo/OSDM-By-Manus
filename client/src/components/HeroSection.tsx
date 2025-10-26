import { useRef, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PLATFORM_INFO } from '@shared/constants';

export default function HeroSection() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-white py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="flex flex-col gap-8">
            {/* Platform Name */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#846F9C] via-[#4691A9] to-[#89A58F] bg-clip-text text-transparent">
                {PLATFORM_INFO.name}
              </span>
            </h1>

            {/* Tagline */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
              {t(PLATFORM_INFO.tagline.ar, PLATFORM_INFO.tagline.en)}
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {t(PLATFORM_INFO.description.ar, PLATFORM_INFO.description.en)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#markets">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 py-6 font-semibold"
                  style={{ backgroundColor: '#846F9C' }}
                >
                  {t('استكشف الأسواق', 'Explore Markets')}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 py-6 font-semibold border-2"
                  style={{ borderColor: '#4691A9', color: '#4691A9' }}
                >
                  {t('ابدأ البيع والشراء', 'Start Selling & Buying')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold" style={{ color: '#846F9C' }}>
                  1000+
                </div>
                <div className="text-sm md:text-base text-gray-600 mt-1">
                  {t('منتج رقمي', 'Digital Products')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold" style={{ color: '#4691A9' }}>
                  500+
                </div>
                <div className="text-sm md:text-base text-gray-600 mt-1">
                  {t('خدمة متخصصة', 'Specialized Services')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold" style={{ color: '#89A58F' }}>
                  200+
                </div>
                <div className="text-sm md:text-base text-gray-600 mt-1">
                  {t('فرصة عمل', 'Job Opportunities')}
                </div>
              </div>
            </div>
          </div>

          {/* Video Side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <video
                ref={videoRef}
                className="w-full h-full object-cover aspect-video"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                poster="/logo.png"
              >
                <source src="/hero-video.mov" type="video/quicktime" />
                <source src="/hero-video.mp4" type="video/mp4" />
                {t('متصفحك لا يدعم تشغيل الفيديو', 'Your browser does not support the video tag')}
              </video>

              {/* Video Controls */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={togglePlay}
                  className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                  aria-label={isPlaying ? t('إيقاف', 'Pause') : t('تشغيل', 'Play')}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={toggleMute}
                  className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                  aria-label={isMuted ? t('تشغيل الصوت', 'Unmute') : t('كتم الصوت', 'Mute')}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Decorative Elements */}
            <div 
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: '#846F9C' }}
            ></div>
            <div 
              className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: '#4691A9' }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

