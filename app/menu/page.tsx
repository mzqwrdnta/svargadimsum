import { Metadata } from 'next';
import MenuSection from '@/components/MenuSection';

export const metadata: Metadata = {
  title: 'Menu Dimsum Premium | Mentai, Tar tar, Cheese Mayo & Party Size',
  description: 'Lihat semua pilihan menu dimsum premium dari Svarga Dimsum. Tersedia Dimsum Mentai creamy, Tartar segar, Cheese Mayo, dan Mix Platter. Halal & Higienis!',
  keywords: 'dimsum mentai, dimsum tartar, dimsum cheese mayo, dimsum party size, svarga dimsum menu, dimsum platter depok, harga dimsum svarga',
};

export default function MenuPage() {
  return (
    <>
      <h1 className="sr-only">Menu Svarga Dimsum</h1>
      <MenuSection isDashboard={false} />
    </>
  );
}
