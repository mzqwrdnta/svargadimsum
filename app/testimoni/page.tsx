import { Metadata } from 'next';
import TestimonialSlider from '@/components/TestimonialSlider';
import ReviewSection from '@/components/ReviewSection';

export const metadata: Metadata = {
  title: 'Testimoni Pelanggan | Svarga Dimsum',
  description: 'Apa kata pelanggan tentang kelezatan Svarga Dimsum? Baca ulasan jujur dari para pecinta dimsum kami.',
};

export default function TestimoniPage() {
  return (
    <>
      <h1 className="sr-only">Testimoni Pelanggan Svarga Dimsum</h1>
      <div style={{ paddingTop: '8rem' }}>
        <ReviewSection />
      </div>
    </>
  );
}
