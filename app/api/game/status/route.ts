import { NextRequest, NextResponse } from 'next/server';
import { fetchFromGameApi } from '@/lib/game-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wa = searchParams.get('wa') || '';

    const data = await fetchFromGameApi({ action: 'status', wa });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Game status error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
