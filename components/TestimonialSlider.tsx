import TestimonialSliderClient from './TestimonialSliderClient';
import { createClient } from '@/utils/supabase/server';

export default async function TestimonialSlider() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order', { ascending: true });

  const defaultTestimonials = [
    { name: '@rina_kuliner', rating: '★★★★★', text: '"Pelayanan cepat dan ramah, rasanya otentik! Sangat direkomendasikan untuk pecinta dimsum."' },
    { name: '@dimas_foodie', rating: '★★★★★', text: '"Dimsum kejunya lumer dan juicy banget! Pasti bakal pesen lagi buat acara keluarga minggu depan."' },
    { name: '@sari_momlife', rating: '★★★★★', text: '"Cocok buat bekal anak-anak, pasti habis. Pilihan sehat dan praktis yang selalu ditunggu-tunggu."' },
    { name: '@andi_jkt', rating: '★★★★', text: '"Pengiriman cepat, packing sangat rapi dan aman. Dimsum masih hangat saat sampai. Recommended!"' }
  ];

  const activeTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return <TestimonialSliderClient testimonials={activeTestimonials} />;
}
