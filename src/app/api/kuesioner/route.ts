import { NextResponse } from 'next/server';
import { getAllKuesioner, addKuesioner } from '@/lib/db';
import { getClientIp, checkRateLimit } from '@/lib/rate_limiter';
import { sanitizeText } from '@/lib/sanitize';
import { KuesionerRecord } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip, 'kuesioner_get', 60, 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: 'Terlalu banyak permintaan data. Tunggu sejenak.' },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
      );
    }

    const data = getAllKuesioner();

    // Kalkulasi agregat metrik untuk panel statistik UAT
    const total = data.length;
    const avgKemudahan = total > 0 
      ? Number((data.reduce((acc, curr) => acc + curr.skor_kemudahan, 0) / total).toFixed(1)) 
      : 5.0;

    const akurasiAkuratCount = data.filter(d => d.akurasi_fitur === 'Sangat Akurat' || d.akurasi_fitur === 'Cukup Akurat').length;
    const persentasePuas = total > 0 ? Math.round((akurasiAkuratCount / total) * 100) : 100;

    return NextResponse.json({
      success: true,
      data,
      stats: {
        total_responden: total,
        rata_rata_kemudahan: avgKemudahan,
        persentase_kepuasan: persentasePuas
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat data kuesioner' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: Maksimal 10 submisi kuesioner per menit per IP
    const rate = checkRateLimit(ip, 'kuesioner_post', 10, 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: `Batas pengiriman survei tercapai. Silakan coba lagi dalam ${rate.resetInSeconds} detik.` },
        { status: 429, headers: { 'Retry-After': String(rate.resetInSeconds) } }
      );
    }

    const body = await request.json();
    const { 
      nama, 
      profesi, 
      skor_kemudahan, 
      akurasi_fitur, 
      fitur_favorit, 
      masukan 
    } = body;

    const cleanNama = sanitizeText(nama, 80) || 'Pengguna Terverifikasi';
    
    const validProfesi: KuesionerRecord['profesi'][] = [
      'Petani',
      'Penyuluh Pertanian',
      'Akademisi / Peneliti',
      'Mahasiswa',
      'Masyarakat Umum'
    ];
    const cleanProfesi = validProfesi.includes(profesi) ? profesi : 'Masyarakat Umum';

    const cleanSkor = Math.min(5, Math.max(1, Number(skor_kemudahan) || 5));

    const validAkurasi: KuesionerRecord['akurasi_fitur'][] = [
      'Sangat Akurat',
      'Cukup Akurat',
      'Perlu Peningkatan'
    ];
    const cleanAkurasi = validAkurasi.includes(akurasi_fitur) ? akurasi_fitur : 'Sangat Akurat';

    const cleanFitur = sanitizeText(fitur_favorit, 80) || 'Scan AI Penyakit';
    const cleanMasukan = sanitizeText(masukan, 1000);

    if (!cleanMasukan || cleanMasukan.length < 5) {
      return NextResponse.json(
        { success: false, message: 'Mohon tuliskan masukan atau ulasan minimal 5 karakter.' },
        { status: 400 }
      );
    }

    const saved = addKuesioner({
      nama: cleanNama,
      profesi: cleanProfesi,
      skor_kemudahan: cleanSkor,
      akurasi_fitur: cleanAkurasi,
      fitur_favorit: cleanFitur,
      masukan: cleanMasukan
    });

    return NextResponse.json({
      success: true,
      message: 'Terima kasih! Umpan balik Anda berhasil dicatat dalam data riset validasi Kertanusa.',
      data: saved
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menyimpan ulasan kuesioner' }, { status: 500 });
  }
}
