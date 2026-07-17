import ReviewSectionClient from './ReviewSectionClient';
import { createClient } from '@/utils/supabase/server';

export default async function ReviewSection() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  return <ReviewSectionClient initialReviews={reviews || []} />;
}
