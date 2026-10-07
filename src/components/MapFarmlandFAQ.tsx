'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Apa itu KERTANUSA?',
    answer: 'KERTANUSA (Kreasi Riset Tani Nusantara) adalah platform Decision Support System (DSS) agroteknologi modern yang memadukan data telemetri iklim mikro, kecerdasan buatan, dan kalkulator usahatani untuk membantu petani meningkatkan produktivitas serta efisiensi budidaya secara presisi.'
  },
  {
    id: 'faq-2',
    question: 'Bagaimana cara mendaftarkan lahan sawah baru ke dalam peta sebaran KERTANUSA?',
    answer: 'Petani atau kelompok tani dapat mendaftarkan lahan melalui menu "Input Lahan". Anda cukup memasukkan nama petani, luas tanah, jenis komoditas tanaman, perkiraan tanggal tanam, serta mengaktifkan izin lokasi GPS di perangkat Anda. Sistem akan otomatis mengunci titik koordinat sawah dan menghubungkannya ke jaringan sebaran nasional.'
  },
  {
    id: 'faq-3',
    question: 'Bagaimana sistem KERTANUSA memandu jadwal penyiraman dan pemupukan secara presisi?',
    answer: 'Sistem tidak menyamaratakan semua komoditas. KERTANUSA menerapkan algoritma DSS berbasis Vapor Pressure Deficit (VPD), kapasitas lapang tanah, dan fase pertumbuhan spesifik (seperti sistem AWD macak-macak untuk padi, irigasi piringan kanopi untuk apel, atau parit leb untuk hortikultura). Dosis pemupukan (NPK dan bahan organik) juga dihitung proporsional sesuai luas lahan riil Anda.'
  },
  {
    id: 'faq-4',
    question: 'Apakah titik koordinat lahan tetap 100% akurat tanpa peta satelit berbayar?',
    answer: 'Ya, akurasi tetap 100% presisi. Sistem KERTANUSA menggunakan standar geospasial global WGS 84 (EPSG:4326) yang diselaraskan dengan batas wilayah resmi Badan Informasi Geospasial (BIG). Posisi lahan dipetakan secara matematis berpatokan pada garis lintang (latitude) dan bujur (longitude) GPS asli, bukan sekadar perkiraan visual.'
  },
  {
    id: 'faq-5',
    question: 'Apa fungsi garis lengkung hijau mint yang menghubungkan antarlahan petani?',
    answer: 'Garis tersebut merupakan visualisasi Jaringan Telemetri Sensor Nusantara (Mesh Grid). Sistem mengagregasikan data cuaca mikro antarsentra pertanian untuk menganalisis keselarasan iklim mikro (suhu lingkungan, pH tanah, dan kelembapan) guna memantau stabilitas panen serta mendeteksi potensi anomali iklim lintas wilayah.'
  },
  {
    id: 'faq-6',
    question: 'Bagaimana cara melihat detail telemetri tanah dan jadwal panen pada pin sawah?',
    answer: 'Cukup ketuk atau klik salah satu pin di peta. Di layar desktop, jendela ringkasan otomatis terbuka di samping pin. Di layar smartphone, kartu bawah (bottom sheet) bergaya Google Maps akan muncul menampilkan nama petani, komoditas, fase tumbuh, estimasi panen, serta 3 metrik sensor tanah (Kelembapan %, pH, dan Suhu °C).'
  },
  {
    id: 'faq-7',
    question: 'Apakah platform KERTANUSA dapat digunakan secara gratis oleh kelompok tani?',
    answer: 'Ya, platform KERTANUSA dapat diakses secara gratis oleh seluruh petani, kelompok tani, dan penyuluh pertanian di Indonesia untuk memantau kondisi cuaca, menghitung kelayakan ekonomi budidaya, serta mendata sebaran lahan secara mandiri.'
  }
];

export default function MapFarmlandFAQ() {
  // Hanya 1 tab yang bisa terbuka sekaligus (single accordion)
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Kolom Kiri: Judul & Deskripsi (Tanpa Tombol Hubungi) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-slate-900 tracking-tight leading-[1.18]">
            Masih Punya <br className="hidden sm:inline" />
            Pertanyaan?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-[15px] leading-relaxed mt-3.5 sm:mt-4 max-w-sm">
            Jika Anda belum menemukan jawaban yang dicari, tim agronomis & riset teknologi KERTANUSA siap membantu kendala registrasi lahan, integrasi sensor telemetri, atau konsultasi kebutuhan budidaya presisi Anda.
          </p>
        </div>

        {/* Kolom Kanan: List Accordion Bersih & Minimalis dengan Transisi Halus */}
        <div className="lg:col-span-7">
          {FAQ_LIST.map((item, idx) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`transition-all duration-300 ease-in-out ${
                  isOpen
                    ? 'bg-[#f0fdf4] rounded-xl sm:rounded-2xl p-4 sm:p-5 my-2 border border-emerald-100/90 shadow-xs'
                    : `py-4 sm:py-5 border-b border-slate-100 ${idx === 0 ? 'pt-0' : ''}`
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-[14.5px] sm:text-[15.5px] font-bold transition-colors leading-snug ${
                      isOpen ? 'text-emerald-700 font-extrabold' : 'text-slate-900 group-hover:text-emerald-600'
                    }`}
                  >
                    {item.question}
                  </span>
                  <div className="shrink-0 p-1 transition-colors">
                    <ChevronDown
                      className={`w-4.5 h-4.5 transition-transform duration-300 ease-in-out ${
                        isOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                  </div>
                </button>

                {/* Smooth Accordion Collapse/Expand Animation via CSS Grid Rows */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-2.5 sm:pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pr-2">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
