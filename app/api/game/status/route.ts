import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

function isWithinSchedule(settings: Record<string, string>): boolean {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const start = settings.game_start_hour || '01:00';
  const end = settings.game_end_hour || '05:00';
  if (start <= end) return currentTime >= start && currentTime <= end;
  return currentTime >= start || currentTime <= end;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const wa = url.searchParams.get('wa');

    const { data: settingsRows } = await supabase.from('game_settings').select('*');
    const settings = settingsRows?.reduce((acc: any, s: any) => { acc[s.key] = s.value; return acc; }, {}) || {};

    if (settings.game_active !== 'true') {
      return NextResponse.json({ status: 'closed', message: 'Game sedang tidak aktif.' });
    }

    if (!isWithinSchedule(settings)) {
      const start = settings.game_start_hour || '01:00';
      const end = settings.game_end_hour || '05:00';
      return NextResponse.json({ status: 'closed', message: `Game aktif jam ${start} - ${end}.` });
    }

    const today = new Date().toISOString().split('T')[0];
    const maxWinners = parseInt(settings.game_max_winners || '1');

    const { count: todayWinners } = await supabase
      .from('game_daily_winners')
      .select('*', { count: 'exact', head: true })
      .eq('tanggal', today);

    if ((todayWinners || 0) >= maxWinners) {
      const { data: winner } = await supabase
        .from('game_daily_winners')
        .select('nama, waktu_menang')
        .eq('tanggal', today)
        .order('waktu_menang', { ascending: false })
        .limit(1)
        .single();
      return NextResponse.json({
        status: 'winner_exists',
        winner: winner?.nama || 'Pemenang',
        waktu: winner?.waktu_menang || '',
        message: 'Semua kuota pemenang hari ini sudah terpenuhi.'
      });
    }

    if (wa) {
      const { count } = await supabase
        .from('game_players')
        .select('*', { count: 'exact', head: true })
        .eq('whatsapp', wa)
        .eq('play_date', today);

      if ((count || 0) > 0) {
        return NextResponse.json({ status: 'already_played', message: 'Kamu sudah bermain hari ini.' });
      }
    }

    const difficulty = settings.game_difficulty || 'medium';
    const timer = parseInt(settings.game_timer || (difficulty === 'easy' ? '60' : difficulty === 'hard' ? '30' : '45'));
    const lives = parseInt(settings.game_lives || '3');
    const pairs = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 8 : 6;

    return NextResponse.json({
      status: 'open',
      message: 'Game aktif!',
      difficulty,
      timer,
      lives,
      pairs,
      maxWinners,
      currentWinners: todayWinners || 0
    });

  } catch (error) {
    console.error('Game status error:', error);
    return NextResponse.json({ status: 'closed', message: 'Terjadi kesalahan sistem.' });
  }
}
