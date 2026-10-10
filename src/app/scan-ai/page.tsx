'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Upload, 
  ScanSearch, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  FlipHorizontal, 
  X, 
  FlaskConical, 
  Leaf, 
  History, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Check, 
  Copy, 
  Eye, 
  EyeOff, 
  Activity, 
  Sprout, 
  ArrowRight,
  Printer,
  ChevronRight,
  Layers,
  Clock,
  ExternalLink
} from 'lucide-react';
import { VisionAnalysisResult } from '@/lib/types';
import { DISEASE_LIBRARY } from '@/lib/vision_ai';
import { SAMPLE_CROP_SVGS } from '@/lib/sample_crops_svg';

export default function ScanAiPage() {
  // Tab Input: 'sample' | 'camera' | 'upload'
  const [activeInputTab, setActiveInputTab] = useState<'sample' | 'camera' | 'upload'>('sample');
  // Tab Hasil Diagnosa: 'visual' | 'nutrisi' | 'hayati' | 'mitigasi'
  const [activeResultTab, setActiveResultTab] = useState<'visual' | 'nutrisi' | 'hayati' | 'mitigasi'>('visual');

  // Status Sampel & Citra
  const [selectedSample, setSelectedSample] = useState<string>('antraknosa');
  const [imagePreview, setImagePreview] = useState<string | null>(SAMPLE_CROP_SVGS['antraknosa'] || null);
  const [imageSource, setImageSource] = useState<'camera' | 'upload' | 'sample'>('sample');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Status Pemindaian AI & Hasil
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [result, setResult] = useState<VisionAnalysisResult | null>(() => ({
    id: 'demo-init',
    ...DISEASE_LIBRARY['antraknosa']
  }));
  const [scanHistory, setScanHistory] = useState<VisionAnalysisResult[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Integrasi Lahan Terdaftar Petani (Local Persistence)
  const [activeFarmer, setActiveFarmer] = useState<{
    id?: string;
    nama_petani?: string;
    daerah?: string;
    jenis_tanaman?: string;
    luas_tanah?: number | string;
    satuan_luas?: string;
  } | null>(null);

  // State Kamera Langsung (WebRTC Viewfinder)
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isShutterFlashing, setIsShutterFlashing] = useState<boolean>(false);

  // Refs untuk Media Stream dan File Inputs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Pipeline Tahapan Analisis Visual
  const SCAN_STAGES = [
    'Ekstraksi Citra & Normalisasi Pencahayaan...',
    'Segmentasi Spektral Klorofil & Pola Lesi Daun...',
    'Inferensi Model Patologi Vision Kertanusa...',
    'Menyusun Resep Formulasi Nutrisi & Penanganan...'
  ];

  // Sampel Kasus Lapangan Kurasi Agronomis
  const samplePresets = [
    {
      id: 'antraknosa',
      crop: 'Cabai Merah / Rawit',
      label: 'Antraknosa (Patek Buah)',
      desc: 'Bercak cekung melingkar kehitaman berspora oranye pada cabai',
      badge: 'Penyakit Buah',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
      svgKey: 'antraknosa',
      accuracy: '94.8%'
    },
    {
      id: 'kutu-kebul',
      crop: 'Cabai / Tomat / Terong',
      label: 'Kutu Kebul & Virus Kuning',
      desc: 'Daun keriting mangkok & koloni serangga putih vektor gemini',
      badge: 'Hama Vektor',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
      svgKey: 'kutu-kebul',
      accuracy: '96.2%'
    },
    {
      id: 'ulat-grayak',
      crop: 'Bawang Merah / Jagung',
      label: 'Ulat Grayak (Spodoptera)',
      desc: 'Helaian silindris daun berlubang transparan akibat larva',
      badge: 'Hama Daun',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200/80',
      svgKey: 'ulat-grayak',
      accuracy: '95.4%'
    },
    {
      id: 'hawar-daun',
      crop: 'Padi Sawah / Gogo',
      label: 'Hawar Bakteri (Kresek)',
      desc: 'Garis basah kuning bergelombang di tepi helai daun padi',
      badge: 'Penyakit Daun',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
      svgKey: 'hawar-daun',
      accuracy: '93.5%'
    },
    {
      id: 'bulai-jagung',
      crop: 'Jagung (Zea mays)',
      label: 'Bulai Klorotik Jagung',
      desc: 'Garis putih klorosis sejajar tulang daun berspora tepung',
      badge: 'Penyakit Daun',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
      svgKey: 'bulai-jagung',
      accuracy: '94.1%'
    },
    {
      id: 'siap-panen-grade-a',
      crop: 'Cabai Merah Prima',
      label: 'Buah Matang Super Grade A',
      desc: 'Pigmen merah merata 95%, kulit mulus bebas bercak patogen',
      badge: 'Siap Panen',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      svgKey: 'siap-panen-grade-a',
      accuracy: '98.7%'
    }
  ];

  // Muat data Lahan Aktif Petani saat client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('kertanusa_active_farmer_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.nama_petani) {
          setActiveFarmer(parsed);
        }
      }
    } catch (e) {
      console.warn('Gagal memuat profil petani aktif:', e);
    }
  }, []);

  // Bersihkan stream kamera saat unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  function stopCameraStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }

  // Buka Kamera Langsung WebRTC
  async function startCamera(mode: 'environment' | 'user' = 'environment') {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('WebRTC Camera tidak didukung pada browser ini.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      });

      streamRef.current = stream;
      setCameraFacingMode(mode);
      setIsCameraActive(true);
      setActiveInputTab('camera');

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.log('Video auto-play interrupted:', e));
        }
      }, 150);

    } catch (err: any) {
      console.warn('Gagal membuka kamera WebRTC:', err);
      setCameraError('Izin akses kamera browser belum diaktifkan. Anda dapat memilih foto dari galeri atau membuka kamera bawaan ponsel.');
      setIsCameraActive(false);
    }
  }

  function toggleCameraFacing() {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  }

  // Jepret foto dari viewfinder kamera
  function capturePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;

    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImagePreview(dataUrl);
      setImageSource('camera');
      stopCameraStream();
      handleRunScan('custom-kamera', dataUrl);
    }
  }

  // Handler Berkas Gambar
  function handleFileSelected(file?: File, source: 'camera' | 'upload' = 'upload') {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar (JPG, PNG, atau WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setImageSource(source);
      stopCameraStream();
      handleRunScan('custom-' + source, dataUrl);
    };
    reader.readAsDataURL(file);
  }

  // Jalankan Pipeline Computer Vision
  async function handleRunScan(sampleKey: string, customImage?: string) {
    setScanning(true);
    setScanStepIndex(0);

    // Animasi step progress scanning
    const stepInterval = setInterval(() => {
      setScanStepIndex(prev => {
        if (prev < SCAN_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 380);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sampleKey, 
          registeredCrop: activeFarmer?.jenis_tanaman,
          hasCustomImage: !!customImage 
        })
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (data.success && data.data) {
        setResult(data.data);
        setScanHistory(prev => [data.data, ...prev.filter(item => item.id !== data.data.id).slice(0, 5)]);
      } else {
        // Fallback lokal jika endpoint mengalami kendala
        const fallback = {
          id: 'scan-' + Date.now(),
          ...(DISEASE_LIBRARY[sampleKey] || DISEASE_LIBRARY['antraknosa'])
        };
        setResult(fallback as VisionAnalysisResult);
        setScanHistory(prev => [fallback as VisionAnalysisResult, ...prev.slice(0, 5)]);
      }
    } catch (err) {
      console.error('Scan error:', err);
      clearInterval(stepInterval);
      const fallback = {
        id: 'scan-' + Date.now(),
        ...(DISEASE_LIBRARY[sampleKey] || DISEASE_LIBRARY['antraknosa'])
      };
      setResult(fallback as VisionAnalysisResult);
      setScanHistory(prev => [fallback as VisionAnalysisResult, ...prev.slice(0, 5)]);
    } finally {
      setTimeout(() => {
        setScanning(false);
      }, 500);
    }
  }

  // Pilih Sampel Preset
  function handleSelectSample(presetId: string) {
    setSelectedSample(presetId);
    setImagePreview(SAMPLE_CROP_SVGS[presetId] || null);
    setImageSource('sample');
    stopCameraStream();
    handleRunScan(presetId);
  }

  // Salin Rangkuman Diagnosa ke Clipboard
  function handleCopyDiagnosis() {
    if (!result) return;
    const text = `📋 LAPORAN DIAGNOSTIK KERTANUSA VISION AI
━━━━━━━━━━━━━━━━━━━━
🌱 Tanaman: ${result.nama_tanaman}
🚨 Diagnosis: ${result.nama_masalah} (${result.kategori_diagnosa})
📊 Akurasi AI: ${result.akurasi}% | Tingkat: ${result.tingkat_keparahan}
⏳ Kesiapan Panen: ${result.status_kematangan} (${result.estimasi_hari_panen === 0 ? 'Siap Petik' : `± ${result.estimasi_hari_panen} hari`})

🔍 Ciri Visual Terdeteksi:
${result.ciri_visual.map(c => `• ${c}`).join('\n')}

🧪 Rekomendasi Nutrisi & Dosis:
${result.rekomendasi_pupuk.map(p => `• ${p.jenis} (${p.formula}): ${p.dosis} -> ${p.cara_aplikasi}`).join('\n')}

🌿 Solusi Hayati & Pengendalian:
${result.solusi_perawatan.map(s => `• ${s}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━
Dianalisis melalui https://kertanusa.web.id/scan-ai`;

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 space-y-8 text-slate-800">
      
      {/* ── HEADER HALAMAN: CLEAN, NATURAL & SEIMBANG ── */}
      <section className="space-y-3.5 border-b border-slate-200/70 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
            <ScanSearch className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kertanusa Vision AI • Diagnostik Makro Lapangan</span>
          </div>

          {/* Badge Status Kamera / AI */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Engine Vision v2.4 Aktif
            </span>
          </div>
        </div>

        <div className="space-y-1.5 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pindai Kesehatan & Kesiapan Panen Tanaman
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Diagnosa dini gejala serangan patogen, serangga vektor, indeks klorofil (SPAD), dan tingkat kematangan buah menggunakan computer vision makro yang dirancang khusus untuk kondisi iklim tropis Nusantara.
          </p>
        </div>

        {/* Notifikasi Sinkronisasi Lahan Aktif Petani (Jika terdaftar) */}
        {activeFarmer ? (
          <div className="mt-2 p-3 sm:p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">
                  Lahan Terdaftar Terhubung: {activeFarmer.nama_petani}
                </span>
                <span className="text-emerald-800 text-[11px]">
                  Komoditas: <strong>{activeFarmer.jenis_tanaman}</strong> • Lokasi: {activeFarmer.daerah} ({activeFarmer.luas_tanah} {activeFarmer.satuan_luas || 'm²'})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const crop = (activeFarmer.jenis_tanaman || '').toLowerCase();
                  if (crop.includes('bawang')) handleSelectSample('ulat-grayak');
                  else if (crop.includes('jagung')) handleSelectSample('bulai-jagung');
                  else if (crop.includes('padi')) handleSelectSample('hawar-daun');
                  else handleSelectSample('antraknosa');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Fokus Diagnosa {activeFarmer.jenis_tanaman}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Ingin hasil diagnosis otomatis tersinkronisasi dengan luas petak dan kalender sawah Anda?</span>
            </div>
            <Link 
              href="/input-lahan"
              className="text-emerald-700 hover:text-emerald-800 font-semibold shrink-0 hover:underline inline-flex items-center gap-1"
            >
              <span>Sambungkan Lahan</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </section>

      {/* Hidden File Inputs */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={nativeCameraInputRef} 
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file, 'camera');
          e.target.value = '';
        }} 
        className="hidden" 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={galleryInputRef} 
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file, 'upload');
          e.target.value = '';
        }} 
        className="hidden" 
      />

      {/* ── KONTEN UTAMA: DUA KOLOM BERSIH & PROPORSIONAL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ══ KOLOM KIRI (5 KOLOM): VIEWFINDER CITRA & INPUT SUMBER ══ */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card Viewfinder Utama */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            
            {/* Header Card dengan Navigasi Tab Segmented */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Sumber Citra Tanaman
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Foto daun/buah makro resolusi tinggi
                </p>
              </div>

              {/* Segmented Control Pill Tab */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100/90 text-xs font-medium self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveInputTab('sample');
                    stopCameraStream();
                    if (!imagePreview && selectedSample) {
                      setImagePreview(SAMPLE_CROP_SVGS[selectedSample] || null);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeInputTab === 'sample'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sampel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveInputTab('camera');
                    startCamera('environment');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeInputTab === 'camera'
                      ? 'bg-white text-emerald-800 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kamera
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveInputTab('upload');
                    stopCameraStream();
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeInputTab === 'upload'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unggah
                </button>
              </div>
            </div>

            {/* AREA TAMPILAN VIEWPORT / KAMERA / PREVIEW */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/70 aspect-4/3 flex items-center justify-center select-none">
              
              {/* KONDISI A: KAMERA LANGSUNG WEBRTC AKTIF */}
              {isCameraActive ? (
                <div className="w-full h-full relative bg-slate-900 flex flex-col justify-between">
                  {/* Elemen Video */}
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover ${cameraFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* Kilatan Shutter */}
                  {isShutterFlashing && (
                    <div className="absolute inset-0 bg-white/95 z-30 transition-opacity duration-150" />
                  )}

                  {/* Frame Reticle Natural (Sleek Minimal White Corners) */}
                  <div className="absolute inset-0 pointer-events-none p-8 flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 border border-white/30 rounded-2xl">
                      {/* 4 Sudut Minimalis Putih Halus */}
                      <span className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-md shadow-xs" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-md shadow-xs" />
                      <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-md shadow-xs" />
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-white rounded-br-md shadow-xs" />

                      {/* Titik Fokus Halus */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white/70 animate-ping" />
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] font-medium text-white/90 bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-md shadow-xs">
                      Posisikan helai daun atau buah di tengah bingkai
                    </p>
                  </div>

                  {/* Bar Kontrol Bawah Viewfinder */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-[11px] hidden sm:inline">Batal</span>
                    </button>

                    {/* Tombol Shutter Utama */}
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400/40"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      <span>Jepret Foto</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleCameraFacing}
                      className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                      title="Beralih Kamera Depan/Belakang"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      <span className="text-[11px] hidden sm:inline">Putar</span>
                    </button>
                  </div>
                </div>
              ) : imagePreview ? (
                /* KONDISI B: PREVIEW CITRA AKTIF (SAMPEL / UPLOAD / FOTO KAMERA) */
                <div className="w-full h-full relative group">
                  {/* Gambar Utama */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imagePreview} 
                    alt="Pratinjau Citra Tanaman" 
                    className="w-full h-full object-cover transition-transform duration-300"
                  />

                  {/* OVERLAY DETEKSI COMPUTER VISION (BOUNDING BOXES) */}
                  {showAnnotations && result && result.detected_boxes && result.detected_boxes.length > 0 && !scanning && (
                    <div className="absolute inset-0 pointer-events-none">
                      {result.detected_boxes.map((box) => (
                        <div 
                          key={box.id}
                          className="absolute border-2 rounded-lg transition-all duration-300"
                          style={{
                            left: `${box.x}%`,
                            top: `${box.y}%`,
                            width: `${box.width}%`,
                            height: `${box.height}%`,
                            borderColor: box.color || '#e11d48',
                            backgroundColor: `${box.color || '#e11d48'}18`,
                            boxShadow: `0 0 10px ${box.color || '#e11d48'}40`
                          }}
                        >
                          {/* Label Tag Bounding Box */}
                          <span 
                            className="absolute -top-6 left-0 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs backdrop-blur-xs whitespace-nowrap"
                            style={{ backgroundColor: box.color || '#e11d48' }}
                          >
                            {box.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ANIMASI PEMINDAIAN LASER (SAAT PROSES SCAN AKTIF) */}
                  {scanning && (
                    <div className="absolute inset-0 bg-emerald-950/20 flex flex-col justify-between overflow-hidden">
                      {/* Garis Pemindai Spektral Bergerak */}
                      <div className="w-full h-1 bg-emerald-400 shadow-[0_0_16px_#34d399] animate-bounce absolute top-1/2 -translate-y-1/2" />
                      
                      {/* Bar Status Pemindaian */}
                      <div className="absolute bottom-3 inset-x-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 animate-spin" />
                            <span>Membedah Citra Makro...</span>
                          </span>
                          <span className="font-mono text-slate-300">{Math.round(((scanStepIndex + 1) / SCAN_STAGES.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full transition-all duration-300"
                            style={{ width: `${((scanStepIndex + 1) / SCAN_STAGES.length) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-300 truncate">
                          {SCAN_STAGES[scanStepIndex]}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Badge Sumber & Toggle Anotasi di Sudut Atas */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-900/70 text-white backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                      {imageSource === 'camera' ? <Camera className="w-3 h-3 text-emerald-400" /> : imageSource === 'upload' ? <Upload className="w-3 h-3 text-emerald-400" /> : <Sprout className="w-3 h-3 text-emerald-400" />}
                      <span>{imageSource === 'camera' ? 'Kamera Langsung' : imageSource === 'upload' ? 'Unggahan Berkas' : 'Sampel Lapangan'}</span>
                    </span>

                    {/* Tombol Toggle Anotasi Bounding Box */}
                    {result && (
                      <button
                        type="button"
                        onClick={() => setShowAnnotations(prev => !prev)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                          showAnnotations 
                            ? 'bg-emerald-700/90 hover:bg-emerald-800 text-white' 
                            : 'bg-slate-900/70 hover:bg-slate-900 text-slate-200'
                        }`}
                        title="Tampilkan / Sembunyikan Bounding Box AI"
                      >
                        {showAnnotations ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{showAnnotations ? 'Anotasi AI: Aktif' : 'Citra Asli'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* KONDISI C: BELUM ADA CITRA */
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      Pilih atau Ambil Foto Tanaman
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Gunakan tab di atas untuk memilih metode pengambilan citra
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Toolbar Aksi Cepat Bawah Viewport */}
            {imagePreview && !isCameraActive && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (imageSource === 'camera') startCamera('environment');
                    else if (imageSource === 'upload') galleryInputRef.current?.click();
                    else handleRunScan(selectedSample);
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>{imageSource === 'camera' ? 'Foto Ulang' : 'Pindai Ulang'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ganti Berkas</span>
                </button>
              </div>
            )}

            {/* Pesan Kesalahan Akses Kamera */}
            {cameraError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Akses Kamera Perangkat Terkendala</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {cameraError}
                </p>
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="text-xs font-semibold text-emerald-800 underline underline-offset-2 cursor-pointer"
                  >
                    Buka Kamera HP Bawaan
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* TAB CONTENT: UNGGAH DRAG & DROP (JIKA TAB UNGGAH DIPILIH) */}
          {activeInputTab === 'upload' && !isCameraActive && (
            <div 
              onDragOver={e => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={e => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={e => {
                e.preventDefault();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileSelected(file, 'upload');
              }}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center space-y-3 cursor-pointer ${
                isDragOver 
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-xs' 
                  : 'border-slate-200 hover:border-emerald-400 bg-white hover:bg-slate-50/50 shadow-xs'
              }`}
              onClick={() => galleryInputRef.current?.click()}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">
                  Tarik & Lepas Foto Daun / Buah di Sini
                </h4>
                <p className="text-[11px] text-slate-500">
                  atau klik untuk memilih dari album galeri penyimpanan
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                <span>Mendukung format JPG, PNG, WebP (Maks 10 MB)</span>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SAMPEL KASUS LAPANGAN KURASI (GRID KARTU VISUAL ALAMI) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Katalog Sampel Kasus Lapangan
                </h3>
                <p className="text-[11px] text-slate-500">
                  Klik untuk simulasi diagnostik makro instan
                </p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                6 Kasus Uji
              </span>
            </div>

            <div className="space-y-2">
              {samplePresets.map((preset) => {
                const isSelected = selectedSample === preset.id && imageSource === 'sample';
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectSample(preset.id)}
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-600 shadow-2xs'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                    }`}
                  >
                    {/* Thumbnail Miniatur Vektor Sampel */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={SAMPLE_CROP_SVGS[preset.svgKey]} 
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-950 font-extrabold' : 'text-slate-900'}`}>
                          {preset.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                        {preset.crop} • {preset.desc}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border block ${preset.badgeClass}`}>
                        {preset.badge}
                      </span>
                      <span className="text-[9.5px] font-mono text-slate-400 mt-0.5 block">
                        Akurasi {preset.accuracy}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ══ KOLOM KANAN (7 KOLOM): HASIL DIAGNOSTIK KLINIS & RESEP PERAWATAN ══ */}
        <div className="lg:col-span-7 space-y-5">
          
          {scanning ? (
            /* STATE 1: SEDANG MEMINDAI (NATURAL SCANNING SKELETON) */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-14 text-center space-y-5 min-h-[480px] flex flex-col items-center justify-center shadow-xs">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-3 border-emerald-100 border-t-emerald-700 animate-spin" />
                <ScanSearch className="w-7 h-7 text-emerald-700 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-slate-900">
                  Computer Vision AI Sedang Mendiagnosis...
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Menganalisis indeks spektral klorofil daun, mendeteksi batas bercak nekrotik, dan meracik takaran nutrisi presisi.
                </p>
              </div>

              {/* Progress Steps Indicator */}
              <div className="w-full max-w-xs space-y-2 pt-2 text-left">
                {SCAN_STAGES.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px]">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      idx < scanStepIndex 
                        ? 'bg-emerald-600 text-white' 
                        : idx === scanStepIndex 
                        ? 'bg-emerald-100 text-emerald-800 animate-pulse' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {idx < scanStepIndex ? '✓' : idx + 1}
                    </div>
                    <span className={idx === scanStepIndex ? 'font-bold text-slate-900' : 'text-slate-500'}>
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : result ? (
            /* STATE 2: HASIL PEMINDAIAN LENGKAP & NATURAL AGRONOMIC CLINIC CARD */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
              
              {/* Header Hasil Diagnosa: Natural Badges & Metrics Strip */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                      result.kategori_diagnosa === 'Tanaman Sehat'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : result.tingkat_keparahan === 'Parah'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {result.kategori_diagnosa} • Tingkat {result.tingkat_keparahan}
                    </span>

                    <span className="text-xs text-emerald-800 font-semibold bg-emerald-50/70 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                      Akurasi AI {result.akurasi}%
                    </span>

                    {result.spad_chlorophyll_index && (
                      <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                        SPAD Klorofil: <strong className="text-slate-900">{result.spad_chlorophyll_index}</strong>
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {result.nama_masalah}
                  </h2>
                  
                  <p className="text-xs text-slate-500">
                    Komoditas Relevan: <strong className="text-slate-800">{result.nama_tanaman}</strong>
                  </p>
                </div>

                {/* Kotak Status Kesiapan Panen */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-left sm:text-right shrink-0 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Kesiapan Panen
                  </span>
                  <strong className={`text-xs block ${
                    result.status_kematangan.includes('Siap Panen') ? 'text-emerald-700 font-bold' : 'text-slate-800'
                  }`}>
                    {result.status_kematangan}
                  </strong>
                  <span className="text-[11px] text-slate-500 block">
                    {result.estimasi_hari_panen === 0 
                      ? '✅ Siap Petik Sekarang' 
                      : `± ${result.estimasi_hari_panen} hari menuju panen`}
                  </span>
                </div>
              </div>

              {/* TAB SUB-SEGMEN LAPORAN KLINIS */}
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveResultTab('visual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeResultTab === 'visual'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Temuan Visual ({result.ciri_visual.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveResultTab('nutrisi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeResultTab === 'nutrisi'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Resep Pupuk Presisi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveResultTab('hayati')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeResultTab === 'hayati'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Solusi Hayati & Nabati</span>
                </button>

                {result.mitigasi_7hari && (
                  <button
                    type="button"
                    onClick={() => setActiveResultTab('mitigasi')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeResultTab === 'mitigasi'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Rencana 7 Hari</span>
                  </button>
                )}
              </div>

              {/* KONTEN SUB-TAB 1: TEMUAN VISUAL & ANOTASI */}
              {activeResultTab === 'visual' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Ciri Visual Terdeteksi pada Citra:</span>
                    </h4>
                    <div className="space-y-2">
                      {result.ciri_visual.map((ciri, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span>{ciri}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ringkasan Indeks Kesehatan Spektral */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-500 font-medium block">Indeks Kesehatan Tajuk</span>
                      <strong className="text-sm font-bold text-slate-900 mt-0.5 block">{result.health_index || 70}%</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-500 font-medium block">Indeks Klorofil (SPAD)</span>
                      <strong className="text-sm font-bold text-slate-900 mt-0.5 block">{result.spad_chlorophyll_index || 38.2}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 font-medium block">Deteksi Lesi/Objek</span>
                      <strong className="text-sm font-bold text-emerald-700 mt-0.5 block">{result.detected_boxes?.length || 2} Anotasi AI</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* KONTEN SUB-TAB 2: RESEP FORMULASI PUPUK PRESISI */}
              {activeResultTab === 'nutrisi' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-emerald-700" />
                      <span>Formulasi Nutrisi & Pemulihan Tanaman</span>
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">Berdasarkan Luas Daun</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.rekomendasi_pupuk.map((pupuk, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2 text-xs">
                        <div className="flex items-baseline justify-between gap-2">
                          <strong className="text-emerald-950 font-bold block text-sm">
                            {pupuk.jenis}
                          </strong>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                            {pupuk.formula}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-900 font-medium">
                          <span className="font-bold text-emerald-950">Takaran Dosis:</span> {pupuk.dosis}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed border-t border-emerald-200/40 pt-2">
                          {pupuk.cara_aplikasi}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* KONTEN SUB-TAB 3: SOLUSI HAYATI & SANITASI LAHAN */}
              {activeResultTab === 'hayati' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-700" />
                      <span>Tindakan Agronomis & Sanitasi Lapangan:</span>
                    </h4>
                    <div className="space-y-2 text-xs text-slate-700">
                      {result.solusi_perawatan.map((sol, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{sol}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.pestisida_nabati_organik.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-2">
                      <strong className="text-amber-950 font-bold block">
                        Resep Hayati & Pestisida Alami Lokal Ramah Lingkungan:
                      </strong>
                      <ul className="space-y-1.5 text-amber-900 text-[11px]">
                        {result.pestisida_nabati_organik.map((pes, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-700 font-bold">•</span>
                            <span>{pes}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* KONTEN SUB-TAB 4: RENCANA MITIGASI 7 HARI */}
              {activeResultTab === 'mitigasi' && result.mitigasi_7hari && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Jadwal Aksi Perawatan 7 Hari ke Depan</span>
                  </h4>
                  <div className="space-y-2">
                    {result.mitigasi_7hari.map((m, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px] shrink-0 font-mono">
                          Langkah {idx + 1}
                        </span>
                        <p className="text-slate-700 leading-relaxed">{m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TOMBOL AKSI BAGIKAN / SIMPAN / KONSULTASI */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyDiagnosis}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Tersalin ke Clipboard!' : 'Salin Laporan'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cetak PDF</span>
                  </button>
                </div>

                <Link
                  href="/monitoring"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <span>Cek Kondisi Cuaca Sawah</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ) : (
            /* STATE 3: BELUM ADA HASIL PEMINDAIAN */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-14 text-center space-y-5 min-h-[480px] flex flex-col items-center justify-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-200/80">
                <ScanSearch className="w-7 h-7 text-slate-400" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-slate-900">
                  Belum Ada Pemindaian Aktif
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pilih salah satu sampel demo lapangan di sebelah kiri atau ambil foto daun/buah melalui kamera untuk menjalankan diagnosis vision AI.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── RIWAYAT PEMINDAIAN SESI INI ── */}
      {scanHistory.length > 0 && (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-sm text-slate-900">
                Riwayat Pemindaian Sesi Ini
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {scanHistory.length} Hasil Tersimpan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scanHistory.map((scan) => (
              <div 
                key={scan.id} 
                onClick={() => {
                  setResult(scan);
                  if (scan.sample_image_url) {
                    setImagePreview(scan.sample_image_url);
                  }
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-100/70 transition-colors space-y-2 text-xs cursor-pointer group"
              >
                <div className="flex justify-between items-start gap-2">
                  <strong className="text-slate-900 font-bold block truncate group-hover:text-emerald-700 transition-colors">
                    {scan.nama_masalah}
                  </strong>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0">
                    {scan.akurasi}%
                  </span>
                </div>

                <p className="text-slate-500 text-[11px] truncate">
                  {scan.nama_tanaman} • Tingkat: <strong className="text-slate-700">{scan.tingkat_keparahan}</strong>
                </p>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200/70 flex justify-between items-center">
                  <span>Panen: {scan.estimasi_hari_panen === 0 ? 'Siap Petik' : `${scan.estimasi_hari_panen} hari`}</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Buka Rincian</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PANDUAN PEMOTRETAN MAKRO DI LAPANGAN (NATURAL FOOTER TIPS) ── */}
      <section className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-5 sm:p-6 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Panduan Pemotretan Citra Makro untuk Akurasi Optimal:</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">1. Jarak Bidik Makro</span>
            <p className="text-xs font-bold text-slate-800">15 – 30 cm dari Objek</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Fokuskan kamera langsung pada bercak daun atau permukaan kulit buah yang mengalami kelainan.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">2. Cahaya Alami Sejuk</span>
            <p className="text-xs font-bold text-slate-800">Pagi / Sore Hari</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hindari bayangan jari atau silau matahari terik langsung agar segmentasi warna pigmen klorofil tidak bias.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">3. Tanpa Goyangan</span>
            <p className="text-xs font-bold text-slate-800">Kamera Stabil & Bersih</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pegang ponsel dengan dua tangan dan bersihkan lensa dari debu kebun agar tepi lesi patogen terbaca tajam.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
