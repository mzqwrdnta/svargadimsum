import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('game_daily_winners')
      .select('nama, waktu_menang, voucher_code')
      .eq('tanggal', today)
      .order('waktu_menang', { ascending: false });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ winners: [], count: 0 });
    }

    return NextResponse.json({
      winners: data,
      count: data.length
    });

  } catch (error) {
    return NextResponse.json({ winners: [], count: 0 });
  }
}
