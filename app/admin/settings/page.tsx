import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { adminStyles } from '../styles';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*');

  const settingsObj = settings?.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};

  const defaultSocialLinks = [
    { name: 'WhatsApp Admin', icon: 'fa-whatsapp', url: 'https://wa.me/6282123149872', color: '#25D366' },
    { name: 'GoFood', icon: 'fa-motorcycle', url: 'https://gofood.co.id/', color: '#EE2737' },
    { name: 'GrabFood', icon: 'fa-motorcycle', url: 'https://food.grab.com/', color: '#00B14F' },
    { name: 'ShopeeFood', icon: 'fa-utensils', url: 'https://shopee.co.id/m/shopeefood', color: '#EE4D2D' },
    { name: 'Instagram', icon: 'fa-instagram', url: 'https://www.instagram.com/svarga.foodies/', color: '#E4405F' },
    { name: 'Lokasi Outlet', icon: 'fa-map-marker-alt', url: '/outlet', color: '#3578E5' },
  ];

  const socialLinks = settingsObj.social_links || defaultSocialLinks;
  const contactInfo = settingsObj.contact_info || { address: 'Jl. Raya Abdul Gani No.2 Blok B, Depok', phone: '+62 852-1396-3005', email: 'hello@svargadimsum.com' };
  const promoImage = settingsObj.promo_image || '/img/poster.jpg';

  async function saveSettings(formData: FormData) {
    'use server';
    const supabaseServer = await createClient();

    const socialLinksData = [];
    let i = 0;
    while (formData.get(`social_name_${i}`)) {
      socialLinksData.push({
        name: formData.get(`social_name_${i}`),
        url: formData.get(`social_url_${i}`),
        icon: formData.get(`social_icon_${i}`),
        color: formData.get(`social_color_${i}`)
      });
      i++;
    }

    const contactInfoData = {
      address: formData.get('contact_address'),
      phone: formData.get('contact_phone'),
      email: formData.get('contact_email')
    };

    const promoImageData = formData.get('promo_image');

    await supabaseServer.from('site_settings').upsert([
      { key: 'social_links', value: socialLinksData },
      { key: 'contact_info', value: contactInfoData },
      { key: 'promo_image', value: promoImageData }
    ], { onConflict: 'key' });

    revalidatePath('/admin/settings');
    revalidatePath('/');
    revalidatePath('/link');
  }

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Site Settings</h1>
            <p className="admin-page-subtitle">Manage social links, contact info, and promo images</p>
          </div>
        </div>

        <form action={saveSettings}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Promo Popup Image</div>
              </div>
              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label className="admin-label">Image URL</label>
                  <input type="text" name="promo_image" defaultValue={promoImage as string} className="admin-input" />
                </div>
                {promoImage && <img src={promoImage as string} alt="Promo Preview" style={{ height: '80px', borderRadius: '8px', border: '1px solid #f1f5f9' }} />}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Contact Information</div>
              </div>
              <div className="admin-card-body">
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Address</label>
                    <input type="text" name="contact_address" defaultValue={contactInfo.address} className="admin-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Phone</label>
                    <input type="text" name="contact_phone" defaultValue={contactInfo.phone} className="admin-input" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Email</label>
                  <input type="text" name="contact_email" defaultValue={contactInfo.email} className="admin-input" />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Social Links</div>
              </div>
              <div className="admin-card-body">
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>These links appear on the /link page and footer.</p>
                {socialLinks.map((link: any, i: number) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <input type="text" name={`social_name_${i}`} defaultValue={link.name} placeholder="Name" className="admin-input" />
                    <input type="text" name={`social_url_${i}`} defaultValue={link.url} placeholder="URL" className="admin-input" />
                    <input type="text" name={`social_icon_${i}`} defaultValue={link.icon} placeholder="Icon" className="admin-input" style={{ width: '100px' }} />
                    <input type="color" name={`social_color_${i}`} defaultValue={link.color} style={{ width: '36px', height: '36px', padding: '2px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' }} />
                  </div>
                ))}
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>To add/remove links, use the database editor.</p>
              </div>
            </div>

            <div>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '12px 32px', fontSize: '14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
                Save All Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
