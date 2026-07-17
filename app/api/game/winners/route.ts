import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('game_daily_winners')
      .select('id, tanggal, nama, voucher_code, waktu_menang')
      .order('waktu_menang', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ winners: [] });
    }

    return NextResponse.json({ winners: data || [] });

  } catch (error) {
    return NextResponse.json({ winners: [] });
  }
}
