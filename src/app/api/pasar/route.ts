import { NextResponse } from 'next/server';
import { COMMODITY_TRENDS, calculateProfitProjection } from '@/lib/market_demand';
import { getClientIp, checkRateLimit } from '@/lib/rate_limiter';
import { sanitizeText, sanitizeNumeric } from '@/lib/sanitize';

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip, 'pasar_get', 60, 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: 'Terlalu banyak permintaan data pasar.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const luas = sanitizeNumeric(searchParams.get('luas'), 1, 10_000_000);
    const komoditas = sanitizeText(searchParams.get('komoditas'), 80);

    let projection = null;
    if (luas && komoditas) {
      projection = calculateProfitProjection(luas, komoditas);
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
