import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import MenuList from './MenuList';
import { adminStyles } from '../styles';

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: menuItems } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });

  async function deleteMenu(id: string) {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('menu_items').delete().eq('id', id);
    revalidatePath('/admin/menu');
    revalidatePath('/');
    revalidatePath('/menu');
  }

  async function saveMenu(formData: FormData) {
    'use server';
    const supabaseServer = await createClient();
    const id = formData.get('id') as string;
    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: parseInt(formData.get('price') as string),
      image: formData.get('image') as string,
      description: formData.get('description') as string,
      is_best_seller: formData.get('is_best_seller') === 'on',
      order_name: formData.get('order_name') as string,
    };
    if (id) {
      await supabaseServer.from('menu_items').update(data).eq('id', id);
    } else {
      await supabaseServer.from('menu_items').insert(data);
    }
    revalidatePath('/admin/menu');
    revalidatePath('/');
    revalidatePath('/menu');
  }

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Menu Management</h1>
            <p className="admin-page-subtitle">Manage your dimsum products, prices, and categories</p>
          </div>
        </div>
        <MenuList initialItems={menuItems || []} deleteMenu={deleteMenu} saveMenu={saveMenu} />
      </div>
    </>
  );
}
