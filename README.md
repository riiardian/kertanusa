# 🌾 KERTANUSA — Kreasi Riset Tani Nusantara
### Precision Agriculture & AI-Driven Decision Support System (DSS)

[![Live Prototype](https://img.shields.io/badge/Live%20Prototype-kertanusa.web.id-059669?style=for-the-badge&logo=google-chrome&logoColor=white)](https://kertanusa.web.id)
[![Next.js](https://img.shields.io/badge/Next.js-15%2B%20Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![OWASP Hardened](https://img.shields.io/badge/Security-OWASP%20Hardened-green?style=for-the-badge&logo=shield&logoColor=white)](#-keamanan--hardeningsistem)

---

## 📌 Ringkasan Eksekutif (Executive Summary)

**KERTANUSA** adalah platform pertanian presisi terintegrasi (*Precision Agriculture Decision Support System*) yang dirancang untuk menjembatani kesenjangan antara petani di lapangan, data agroklimat satelit real-time, kecerdasan buatan (*Multimodal Vision AI*), dan dinamika pasar komoditas nasional. 

Platform ini mentransformasi data ilmiah mikro (karakteristik tanah, cuaca satelit BMKG/Open-Meteo, siklus fenologi tanaman) dan data makro (harga Bapanas, NTP BPS, neraca pangan) menjadi **rekomendasi taktis lapangan yang dapat langsung dieksekusi oleh petani** — mulai dari jadwal semprot presisi, takaran pupuk proporsional, hingga strategi momentum panen.

---

## 🚀 Fitur Unggulan & Arsitektur Modul

```
                                 ┌─────────────────────────────────────────┐
                                 │       KERTANUSA ARCHITECTURE CORE       │
                                 └────────────────────┬────────────────────┘
                                                      │
         ┌────────────────────────┬───────────────────┴───────────────────┬────────────────────────┐
         ▼                        ▼                                       ▼                        ▼
 ┌───────────────┐        ┌───────────────┐                       ┌───────────────┐        ┌───────────────┐
 │ Input Lahan & │        │ Multimodal AI │                       │  Agroklimat   │        │ Tren Pasar &  │
 │  GPS Spasial  │        │ Computer Vis. │                       │ Presisi Satelit│       │ Supply-Demand │
 └───────┬───────┘        └───────┬───────┘                       └───────┬───────┘        └───────┬───────┘
         │                        │                                       │                        │
         └────────────────────────┼───────────────────────────────────────┴────────────────────────┘
                                  ▼
               ┌─────────────────────────────────────┐
               │    DECISION SUPPORT ENGINE (DSS)    │
               │  • Dynamic Spray Window (Weather)   │
               │  • Precision Fertilizer Dosing (Ha) │
               │  • Fungal/Pest Risk Index           │
               │  • Harvest Momentum & ROI Projection│
               └─────────────────────────────────────┘
```

### 1. 🔬 Multimodal Computer Vision AI (`/scan-ai`)
* **Live Pathology & Pest Diagnosis**: Menggunakan model visi multimodal (*Gemini 2.5 Multimodal Architecture*) yang menganalisis citra daun/buah secara langsung melalui kamera smartphone atau galeri.
* **Deteksi Komoditas & Patogen Otomatis**: Mengenali spesies tanaman budidaya (Jeruk, Cabai, Padi, Bawang Merah, Tomat, Jagung, dll.) serta mendiagnosis penyakit agronomis (Bercak Cokelat Alternaria, Patek Antraknosa, Ulat Grayak, Hawar Daun, Bulai Jagung).
* **Resep Presisi Berjenjang**: Memberikan 3 tindakan darurat lapangan hari ini, formula pupuk kimia presisi (kandungan unsur hara + dosis), serta alternatif pestisida nabati organik lokal.
* **Edge-Case Validation Protection**: Sistem secara otomatis menolak citra non-pertanian (perangkat laptop, manusia, kendaraan) dan memberikan panduan edukasi pengambilan foto yang valid.

### 2. 🛰️ Agroklimat & Monitoring Lahan Real-Time (`/monitoring`)
* **Integrasi Satelit Multi-Lembaga**: Mengintegrasikan data radar cuaca global **ECMWF** dan **NOAA** via **Open-Meteo API** yang dikalibrasi dengan stasiun darat **BMKG**.
* **Jadwal Semprot Dinamis (*Dynamic Spray Window*)**:
  * Evaluasi curah hujan, angin, dan suhu real-time untuk merekomendasikan jam semprot optimal (06.30–08.30 & 15.30–17.30 WIB).
  * Peringatan tunda semprot otomatis saat potensi hujan > 2 mm (anti-luntur) atau angin > 14 km/jam (anti-drift).
* **Estimasi Neraca Air & Kebasahan Tanah**: Mengadopsi standar internasional **FAO Irrigation and Drainage Paper No. 56** untuk memantau status tanah (*Kering*, *Optimal*, *Jenuh Air*).
* **Perhitungan Dosis Pupuk Proporsional**: Menghitung kebutuhan karung pupuk (NPK, Kompos, Pupuk Kalium) secara otomatis sesuai luas lahan riil petani ($m^2$ atau Hektar).

### 3. 📈 Tren Pasar & Analisis Supply-Demand (`/tren-pasar`)
* **Kalkulasi Momentum Panen**: Menghitung tanggal panen berdasarkan Hari Setelah Tanam (HST) dan memetakan hasilnya dengan kurva musiman harga komoditas historis (2021–2026).
* **Peringatan Risiko Pasar**: Mengidentifikasi apakah panen bertepatan dengan *Panen Raya (Over-supply)* atau *Momentum Emas (Kelangkaan Pasokan/Hari Raya)*.
* **Proyeksi Margin Finansial**: Menghitung estimasi produktivitas panen dan proyeksi omzet kotor/bersih berdasarkan harga acuan pasar konsumen.

### 4. 📍 Pendaftaran Lahan Petani (`/input-lahan`)
* **Geocoding & Reverse Geocoding**: Mengonversi koordinat GPS satelit secara instan menjadi nama desa, kecamatan, dan kabupaten via **OpenStreetMap Nominatim**.
* **Penyimpanan Lokal Atomik**: Menyimpan profil lahan petani secara persisten dan crash-safe di basis data lokal server.

---

## 🛠️ Tech Stack & Arsitektur Sistem

| Lapisan | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15+ (App Router)** | Server Components, Turbopack Bundler, Client Stepper Wizard |
| **Language** | **TypeScript 5.0** | Strict Type Safety, Interfaces & Agronomic Enums |
| **Styling & UI** | **Tailwind CSS v4** | Clean Minimalist, Flat Design (Zero AI-Slop), Mobile-First |
| **Animation Engine** | **Lottie-Web** | Render animasi vektor JSON ringan untuk proses analisis |
| **AI Vision Engine** | **Multimodal Vision AI** | Inference citra agronomis via router lokal port 20128 |
| **Geospatial / GIS** | **OpenStreetMap & Leaflet** | Pemetaan koordinat lahan dan boundary wilayah pertanian |
| **Agrometeorologi** | **Open-Meteo & BMKG** | Live 14-days forecast, solar radiation, soil water balance |
| **Server & Deployment** | **Ubuntu Linux VPS + PM2 + Nginx** | Node.js runtime, Supervisor, Reverse Proxy, SSL Cloudflare |

---

## 🛡️ Keamanan & Hardening Sistem (OWASP Standard)

Kertanusa telah melalui audit keamanan menyeluruh dan menerapkan standar proteksi produksi:

1. **OWASP Security Headers**:
   * `Strict-Transport-Security (HSTS)`: `max-age=31536000; includeSubDomains; preload`
   * `X-Content-Type-Options: nosniff` (Anti-MIME Sniffing)
   * `X-Frame-Options: SAMEORIGIN` (Anti-Clickjacking)
   * `X-XSS-Protection: 1; mode=block`
   * `Referrer-Policy: strict-origin-when-cross-origin`
   * `Permissions-Policy: camera=(self), geolocation=(self), microphone=(), payment=()`
   * `poweredByHeader: false` (Menghilangkan fingerprint `X-Powered-By: Next.js`)
2. **In-Memory Sliding Window Rate Limiting (`rate_limiter.ts`)**:
   * Proteksi DoS & Kuota AI Vision: Maksimal 12 pemindaian/menit per IP (`/api/analyze`).
   * Proteksi Database: Maksimal 15 pendaftaran/menit per IP (`/api/petani`).
3. **Input Sanitization & Stored XSS Defense (`sanitize.ts`)**:
   * Stripping tag HTML, script, dan karakter berbahaya pada seluruh input teks form.
   * Batasan ukuran payload gambar maksimal 10 MB.
4. **Nginx Web Server Hardening**:
   * Pemblokiran akses langsung ke direktori sensitif (`.env`, `.git`, `/storage/`, `/data/`) dengan respon `404 Not Found`.
   * Pembatasan ukuran request body (`client_max_body_size 12M`).

---

## 💻 Panduan Instalasi Lokal (Local Development)

### Prasyarat
* Node.js >= 20.0.0
* npm atau yarn / pnpm

### Langkah Pemasangan
```bash
# 1. Kloning repositori
git clone https://github.com/riiardian/kertanusa.git
cd kertanusa

# 2. Pasang dependensi
npm install

# 3. Konfigurasi Environment Variable (.env.local)
cp .env.example .env.local
# Sesuaikan AI_VISION_BASE_URL dan AI_VISION_API_KEY jika menggunakan custom provider

# 4. Jalankan Development Server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### Kompilasi Produksi
```bash
# Build dengan Turbopack
npm run build

# Menjalankan server produksi
npm run start -p 3001
```

---

## 👥 Pengembang (Author)

* **Rio Ardian Pratama** ([@riiardian](https://github.com/riiardian))
  * *Lead Developer & Solution Architect*

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 **KERTANUSA (Kreasi Riset Tani Nusantara)**. Seluruh hak cipta dilindungi undang-undang.
Dikembangkan untuk kemandirian pangan dan kedaulatan petani Indonesia.
