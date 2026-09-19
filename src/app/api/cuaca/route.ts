import { NextResponse } from 'next/server';
import { getWeatherData } from '@/lib/weather';
import { REGIONS } from '@/lib/agro_regions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const daerah = searchParams.get('daerah') || 'Brebes, Jawa Tengah';
    
    const weather = getWeatherData(daerah);
    return NextResponse.json({
      success: true,
      daerah,
      daftar_wilayah: REGIONS.map(r => r.nama),
      data: weather
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat data cuaca & tanah' }, { status: 500 });
  }
}
