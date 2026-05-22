import { NextRequest, NextResponse } from 'next/server';
import { postToGameApi } from '@/lib/game-api';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, whatsapp, duration } = body;

    if (!nama || !whatsapp) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ success: false, message: 'Terlalu banyak permintaan. Coba lagi nanti.' }, { status: 429 });
    }

    // Anti-cheat: memory game with 8 pairs in < 5 seconds is highly suspicious
    if (duration && duration < 5) {
      return NextResponse.json({ success: false, message: 'Impossible solve time' }, { status: 403 });
    }

    const data = await postToGameApi('finish', {
      nama,
      whatsapp,
      ip,
      duration
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Game finish error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
