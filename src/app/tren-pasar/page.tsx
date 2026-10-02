'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, Calendar, DollarSign, CheckCircle2, ArrowUpRight, 
  Calculator, Sprout, ShieldCheck, MapPin, Gauge, AlertTriangle, 
  Layers, Sparkles, User, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';
import { COMMODITY_TRENDS, calculateProfitProjection } from '@/lib/market_demand';
import { 
  MASTER_VARIETIES, 
  recommendBestSeeds, 
  LandConditionInput, 
  RecommendationResult, 
  SeedVariety 
} from '@/lib/seed_recommender';
import { REGIONS } from '@/lib/agro_regions';
import { PetaniRecord } from '@/lib/types';

export default function TrenPasarPage() {
  const [selectedKomoditas, setSelectedKomoditas] = useState<string>(COMMODITY_TRENDS[0].komoditas);
  const [calcLuas, setCalcLuas] = useState<number>(1500);

  // Mode Pemilihan Wilayah: 'petani' | 'daerah' | 'manual'
  const [inputMode, setInputMode] = useState<'petani' | 'daerah' | 'manual'>('petani');
  const [registeredFarmers, setRegisteredFarmers] = useState<PetaniRecord[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [selectedDaerahId, setSelectedDaerahId] = useState<string>(REGIONS[0].id);

  // Parameter Kondisi Lahan Aktif
  const [condition, setCondition] = useState<LandConditionInput>({
    komoditas: 'Padi',
    ketinggian: 'rendah',
    tipe_lahan: 'irigasi_teknis',
    musim: 'hujan',
    ph_tanah: 6.5,
    target_pasar: 'umum'
  });

  // Hasil Rekomendasi Bibit
  const [recommendation, setRecommendation] = useState<RecommendationResult>(() => 
    recommendBestSeeds({
      komoditas: 'Padi',
      ketinggian: 'rendah',
      tipe_lahan: 'irigasi_teknis',
      musim: 'hujan',
      ph_tanah: 6.5,
      target_pasar: 'umum'
    })
  );

  // Fetch Petani Terdaftar
  useEffect(() => {
    fetch('/api/petani')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setRegisteredFarmers(res.data);
          setSelectedFarmerId(res.data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  // Sinkronkan komoditas tab dengan rekomendasi bibit
  const getSeedKomoditasKey = (komoditasName: string): 'Padi' | 'Cabai Rawit Merah' | 'Bawang Merah' | 'Jagung' | 'Tomat' => {
    if (komoditasName.includes('Padi')) return 'Padi';
    if (komoditasName.includes('Cabai')) return 'Cabai Rawit Merah';
    if (komoditasName.includes('Bawang')) return 'Bawang Merah';
    if (komoditasName.includes('Jagung')) return 'Jagung';
    if (komoditasName.includes('Tomat')) return 'Tomat';
    return 'Padi';
  };

  // Saat Petani Terdaftar Dipilih
  useEffect(() => {
    if (inputMode === 'petani' && selectedFarmerId && registeredFarmers.length > 0) {
      const farmer = registeredFarmers.find(f => f.id === selectedFarmerId);
      if (farmer) {
        const ph = farmer.ph_tanah || 6.5;

        const ketinggian = farmer.daerah.toLowerCase().includes('malang') || farmer.daerah.toLowerCase().includes('karo')
          ? 'tinggi'
          : farmer.daerah.toLowerCase().includes('cianjur') || farmer.daerah.toLowerCase().includes('tabanan')
          ? 'sedang'
          : 'rendah';

        const tipeLahan = farmer.daerah.toLowerCase().includes('lombok') || farmer.daerah.toLowerCase().includes('kering')
          ? 'tadah_hujan'
          : 'irigasi_teknis';

        const newCond: LandConditionInput = {
          daerahNama: farmer.daerah,
          komoditas: getSeedKomoditasKey(selectedKomoditas),
          ketinggian,
          tipe_lahan: tipeLahan,
          musim: 'hujan',
          ph_tanah: ph,
          target_pasar: 'umum'
        };

        setCondition(newCond);
        setRecommendation(recommendBestSeeds(newCond));
      }
    }
  }, [inputMode, selectedFarmerId, registeredFarmers, selectedKomoditas]);

  // Saat Daerah Dipilih
  useEffect(() => {
    if (inputMode === 'daerah' && selectedDaerahId) {
      const reg = REGIONS.find(r => r.id === selectedDaerahId) || REGIONS[0];
      const ketinggian = reg.id === 'malang' || reg.id === 'karo'
        ? 'tinggi'
        : reg.id === 'cianjur' || reg.id === 'tabanan'
        ? 'sedang'
        : 'rendah';

      const tipeLahan = reg.id === 'lombok-timur' ? 'tadah_hujan' : 'irigasi_teknis';

      const newCond: LandConditionInput = {
        daerahNama: reg.nama,
        komoditas: getSeedKomoditasKey(selectedKomoditas),
        ketinggian,
        tipe_lahan: tipeLahan,
        musim: 'hujan',
        ph_tanah: reg.ph_rata_rata,
        target_pasar: 'umum'
      };

      setCondition(newCond);
      setRecommendation(recommendBestSeeds(newCond));
    }
  }, [inputMode, selectedDaerahId, selectedKomoditas]);

  // Handler saat ubah manual
  const handleManualConditionChange = (updates: Partial<LandConditionInput>) => {
    const updated = { ...condition, ...updates, komoditas: getSeedKomoditasKey(selectedKomoditas) };
    setCondition(updated);
    setRecommendation(recommendBestSeeds(updated));
  };

  // Handler ganti komoditas tab
  const handleSelectKomoditas = (komoditasName: string) => {
    setSelectedKomoditas(komoditasName);
    const updated = { ...condition, komoditas: getSeedKomoditasKey(komoditasName) };
    setCondition(updated);
    setRecommendation(recommendBestSeeds(updated));
  };

  const currentTrend = COMMODITY_TRENDS.find(t => t.komoditas === selectedKomoditas) || COMMODITY_TRENDS[0];
  const projection = calculateProfitProjection(calcLuas, selectedKomoditas);
  const maxPrice = Math.max(...currentTrend.historis_bulanan.map(h => h.harga));

  const bestSeed = recommendation.varietasTerbaik;
  const altSeeds = recommendation.varietasAlternatif;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-10">
      
      {/* Header Halaman */}
      <div className="space-y-1.5 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sprout className="w-3.5 h-3.5 text-emerald-700" />
          <span>Market Intelligence &amp; Intelligent Seed Matcher</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Daya Beli Pasar &amp; Rekomendasi Bibit Unggul Wilayah
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-4xl leading-relaxed">
          Sistem menganalisis data tren harga pasar Bapanas, musim puncak permintaan, dan secara cerdas <strong>menentukan varietas bibit unggul resmi</strong> yang paling kebal terhadap hama musiman dan paling cocok dengan kondisi tanah serta iklim wilayah lahan petani.
        </p>
      </div>

      {/* Commodity Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Pilih Komoditas Pertanian:
          </span>
          <span className="text-[11px] text-slate-500">
            Sumber acuan: Bapanas &amp; BPS RI
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {COMMODITY_TRENDS.map((item) => {
            const isSelected = selectedKomoditas === item.komoditas;
            return (
              <button
                key={item.komoditas}
                onClick={() => handleSelectKomoditas(item.komoditas)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.komoditas}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  Rp {item.harga_saat_ini.toLocaleString('id-ID')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODUL 1: MESIN PENENTU BIBIT & VARIETAS UNGGUL SESUAI WILAYAH PETANI      */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Penentuan Bibit Terbaik untuk Wilayah Lahan Anda
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Sistem mencocokkan ketinggian lahan, jenis tanah, pH, musim berjalan, dan daya serap pasar untuk merekomendasikan benih bersertifikasi BRIN / Kementan.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start lg:self-center">
            <button
              onClick={() => setInputMode('petani')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputMode === 'petani' 
                  ? 'bg-white text-emerald-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lahan Terdaftar ({registeredFarmers.length})
            </button>
            <button
              onClick={() => setInputMode('daerah')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputMode === 'daerah' 
                  ? 'bg-white text-emerald-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pilih Wilayah
            </button>
            <button
              onClick={() => setInputMode('manual')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputMode === 'manual' 
                  ? 'bg-white text-emerald-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kustom Parameter
            </button>
          </div>
        </div>

        {/* Bar Pemilihan Kondisi Lahan */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-4">
          
          {/* Row 1: Selector sesuai Mode */}
          {inputMode === 'petani' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Pilih Profil Lahan Petani Terdaftar:</span>
              </div>
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                className="w-full sm:w-auto min-w-[280px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-emerald-600"
              >
                {registeredFarmers.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.nama_petani} - {f.daerah} ({f.luas_tanah} {f.satuan_luas})
                  </option>
                ))}
              </select>
            </div>
          )}

          {inputMode === 'daerah' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Pilih Sentra Pertanian Wilayah Indonesia:</span>
              </div>
              <select
                value={selectedDaerahId}
                onChange={(e) => setSelectedDaerahId(e.target.value)}
                className="w-full sm:w-auto min-w-[280px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-emerald-600"
              >
                {REGIONS.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nama} (Tanah: {r.jenis_tanah}, pH {r.ph_rata_rata})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Interactive Parameters Quick Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-200/70 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Ketinggian Lahan:</span>
              {inputMode === 'manual' ? (
                <select
                  value={condition.ketinggian}
                  onChange={(e) => handleManualConditionChange({ ketinggian: e.target.value as any })}
                  className="mt-1 w-full p-1.5 rounded-md border border-slate-300 bg-white font-bold text-slate-900 text-xs"
                >
                  <option value="rendah">Dataran Rendah (&lt;400 mdpl)</option>
                  <option value="sedang">Dataran Sedang (400-700 mdpl)</option>
                  <option value="tinggi">Dataran Tinggi (&gt;700 mdpl)</option>
                </select>
              ) : (
                <span className="font-bold text-slate-800 capitalize">
                  Dataran {condition.ketinggian}
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Tipe Lahan / Pengairan:</span>
              {inputMode === 'manual' ? (
                <select
                  value={condition.tipe_lahan}
                  onChange={(e) => handleManualConditionChange({ tipe_lahan: e.target.value as any })}
                  className="mt-1 w-full p-1.5 rounded-md border border-slate-300 bg-white font-bold text-slate-900 text-xs"
                >
                  <option value="irigasi_teknis">Sawah Irigasi Teknis</option>
                  <option value="tadah_hujan">Sawah Tadah Hujan</option>
                  <option value="rawa_pasangsurut">Lahan Rawa / Pasang Surut</option>
                  <option value="lahan_kering">Lahan Kering / Gogo</option>
                </select>
              ) : (
                <span className="font-bold text-slate-800">
                  {condition.tipe_lahan.replace('_', ' ')}
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Musim Tanam Saat Ini:</span>
              {inputMode === 'manual' ? (
                <select
                  value={condition.musim}
                  onChange={(e) => handleManualConditionChange({ musim: e.target.value as any })}
                  className="mt-1 w-full p-1.5 rounded-md border border-slate-300 bg-white font-bold text-slate-900 text-xs"
                >
                  <option value="hujan">Musim Hujan (Rendengan)</option>
                  <option value="kemarau">Musim Kemarau (Gadu)</option>
                  <option value="pancaroba">Pancaroba / Peralihan</option>
                </select>
              ) : (
                <span className="font-bold text-slate-800 capitalize">
                  Musim {condition.musim}
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">pH Tanah Terdeteksi:</span>
              {inputMode === 'manual' ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="8.5"
                    value={condition.ph_tanah}
                    onChange={(e) => handleManualConditionChange({ ph_tanah: Number(e.target.value) })}
                    className="w-20 p-1.5 rounded-md border border-slate-300 bg-white font-bold text-slate-900 text-xs"
                  />
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {condition.ph_tanah < 5.5 ? 'Masam' : condition.ph_tanah > 7.0 ? 'Basa' : 'Netral'}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-slate-800">
                  pH {condition.ph_tanah} ({condition.ph_tanah < 5.5 ? 'Masam' : condition.ph_tanah > 7.0 ? 'Basa' : 'Netral & Sehat'})
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Diagnosa Risiko Agroekologi Wilayah */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Diagnosa Faktor Wilayah &amp; Risiko Hama/Penyakit:</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-[11.5px]">
            {recommendation.diagnosaAgronomis.ancaman_utama} {recommendation.diagnosaAgronomis.kesimpulan_strategi}
          </p>
        </div>

        {/* KARTU HASIL: BIBIT PILIHAN UTAMA (#1) & ALTERNATIF (#2) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1">
          
          {/* Kartu Utama (#1 - 2 Kolom Lebar) */}
          <div className="lg:col-span-2 rounded-2xl border-2 border-emerald-500 bg-white p-5 sm:p-6 space-y-5 relative shadow-sm">
            
            {/* Badge Rekomendasi Utama */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wide">
                  Pilihan Utama Sistem
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Kecocokan {bestSeed.skor_kecocokan}%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Komoditas: <strong className="text-slate-700">{bestSeed.komoditas}</strong>
              </span>
            </div>

            {/* Nama Varietas & Pemulia */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>{bestSeed.nama_varietas}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Resmi dirilis oleh: <strong className="text-slate-700 font-semibold">{bestSeed.pemulia_resmi}</strong>
              </p>
            </div>

            {/* Grid 4 Indikator Performa Bibit */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Potensi Panen</span>
                <strong className="text-xs sm:text-sm font-extrabold text-slate-900 block mt-0.5">
                  {bestSeed.potensi_hasil}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Umur Panen</span>
                <strong className="text-xs sm:text-sm font-extrabold text-slate-900 block mt-0.5">
                  {bestSeed.umur_panen}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Daya Serap Pasar</span>
                <strong className="text-xs sm:text-sm font-extrabold text-emerald-700 block mt-0.5">
                  {bestSeed.daya_serap_pasar}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Estimasi Harga Jual</span>
                <strong className="text-xs sm:text-sm font-extrabold text-slate-900 block mt-0.5">
                  {bestSeed.estimasi_harga_jual}
                </strong>
              </div>
            </div>

            {/* Alasan Kenapa Sistem Memilih Bibit Ini */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">
                Mengapa Varietas Ini Paling Tepat untuk Lahan Anda?
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {bestSeed.alasan_rekomendasi}
              </p>
            </div>

            {/* Karakteristik Kualitas & Ketahanan Hama */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 block">
                Profil Ketahanan Hama &amp; Karakteristik Tanaman:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bestSeed.ketahanan_hama_penyakit.map((ket, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{ket}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                <strong>Kualitas Hasil:</strong> {bestSeed.tekstur_atau_kualitas}
              </div>
            </div>

          </div>

          {/* Kartu Alternatif Cadangan (#2 - 1 Kolom) */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10.5px] font-bold">
                  Alternatif Unggul #2
                </span>
                {altSeeds[0] && (
                  <span className="text-[11px] font-bold text-slate-600">
                    Kecocokan {altSeeds[0].skor_kecocokan}%
                  </span>
                )}
              </div>

              {altSeeds[0] ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {altSeeds[0].nama_varietas}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pemulia: {altSeeds[0].pemulia_resmi}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10.5px]">Potensi:</span>
                      <strong className="text-slate-800">{altSeeds[0].potensi_hasil}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10.5px]">Umur:</span>
                      <strong className="text-slate-800">{altSeeds[0].umur_panen}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10.5px]">Pasar:</span>
                      <strong className="text-emerald-700 font-bold">{altSeeds[0].kategori_pasar}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {altSeeds[0].alasan_rekomendasi}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-slate-800 block">Kelebihan Khusus:</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {altSeeds[0].keunggulan_utama}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Tidak ada varietas alternatif lain untuk kategori ini.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
              <em>Gunakan varietas alternatif jika benih varietas utama sulit didapat di distributor setempat.</em>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* MODUL 2: RISET DAYA BELI, GRAFIK HARGA BULANAN & KALKULATOR SIMULASI      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Historical Chart &amp; Seasonal Drivers */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Price Chart Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Grafik Tren Harga Bulanan: {currentTrend.komoditas}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    +{currentTrend.persentase_tren}%
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Rata-rata harga grosir acuan pasar nasional (Rp / kg)</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Harga Acuan Sekarang:</span>
                <p className="text-xl font-extrabold text-emerald-700">
                  Rp {currentTrend.harga_saat_ini.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ kg</span>
                </p>
              </div>
            </div>

            {/* Custom Interactive Bar Chart */}
            <div className="space-y-2">
              <div className="h-56 flex items-end justify-between gap-1.5 sm:gap-2 pt-6">
                {currentTrend.historis_bulanan.map((hist, idx) => {
                  const heightPercent = Math.round((hist.harga / maxPrice) * 100);
                  const isPeak = currentTrend.bulan_harga_tertinggi.some(b => b.toLowerCase().startsWith(hist.bulan.toLowerCase()));
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      {/* Tooltip on hover */}
                      <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-100 px-1 py-0.5 rounded">
                        {(hist.harga / 1000).toFixed(0)}k
                      </span>

                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-500 group-hover:brightness-95 ${
                          isPeak
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>

                      {/* Label Bulan */}
                      <span className={`text-[11px] font-semibold ${isPeak ? 'text-amber-700 font-extrabold' : 'text-slate-500'}`}>
                        {hist.bulan}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
                  <span className="font-medium text-slate-600">Bulan Puncak Permintaan / Harga Tertinggi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block"></span>
                  <span className="font-medium text-slate-600">Bulan Pasokan Stabil</span>
                </div>
              </div>
            </div>

          </div>

          {/* Seasonal Analysis & Demand Drivers */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Analisis Musim &amp; Penyebab Lonjakan Daya Beli</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1.5">
                <span className="text-xs font-bold text-amber-900">Musim Puncak Permintaan:</span>
                <p className="text-sm font-extrabold text-amber-950">{currentTrend.musim_puncak}</p>
                <p className="text-xs text-amber-800/90 leading-relaxed mt-1">
                  {currentTrend.alasan_permintaan}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <span className="text-xs font-bold text-emerald-900">Rekomendasi Waktu Tanam Cerdas:</span>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed mt-1">
                  {currentTrend.rekomendasi_waktu_tanam}
                </p>
                <div className="pt-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mencegah anjlok harga saat panen raya serentak</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Profit & Yield Projection Calculator */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Simulasi Keuntungan Panen</h3>
                <p className="text-[11px] text-slate-500">Estimasi hasil panen &amp; omset bersih</p>
              </div>
            </div>

            {/* Input Luas */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Luas Lahan Anda (m²):
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={calcLuas}
                  onChange={(e) => setCalcLuas(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm font-semibold outline-none"
                />
                <div className="flex gap-1">
                  {[1000, 2500, 5000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCalcLuas(v)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 cursor-pointer"
                    >
                      {v >= 10000 ? `${v/10000}ha` : `${v}m²`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Perhitungan */}
            <div className="space-y-3 pt-2">
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Tonase Panen:</span>
                  <strong className="text-slate-900">{projection.totalPanenKg.toLocaleString('id-ID')} kg</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Modal Operasional:</span>
                  <strong className="text-rose-600">Rp {projection.totalBiayaProduksi.toLocaleString('id-ID')}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200/80 pt-2">
                  <span className="text-slate-500 font-semibold">Proyeksi Omset Penjualan:</span>
                  <strong className="text-slate-900 font-bold">Rp {projection.totalOmset.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              {/* Net Profit Box */}
              <div className="p-4 rounded-xl bg-emerald-700 text-white shadow-sm space-y-1">
                <span className="text-xs text-emerald-100 font-medium block">Estimasi Keuntungan Bersih:</span>
                <div className="text-2xl font-extrabold tracking-tight">
                  Rp {projection.labaBersih.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-emerald-100/90 pt-1 flex justify-between">
                  <span>Tingkat Pengembalian (ROI):</span>
                  <strong className="text-amber-300 font-extrabold">{projection.roi}%</strong>
                </div>
              </div>

            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              <strong>Catatan:</strong> Angka di atas dihitung dengan asumsi pemeliharaan sesuai bibit varietas unggul rekomendasi sistem dan panen pada periode puncak permintaan.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
