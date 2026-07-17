import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import OutletList from './OutletList';
import { adminStyles } from '../styles';

export default async function OutletsPage() {
  const supabase = await createClient();
  const { data: outlets } = await supabase.from('outlets').select('*').order('sort_order', { ascending: true });

  async function deleteOutlet(id: string) {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('outlets').delete().eq('id', id);
    revalidatePath('/admin/outlets');
    revalidatePath('/');
    revalidatePath('/outlet');
  }

  async function saveOutlet(formData: FormData) {
    'use server';
    const supabaseServer = await createClient();
    const id = formData.get('id') as string;
    const data = {
      slug: formData.get('slug') as string,
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      hours: formData.get('hours') as string,
      phone: formData.get('phone') as string,
      map_url: formData.get('map_url') as string,
      image: formData.get('image') as string,
      description: formData.get('description') as string,
      is_active: formData.get('is_active') === 'on',
    };
    if (id) {
      await supabaseServer.from('outlets').update(data).eq('id', id);
    } else {
      await supabaseServer.from('outlets').insert(data);
    }
    revalidatePath('/admin/outlets');
    revalidatePath('/');
    revalidatePath('/outlet');
  }

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Outlets Management</h1>
            <p className="admin-page-subtitle">Manage your restaurant branches and locations</p>
          </div>
        </div>
        <OutletList initialItems={outlets || []} deleteOutlet={deleteOutlet} saveOutlet={saveOutlet} />
      </div>
    </>
  );
}
