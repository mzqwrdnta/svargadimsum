import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import ReviewList from './ReviewList';
import { adminStyles } from '../styles';

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });

  async function deleteReview(id: string) {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('reviews').delete().eq('id', id);
    revalidatePath('/admin/reviews');
    revalidatePath('/');
  }

  async function toggleVisibility(id: string, currentStatus: boolean) {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('reviews').update({ is_visible: !currentStatus }).eq('id', id);
    revalidatePath('/admin/reviews');
    revalidatePath('/');
  }

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Reviews & Testimonials</h1>
            <p className="admin-page-subtitle">Manage customer reviews and control visibility on the landing page</p>
          </div>
        </div>
        <ReviewList initialItems={reviews || []} deleteReview={deleteReview} toggleVisibility={toggleVisibility} />
      </div>
    </>
  );
}
