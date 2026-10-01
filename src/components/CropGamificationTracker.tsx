'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, Sprout, CheckCircle2, Circle, Droplets, 
  Sparkles, Calendar, Clock, Trophy, RefreshCw, 
  ChevronRight, Award, PartyPopper, ArrowRight, ShieldCheck
} from 'lucide-react';
import { PetaniRecord } from '@/lib/types';

interface CropGamificationTrackerProps {
  petaniList?: PetaniRecord[];
}

export default function CropGamificationTracker({ petaniList = [] }: CropGamificationTrackerProps) {
  // Tanaman yang dipilih
  const [selectedId, setSelectedId] = useState<string>('');
  
  // State interaktif tugas harian
  const [tasksDone, setTasksDone] = useState<{ [key: string]: boolean }>({
    siram: false,
    pupuk: false,
    cekHama: false,
  });

  // Counter Streak Api Harian
  const [streakDays, setStreakDays] = useState(14);
  const [showToastPanen, setShowToastPanen] = useState(false);
  const [simulatedDayOffset, setSimulatedDayOffset] = useState(0);

  // Ambil data tanaman aktif
  const currentPlant = petaniList.find(p => p.id === selectedId) || petaniList[0] || {
    id: 'demo-1',
    nama_petani: 'Pak Bambang',
    daerah: 'Brebes, Jawa Tengah',
    jenis_tanaman: 'Padi Ciherang Super',
    umur_hari: 35,
    luas_tanah: 1.5,
    satuan_luas: 'hektar'
  };

  // Kalkulasi fase umur tanaman
  const baseAge = (currentPlant.umur_hari || 35) + simulatedDayOffset;
  const targetHarvestDays = 100;
  const currentAge = Math.min(105, Math.max(1, baseAge));
  const progressPercent = Math.min(100, Math.round((currentAge / targetHarvestDays) * 100));
  const daysLeft = Math.max(0, targetHarvestDays - currentAge);

  // Cek apakah siap panen
  const isSiapPanen = progressPercent >= 100;

  // Efek toast otomatis ketika umur mencapai panen
  useEffect(() => {
    if (isSiapPanen) {
      setShowToastPanen(true);
    }
  }, [isSiapPanen]);

  // Handler selesaikan tugas harian
  const toggleTask = (taskKey: string) => {
    setTasksDone(prev => {
      const nextState = { ...prev, [taskKey]: !prev[taskKey] };
      const allDone = Object.values(nextState).filter(Boolean).length === 3;
      if (allDone && !prev[taskKey]) {
        setStreakDays(s => s + 1);
      }
      return nextState;
    });
  };

  // Tentukan fase pertumbuhan
  const getGrowthStage = () => {
    if (currentAge <= 15) {
      return {
        stage: 1,
        namaFase: 'Fase Tunas & Kecambah',
        desc: 'Bibit baru bertunas dari tanah, akar mulai menancap kuat.',
        warna: 'text-emerald-600',
        badge: 'Kecambah (Hari 1-15)',
        svgType: 'sprout'
      };
    } else if (currentAge <= 45) {
      return {
        stage: 2,
        namaFase: 'Fase Anakan & Daun Rimbun',
        desc: 'Batang mulai bercabang rimbun, daun hijau segar menyerap matahari.',
        warna: 'text-emerald-700',
        badge: 'Vegetatif Aktif (Hari 16-45)',
        svgType: 'growing'
      };
    } else if (currentAge <= 75) {
      return {
        stage: 3,
        namaFase: 'Fase Berbunga & Bulir Hijau',
        desc: 'Muncul bunga malai padi dan bulir padi hijau muda berisi cairan susu.',
        warna: 'text-teal-700',
        badge: 'Generatif Bunga (Hari 46-75)',
        svgType: 'flowering'
      };
    } else if (currentAge < 100) {
      return {
        stage: 4,
        namaFase: 'Fase Pematangan & Menguning',
        desc: 'Bulir padi mulai padat merunduk dan menguning keemasan.',
        warna: 'text-amber-600',
        badge: 'Pematangan Bulir (Hari 76-99)',
        svgType: 'ripening'
      };
    } else {
      return {
        stage: 5,
        namaFase: 'Fase Siap Panen Raya!',
        desc: 'Seluruh malai padi telah menguning sempurna dan siap dipetik!',
        warna: 'text-amber-500 font-extrabold',
        badge: 'Panen Raya (Hari 100+)',
        svgType: 'harvest'
      };
    }
  };

  const stageInfo = getGrowthStage();
  const tasksCompletedCount = Object.values(tasksDone).filter(Boolean).length;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden relative">
      
      {/* Toast Notifikasi Perayaan Siap Panen */}
      {showToastPanen && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 p-4 sm:p-5 flex items-center justify-between shadow-lg animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/90 text-amber-600 flex items-center justify-center shadow-md shrink-0">
              <PartyPopper className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                <span>ðŸŽ‰ Selamat Pak Tani! Tanaman Anda Siap Dipanen Hari Ini!</span>
              </h4>
              <p className="text-xs text-slate-900/90 font-medium">
                {currentPlant.jenis_tanaman} telah mencapai usia {currentAge} hari dengan kematangan sempurna 100%. Waktunya panen raya!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowToastPanen(false)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold shrink-0 cursor-pointer shadow-sm transition-all"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header Gamifikasi: Streak Api & Nama Tanaman */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-1">
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            <span>Petualangan Tani & Pohon Tumbuh</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Perkembangan Pohon & Streak Rawat Sawah</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Selesaikan jadwal harian agar tanaman tumbuh sehat dan api kerajinan Anda terus menyala
          </p>
        </div>

        {/* Counter Streak Api Harian Petani */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center gap-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
              <Flame className="w-5 h-5 animate-pulse text-yellow-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">
                Streak Rawat
              </span>
              <span className="text-base font-extrabold text-slate-900 leading-none">
                {streakDays} Hari ðŸ”¥
              </span>
            </div>
          </div>

          {/* Selektor Tanaman Petani Jika Ada Lebih Dari 1 */}
          {petaniList.length > 1 && (
            <select
              value={selectedId || currentPlant.id}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setSimulatedDayOffset(0);
              }}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {petaniList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama_petani} - {p.jenis_tanaman} ({p.daerah})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Badan Gamifikasi: 2 Kolom (Kiri: Pohon Tumbuh Interaktif, Kanan: Jadwal Quest & Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Kolom Kiri: Visual Pohon Tumbuh (Bentuk Berubah-ubah Berdasarkan Usia) */}
        <div className="lg:col-span-6 p-6 sm:p-8 bg-gradient-to-b from-emerald-50/40 via-sky-50/20 to-amber-50/30 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col items-center justify-between min-h-[380px]">
          
          {/* Badge Fase Saat Ini */}
          <div className="w-full flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-emerald-800 border border-emerald-200 shadow-xs">
              {stageInfo.badge}
            </span>
            <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              Hari ke-{currentAge} dari 100
            </span>
          </div>

          {/* Area Ilustrasi Pohon Dinamis */}
          <div className="relative w-56 h-56 flex items-center justify-center my-4">
            
            {/* Sinar Cahaya Lembut di Belakang Pohon */}
            <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
              isSiapPanen ? 'bg-amber-300/40 scale-125' : 'bg-emerald-200/40 scale-100'
            }`}></div>

            {/* Ilustrasi Bentuk Pohon yang Berubah Sesuai Fase */}
            <div className="relative z-10 transition-all duration-700 transform hover:scale-105">
              
              {/* TAHAP 1: KECAMBAH & TUNAS KECIL (Hari 1-15) */}
              {stageInfo.stage === 1 && (
                <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="drop-shadow-md">
                  {/* Gundukan Tanah */}
                  <ellipse cx="90" cy="145" rx="55" ry="16" fill="#8D6E63" />
                  <ellipse cx="90" cy="142" rx="45" ry="12" fill="#6D4C41" />
                  {/* Batang Tunas Kecil */}
                  <path d="M90 140 C90 120, 85 105, 88 95" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" />
                  {/* Dua Daun Kecambah */}
                  <path d="M88 95 C75 90, 68 75, 78 70 C88 65, 88 88, 88 95 Z" fill="#81C784" />
                  <path d="M88 95 C101 90, 108 75, 98 70 C88 65, 88 88, 88 95 Z" fill="#66BB6A" />
                  {/* Tetes Embun Pagi */}
                  <circle cx="78" cy="72" r="3" fill="#E0F7FA" />
                </svg>
              )}

              {/* TAHAP 2: VEGETATIF RIMBUN (Hari 16-45) */}
              {stageInfo.stage === 2 && (
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="drop-shadow-md">
                  <ellipse cx="100" cy="165" rx="65" ry="18" fill="#6D4C41" />
                  {/* Batang Utama */}
                  <path d="M100 165 C100 125, 96 90, 100 65" stroke="#388E3C" strokeWidth="8" strokeLinecap="round" />
                  {/* Daun Cabang Kiri & Kanan */}
                  <path d="M98 135 C70 130, 50 110, 55 95 C62 82, 85 110, 98 128" fill="#4CAF50" />
                  <path d="M102 120 C130 115, 150 95, 145 80 C138 67, 115 95, 102 113" fill="#43A047" />
                  <path d="M99 90 C75 75, 65 50, 78 45 C90 40, 95 68, 100 80" fill="#66BB6A" />
                  <path d="M101 80 C125 65, 135 40, 122 35 C110 30, 105 58, 100 70" fill="#81C784" />
                </svg>
              )}

              {/* TAHAP 3: BERBUNGA & BULIR HIJAU (Hari 46-75) */}
              {stageInfo.stage === 3 && (
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="drop-shadow-md">
                  <ellipse cx="100" cy="168" rx="68" ry="18" fill="#5D4037" />
                  <path d="M100 168 C100 120, 98 75, 100 48" stroke="#2E7D32" strokeWidth="8" strokeLinecap="round" />
                  {/* Rumpun Padi Hijau */}
                  <path d="M98 125 C60 115, 40 85, 45 60 C55 45, 80 85, 98 115" fill="#43A047" />
                  <path d="M102 115 C140 105, 160 75, 155 50 C145 35, 120 75, 102 105" fill="#388E3C" />
                  {/* Malai Bunga Hijau Muda */}
                  <path d="M100 50 C85 30, 70 25, 60 28" stroke="#8BC34A" strokeWidth="4" strokeLinecap="round" />
                  <path d="M100 48 C115 28, 130 23, 140 26" stroke="#8BC34A" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="62" cy="28" r="4" fill="#CDDC39" />
                  <circle cx="70" cy="26" r="4" fill="#CDDC39" />
                  <circle cx="138" cy="26" r="4" fill="#CDDC39" />
                  <circle cx="130" cy="24" r="4" fill="#CDDC39" />
                </svg>
              )}

              {/* TAHAP 4: BULIR EMAS MENGUNING (Hari 76-99) */}
              {stageInfo.stage === 4 && (
                <svg width="210" height="210" viewBox="0 0 210 210" fill="none" className="drop-shadow-lg">
                  <ellipse cx="105" cy="172" rx="72" ry="18" fill="#4E342E" />
                  <path d="M105 172 C105 125, 103 80, 105 45" stroke="#795548" strokeWidth="8" strokeLinecap="round" />
                  {/* Daun Mulai Menguning */}
                  <path d="M103 125 C65 118, 42 90, 48 68 C58 55, 82 92, 103 118" fill="#8BC34A" />
                  <path d="M107 118 C145 110, 168 82, 162 60 C152 48, 128 85, 107 110" fill="#9CCC65" />
                  {/* Malai Padi Menguning Emas Merunduk */}
                  <path d="M105 45 C80 20, 50 25, 38 45" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                  <path d="M105 42 C130 18, 160 22, 172 42" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                  {/* Bulir Padi Emas */}
                  <circle cx="42" cy="40" r="5" fill="#FBBF24" />
                  <circle cx="55" cy="28" r="5" fill="#FBBF24" />
                  <circle cx="72" cy="22" r="5" fill="#F59E0B" />
                  <circle cx="168" cy="38" r="5" fill="#FBBF24" />
                  <circle cx="155" cy="26" r="5" fill="#FBBF24" />
                  <circle cx="138" cy="20" r="5" fill="#F59E0B" />
                </svg>
              )}

              {/* TAHAP 5: SIAP PANEN RAYA (Hari 100+) */}
              {stageInfo.stage === 5 && (
                <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="drop-shadow-xl animate-pulse">
                  <ellipse cx="110" cy="178" rx="78" ry="20" fill="#3E2723" />
                  {/* Batang Emas Matang */}
                  <path d="M110 178 C110 125, 108 75, 110 40" stroke="#D97706" strokeWidth="9" strokeLinecap="round" />
                  {/* Rumpun Padi Kuning Emas Lebat */}
                  <path d="M108 128 C62 118, 38 85, 45 60 C55 45, 82 92, 108 120" fill="#F59E0B" />
                  <path d="M112 120 C158 110, 182 78, 175 52 C165 38, 138 82, 112 112" fill="#D97706" />
                  {/* Malai Padi Emas Penuh Berat Merunduk */}
                  <path d="M110 40 C78 10, 40 18, 25 45" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
                  <path d="M110 38 C142 8, 180 15, 195 42" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
                  {/* Biji-biji Emas Siap Panen */}
                  <circle cx="28" cy="42" r="6" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
                  <circle cx="45" cy="25" r="6" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
                  <circle cx="68" cy="15" r="6" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />
                  <circle cx="192" cy="40" r="6" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
                  <circle cx="175" cy="22" r="6" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
                  <circle cx="152" cy="12" r="6" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />
                </svg>
              )}

            </div>
          </div>

          {/* Deskripsi Fase & Slider Simulasi Hari */}
          <div className="w-full text-center space-y-2">
            <h4 className={`text-base font-bold ${stageInfo.warna}`}>
              {stageInfo.namaFase}
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {stageInfo.desc}
            </p>

            {/* Slider Pengatur Hari untuk Mencoba Game */}
            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Tes Simulasi Hari:</span>
              <button
                onClick={() => setSimulatedDayOffset(-20)}
                className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border text-[11px] font-semibold text-slate-700 cursor-pointer"
              >
                Hari 15 (Bibit)
              </button>
              <button
                onClick={() => setSimulatedDayOffset(0)}
                className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border text-[11px] font-semibold text-slate-700 cursor-pointer"
              >
                Hari 35 (Saat Ini)
              </button>
              <button
                onClick={() => setSimulatedDayOffset(65)}
                className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold cursor-pointer shadow-xs"
              >
                Hari 100 (Panen ðŸŽ‰)
              </button>
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Jadwal Harian Petani (Daily Quests & Progress Panen) */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          {/* Bar Kemajuan Panen */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Kemajuan Menuju Panen Raya</span>
              </span>
              <span className="text-sm font-extrabold text-emerald-700">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isSiapPanen
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Hari 1: Mulai Tanam</span>
              <span className="font-semibold text-slate-800">
                {isSiapPanen ? 'âœ¨ Siap Dipanen Hari Ini!' : `Tersisa Â±${daysLeft} Hari Lagi`}
              </span>
            </div>
          </div>

          {/* Kartu Jadwal Quest Harian Petani */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Jadwal Rawat Sawah Hari Ini (Daily Quest)</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {tasksCompletedCount}/3 Selesai
              </span>
            </div>

            <div className="space-y-2.5">
              
              {/* Quest 1: Siram Air */}
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                tasksDone.siram ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50/70 border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tasksDone.siram ? 'bg-emerald-600 text-white' : 'bg-sky-100 text-sky-700'
                  }`}>
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${tasksDone.siram ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      Penyiraman Air Sawah Pagi
                    </h5>
                    <p className="text-[10px] text-slate-500">Kebutuhan air tanah 58%, cukup basahi parit sawah</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleTask('siram')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tasksDone.siram
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {tasksDone.siram ? 'âœ“ Selesai' : 'Selesai Siram'}
                </button>
              </div>

              {/* Quest 2: Pupuk Susulan */}
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                tasksDone.pupuk ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50/70 border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tasksDone.pupuk ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${tasksDone.pupuk ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      Jadwal Pemupukan Susulan (NPK/Urea)
                    </h5>
                    <p className="text-[10px] text-slate-500">Fase anakan aktif, berikan 50 kg NPK per hektar</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleTask('pupuk')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tasksDone.pupuk
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {tasksDone.pupuk ? 'âœ“ Selesai' : 'Selesai Dipupuk'}
                </button>
              </div>

              {/* Quest 3: Cek Hama Daun */}
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                tasksDone.cekHama ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50/70 border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tasksDone.cekHama ? 'bg-emerald-600 text-white' : 'bg-purple-100 text-purple-700'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${tasksDone.cekHama ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      Pemeriksaan Hama Daun Pagi
                    </h5>
                    <p className="text-[10px] text-slate-500">Awasi tanda wereng atau bercak cokelat di bawah daun</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleTask('cekHama')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tasksDone.cekHama
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {tasksDone.cekHama ? 'âœ“ Selesai' : 'Selesai Dicek'}
                </button>
              </div>

            </div>
          </div>

          {/* Footer Card: Status Hadiah & Motivasi */}
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {tasksCompletedCount === 3
                  ? 'Luar biasa! Semua tugas sawah hari ini selesai. Streak api Anda bertambah!'
                  : 'Selesaikan 3 tugas hari ini untuk menjaga streak api dan mempercepat panen!'}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
