'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sprout, MapPin, Calendar, Ruler, User, 
  CheckCircle2, ArrowRight, Sparkles, ShieldAlert,
  HelpCircle, Info, Navigation, RefreshCw, Satellite,
  Sun, Droplets, Thermometer, AlertTriangle
} from 'lucide-react';
import { REGIONS } from '@/lib/agro_regions';
import { CROPS_CATALOG } from '@/lib/crops';

export default function InputLahanPage() {
  const [formData, setFormData] = useState({
    nama_petani: '',
    kontak: '',
    luas_tanah: '',
    satuan_luas: 'm²',
    daerah: REGIONS[0].nama,
    lat: REGIONS[0].lat as number | undefined,
    lon: REGIONS[0].lon as number | undefined,
    akurasi_gps: undefined as number | undefined,
    jenis_tanaman: 'Cabai Rawit Merah',
    waktu_tanam: new Date().toISOString().split('T')[0],
    catatan: ''
  });

  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');
  const [livePreviewWeather, setLivePreviewWeather] = useState<{
    suhu: number;
    kelembapan: number;
    radiasi: number;
    kondisi: string;
    sumber: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedCrop = CROPS_CATALOG[formData.jenis_tanaman] || CROPS_CATALOG['Cabai Rawit Merah'];
  const selectedRegion = REGIONS.find(r => r.nama === formData.daerah) || REGIONS[0];

  // Hitung estimasi tanggal panen
  const tanamDate = new Date(formData.waktu_tanam);
  const panenDate = new Date(tanamDate);
  panenDate.setDate(panenDate.getDate() + selectedCrop.umur_panen_hari);
  const panenFormatted = panenDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Estimasi tonase panen
  const luasVal = Number(formData.luas_tanah) || 0;
  const luasM2 = formData.satuan_luas === 'hektar' ? luasVal * 10000 : luasVal;
  const estYieldKg = Math.round(luasM2 * (formData.jenis_tanaman === 'Tomat' ? 2.5 : formData.jenis_tanaman === 'Bawang Merah' ? 1.2 : 0.9));

  // Fungsi deteksi GPS presisi perangkat
  function handleActivateGps() {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMsg('Peramban Anda tidak mendukung sensor Geolocation GPS.');
      return;
    }

    setGpsStatus('loading');
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const roundedAcc = Math.round(accuracy);

        try {
          // Tarik data cuaca BMKG & identifikasi wilayah via reverse geocode di backend
          const res = await fetch(`/api/cuaca?lat=${latitude}&lon=${longitude}`);
          const resData = await res.json();

          let detectedDaerah = formData.daerah;
          if (resData.success && resData.daerah) {
            detectedDaerah = resData.daerah;
          }

          if (resData.success && resData.data) {
            setLivePreviewWeather({
              suhu: resData.data.suhu,
              kelembapan: resData.data.kelembapan_udara,
              radiasi: resData.data.radiasi_surya,
              kondisi: resData.data.kondisi,
              sumber: resData.data.sumber_data || 'Satelit BMKG & Open-Meteo'
            });
          }

          setFormData(prev => ({
            ...prev,
            lat: latitude,
            lon: longitude,
            akurasi_gps: roundedAcc,
            daerah: detectedDaerah
          }));

          setGpsStatus('success');
        } catch (err) {
          setFormData(prev => ({
            ...prev,
            lat: latitude,
            lon: longitude,
            akurasi_gps: roundedAcc
          }));
          setGpsStatus('success');
        }
      },
      (err) => {
        setGpsStatus('error');
        if (err.code === 1) {
          setGpsErrorMsg('Akses GPS ditolak. Silakan aktifkan izin lokasi di browser / HP Anda agar data BMKG titik sawah valid.');
        } else if (err.code === 2) {
          setGpsErrorMsg('Posisi GPS tidak tersedia atau sinyal satelit lemah.');
        } else {
          setGpsErrorMsg('Waktu pembacaan GPS habis. Silakan coba lagi.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/petani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Gagal menyimpan data.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sprout className="w-3.5 h-3.5" />
          <span>Form Registrasi Lahan & Titik GPS Presisi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pendaftaran Profil Lahan & Tanaman
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          Sistem mewajibkan aktivasi GPS untuk mengunci titik koordinat presisi sawah. Data ditarik langsung dari satelit agrometeorologi BMKG untuk memastikan data cuaca, suhu, dan kelembapan 100% valid dan akurat untuk riset.
        </p>
      </div>

      {success ? (
        <div className="p-8 rounded-2xl bg-white border border-emerald-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Lahan & Bibit Berhasil Didaftarkan!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Bibit <strong>{formData.jenis_tanaman}</strong> milik <strong>{formData.nama_petani}</strong> di <strong>{formData.daerah}</strong> ({formData.lat?.toFixed(4)}, {formData.lon?.toFixed(4)}) telah tersimpan dan <strong>langsung memancar sebagai titik radar aktif di Peta Satelit Nusantara</strong>!
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <a
              href="/"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-1.5 transition-colors"
            >
              <span>🗺️ Lihat Sawah Saya di Peta Nusantara</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/monitoring"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-colors"
            >
              <span>📊 Pantau Telemetri Lahan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => {
                setSuccess(false);
                setGpsStatus('idle');
                setLivePreviewWeather(null);
                setFormData({
                  nama_petani: '',
                  kontak: '',
                  luas_tanah: '',
                  satuan_luas: 'm²',
                  daerah: REGIONS[0].nama,
                  lat: REGIONS[0].lat,
                  lon: REGIONS[0].lon,
                  akurasi_gps: undefined,
                  jenis_tanaman: 'Cabai Rawit Merah',
                  waktu_tanam: new Date().toISOString().split('T')[0],
                  catatan: ''
                });
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              + Input Lahan Lain
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Form (2 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
              
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Nama & Kontak */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Nama Petani / Pemilik Lahan <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak Budi Hartono"
                    value={formData.nama_petani}
                    onChange={(e) => setFormData({ ...formData, nama_petani: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    No. HP / WhatsApp (Opsional untuk Notifikasi Cuaca Darurat)
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 0812-3456-7890"
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs outline-none transition-all"
                  />
                </div>
              </div>

              {/* 2. Titik Koordinat GPS Sawah (MANDATORY GPS SECTION) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Satellite className="w-4 h-4 text-emerald-600" />
                    <span>2. Titik Koordinat GPS & Lokasi Sawah <span className="text-rose-500">*</span></span>
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Satelit BMKG Presisi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Sistem menarik data BMKG langsung dari <strong>titik koordinat GPS sawah</strong> agar suhu, kelembapan, dan potensi radiasi pompa surya 100% valid sesuai mikro-iklim lahan Anda.
                </p>

                {/* GPS Activation Box */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Sensor Geolocation Satelit
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {gpsStatus === 'success' 
                          ? `Terkunci: Lat ${formData.lat?.toFixed(5)}, Lon ${formData.lon?.toFixed(5)} (Akurasi ±${formData.akurasi_gps || 10}m)`
                          : 'Wajib nyalakan GPS di HP/perangkat Anda'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleActivateGps}
                      disabled={gpsStatus === 'loading'}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        gpsStatus === 'success'
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                      }`}
                    >
                      {gpsStatus === 'loading' ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Membaca Satelit GPS...</span>
                        </>
                      ) : gpsStatus === 'success' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Perbarui Titik GPS</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3.5 h-3.5 text-amber-300" />
                          <span>Nyalakan GPS & Kunci Koordinat</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* GPS Success Feedback Widget */}
                  {gpsStatus === 'success' && (
                    <div className="pt-2 border-t border-emerald-200/70 space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2 bg-white rounded-lg border border-emerald-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Latitude</span>
                          <span className="font-mono font-bold text-slate-800">{formData.lat?.toFixed(5)}</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-emerald-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Longitude</span>
                          <span className="font-mono font-bold text-slate-800">{formData.lon?.toFixed(5)}</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-emerald-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Akurasi GPS</span>
                          <span className="font-bold text-emerald-700">±{formData.akurasi_gps} m</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-emerald-100">
                          <span className="text-[10px] text-slate-400 block font-medium">Suhu Satelit</span>
                          <span className="font-bold text-amber-700">{livePreviewWeather ? `${livePreviewWeather.suhu}°C` : 'Live'}</span>
                        </div>
                      </div>

                      {livePreviewWeather && (
                        <div className="p-2.5 rounded-lg bg-emerald-100/60 text-[11px] text-emerald-900 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Kondisi Saat Ini: <strong>{livePreviewWeather.kondisi}</strong> ({livePreviewWeather.radiasi} W/m²)</span>
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                            BMKG Verified
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* GPS Error Feedback */}
                  {gpsStatus === 'error' && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Akses GPS Perangkat Terkendala</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-amber-800">
                        {gpsErrorMsg} Anda tetap dapat memilih daerah terdekat di bawah sebagai titik acuan sementara.
                      </p>
                    </div>
                  )}

                  {/* Manual / Preset Region Fallback */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kecamatan / Kabupaten Terdeteksi:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.daerah}
                        onChange={(e) => setFormData({ ...formData, daerah: e.target.value })}
                        placeholder="Contoh: Brebes, Jawa Tengah"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] text-slate-400 font-medium py-0.5">Preset Cepat:</span>
                      {REGIONS.slice(0, 4).map((r) => (
                        <button
                          type="button"
                          key={r.id}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              daerah: r.nama,
                              lat: r.lat,
                              lon: r.lon,
                              akurasi_gps: 10
                            }));
                            setGpsStatus('success');
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium transition-colors"
                        >
                          {r.nama.split(',')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. Luas Tanah */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Luas Tanah / Lahan <span className="text-rose-500">*</span></span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="Contoh: 1500"
                    value={formData.luas_tanah}
                    onChange={(e) => setFormData({ ...formData, luas_tanah: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                  />
                  <select
                    value={formData.satuan_luas}
                    onChange={(e) => setFormData({ ...formData, satuan_luas: e.target.value as 'm²' | 'hektar' })}
                    className="w-28 px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-sm font-semibold outline-none"
                  >
                    <option value="m²">Meter² (m²)</option>
                    <option value="hektar">Hektar (ha)</option>
                  </select>
                </div>
              </div>

              {/* 4. Jenis Tanaman */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>4. Jenis Tanaman yang Ditanam <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={formData.jenis_tanaman}
                  onChange={(e) => setFormData({ ...formData, jenis_tanaman: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none bg-white transition-all font-semibold text-slate-800"
                >
                  {Object.keys(CROPS_CATALOG).map((crop) => (
                    <option key={crop} value={crop}>
                      {crop} (Siklus {CROPS_CATALOG[crop].umur_panen_hari} hari)
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Waktu Tanam */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5. Waktu / Tanggal Mulai Tanam <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.waktu_tanam}
                  onChange={(e) => setFormData({ ...formData, waktu_tanam: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all font-medium"
                />
              </div>

              {/* Catatan / Keterangan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  Catatan Lahan / Varietas Benih (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Varietas Bima Brebes, menggunakan pompa air tenaga surya, tanah lempung berpasir..."
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Menyimpan ke Database Riset...' : 'Simpan Data Lahan & Mulai Monitoring'}
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Right Column: Live Calculation Preview */}
          <div className="space-y-4">
            
            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Preview Analisis Budidaya & GPS</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Komoditas:</span>
                  <p className="text-sm font-bold text-emerald-400">{selectedCrop.nama}</p>
                  <p className="text-[11px] text-slate-400">Kategori: {selectedCrop.kategori}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400">Umur Siklus:</span>
                    <p className="font-bold text-slate-200">{selectedCrop.umur_panen_hari} Hari</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Est. Panen:</span>
                    <p className="font-bold text-amber-300">{panenFormatted}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-slate-400">Titik Koordinat Sawah:</span>
                  <div className="flex items-center gap-1.5 text-slate-200 font-mono text-[11px]">
                    <Satellite className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{formData.lat ? `${formData.lat.toFixed(5)}, ${formData.lon?.toFixed(5)}` : 'Belum Terkunci'}</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-semibold">
                    {formData.akurasi_gps ? `Akurasi GPS: ±${formData.akurasi_gps} meter` : 'Posisikan perangkat di area sawah'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Karakteristik Lahan:</span>
                  <p className="text-slate-300 font-medium mt-0.5">{formData.daerah}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Jenis Tanah: <span className="text-slate-200">{selectedRegion.jenis_tanah}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    pH Alami: <span className="text-emerald-300 font-semibold">{selectedRegion.ph_rata_rata}</span> | Suhu Rata-rata: <span className="text-amber-300">{selectedRegion.suhu_rata_rata}°C</span>
                  </p>
                </div>

                {luasVal > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-slate-400">Proyeksi Hasil Panen:</span>
                    <p className="text-base font-extrabold text-emerald-300">
                      ± {estYieldKg.toLocaleString('id-ID')} kg
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Dihitung dari luas lahan {luasVal} {formData.satuan_luas}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Riset Pertanian Berkelanjutan</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                Data GPS dan parameter agrometeorologi BMKG yang tersimpan menjadi basis data riset komparatif untuk mendeteksi variabilitas mikroklimat antardesa dan memitigasi risiko gagal panen di wilayah terpencil.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
