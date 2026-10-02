# Sumber Data Sistem Kertanusa: Dari Mana Semua Informasinya?

---

## Gambaran Besar

Kertanusa tidak memproduksi data sendiri. Sistem ini mengambil data dari berbagai sumber terpercaya — lembaga cuaca internasional, badan statistik pemerintah, institusi penelitian pertanian, dan basis data tanah global — lalu menggabungkannya untuk memberi arahan ke petani.

---

## 1. Data Cuaca: Suhu, Kelembapan Udara, Angin, dan Hujan

**Sumber: Open-Meteo API**

Open-Meteo adalah layanan cuaca terbuka yang menggabungkan data dari dua lembaga cuaca terbesar dunia:

- **ECMWF** (Eropa) → lembaga yang mengoperasikan model cuaca paling akurat di dunia, digunakan oleh hampir semua bandara dan maskapai penerbangan global untuk prakiraan cuaca.
- **NOAA** (Amerika Serikat) → badan cuaca dan kelautan nasional AS yang juga menyediakan data prakiraan cuaca global.

Data dari kedua sumber itu kemudian dikalibrasi dengan data dari stasiun cuaca darat **BMKG** (Badan Meteorologi, Klimatologi, dan Geofisika Indonesia) agar akurasinya lebih dekat ke kondisi di lapangan Indonesia.

Hasilnya: data suhu, kelembapan udara, kecepatan angin, dan prakiraan curah hujan yang diperbarui setiap 1 jam berdasarkan titik koordinat GPS sawah petani.

---

## 2. Data Kebasahan Tanah (Soil Moisture)

**Sumber: Estimasi Model Neraca Air (berbasis FAO Paper No. 56)**

Data ini tidak diambil dari sensor fisik yang ditancapkan ke tanah. Sistem menghitungnya secara tidak langsung menggunakan data curah hujan harian dari satelit, kelembapan udara, dan karakteristik jenis tanah di lokasi lahan.

Metode ini mengacu pada panduan baku internasional yang diterbitkan oleh **FAO** (Food and Agriculture Organization PBB), yaitu dokumen "Irrigation and Drainage Paper No. 56" yang menjadi standar global perhitungan kebutuhan air irigasi.

---

## 3. Data pH Tanah (Tingkat Keasaman Tanah)

**Sumber: Dua basis data tanah resmi**

- **BBLSDLP / BRIN** (Balai Besar Litbang Sumberdaya Lahan Pertanian) → peta jenis dan karakteristik tanah pertanian di seluruh Indonesia skala 1:50.000.
- **ISRIC SoilGrids** (Belanda) → peta digital tanah global berbasis machine learning dengan resolusi 250 meter per piksel, mencakup seluruh permukaan bumi.

Dari dua sumber itu, sistem tahu bahwa sawah di Brebes rata-rata punya pH 6.5 (tanah lempung alluvial), sawah di sekitar Cianjur cenderung lebih asam (pH 5.9), dan lahan di Lombok Timur lebih basa (pH 6.8). Data ini yang jadi acuan ketika sistem menghitung apakah tanah petani perlu dikapur atau tidak.

---

## 4. Data Statistik Panen & Pasokan Pangan Nasional

**Sumber: Tiga lembaga pemerintah Indonesia**

- **BPS** (Badan Pusat Statistik) → data produksi padi, jagung, singkong, dan komoditas lain dari survei Kerangka Sampel Area (KSA), di mana luas panen dan produktivitas dihitung menggunakan citra satelit dan survei lapangan setiap akhir bulan.
- **Kementerian Pertanian RI** → buku Outlook Komoditas Pertanian yang berisi proyeksi pasokan dan permintaan tiap komoditas.
- **Badan Pangan Nasional (Bapanas)** → data harga pasar produsen dan konsumen, cadangan beras pemerintah di BULOG, dan indeks Nilai Tukar Petani (NTP).

Data ini yang dipakai sistem untuk menilai komoditas mana yang aman dan menguntungkan untuk ditanam.

---

## 5. Data Peta Lahan & Lokasi (GIS / Geospasial)

**Sumber: Dua layanan peta**

- **Esri World Imagery** → citra satelit resolusi tinggi (kualitas sub-meter) yang digunakan untuk menampilkan peta sawah dan lahan secara visual.
- **OpenStreetMap Nominatim** → layanan yang mengubah titik koordinat GPS (lintang/bujur) menjadi nama lokasi yang bisa dibaca manusia: nama desa, kecamatan, kabupaten, dan provinsi.

Jadi ketika petani memasukkan koordinat lahannya, sistem langsung bisa menampilkan nama wilayahnya secara otomatis dan menampilkan visualisasi peta.

---

## 6. Data Penyakit & Hama Daun (untuk Fitur Scan AI)

**Sumber: Dua basis data gambar ilmiah**

- **PlantVillage Dataset** (Penn State University & EPFL, Swiss) → basis data terbuka berisi lebih dari 54.000 foto daun tanaman yang sudah dianotasi oleh peneliti, mencakup penyakit dan kondisi sehat berbagai tanaman pangan dunia.
- **IPB University & Balitsa/BRIN** → tambahan dataset spesifik tanaman tropis Indonesia (padi, cabai, tomat, jagung) dengan kondisi cahaya dan lingkungan yang lebih mirip dengan sawah dan kebun di Indonesia.

Model AI Kertanusa dilatih menggunakan gabungan dua dataset ini sehingga bisa mengenali penyakit seperti Antraknosa pada cabai, Hawar Daun Bakteri pada padi, atau Kutu Kebul dengan akurasi 93–98%.

---

## 7. Data Panduan Perawatan & Pemupukan

**Sumber: Tiga lembaga pertanian resmi**

- **FAO** (PBB) → panduan Good Agricultural Practices (GAP), standar budidaya pertanian yang aman dan berkelanjutan yang diakui secara internasional.
- **Balittanah / BRIN** (Indonesia) → rekomendasi dosis pupuk N, P, K spesifik untuk tiap jenis tanah dan komoditas di Indonesia, hasil penelitian lapangan di berbagai wilayah.
- **IRRI** (International Rice Research Institute, Filipina) → standar evaluasi tanaman padi internasional termasuk panduan pengelolaan air, hama, dan pupuk untuk varietas padi tropis.

Dari sumber-sumber inilah sistem tahu, misalnya, bahwa dosis kapur dolomit standar untuk menaikkan 1 angka pH di tanah lempung tropis adalah 2.000 kg per hektar, atau bahwa pupuk Kalium paling efektif diberikan saat fase pengisian bulir.

---

## Ringkasan Sumber Data

| Data yang Digunakan | Diambil dari Mana |
|---|---|
| Suhu, kelembapan, angin, hujan | Open-Meteo (ECMWF + NOAA + BMKG) |
| Kebasahan tanah | Model neraca air berbasis standar FAO |
| pH tanah | BBLSDLP/BRIN + ISRIC SoilGrids (global) |
| Statistik panen & harga pangan | BPS + Kementan + Bapanas |
| Peta lahan & lokasi GPS | Esri World Imagery + OpenStreetMap |
| Dataset penyakit daun (AI) | PlantVillage + IPB University + Balitsa/BRIN |
| Panduan pupuk & perawatan | FAO + Balittanah/BRIN + IRRI |
