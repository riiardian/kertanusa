import { NextResponse } from 'next/server';
import { COMMODITY_TRENDS, calculateProfitProjection } from '@/lib/market_demand';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const luas = searchParams.get('luas');
    const komoditas = searchParams.get('komoditas');

    let projection = null;
    if (luas && komoditas) {
      projection = calculateProfitProjection(Number(luas), komoditas);
    }

    return NextResponse.json({
      success: true,
      tren_komoditas: COMMODITY_TRENDS,
      proyeksi: projection
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat analisis pasar' }, { status: 500 });
  }
}
