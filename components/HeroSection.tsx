import HeroSectionClient from './HeroSectionClient';
import { createClient } from '@/utils/supabase/server';

export default async function HeroSection() {
  const supabase = await createClient();
  const { data: slides } = await supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order', { ascending: true });

  // Default fallback if no slides exist in DB yet
  const defaultSlides = [
    { image: '/img/dimsum_ori.png', product_name: 'Dimsum Ori' },
    { image: '/img/Dumpling.png', product_name: 'Dumpling Ayam' },
    { image: '/img/dimsum_mentai.png', product_name: 'Dimsum Mentai' }
  ];

  const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  return <HeroSectionClient slides={activeSlides} />;
}
