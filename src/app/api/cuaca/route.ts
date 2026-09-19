import { NextResponse } from 'next/server';
import { getLiveWeatherData } from '@/lib/weather';
import { REGIONS, getRegionProfile, getNearestRegionProfile } from '@/lib/agro_regions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');
    const daerahParam = searchParams.get('daerah');

    let lat = latParam ? parseFloat(latParam) : null;
    let lon = lonParam ? parseFloat(lonParam) : null;
    let namaLokasi = daerahParam || '';
    let isGpsAccurate = false;

    if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)) {
      isGpsAccurate = true;
      // Deteksi nama wilayah administratif dari satelit OpenStreetMap Nominatim
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
          {
            headers: { 'User-Agent': 'AgroNusantara-Research/1.0' },
            next: { revalidate: 86400 }
          }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const addr = geoData.address || {};
          const loc = addr.village || addr.suburb || addr.town || addr.city_district || '';
          const regency = addr.county || addr.city || '';
          const state = addr.state || '';
          const parts = [loc, regency, state].filter(Boolean);
          if (parts.length > 0) {
            namaLokasi = parts.join(', ');
          }
        }
      } catch (e) {
        // Fallback jika nominatim timeout
      }

      if (!namaLokasi) {
        const nearest = getNearestRegionProfile(lat, lon);
        namaLokasi = nearest.nama;
      }
    } else {
      const profile = getRegionProfile(namaLokasi || 'Brebes, Jawa Tengah');
      lat = profile.lat;
      lon = profile.lon;
      namaLokasi = profile.nama;
    }

    const nearestProfile = getNearestRegionProfile(lat, lon);
    const weather = await getLiveWeatherData(lat, lon, nearestProfile.nama);

    return NextResponse.json({
      success: true,
      daerah: namaLokasi,
      lat,
      lon,
      is_gps: isGpsAccurate,
      nearest_region: nearestProfile.nama,
      daftar_wilayah: REGIONS.map(r => r.nama),
      data: weather
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat data cuaca & tanah' }, { status: 500 });
  }
}
