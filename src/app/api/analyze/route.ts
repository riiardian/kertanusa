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

    // Pastikan ada parameter citra atau sampel yang dikirim (mencegah spam entri kosong)
    if (!imageData && !sampleKey && !imageKeyword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Parameter imageData atau sampleKey diperlukan untuk pemindaian.' 
        }, 
        { status: 400 }
      );
    }

    // Validasi & Sanitasi Ukuran Payload Gambar (Maksimal 12 MB) & Mitigasi SSRF
    let isValidImageFormat = false;
    if (imageData && typeof imageData === 'string') {
      if (imageData.length > 16_000_000) {
        return NextResponse.json(
          { success: false, message: 'Ukuran file citra terlalu besar. Maksimal 10 MB.' },
          { status: 413 }
        );
      }

      // Mitigasi SSRF: Hanya izinkan data URI base64 gambar, tolak skema URL eksternal / internal
      if (imageData.startsWith('data:image/')) {
        isValidImageFormat = true;
      } else if (imageData.startsWith('http://') || imageData.startsWith('https://') || imageData.startsWith('//') || imageData.startsWith('file://')) {
        return NextResponse.json(
          { success: false, message: 'Format gambar tidak diizinkan. Harap unggah berkas citra secara langsung (Base64 Data URI).' },
          { status: 400 }
        );
      }
    }

    const cleanCropName = sanitizeText(cropName, 80);
    const cleanSampleKey = sanitizeText(sampleKey || imageKeyword, 50);

    let result;
    if (isValidImageFormat && imageData) {
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
