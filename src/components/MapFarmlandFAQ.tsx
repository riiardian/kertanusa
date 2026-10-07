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
    question: 'Apakah aplikasi KERTANUSA ini bisa digunakan secara gratis oleh petani?',
    answer: 'Ya, 100% gratis. Seluruh petani mandiri, kelompok tani, maupun penyuluh pertanian di Indonesia dapat menggunakan fitur pemantauan cuaca mikro, rekomendasi perawatan tanaman, hingga kalkulator keuntungan panen tanpa biaya apa pun.'
  },
  {
    id: 'faq-2',
    question: 'Bagaimana cara mendaftarkan lahan sawah saya ke dalam sistem?',
    answer: 'Sangat mudah. Masuk ke menu "Input Lahan", masukkan nama Anda, luas tanah, jenis tanaman, dan perkiraan tanggal tanam. Cukup nyalakan izin GPS di HP saat berada di sawah agar sistem otomatis mengunci lokasi lahan Anda dan menampilkannya di peta sebaran.'
  },
  {
    id: 'faq-3',
    question: 'Bagaimana KERTANUSA memandu waktu penyiraman dan pemupukan yang tepat?',
    answer: 'Sistem menyesuaikan dengan kebutuhan jenis tanaman Anda secara spesifik. Untuk padi ada panduan genangan macak-macak berkala (AWD), sedangkan untuk apel, cabai, atau bawang disesuaikan dengan kelembapan tanah dan cuaca sekitar. Takaran pupuk (NPK & organik) juga otomatis dihitung pas sesuai luas sawah Anda.'
  },
  {
    id: 'faq-4',
    question: 'Bagaimana cara mengetahui tanaman apa yang paling menguntungkan di daerah saya?',
    answer: 'Buka menu "Daya Beli Pasar". Berdasarkan lokasi sawah yang Anda daftarkan, sistem akan merekomendasikan komoditas unggulan yang paling cocok dengan tanah dan iklim setempat, lengkap dengan simulasi modal biaya, perkiraan hasil panen, dan potensi keuntungan bersihnya.'
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 lg:items-center">
        {/* Kolom Kiri: Judul & Deskripsi (Pas di Tengah Vertikal) */}
        <div className="lg:col-span-5">
          <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-slate-900 tracking-tight leading-[1.18]">
            Masih Punya <br className="hidden sm:inline" />
            Pertanyaan?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-[15px] leading-relaxed mt-3.5 sm:mt-4 max-w-sm">
            Jika Anda belum menemukan jawaban yang dicari, tim agronomis & riset teknologi KERTANUSA siap membantu kendala pendaftaran lahan, perawatan tanaman, atau konsultasi pertanian Anda.
          </p>
        </div>

        {/* Kolom Kanan: List Accordion Bersih, Sejajar Sempurna, Kotak Persegi Presisi */}
        <div className="lg:col-span-7">
          <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
            {FAQ_LIST.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className={`transition-colors duration-200 ${
                    isOpen ? 'bg-[#f0fdf4]' : 'bg-transparent hover:bg-slate-50/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-4 sm:px-5 py-4 sm:py-4.5 flex items-center justify-between gap-4 text-left cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-[14.5px] sm:text-[15.5px] font-bold transition-colors leading-snug ${
                        isOpen ? 'text-emerald-700 font-extrabold' : 'text-slate-900 hover:text-emerald-600'
                      }`}
                    >
                      {item.question}
                    </span>
                    <div className="shrink-0 p-1">
                      <ChevronDown
                        className={`w-4.5 h-4.5 transition-transform duration-300 ease-in-out ${
                          isOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'
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
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
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
    </div>
  );
}
