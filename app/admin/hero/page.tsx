import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import HeroList from './HeroList';
import { adminStyles } from '../styles';

export default async function HeroPage() {
  const supabase = await createClient();
  const { data: slides } = await supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });

  async function deleteSlide(id: string) {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('hero_slides').delete().eq('id', id);
    revalidatePath('/admin/hero');
    revalidatePath('/');
  }

  async function saveSlide(formData: FormData) {
    'use server';
    const supabaseServer = await createClient();
    const id = formData.get('id') as string;
    const data = {
      product_name: formData.get('product_name') as string,
      image: formData.get('image') as string,
      is_active: formData.get('is_active') === 'on',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    };
    if (id) {
      await supabaseServer.from('hero_slides').update(data).eq('id', id);
    } else {
      await supabaseServer.from('hero_slides').insert(data);
    }
    revalidatePath('/admin/hero');
    revalidatePath('/');
  }

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Hero Slides</h1>
            <p className="admin-page-subtitle">Manage homepage hero carousel images</p>
          </div>
        </div>
        <HeroList initialItems={slides || []} deleteSlide={deleteSlide} saveSlide={saveSlide} />
      </div>
    </>
  );
}
