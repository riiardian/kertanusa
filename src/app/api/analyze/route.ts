import { NextResponse } from 'next/server';
import { analyzeCropImage, analyzeImageWithAI, DISEASE_LIBRARY } from '@/lib/vision_ai';
import { addScanRecord, getAllScans } from '@/lib/db';

export async function GET() {
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
    const body = await request.json();
    const { imageData, imageKeyword, sampleKey, cropName } = body;

    let result;
    if (imageData && typeof imageData === 'string' && (imageData.startsWith('data:image/') || imageData.length > 100)) {
      // Panggil AI Multimodal Vision asli di server!
      result = await analyzeImageWithAI(imageData, cropName);
    } else {
      // Fallback ke simulasi preset sampel
      result = analyzeCropImage(sampleKey || imageKeyword || 'antraknosa', cropName);
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
