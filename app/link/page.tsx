import { createClient } from '@/utils/supabase/server';
import LinksPageClient from './LinksPageClient';

export default async function LinksPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*');
  const { data: menuItems } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
  
  const settingsObj = settings?.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};

  const defaultSocialLinks = [
    { name: 'Website Utama', icon: 'fa-globe', url: '/', color: '#FF6B35' },
    { name: 'WhatsApp Admin', icon: 'fa-whatsapp', url: 'https://wa.me/6282123149872', color: '#25D366' },
    { name: 'GoFood', icon: 'fa-motorcycle', url: 'https://gofood.co.id/', color: '#EE2737' },
    { name: 'GrabFood', icon: 'fa-motorcycle', url: 'https://food.grab.com/', color: '#00B14F' },
    { name: 'ShopeeFood', icon: 'fa-utensils', url: 'https://shopee.co.id/m/shopeefood', color: '#EE4D2D' },
    { name: 'Lokasi Outlet', icon: 'fa-map-marker-alt', url: '/outlet', color: '#3578E5' },
    { name: 'Instagram', icon: 'fa-instagram', url: 'https://www.instagram.com/svarga.foodies/', color: '#E4405F' },
  ];

  const socialLinks = settingsObj.social_links || defaultSocialLinks;

  return <LinksPageClient socialLinks={socialLinks} menuItems={menuItems || []} />;
}
