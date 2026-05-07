import { Metadata } from 'next';
import AboutSection from '@/components/AboutSection';

export const metadata: Metadata = {
  title: 'Tentang Kami | Svarga Dimsum',
  description: 'Pelajari lebih lanjut tentang Svarga Dimsum, sejarah kami, dan komitmen kami untuk menyajikan dimsum berkualitas terbaik di Depok.',
};

export default function TentangPage() {
  return (
    <>
      <h1 className="sr-only">Tentang Svarga Dimsum</h1>
      <div style={{ paddingTop: '8rem' }}>
        <AboutSection />
      </div>
    </>
  );
}
