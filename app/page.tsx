import { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import GameGuide from '@/components/GameGuide';
import OrderGuide from '@/components/OrderGuide';
import MenuSection from '@/components/MenuSection';
import TestimonialSlider from '@/components/TestimonialSlider';
import ReviewSection from '@/components/ReviewSection';

export const metadata: Metadata = {
  title: 'Home | Svarga Dimsum',
  description: 'Rasakan kelezatan dimsum pilihan dengan bahan terbaik dan rasa yang otentik. Tersedia dimsum mentai, ayam, ikan, dan paket kombo.',
};

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Svarga Dimsum - Beranda</h1>
      <HeroSection />
      <AboutSection />
      <OrderGuide />
      <MenuSection isDashboard={true} />
      <GameGuide />
      <ReviewSection />
    </>
  );
}
