import { createClient } from '@supabase/supabase-js';

export async function generateStaticParams() {
  // Use a standard Supabase client without cookies for build-time generation
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: outlets } = await supabase.from('outlets').select('slug').eq('is_active', true);
  
  return (outlets || []).map((outlet) => ({
    slug: outlet.slug,
  }));
}
