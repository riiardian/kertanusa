'use client';

import { useState, useRef, useEffect } from 'react';
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
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  RefreshCw
} from 'lucide-react';
import PixelScanOverlay from '@/components/PixelScanOverlay';
import { VisionAnalysisResult } from '@/lib/types';
import { DISEASE_LIBRARY } from '@/lib/vision_ai';

export default function ScanAiPage() {
  // ── STEP WIZARD STATE (1: Input, 2: Pratinjau, 3: Hasil) ──
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Data State
  const [selectedCrop, setSelectedCrop] = useState<string>('Deteksi Otomatis AI');
  const [selectedSample, setSelectedSample] = useState<string>('antraknosa');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<'camera' | 'upload' | 'sample'>('camera');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<VisionAnalysisResult | null>(null);
  const [resultTab, setResultTab] = useState<'pupuk' | 'nabati'>('pupuk');

  // State Kamera Langsung (WebRTC)
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isShutterFlashing, setIsShutterFlashing] = useState<boolean>(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Komoditas Pilihan Cepat di Step 2
  const cropOptions = [
    { name: 'Deteksi Otomatis AI', defaultKey: 'auto' },
    { name: 'Mangga', defaultKey: 'antraknosa' },
    { name: 'Cabai', defaultKey: 'antraknosa' },
    { name: 'Padi', defaultKey: 'hawar-daun' },
    { name: 'Bawang Merah', defaultKey: 'ulat-grayak' },
    { name: 'Jagung', defaultKey: 'bulai-jagung' },
    { name: 'Jeruk', defaultKey: 'jeruk' },
    { name: 'Tomat', defaultKey: 'antraknosa' },
    { name: 'Lainnya', defaultKey: 'siap-panen-grade-a' }
  ];

  // Sampel Kasus Nyata Petani
  const samplePresets = [
    {
      id: 'antraknosa',
      crop: 'Cabai',
      label: 'Cabai: Antraknosa (Patek Buah)',
      desc: 'Bercak hitam melingkar cekung pada buah',
      badge: 'Penyakit Buah',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/80'
    },
    {
      id: 'kutu-kebul',
      crop: 'Cabai',
      label: 'Cabai: Kutu Kebul & Virus Kuning',
      desc: 'Daun keriting mangkok & vektor virus kuning',
      badge: 'Hama Vektor',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/80'
    },
    {
      id: 'ulat-grayak',
      crop: 'Bawang Merah',
      label: 'Bawang: Ulat Grayak (Spodoptera)',
      desc: 'Daun berlubang transparan & bekas gerekan larva',
      badge: 'Hama Daun',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200/80'
    },
    {
      id: 'hawar-daun',
      crop: 'Padi',
      label: 'Padi: Hawar Daun Bakteri (Kresek)',
      desc: 'Garis basah kuning di tepi daun menyerupai terbakar',
      badge: 'Penyakit Daun',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/80'
    },
    {
      id: 'bulai-jagung',
      crop: 'Jagung',
      label: 'Jagung: Bulai Jagung (Peronosclerospora)',
      desc: 'Garis klorotik putih sejajar tulang daun',
      badge: 'Penyakit Daun',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/80'
    },
    {
      id: 'siap-panen-grade-a',
      crop: 'Cabai',
      label: 'Cabai: Buah Matang Optimal Grade A',
      desc: 'Kulit merah berkilau merata 95%, buah padat prima',
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

  // Mulai Kamera WebRTC
  async function startCamera(mode: 'environment' | 'user' = 'environment') {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Kamera tidak didukung di browser ini.');
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
          videoRef.current.play().catch(e => console.log('Autoplay video:', e));
        }
      }, 120);

    } catch (err: any) {
      console.warn('Gagal buka kamera WebRTC:', err);
      setCameraError('Izin kamera tidak aktif. Mengalihkan ke kamera bawaan perangkat...');
      setIsCameraActive(false);
      setTimeout(() => {
        nativeCameraInputRef.current?.click();
      }, 300);
    }
  }

  function toggleCameraFacing() {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  }

  // Kompresi Citra Client-Side Otomatis (Percepat Kirim & Proses AI)
  function compressImage(file: File, maxDim = 1280, quality = 0.82): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  // Ambil Foto dari Viewfinder Kamera
  function capturePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;

    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 180);

    const canvas = document.createElement('canvas');
    let width = video.videoWidth || 640;
    let height = video.videoHeight || 480;
    const maxDim = 1280;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setImagePreview(dataUrl);
      setImageSource('camera');
      stopCameraStream();
      setStep(2); // Otomatis maju ke Step 2 (Pratinjau)
    }
  }

  // Unggah File dari Galeri atau Kamera Bawaan (Kompresi Ringan & Cepat)
  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>, source: 'camera' | 'upload') {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await compressImage(file, 1280, 0.82);
      setImagePreview(dataUrl);
      setImageSource(source);
      stopCameraStream();
      setStep(2); // Otomatis maju ke Step 2 (Pratinjau)
    }
    e.target.value = '';
  }

  // Pilih Sampel Simulasi
  function handleSelectSample(presetId: string, cropName: string) {
    setSelectedSample(presetId);
    setSelectedCrop(cropName);
    setImagePreview(null);
    setImageSource('sample');
    stopCameraStream();
    setStep(2); // Maju ke Step 2 (Pratinjau)
  }

  // Jalankan Proses Analisis AI (Respons Cepat Tanpa Delay Buatan)
  async function handleRunScan() {
    setScanning(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: imagePreview,
          sampleKey: imageSource === 'sample' ? selectedSample : undefined,
          cropName: selectedCrop === 'Deteksi Otomatis AI' ? undefined : selectedCrop
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        setScanning(false);
        setStep(3); // Langsung masuk ke Step 3 (Hasil)
      } else {
        setScanning(false);
      }
    } catch (err) {
      console.error('Scan error:', err);
      const fallbackResult = {
        id: 'scan-' + Date.now(),
        ...(DISEASE_LIBRARY[selectedSample] || DISEASE_LIBRARY['antraknosa'])
      };
      setResult(fallbackResult as VisionAnalysisResult);
      setScanning(false);
      setStep(3); // Masuk ke Step 3 (Hasil)
    }
  }

  // Reset & Foto Ulang (Kembali ke Step 1)
  function handleReset() {
    stopCameraStream();
    setImagePreview(null);
    setResult(null);
    setStep(1);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-6 sm:space-y-8 text-slate-800">
      
      {/* ── HEADER HALAMAN (RINGKAS & BERSIH) ── */}
      <div className="text-center space-y-2 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-semibold">
          <ScanSearch className="w-3.5 h-3.5 text-emerald-600" />
          <span>Computer Vision AI Pertanian</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Deteksi Hama, Penyakit & Kesiapan Panen
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Diagnosis gejala daun dan buah tanaman secara instan. Dapatkan rekomendasi penanganan dan dosis pupuk presisi untuk petani.
        </p>
      </div>

      {/* ── STEPPER WIZARD INDICATOR (CLEAN & MINIMALIS) ── */}
      <div className="max-w-md sm:max-w-xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
          
          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 select-none">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 1
                  ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow-sm'
                  : step > 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border-2 border-slate-300 text-slate-500'
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
            </div>
            <span className={`text-[11px] font-semibold ${step === 1 ? 'text-emerald-900 font-bold' : 'text-slate-500'}`}>
              Foto Tanaman
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 select-none">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 2
                  ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow-sm'
                  : step > 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
            </div>
            <span className={`text-[11px] font-semibold ${step === 2 ? 'text-emerald-900 font-bold' : 'text-slate-500'}`}>
              Pratinjau
            </span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 select-none">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 3
                  ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow-sm'
                  : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}
            >
              3
            </div>
            <span className={`text-[11px] font-semibold ${step === 3 ? 'text-emerald-900 font-bold' : 'text-slate-500'}`}>
              Hasil Diagnosis
            </span>
          </div>
        </div>
      </div>

      {/* Hidden Inputs */}
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

      {/* ══════════════════════════════════════════════════════════════════════
          LANGKAH 1: AMBIL FOTO / INPUT CITRA (CLEAN & MINIMALIS)
      ══════════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="max-w-3xl lg:max-w-4xl mx-auto space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
            
            {/* Viewfinder Kamera WebRTC jika aktif */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 aspect-4/3 flex flex-col justify-between">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover ${cameraFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />

                {isShutterFlashing && (
                  <div className="absolute inset-0 bg-white/95 z-30 transition-opacity duration-150" />
                )}

                {/* Reticle Pembidik */}
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col items-center justify-center">
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 border border-white/30 rounded-2xl">
                    <span className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-md" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-md" />
                    <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-md" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-white rounded-br-md" />
                  </div>
                  <p className="mt-3 text-[11px] font-medium text-white/90 bg-slate-900/70 px-3 py-1 rounded-full backdrop-blur-md">
                    Arahkan daun atau buah di tengah kotak
                  </p>
                </div>

                {/* Kontrol Bawah Viewfinder */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20 bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={stopCameraStream}
                    className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Batal</span>
                  </button>

                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400/30"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Jepret Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Putar Kamera"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    <span>Putar</span>
                  </button>
                </div>
              </div>
            ) : (
              /* State Standar Tanpa Kamera Aktif */
              <div className="text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                  <Camera className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Ambil Foto Daun atau Buah Tanaman
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Arahkan kamera pada bagian yang memiliki gejala bercak, hama, atau buah menjelang panen.
                  </p>
                </div>

                {/* 2 Tombol Aksi Utama */}
                <div className="space-y-2.5 pt-2 max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={() => startCamera('environment')}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Buka Kamera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Pilih dari Galeri</span>
                  </button>
                </div>

                {/* Pesan Kesalahan jika ada */}
                {cameraError && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left">
                    {cameraError}
                  </div>
                )}

                {/* Tips Pemotretan Ringkas */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-slate-600">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Jarak</span>
                    <span className="text-[11px] font-semibold text-slate-700">15–30 cm</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Cahaya</span>
                    <span className="text-[11px] font-semibold text-slate-700">Terang Alami</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Fokus</span>
                    <span className="text-[11px] font-semibold text-slate-700">Tajam Jelas</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          LANGKAH 2: PRATINJAU & PILIHAN TANAMAN (2-KOLOM DESKTOP PROPORSI PENUH)
      ══════════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Kolom Kiri (Lg 7/12): Frame Foto Pratinjau Besar & Lega */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 w-full h-[300px] sm:h-[400px] lg:h-[460px] flex items-center justify-center">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={imagePreview} 
                      alt="Pratinjau Tanaman" 
                      className="w-full h-full object-contain sm:object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-white space-y-2">
                      <ScanSearch className="w-8 h-8 text-emerald-400 mx-auto" />
                      <p className="text-xs font-bold">Mode Simulasi Sampel Lapangan</p>
                      <span className="text-[11px] text-white/70 block">
                        {samplePresets.find(p => p.id === selectedSample)?.label}
                      </span>
                    </div>
                  )}

                  {/* Tag Sumber */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                      {imageSource === 'camera' ? <Camera className="w-3 h-3 text-emerald-400" /> : <Upload className="w-3 h-3 text-emerald-400" />}
                      <span>{imageSource === 'camera' ? 'Foto Kamera' : imageSource === 'upload' ? 'Unggahan Galeri' : 'Sampel Lapangan'}</span>
                    </span>
                  </div>

                  {/* Animasi Dot Matrix & Laser Scanner AI */}
                  {scanning && <PixelScanOverlay />}
                </div>

                <p className="text-[11px] text-slate-500 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Foto siap dianalisis. Pilih komoditas spesifik atau gunakan deteksi otomatis AI.</span>
                </p>
              </div>

              {/* Kolom Kanan (Lg 5/12): Panel Konfirmasi & Aksi */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Konfirmasi Komoditas
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bantu AI menentukan diagnosa agronomis yang lebih spesifik.
                    </p>
                  </div>

                  {/* Pilihan Komoditas */}
                  <div className="space-y-2.5">
                    {/* Default: Deteksi Otomatis AI (Full Width) */}
                    <button
                      type="button"
                      disabled={scanning}
                      onClick={() => {
                        setSelectedCrop('Deteksi Otomatis AI');
                        if (imageSource === 'sample') setSelectedSample('auto');
                      }}
                      className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        selectedCrop === 'Deteksi Otomatis AI'
                          ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ScanSearch className={`w-4 h-4 ${selectedCrop === 'Deteksi Otomatis AI' ? 'text-white' : 'text-emerald-600'}`} />
                        <span>Deteksi Otomatis AI</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${selectedCrop === 'Deteksi Otomatis AI' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        Rekomendasi
                      </span>
                    </button>

                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Atau Pilih Komoditas Tertentu:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {cropOptions.filter(c => c.name !== 'Deteksi Otomatis AI').map((crop) => {
                          const isSelected = selectedCrop === crop.name;
                          return (
                            <button
                              key={crop.name}
                              type="button"
                              disabled={scanning}
                              onClick={() => {
                                setSelectedCrop(crop.name);
                                if (imageSource === 'sample') {
                                  setSelectedSample(crop.defaultKey);
                                }
                              }}
                              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className="truncate">{crop.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi Bawah */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleRunScan}
                    disabled={scanning}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {scanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menganalisis...</span>
                      </>
                    ) : (
                      <span>Analisis Sekarang</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={scanning}
                    className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    <span>Foto Ulang</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          LANGKAH 3: HASIL DIAGNOSIS LENGKAP & TINDAKAN LAPANGAN
      ══════════════════════════════════════════════════════════════════════ */}
      {step === 3 && result && (
        <div className="max-w-3xl lg:max-w-4xl mx-auto space-y-5">

          {/* KONDISI A: BUKAN KOMODITAS TANAMAN PERTANIAN */}
          {(!result.is_tanaman || result.kategori_diagnosa === 'Non-Pertanian') ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-5">
              
              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {result.nama_masalah || 'Objek Bukan Tanaman Pertanian'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {result.pesan_penolakan || 'Sistem Computer Vision Kertanusa mendeteksi bahwa foto yang diunggah bukan merupakan daun, buah, atau bagian tanaman budidaya pertanian. Pastikan Anda mengambil foto jarak dekat dari komoditas tanaman pangan, hortikultura, atau perkebunan untuk mendapatkan analisis agronomis yang akurat.'}
                </p>
              </div>

              {/* Panduan Foto yang Benar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2 max-w-md mx-auto">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Panduan Pengambilan Foto yang Tepat:
                </span>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Fokuskan lensa kamera pada daun, buah, atau batang tanaman.</li>
                  <li>Pastikan pencahayaan terang alami dan tidak blur/buram.</li>
                  <li>Jarak pengambilan foto ideal antara 15–30 cm.</li>
                </ul>
              </div>

              <div className="pt-2 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ambil Foto Tanaman Ulang</span>
                </button>
              </div>
            </div>
          ) : (
            /* KONDISI B: VALID TANAMAN PERTANIAN */
            <div className="space-y-5">
              
              {/* LEMBAR LAPORAN DIAGNOSIS TUNGGAL & BERSIH (FLAT DESIGN & WIDE DESKTOP) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-100">
                
                {/* 1. Header Identitas Diagnosis */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-base sm:text-xl font-bold text-slate-900 leading-snug">
                        {result.nama_masalah}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Komoditas: <span className="font-semibold text-slate-800">{result.nama_tanaman}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Kesiapan Panen
                      </span>
                      <span className={`text-xs sm:text-sm font-bold block ${
                        result.status_kematangan.includes('Rusak') || result.status_kematangan.includes('Gagal') || result.status_kematangan.includes('Afkir')
                          ? 'text-rose-600'
                          : result.status_kematangan.includes('Super')
                          ? 'text-emerald-700'
                          : 'text-slate-800'
                      }`}>
                        {result.status_kematangan}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {result.status_kematangan.includes('Rusak') || result.status_kematangan.includes('Gagal') || result.status_kematangan.includes('Afkir')
                          ? 'Tidak Layak Panen'
                          : result.estimasi_hari_panen === 0 
                          ? 'Siap Petik Hari Ini' 
                          : `± ${result.estimasi_hari_panen} hari lagi`}
                      </span>
                    </div>
                  </div>

                  {/* 4 Metrik Indikator Flat */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-center">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Kategori</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">{result.kategori_diagnosa}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Keparahan</span>
                      <span className={`text-xs sm:text-sm font-bold ${
                        result.tingkat_keparahan === 'Aman' ? 'text-emerald-700' : result.tingkat_keparahan === 'Parah' ? 'text-rose-700' : 'text-amber-700'
                      }`}>
                        {result.tingkat_keparahan}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Akurasi AI</span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-700">{result.akurasi}%</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimasi Panen</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {result.status_kematangan.includes('Rusak') || result.status_kematangan.includes('Gagal') || result.status_kematangan.includes('Afkir')
                          ? 'Afkir / Rusak'
                          : result.estimasi_hari_panen === 0 ? 'Siap Petik' : `${result.estimasi_hari_panen} Hari`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Ciri Visual Terdeteksi (Flat Clean 2-Column Grid) */}
                <div className="p-6 sm:p-8 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Ciri Visual Terdeteksi
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                    {result.ciri_visual.map((ciri, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{ciri}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Langkah Penanganan Lapangan (Numbered List) */}
                <div className="p-6 sm:p-8 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Langkah Penanganan Lapangan
                  </h3>
                  <div className="space-y-2.5">
                    {result.solusi_perawatan.map((sol, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Rekomendasi Nutrisi & Obat Alami (Center & Full Width 2-Kolom Desktop) */}
                <div className="p-6 sm:p-8 space-y-4">
                  {/* Tab Selector Minimalis Center */}
                  <div className="flex p-1 rounded-xl bg-slate-100 text-xs font-semibold w-full sm:max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={() => setResultTab('pupuk')}
                      className={`flex-1 py-2 px-4 rounded-lg transition-all cursor-pointer ${
                        resultTab === 'pupuk' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Rekomendasi Pupuk
                    </button>

                    <button
                      type="button"
                      onClick={() => setResultTab('nabati')}
                      className={`flex-1 py-2 px-4 rounded-lg transition-all cursor-pointer ${
                        resultTab === 'nabati' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Obat Alami & Nabati
                    </button>
                  </div>

                  {/* Konten Tab 1: Pupuk Presisi (2 Kolom Grid Desktop Full) */}
                  {resultTab === 'pupuk' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {result.rekomendasi_pupuk.map((pupuk, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                          <div className="flex items-baseline justify-between gap-2">
                            <strong className="text-slate-900 font-bold text-xs sm:text-sm">
                              {pupuk.jenis}
                            </strong>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold shrink-0">
                              {pupuk.formula}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-700">Dosis:</span> {pupuk.dosis}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {pupuk.cara_aplikasi}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Konten Tab 2: Obat Nabati Alami (2 Kolom Grid Desktop Full & Center) */}
                  {resultTab === 'nabati' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {result.pestisida_nabati_organik.length > 0 ? (
                        result.pestisida_nabati_organik.map((pes, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/90 space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                Resep Alami {idx + 1}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed pl-7">
                              {pes}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 py-3 text-center sm:col-span-2">
                          Tanaman dalam kondisi sehat, tidak memerlukan aplikasi pestisida.
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* 5. Tombol Aksi Akhir (2 Kolom Desktop Center) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Periksa Tanaman Lain</span>
                </button>

                <Link
                  href="/monitoring"
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs text-center"
                >
                  <span>Buka Dasbor Pemantauan Lahan</span>
                </Link>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
