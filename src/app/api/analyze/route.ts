import { NextResponse } from 'next/server';
import { analyzeCropImage, analyzeImageWithAI, DISEASE_LIBRARY } from '@/lib/vision_ai';
import { addScanRecord, getAllScans } from '@/lib/db';
import { getClientIp, checkRateLimit } from '@/lib/rate_limiter';
import { sanitizeText } from '@/lib/sanitize';

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip, 'scan_get', 60, 60);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, message: 'Terlalu banyak permintaan. Silakan tunggu sejenak.' },
      { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
    );
  }

  const scans = getAllScans();
  return NextResponse.json({
    success: true,
    samples: Object.keys(DISEASE_LIBRARY).map(k => ({
      key: k,
      nama_masalah: DISEASE_LIBRARY[k].nama_masalah,
      tanaman: DISEASE_LIBRARY[k].nama_tanaman
    })),
    riwayat: scans
  });
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    
    // Rate limit: Maksimal 12 analisis per menit per IP (mencegah DoS & pembengkakan kuota AI)
    const rate = checkRateLimit(ip, 'scan_post', 12, 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Batas kuota pemindaian per menit tercapai. Silakan coba lagi dalam ${rate.resetInSeconds} detik.` 
        },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
      );
    }

    const body = await request.json();
    const { imageData, imageKeyword, sampleKey, cropName } = body;

    // Validasi & Sanitasi Ukuran Payload Gambar (Maksimal 12 MB)
    if (imageData && typeof imageData === 'string') {
      if (imageData.length > 16_000_000) {
        return NextResponse.json(
          { success: false, message: 'Ukuran file citra terlalu besar. Maksimal 10 MB.' },
          { status: 413 }
        );
      }
    }

    const cleanCropName = sanitizeText(cropName, 80);
    const cleanSampleKey = sanitizeText(sampleKey || imageKeyword, 50);

    let result;
    if (imageData && typeof imageData === 'string' && (imageData.startsWith('data:image/') || imageData.length > 100)) {
      // Panggil AI Multimodal Vision asli di server
      result = await analyzeImageWithAI(imageData, cleanCropName);
    } else {
      // Fallback ke simulasi preset sampel
      result = analyzeCropImage(cleanSampleKey || 'antraknosa', cleanCropName);
    }

    addScanRecord(result);

    return NextResponse.json({
      success: true,
      message: 'Pemindaian citra tanaman berhasil dianalisis!',
      data: result
    });
  } catch (error) {
    console.error('API analyze error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memproses analisis gambar.' }, { status: 500 });
  }
}
