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

function parseUserAgent(ua: string | null): { browser: string; os: string; deviceType: string } {
  if (!ua) return { browser: 'Unknown', os: 'Unknown', deviceType: 'desktop' };
  const browser = ua.includes('Firefox') ? 'Firefox' : ua.includes('Edg') ? 'Edge' : ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : 'Other';
  const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'macOS' : ua.includes('Linux') ? 'Linux' : ua.includes('Android') ? 'Android' : ua.includes('iPhone') || ua.includes('iPad') ? 'iOS' : 'Other';
  const deviceType = /Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop';
  return { browser, os, deviceType };
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.whatsapp) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap.' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: settingsRows } = await supabase.from('game_settings').select('*');
    const settings = settingsRows?.reduce((acc: any, s: any) => { acc[s.key] = s.value; return acc; }, {}) || {};

    if (settings.game_active !== 'true') {
      return NextResponse.json({ success: false, message: 'Game sedang tidak aktif.' });
    }

    if (!isWithinSchedule(settings)) {
      const start = settings.game_start_hour || '01:00';
      const end = settings.game_end_hour || '05:00';
      return NextResponse.json({ success: false, message: `Game hanya aktif jam ${start} - ${end}.` });
    }

    const today = new Date().toISOString().split('T')[0];
    const { count: todayPlayers } = await supabase
      .from('game_players')
      .select('*', { count: 'exact', head: true })
      .eq('play_date', today);

    const maxWinners = parseInt(settings.game_max_winners || '1');
    if ((todayPlayers || 0) >= maxWinners) {
      return NextResponse.json({ success: false, message: 'Kesempatan hari ini sudah habis. Coba lagi besok!' });
    }

    const { count: alreadyPlayed } = await supabase
      .from('game_players')
      .select('*', { count: 'exact', head: true })
      .eq('whatsapp', data.whatsapp)
      .eq('play_date', today);

    if ((alreadyPlayed || 0) > 0) {
      return NextResponse.json({ success: false, message: 'Nomor WhatsApp ini sudah bermain hari ini.' });
    }

    const ua = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';
    const { browser, os, deviceType } = parseUserAgent(ua);

    const { error } = await supabase.from('game_players').insert([{
      nama: data.name,
      whatsapp: data.whatsapp,
      ip,
      user_agent: ua,
      browser,
      os,
      device_type: deviceType,
      status: 'playing',
      play_date: today
    }]);

    if (error) {
      console.error('Error starting game:', error);
      return NextResponse.json({ success: false, message: 'Gagal memulai game.' }, { status: 500 });
    }

    const difficulty = settings.game_difficulty || 'medium';
    const timer = parseInt(settings.game_timer || (difficulty === 'easy' ? '60' : difficulty === 'hard' ? '30' : '45'));
    const lives = parseInt(settings.game_lives || '3');
    const pairs = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 8 : 6;

    return NextResponse.json({
      success: true,
      difficulty,
      timer,
      lives,
      pairs,
      message: 'Game started'
    });

  } catch (error) {
    console.error('Game start error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
