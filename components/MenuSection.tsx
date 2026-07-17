import MenuSectionClient from './MenuSectionClient';
import { createClient } from '@/utils/supabase/server';

export default async function MenuSection({ isDashboard = false }: { isDashboard?: boolean }) {
  const supabase = await createClient();
  const { data: menuItems } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
  const { data: outlets } = await supabase.from('outlets').select('*').order('sort_order', { ascending: true });

  return <MenuSectionClient 
    isDashboard={isDashboard} 
    menuItems={menuItems || []} 
    outlets={outlets || []} 
  />;
}
