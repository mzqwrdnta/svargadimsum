'use client';

import { usePathname } from 'next/navigation';
import Preloader from '@/components/Preloader';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Preloader />
      <Header />
      <main>{children}</main>
      <CartSidebar />
    </>
  );
}
