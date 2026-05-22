import { NextRequest, NextResponse } from 'next/server';
import { fetchFromGameApi } from '@/lib/game-api';

export async function GET() {
  try {
    const data = await fetchFromGameApi({ action: 'winner' });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Game winner fetch error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
