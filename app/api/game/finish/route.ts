import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.whatsapp) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap.' }, { status: 400 });
    }

    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    const { data: settingsRows } = await supabase.from('game_settings').select('*');
    const settings = settingsRows?.reduce((acc: any, s: any) => { acc[s.key] = s.value; return acc; }, {}) || {};
    const maxWinners = parseInt(settings.game_max_winners || '1');

    const { count: currentWinners } = await supabase
      .from('game_daily_winners')
      .select('*', { count: 'exact', head: true })
      .eq('tanggal', today);

    if ((currentWinners || 0) >= maxWinners) {
      await supabase.from('game_players').update({ status: 'lost_max_reached' })
        .eq('whatsapp', data.whatsapp).eq('play_date', today);
      return NextResponse.json({
        success: false,
        message: `Maaf, kuota pemenang hari ini sudah penuh (${maxWinners} orang). Coba lagi besok!`
      });
    }

    const { data: vouchers, error: voucherError } = await supabase
      .from('game_vouchers')
      .select('*')
      .eq('status', 'unused')
      .limit(1);

    if (voucherError || !vouchers || vouchers.length === 0) {
      await supabase.from('game_players').update({ status: 'failed_no_voucher' })
        .eq('whatsapp', data.whatsapp).eq('play_date', today);
      return NextResponse.json({
        success: false,
        message: 'Mohon maaf, kuota voucher hari ini sudah habis.'
      });
    }

    const voucher = vouchers[0];

    const { error: updateError } = await supabase.from('game_vouchers').update({
      status: 'used',
      claimed_by: data.whatsapp,
      claimed_at: new Date().toISOString()
    }).eq('id', voucher.id).eq('status', 'unused');

    if (updateError) {
      await supabase.from('game_players').update({ status: 'failed_concurrent' })
        .eq('whatsapp', data.whatsapp).eq('play_date', today);
      return NextResponse.json({
        success: false,
        message: 'Terjadi pertandingan bersamaan. Silahkan coba lagi.'
      });
    }

    await supabase.from('game_daily_winners').insert([{
      tanggal: today,
      nama: data.name,
      whatsapp: data.whatsapp,
      voucher_code: voucher.code,
      ip: data.ip || 'Unknown',
      device_type: data.deviceType || 'Unknown',
      browser: data.browser || 'Unknown',
      os: data.os || 'Unknown',
      user_agent: data.userAgent || 'Unknown',
      play_duration: data.duration || 0
    }]);

    await supabase.from('game_players').update({ status: 'won' })
      .eq('whatsapp', data.whatsapp).eq('play_date', today);

    return NextResponse.json({
      success: true,
      isWinner: true,
      voucher: voucher.code,
      message: 'Selamat! Anda memenangkan voucher.'
    });

  } catch (error) {
    console.error('Game finish error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}
