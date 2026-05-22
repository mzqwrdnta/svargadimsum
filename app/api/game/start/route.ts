import { NextRequest, NextResponse } from 'next/server';
import { postToGameApi } from '@/lib/game-api';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, whatsapp, kota, instagram } = body;

    if (!nama || !whatsapp) {
      return NextResponse.json({ success: false, message: 'Nama and WhatsApp are required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ success: false, message: 'Terlalu banyak permintaan. Coba lagi nanti.' }, { status: 429 });
    }

    const data = await postToGameApi('start', {
      nama,
      whatsapp,
      kota,
      instagram,
      ip
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Game start error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
