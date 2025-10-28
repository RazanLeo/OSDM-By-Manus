import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import MarketsSection from '@/components/MarketsSection';
import WhyChooseOSDM from '@/components/WhyChooseOSDM';
import WhatYouNeed from '@/components/WhatYouNeed';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <MarketsSection />
      <WhyChooseOSDM />
      <WhatYouNeed />
      </main>
      <Footer />
    </div>
  );
}
