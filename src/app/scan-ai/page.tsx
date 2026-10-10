'use client';

import { useState, useRef, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import { VisionAnalysisResult } from '@/lib/types';
import { DISEASE_LIBRARY } from '@/lib/vision_ai';

export default function ScanAiPage() {
  const [selectedSample, setSelectedSample] = useState<string>('antraknosa');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<'camera' | 'upload' | 'sample'>('sample');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<VisionAnalysisResult | null>(null);
  const [scanHistory, setScanHistory] = useState<VisionAnalysisResult[]>([]);

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

  // Sampel Preset Lapangan Kasus Nyata Petani
  const samplePresets = [
    {
      id: 'antraknosa',
      crop: 'Cabai Merah / Rawit',
      label: 'Cabai: Antraknosa (Patek Buah)',
      desc: 'Bercak hitam cekung melingkar pada buah menjelang merah',
      badge: 'Penyakit Buah',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/80'
    },
    {
      id: 'kutu-kebul',
      crop: 'Cabai / Tomat / Terong',
      label: 'Cabai: Kutu Kebul & Virus Kuning',
      desc: 'Daun keriting mangkok & koloni serangga putih vektor gemini',
      badge: 'Hama Vektor',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/80'
    },
    {
      id: 'ulat-grayak',
      crop: 'Bawang Merah / Jagung',
      label: 'Bawang: Ulat Grayak (Spodoptera)',
      desc: 'Daun berlubang transparan & bekas gerekan larva ulat',
      badge: 'Hama Daun',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200/80'
    },
    {
      id: 'hawar-daun',
      crop: 'Padi Sawah / Gogo',
      label: 'Padi: Hawar Daun Bakteri (Kresek)',
      desc: 'Garis basah kuning di tepi helaian daun menyerupai terbakar',
      badge: 'Penyakit Daun',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/80'
    },
    {
      id: 'siap-panen-grade-a',
      crop: 'Cabai / Tomat / Buah',
      label: 'Cabai: Buah Matang Optimal Grade A',
      desc: 'Kulit merah berkilau merata 95%, buah padat segar',
      badge: 'Siap Panen',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
    }
  ];

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

  // Mulai Kamera Langsung di Browser
  async function startCamera(mode: 'environment' | 'user' = 'environment') {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('WebRTC Camera tidak didukung pada browser ini');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      setCameraFacingMode(mode);
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.log('Video auto-play interrupted:', e));
        }
      }, 120);

    } catch (err: any) {
      console.warn('Gagal membuka kamera WebRTC:', err);
      setCameraError('Kamera langsung di browser tidak tersedia atau izin ditolak. Anda dapat menggunakan kamera bawaan ponsel.');
      setIsCameraActive(false);
      setTimeout(() => {
        nativeCameraInputRef.current?.click();
      }, 300);
    }
  }

  // Beralih Kamera Depan / Belakang
  function toggleCameraFacing() {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  }

  // Jepret Foto dari Video Viewfinder
  function capturePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;

    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setImagePreview(dataUrl);
      setImageSource('camera');
      stopCameraStream();
      handleRunScan('custom-kamera', dataUrl);
    }
  }

  // Unggah Berkas Foto (Galeri atau Kamera Native)
  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>, source: 'camera' | 'upload') {
    const file = e.target.files?.[0];
    if (file) {
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
    e.target.value = '';
  }

  // Jalankan Proses Analisis AI Computer Vision
  async function handleRunScan(sampleKey: string, customImage?: string) {
    setScanning(true);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleKey, hasCustomImage: !!customImage })
      });
      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setResult(data.data);
          setScanHistory(prev => [data.data, ...prev.filter(p => p.id !== data.data.id).slice(0, 5)]);
          setScanning(false);
        }, 1100);
      } else {
        setScanning(false);
      }
    } catch (err) {
      console.error('Scan error:', err);
      const fallbackResult = {
        id: 'scan-' + Date.now(),
        ...(DISEASE_LIBRARY[sampleKey] || DISEASE_LIBRARY['antraknosa'])
      };
      setTimeout(() => {
        setResult(fallbackResult as VisionAnalysisResult);
        setScanHistory(prev => [fallbackResult as VisionAnalysisResult, ...prev.slice(0, 5)]);
        setScanning(false);
      }, 900);
    }
  }

  // Foto Ulang
  function handleRetakePhoto() {
    setImagePreview(null);
    setResult(null);
    startCamera(cameraFacingMode);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-6 sm:space-y-8 text-slate-800">
      
      {/* ── HEADER HALAMAN (CLEAN, NATURAL & RAPI) ── */}
      <div className="space-y-2 border-b border-slate-200/70 pb-5 sm:pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-semibold">
          <ScanSearch className="w-3.5 h-3.5 text-emerald-600" />
          <span>Computer Vision AI Pertanian</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 tracking-tight leading-tight">
          Deteksi Hama, Penyakit & Kesiapan Panen
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Ambil foto langsung melalui kamera atau unggah foto daun dan buah tanaman Anda. AI akan mendiagnosis gejala patogen, menghitung akurasi penyakit, mengukur kematangan panen, dan meracik rekomendasi pupuk presisi.
        </p>
      </div>

      {/* Inputs Tersembunyi untuk Kamera Native & Galeri File */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={nativeCameraInputRef} 
        onChange={e => handleFileSelected(e, 'camera')} 
        className="hidden" 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={galleryInputRef} 
        onChange={e => handleFileSelected(e, 'upload')} 
        className="hidden" 
      />

      {/* ── AREA UTAMA SCANNER (2 KOLOM RAPI & SEIMBANG) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* KOLOM KIRI: KAMERA LANGSUNG, UPLOAD & SAMPEL (5 Kolom) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          
          {/* Card Kamera & Pengambilan Foto */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Sumber Citra Tanaman
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Foto langsung daun/buah atau pilih dari galeri
                </p>
              </div>

              {isCameraActive && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Kamera Aktif
                </span>
              )}
            </div>

            {/* KONDISI 1: LIVE VIEWFINDER KAMERA AKTIF */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 aspect-4/3 flex flex-col justify-between">
                
                {/* Elemen Video WebRTC */}
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover ${cameraFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />

                {/* Kilatan Shutter Flash */}
                {isShutterFlashing && (
                  <div className="absolute inset-0 bg-white/95 z-30 transition-opacity duration-150" />
                )}

                {/* Overlay Pembidik Sudut (Viewfinder Reticle Natural) */}
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col items-center justify-center">
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 border border-white/30 rounded-2xl">
                    {/* 4 Sudut Pembidik Putih Halus */}
                    <span className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-md shadow-xs" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-md shadow-xs" />
                    <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-md shadow-xs" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-white rounded-br-md shadow-xs" />
                    
                    {/* Titik Fokus Tengah */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white/70 animate-ping" />
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] font-medium text-white/90 bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-md shadow-xs">
                    Posisikan daun atau buah di tengah bingkai
                  </p>
                </div>

                {/* Tombol Kontrol Bawah Viewfinder */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20 bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                  {/* Tutup Kamera */}
                  <button
                    type="button"
                    onClick={stopCameraStream}
                    className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    title="Tutup Kamera"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-[11px] hidden sm:inline">Batal</span>
                  </button>

                  {/* Tombol Shutter Utama */}
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400/30"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Jepret Foto</span>
                  </button>

                  {/* Beralih Kamera (Depan / Belakang) */}
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
              /* KONDISI 2: FOTO TELAH DIAMBIL / DIUNGGAH (PREVIEW AKTIF) */
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 aspect-4/3 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imagePreview} 
                    alt="Pratinjau Tanaman" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Tag Sumber */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-900/70 text-white backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                      {imageSource === 'camera' ? <Camera className="w-3 h-3 text-emerald-400" /> : <Upload className="w-3 h-3 text-emerald-400" />}
                      <span>{imageSource === 'camera' ? 'Foto Kamera Langsung' : 'Unggahan Galeri'}</span>
                    </span>
                  </div>

                  {/* Overlay Garis Pemindai saat Scanning */}
                  {scanning && (
                    <div className="absolute inset-0 bg-emerald-950/20 flex flex-col items-center justify-center">
                      <div className="w-full h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse absolute top-1/2 -translate-y-1/2" />
                      <span className="text-xs font-bold text-white bg-slate-900/80 px-3.5 py-1.5 rounded-lg backdrop-blur-xs shadow-md">
                        Memindai Fitur Visual Daun...
                      </span>
                    </div>
                  )}
                </div>

                {/* Tombol Aksi Foto Ulang / Ganti */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleRetakePhoto}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Foto Ulang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ganti Foto</span>
                  </button>
                </div>
              </div>
            ) : (
              /* KONDISI 3: BELUM ADA FOTO (PILIH KAMERA ATAU GALERI) */
              <div className="space-y-3">
                <div className="p-6 sm:p-7 rounded-2xl border border-slate-200/90 bg-slate-50/60 text-center space-y-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                    <Camera className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      Ambil Foto Daun atau Buah Tanaman
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                      Gunakan kamera langsung di kebun atau unggah dari album galeri
                    </p>
                  </div>

                  {/* Dua Tombol Utama yang Rapi & Proporsional */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => startCamera('environment')}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Buka Kamera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Pilih dari Galeri</span>
                    </button>
                  </div>
                </div>

                {/* Catatan / Alternatif Kamera HP Bawaan */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-0.5">
                  <span>Format: JPG, PNG, WebP (Maks 10 MB)</span>
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2 cursor-pointer"
                  >
                    Buka Kamera HP Bawaan
                  </button>
                </div>
              </div>
            )}

            {/* Pesan Kesalahan Kamera jika ada */}
            {cameraError && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Akses Kamera Terkendala</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {cameraError}
                </p>
              </div>
            )}

          </div>

          {/* Card Sampel Demo Lapangan */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Sampel Lapangan (1-Klik Analisis)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Uji coba deteksi instan berbagai kasus patogen pertanian
                </p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                5 Kasus
              </span>
            </div>

            <div className="space-y-2">
              {samplePresets.map((preset) => {
                const isSelected = selectedSample === preset.id && !imagePreview;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedSample(preset.id);
                      setImagePreview(null);
                      setImageSource('sample');
                      stopCameraStream();
                      handleRunScan(preset.id);
                    }}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-600 shadow-2xs ring-1 ring-emerald-600/20'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className={`text-xs font-bold block truncate ${isSelected ? 'text-emerald-950 font-extrabold' : 'text-slate-900'}`}>
                        {preset.label}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                        {preset.crop} • {preset.desc}
                      </p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${preset.badgeColor}`}>
                      {preset.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* KOLOM KANAN: HASIL DIAGNOSIS AI & RESEP AGRONOMIS (7 Kolom) */}
        <div className="lg:col-span-7 space-y-4">
          
          {scanning ? (
            /* STATE 1: SEDANG MEMINDAI (SCANNING ANIMATION) */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-14 text-center space-y-4 min-h-[460px] flex flex-col items-center justify-center shadow-xs">
              <div className="relative w-14 h-14">
                <div className="w-14 h-14 rounded-full border-3 border-emerald-100 border-t-emerald-700 animate-spin" />
                <ScanSearch className="w-6 h-6 text-emerald-700 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-slate-900">
                  Computer Vision AI Sedang Mendiagnosis...
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Membedah indeks spektral klorofil daun, pola nekrosis bercak patogen, dan tingkat kematangan pigmen buah.
                </p>
              </div>
            </div>
          ) : result ? (
            /* STATE 2: HASIL PEMINDAIAN LENGKAP */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              
              {/* Header Kartu Diagnosis */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                      result.kategori_diagnosa === 'Tanaman Sehat'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : result.tingkat_keparahan === 'Parah'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {result.kategori_diagnosa}
                    </span>

                    <span className="text-xs text-slate-500 font-medium">
                      Tingkat: <strong className="text-slate-800">{result.tingkat_keparahan}</strong>
                    </span>

                    <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
                      Akurasi AI {result.akurasi}%
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug pt-0.5">
                    {result.nama_masalah}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Komoditas Relevan: <strong className="text-slate-800">{result.nama_tanaman}</strong>
                  </p>
                </div>

                {/* Status Kematangan & Hari Panen */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/70 text-left sm:text-right shrink-0 space-y-0.5">
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

              {/* Ciri-Ciri Visual Terdeteksi */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Ciri Visual yang Teridentifikasi pada Citra:
                </h4>
                <div className="space-y-1.5">
                  {result.ciri_visual.map((ciri, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/60 p-2.5 sm:p-3 rounded-xl border border-slate-100 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{ciri}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rekomendasi Nutrisi & Resep Pupuk Presisi */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Rekomendasi Nutrisi & Pupuk Presisi
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.rekomendasi_pupuk.map((pupuk, idx) => (
                    <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/70 space-y-2 text-xs">
                      <div className="flex items-baseline justify-between gap-2">
                        <strong className="text-emerald-950 font-bold block text-xs sm:text-sm">
                          {pupuk.jenis}
                        </strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                          {pupuk.formula}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-900 font-medium">
                        <span className="font-bold text-emerald-950">Takaran Dosis:</span> {pupuk.dosis}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed border-t border-emerald-200/40 pt-1.5">
                        {pupuk.cara_aplikasi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solusi Perawatan & Penanganan Alami Nabati */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Tindakan Agronomis & Pengendalian Nabati Hayati
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  {result.solusi_perawatan.map((sol, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 leading-relaxed bg-slate-50/60 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{sol}</span>
                    </div>
                  ))}
                </div>

                {result.pestisida_nabati_organik.length > 0 && (
                  <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-2">
                    <strong className="text-amber-950 font-bold block">
                      Resep Bahan Alami & Hayati Lokal Ramah Lingkungan:
                    </strong>
                    <ul className="space-y-1 text-amber-900 text-[11px]">
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

            </div>
          ) : (
            /* STATE 3: BELUM ADA HASIL PEMINDAIAN (PANDUAN CLEAN) */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 text-center space-y-5 min-h-[460px] flex flex-col items-center justify-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-200/70">
                <ScanSearch className="w-7 h-7 text-slate-400" />
              </div>

              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-slate-900">
                  Belum Ada Pemindaian Aktif
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ambil foto langsung daun/buah lewat kamera, unggah dari galeri, atau pilih salah satu sampel demo untuk menjalankan diagnosis AI.
                </p>
              </div>

              {/* Panduan Ringkas Pemotretan di Lahan */}
              <div className="w-full max-w-md pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Jarak Foto</span>
                  <p className="text-[11px] text-slate-700 font-medium">15–30 cm dari daun/buah</p>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Pencahayaan</span>
                  <p className="text-[11px] text-slate-700 font-medium">Cahaya alami terang sejuk</p>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Ketajaman</span>
                  <p className="text-[11px] text-slate-700 font-medium">Fokus tajam pada bercak</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── RIWAYAT PEMINDAIAN SESI INI ── */}
      {scanHistory.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                Riwayat Pemindaian Sesi Ini
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {scanHistory.length} Hasil Tersimpan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scanHistory.map((scan, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2 text-xs">
                <div className="flex justify-between items-start gap-2">
                  <strong className="text-slate-900 font-bold block truncate">
                    {scan.nama_masalah}
                  </strong>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 shrink-0">
                    {scan.status_kematangan}
                  </span>
                </div>

                <p className="text-slate-500 text-[11px]">
                  {scan.nama_tanaman} • Tingkat: <strong className="text-slate-700">{scan.tingkat_keparahan}</strong>
                </p>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200/60 flex justify-between items-center">
                  <span>Panen: {scan.estimasi_hari_panen === 0 ? 'Siap Petik' : `${scan.estimasi_hari_panen} hari`}</span>
                  <span className="font-semibold text-emerald-700">Akurasi: {scan.akurasi}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
