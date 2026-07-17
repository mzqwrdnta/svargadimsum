import PromoPopupClient from './PromoPopupClient';
import { createClient } from '@/utils/supabase/server';

export default async function PromoPopup() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('value').eq('key', 'promo_image').single();

  const imageUrl = settings?.value || '/img/poster.jpg';

  return <PromoPopupClient imageUrl={imageUrl as string} />;
}
