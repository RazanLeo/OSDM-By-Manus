import { useRef, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PLATFORM_INFO } from '@shared/constants';

export default function HeroSection() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="container py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Right Side (Left in LTR): Content */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          {/* Logo */}
          <div className="flex justify-center lg:justify-start">
            <img 
              src="/logo.png" 
              alt="OSDM Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Platform Name */}
          <h1 className="text-5xl md:text-6xl font-bold gradient-text text-center lg:text-start">
            {PLATFORM_INFO.name}
          </h1>

          {/* Tagline */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 text-center lg:text-start">
            {t(PLATFORM_INFO.tagline.ar, PLATFORM_INFO.tagline.en)}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 text-center lg:text-start leading-relaxed">
            {t(PLATFORM_INFO.description.ar, PLATFORM_INFO.description.en)}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="#markets">
              <Button size="lg" className="bg-osdm-purple hover:bg-osdm-purple/90 text-white text-lg px-8">
                {t('استكشف الآن', 'Explore Now')}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-osdm-blue text-osdm-blue hover:bg-osdm-blue hover:text-white text-lg px-8">
                {t('ابدأ البيع والشراء', 'Start Buying & Selling')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Left Side (Right in LTR): Video */}
        <div className="relative order-1 lg:order-2">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="hero-video"
              autoPlay
              loop
              muted={isMuted}
              playsInline
            >
              <source src="/hero-video.mov" type="video/quicktime" />
              <source src="/hero-video.mp4" type="video/mp4" />
              {t('متصفحك لا يدعم تشغيل الفيديو', 'Your browser does not support the video tag')}
            </video>

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              aria-label={isMuted ? t('تشغيل الصوت', 'Unmute') : t('كتم الصوت', 'Mute')}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

