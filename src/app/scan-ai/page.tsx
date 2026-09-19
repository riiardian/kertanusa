'use client';

import { useState } from 'react';
import { 
  ScanSearch, Upload, Sparkles, CheckCircle2, AlertTriangle, 
  ShieldAlert, Sprout, Clock, ArrowRight, RefreshCw, 
  FlaskConical, Leaf, Camera, History
} from 'lucide-react';
import { VisionAnalysisResult } from '@/lib/types';
import { DISEASE_LIBRARY } from '@/lib/vision_ai';

export default function ScanAiPage() {
  const [selectedSample, setSelectedSample] = useState<string>('antraknosa');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<VisionAnalysisResult | null>(null);
  const [scanHistory, setScanHistory] = useState<VisionAnalysisResult[]>([]);

  // Demo sample cards for live presentation
  const samplePresets = [
    {
      id: 'antraknosa',
      label: 'Cabai: Antraknosa (Patek)',
      desc: 'Bercak hitam cekung pada buah cabai',
      badge: 'Penyakit Buah'
    },
    {
      id: 'kutu-kebul',
      label: 'Cabai: Kutu Kebul & Virus Kuning',
      desc: 'Daun keriting mangkok & serangga putih',
      badge: 'Hama Vektor'
    },
    {
      id: 'hawar-daun',
      label: 'Padi: Hawar Daun Bakteri (Kresek)',
      desc: 'Garis basah kuning di tepi helaian daun padi',
      badge: 'Penyakit Daun'
    },
    {
      id: 'siap-panen-grade-a',
      label: 'Cabai: Buah Matang Optimal',
      desc: 'Cabai merah berkilau kualitas super Grade A',
      badge: 'Siap Panen'
    }
  ];

  async function handleRunScan(sampleKey: string) {
    setScanning(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleKey })
      });
      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setResult(data.data);
          setScanHistory(prev => [data.data, ...prev]);
          setScanning(false);
        }, 1200); // Realistic AI scan delay
      }
    } catch (err) {
      console.error(err);
      setScanning(false);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        handleRunScan('antraknosa');
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-12">
      
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <ScanSearch className="w-3.5 h-3.5 text-amber-700" />
          <span>Computer Vision AI Tanaman & Buah</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Deteksi Hama, Penyakit & Kesiapan Panen
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-3xl">
          Gunakan kecerdasan buatan untuk menganalisis foto daun atau buah tanaman secara instan. Sistem mendiagnosis patogen penyakit, mengukur kematangan panen, dan memberikan resep pupuk presisi.
        </p>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload / Preset Picker (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Upload Box */}
          <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-emerald-300 hover:border-emerald-500 transition-colors text-center space-y-3 relative group">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              title="Unggah foto tanaman"
            />
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform shadow-inner">
              <Camera className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">Ambil Foto atau Unggah Gambar</h3>
              <p className="text-xs text-slate-400 mt-0.5">Format JPG, PNG (Maksimal 10 MB)</p>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Foto dari Galeri</span>
              </span>
            </div>
          </div>

          {/* Preset Demo Samples */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Atau Coba Sampel Demo:</span>
              <span className="text-[10px] text-emerald-600 font-semibold">1-Klik Analisis</span>
            </div>

            <div className="space-y-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedSample(preset.id);
                    setImagePreview(null);
                    handleRunScan(preset.id);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                    selectedSample === preset.id && !imagePreview
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">{preset.label}</span>
                    <p className="text-[11px] text-slate-500">{preset.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                    preset.id === 'siap-panen-grade-a'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Analysis Result Display (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {scanning ? (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
                <ScanSearch className="w-7 h-7 text-emerald-600 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Computer Vision Sedang Menganalisis...</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Memindai spektrum klorofil daun, bercak nekrosis spora jamur, dan indeks kematangan buah.
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-4">
              
              {/* Main Diagnostic Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
                
                {/* Header Result */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        result.kategori_diagnosa === 'Tanaman Sehat'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {result.kategori_diagnosa}
                      </span>
                      <span className="text-xs text-slate-400">Akurasi AI: {result.akurasi}%</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                      {result.nama_masalah}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Tanaman: {result.nama_tanaman}</p>
                  </div>

                  {/* Kesiapan Panen Badge */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Kematangan:</span>
                    <strong className={`text-xs block ${
                      result.status_kematangan.includes('Siap Panen') ? 'text-emerald-600 font-extrabold' : 'text-amber-600'
                    }`}>
                      {result.status_kematangan}
                    </strong>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      {result.estimasi_hari_panen === 0 
                        ? '✅ Petik Sekarang' 
                        : `± ${result.estimasi_hari_panen} hari lagi`}
                    </span>
                  </div>
                </div>

                {/* Ciri Visual Terdeteksi */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ciri-Ciri Visual Terdeteksi:</h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {result.ciri_visual.map((ciri, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                        <span>{ciri}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rekomendasi Pupuk Presisi */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rekomendasi Pupuk & Dosis Nutrisi:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {result.rekomendasi_pupuk.map((pupuk, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-xs">
                        <strong className="text-emerald-950 font-bold block">{pupuk.jenis} ({pupuk.formula})</strong>
                        <div className="text-[11px] text-emerald-800">
                          <span className="font-semibold">Dosis:</span> {pupuk.dosis}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {pupuk.cara_aplikasi}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solusi Perawatan & Pestisida Organik */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Solusi Perawatan & Pestisida Nabati Organik:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {result.solusi_perawatan.map((sol, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{sol}</span>
                      </li>
                    ))}
                  </ul>

                  {result.pestisida_nabati_organik.length > 0 && (
                    <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-950">
                      <strong className="block font-semibold mb-1">Resep Bahan Alami / Hayati Lokal:</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900">
                        {result.pestisida_nabati_organik.map((pes, idx) => (
                          <li key={idx}>{pes}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3 min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <ScanSearch className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Belum Ada Hasil Pemindaian</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Pilih salah satu sampel demo di samping kiri atau unggah foto tanaman Anda untuk memulai analisis Computer Vision.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* History Section (Komparasi Tanaman Lalu) */}
      {scanHistory.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <History className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm">Riwayat Pemindaian Sesi Ini (Komparasi Tanaman Lalu)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scanHistory.map((scan, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{scan.nama_masalah}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {scan.status_kematangan}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">{scan.nama_tanaman} • Tingkat: {scan.tingkat_keparahan}</p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                  <span>Panen: {scan.estimasi_hari_panen === 0 ? 'Siap' : `${scan.estimasi_hari_panen} hari`}</span>
                  <span>Akurasi: {scan.akurasi}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
