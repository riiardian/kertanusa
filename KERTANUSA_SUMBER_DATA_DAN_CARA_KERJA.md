# Sistem Kertanusa: Sumber Data & Cara Kerjanya

---

## Bagian 1 — Data Diambil dari Mana?

Kertanusa tidak memproduksi data sendiri. Sistem ini mengambil data dari berbagai sumber terpercaya — lembaga cuaca internasional, badan statistik pemerintah, institusi penelitian pertanian, dan basis data tanah global — lalu menggabungkannya untuk memberi arahan ke petani.

---

### 1. Data Cuaca: Suhu, Kelembapan Udara, Angin, dan Hujan

**Sumber: Open-Meteo API**

Open-Meteo adalah layanan cuaca terbuka yang menggabungkan data dari dua lembaga cuaca terbesar dunia:

- **ECMWF** (Eropa) → lembaga yang mengoperasikan model cuaca paling akurat di dunia, digunakan oleh hampir semua bandara dan maskapai penerbangan global untuk prakiraan cuaca.
- **NOAA** (Amerika Serikat) → badan cuaca dan kelautan nasional AS yang juga menyediakan data prakiraan cuaca global.

Data dari kedua sumber itu kemudian dikalibrasi dengan data dari stasiun cuaca darat **BMKG** (Badan Meteorologi, Klimatologi, dan Geofisika Indonesia) agar akurasinya lebih dekat ke kondisi di lapangan Indonesia.

Hasilnya: data suhu, kelembapan udara, kecepatan angin, dan prakiraan curah hujan yang diperbarui setiap 1 jam berdasarkan titik koordinat GPS sawah petani.

---

### 2. Data Kebasahan Tanah (Soil Moisture)

**Sumber: Estimasi Model Neraca Air (berbasis FAO Paper No. 56)**

Data ini tidak diambil dari sensor fisik yang ditancapkan ke tanah. Sistem menghitungnya secara tidak langsung menggunakan data curah hujan harian dari satelit, kelembapan udara, dan karakteristik jenis tanah di lokasi lahan.

Metode ini mengacu pada panduan baku internasional yang diterbitkan oleh **FAO** (Food and Agriculture Organization PBB), yaitu dokumen "Irrigation and Drainage Paper No. 56" yang menjadi standar global perhitungan kebutuhan air irigasi.

---

### 3. Data pH Tanah (Tingkat Keasaman Tanah)

**Sumber: Dua basis data tanah resmi**

- **BBLSDLP / BRIN** (Balai Besar Litbang Sumberdaya Lahan Pertanian) → peta jenis dan karakteristik tanah pertanian di seluruh Indonesia skala 1:50.000.
- **ISRIC SoilGrids** (Belanda) → peta digital tanah global berbasis machine learning dengan resolusi 250 meter per piksel, mencakup seluruh permukaan bumi.

Dari dua sumber itu, sistem tahu bahwa sawah di Brebes rata-rata punya pH 6.5 (tanah lempung alluvial), sawah di sekitar Cianjur cenderung lebih asam (pH 5.9), dan lahan di Lombok Timur lebih basa (pH 6.8). Data ini yang jadi acuan ketika sistem menghitung apakah tanah petani perlu dikapur atau tidak.

---

### 4. Data Statistik Panen & Pasokan Pangan Nasional

**Sumber: Tiga lembaga pemerintah Indonesia**

- **BPS** (Badan Pusat Statistik) → data produksi padi, jagung, singkong, dan komoditas lain dari survei Kerangka Sampel Area (KSA), di mana luas panen dan produktivitas dihitung menggunakan citra satelit dan survei lapangan setiap akhir bulan.
- **Kementerian Pertanian RI** → buku Outlook Komoditas Pertanian yang berisi proyeksi pasokan dan permintaan tiap komoditas.
- **Badan Pangan Nasional (Bapanas)** → data harga pasar produsen dan konsumen, cadangan beras pemerintah di BULOG, dan indeks Nilai Tukar Petani (NTP).

Data ini yang dipakai sistem untuk menilai komoditas mana yang aman dan menguntungkan untuk ditanam.

---

### 5. Data Peta Lahan & Lokasi (GIS / Geospasial)

**Sumber: Dua layanan peta**

- **Esri World Imagery** → citra satelit resolusi tinggi (kualitas sub-meter) yang digunakan untuk menampilkan peta sawah dan lahan secara visual.
- **OpenStreetMap Nominatim** → layanan yang mengubah titik koordinat GPS (lintang/bujur) menjadi nama lokasi yang bisa dibaca manusia: nama desa, kecamatan, kabupaten, dan provinsi.

Jadi ketika petani memasukkan koordinat lahannya, sistem langsung bisa menampilkan nama wilayahnya secara otomatis dan menampilkan visualisasi peta.

---

### 6. Data Penyakit & Hama Daun (untuk Fitur Scan AI)

**Sumber: Dua basis data gambar ilmiah**

- **PlantVillage Dataset** (Penn State University & EPFL, Swiss) → basis data terbuka berisi lebih dari 54.000 foto daun tanaman yang sudah dianotasi oleh peneliti, mencakup penyakit dan kondisi sehat berbagai tanaman pangan dunia.
- **IPB University & Balitsa/BRIN** → tambahan dataset spesifik tanaman tropis Indonesia (padi, cabai, tomat, jagung) dengan kondisi cahaya dan lingkungan yang lebih mirip dengan sawah dan kebun di Indonesia.

Model AI Kertanusa dilatih menggunakan gabungan dua dataset ini sehingga bisa mengenali penyakit seperti Antraknosa pada cabai, Hawar Daun Bakteri pada padi, atau Kutu Kebul dengan akurasi 93–98%.

---

### 7. Data Panduan Perawatan & Pemupukan

**Sumber: Tiga lembaga pertanian resmi**

- **FAO** (PBB) → panduan Good Agricultural Practices (GAP), standar budidaya pertanian yang aman dan berkelanjutan yang diakui secara internasional.
- **Balittanah / BRIN** (Indonesia) → rekomendasi dosis pupuk N, P, K spesifik untuk tiap jenis tanah dan komoditas di Indonesia, hasil penelitian lapangan di berbagai wilayah.
- **IRRI** (International Rice Research Institute, Filipina) → standar evaluasi tanaman padi internasional termasuk panduan pengelolaan air, hama, dan pupuk untuk varietas padi tropis.

---

### Ringkasan Sumber Data

| Data yang Digunakan | Diambil dari Mana |
|---|---|
| Suhu, kelembapan, angin, hujan | Open-Meteo (ECMWF + NOAA + BMKG) |
| Kebasahan tanah | Model neraca air berbasis standar FAO |
| pH tanah | BBLSDLP/BRIN + ISRIC SoilGrids (global) |
| Statistik panen & harga pangan | BPS + Kementan + Bapanas |
| Peta lahan & lokasi GPS | Esri World Imagery + OpenStreetMap |
| Dataset penyakit daun (AI) | PlantVillage + IPB University + Balitsa/BRIN |
| Panduan pupuk & perawatan | FAO + Balittanah/BRIN + IRRI |

---
---

## Bagian 2 — Cara Kerja Sistem dari Data ke Keputusan

Kertanusa bekerja seperti seorang penyuluh pertanian digital. Setiap saat, sistem membaca data cuaca dan kondisi tanah dari satelit, lalu memproses data itu dan mengubahnya menjadi arahan yang bisa langsung diikuti petani di lapangan.

Secara garis besar prosesnya seperti ini:

> Data Cuaca Satelit → Diolah oleh Sistem → Keputusan & Arahan untuk Petani

---

### 1. Kapan Waktu Terbaik Semprot Obat?

**Sistem membaca 3 data:** kecepatan angin, suhu udara, dan prakiraan hujan hari ini.

Lalu sistem mengecek satu per satu:
- Kalau hujan diprediksi turun → obat yang disemprot akan langsung tercuci habis sebelum sempat meresap ke daun, jadi sistem bilang **"Tunda dulu"**.
- Kalau angin kencang di atas 14 km/jam → kabut semprot akan melayang terbawa angin dan tidak mengenai sasaran, jadi sistem bilang **"Tunda dulu"**.
- Kalau suhu udara di atas 32°C → obat menguap terlalu cepat dan bisa membakar daun tanaman, jadi sistem bilang **"Tunggu sore"**.
- Kalau ketiga kondisi itu aman semua → sistem memberi lampu hijau: **"Semprot sekarang, antara pagi jam 6-8 atau sore jam 3-5"**, karena di jam itu angin biasanya tenang dan stomata daun sedang terbuka lebar.

---

### 2. Seberapa Besar Risiko Serangan Jamur Daun?

**Sistem membaca 3 data:** kelembapan udara, suhu, dan apakah hari ini turun hujan.

Cara kerjanya sederhana: jamur tropis itu punya syarat hidupnya sendiri. Mereka butuh udara lembap, suhu sekitar 25°C, dan daun yang basah oleh air hujan agar bisa tumbuh dan menyebar.

Sistem menghitung seberapa dekat kondisi hari ini dengan "kondisi impian" jamur tersebut. Kalau ketiga syarat itu terpenuhi semua, maka skor risikonya tinggi dan sistem langsung memperingatkan petani untuk bersiap. Kalau udara kering dan matahari terik, risiko rendah dan sistem tidak memberi peringatan.

Hasilnya berupa angka skor (dari 15 sampai 96) yang diterjemahkan ke tiga level: **Aman, Waspada, atau Bahaya**.

---

### 3. Tanaman Sekarang di Fase Apa, dan Kapan Bisa Panen?

**Sistem membaca 2 data:** tanggal tanam yang diinput petani dan suhu rata-rata harian dari satelit.

Logika di baliknya: tanaman itu tidak bisa dihitung cukup dengan hitungan hari saja, karena cuaca mempengaruhi kecepatan tumbuhnya. Tanaman yang tumbuh di musim panas lebih cepat berkembang dibanding yang tumbuh saat cuaca dingin, meski umurnya sama dalam hari.

Jadi sistem menghitung "energi panas" yang diterima tanaman setiap hari, lalu dijumlahkan dari hari tanam sampai sekarang. Angka akumulasi itu yang menentukan tanaman sudah di fase mana:

- **Fase 1** → Masih kecil, jaga air tetap macak-macak
- **Fase 2** → Anakan aktif tumbuh, waktunya pupuk pertama
- **Fase 3** → Mulai berbunga, jangan sampai kekurangan air
- **Fase 4** → Isi buah atau bulir, kasih pupuk kalium
- **Fase 5** → Sudah menguning, siap panen

Ketika masuk fase 5, sistem memberi tahu petani: **"Saatnya keringkan parit sawah 7-10 hari sebelum panen"**.

---

### 4. Aman atau Tidak untuk Tebar Pupuk?

**Sistem membaca 2 data:** tingkat kebasahan tanah dan prakiraan curah hujan hari ini.

Masalahnya sederhana: pupuk yang ditabur di tanah yang terlalu becek akan hanyut kebawa air parit sebelum sempat diserap akar. Sebaliknya, kalau tanahnya terlalu kering, pupuk tidak bisa larut dan terbuang percuma.

Sistem membandingkan dua angka itu:
- Tanah terlalu becek atau mau hujan deras → **"Tunda dulu"**
- Tanah terlalu kering → **"Alirkan sedikit air dulu baru tabur"**
- Tanah cukup lembap dan cuaca cerah → **"Aman, tabur sekarang"**

---

### 5. Berapa Banyak Kapur Dolomit yang Dibutuhkan?

**Sistem membaca 2 data:** nilai pH tanah di lokasi lahan dan luas lahan petani.

Kalau pH tanah di bawah 6, sistem tahu tanah itu masam dan perlu dinetralkan. Berdasarkan standar penelitian pertanian, untuk menaikkan 1 angka pH diperlukan kapur dolomit sebanyak 2.000 kg per hektar. Sistem tinggal mengalikan selisih pH itu dengan luas lahan petani, lalu mengubah hasilnya ke satuan yang praktis: **berapa karung sak 50 kg yang harus dibeli**.

---

### 6. Penyakit Apa yang Menyerang Daun?

**Sistem membaca 1 data:** foto daun yang diambil lewat kamera HP petani.

Sistem menggunakan teknologi yang sama dengan pengenalan wajah di smartphone, tapi dilatih khusus untuk mengenali pola penyakit tanaman dari ribuan foto daun yang sudah dianotasi oleh peneliti.

Cara kerjanya: foto daun dipecah dan dicek pola, warna, dan teksturnya di setiap bagian. Bercak cekung melingkar? Kemungkinan Antraknosa. Daun mengeriting ke atas dengan bintik kuning? Kemungkinan Kutu Kebul. Setelah semua pola dicocokkan, sistem memilih diagnosis dengan tingkat kemiripan tertinggi dan menampilkan **nama penyakit beserta solusi penanganannya**, lengkap dengan tingkat akurasi deteksinya (93–98%).

---

### 7. Bagaimana Sistem Menentukan Komoditas dan Bibit Unggul yang Paling Cocok untuk Wilayah Petani?

**Sistem membaca:** data tren harga pasar Bapanas, musim puncak permintaan, ketinggian lahan (mdpl), jenis tanah & pH, tipe pengairan (irigasi teknis/tadah hujan/rawa), serta musim berjalan (rendengan/gadu).

Cara sistem memutuskan varietas bibit terbaik:
1. **Analisis Risiko Lingkungan & Hama Musiman:**
   - Jika menanam di musim hujan pada lahan irigasi dataran rendah: sistem memprioritaskan bibit yang kebal terhadap Hawar Daun Bakteri (Kresek) dan jamur blast (contoh: **Inpari 32 HDB**).
   - Jika lahan sering tergenang banjir atau petani ingin menghemat biaya pupuk: sistem merekomendasikan varietas **Inpari 42 Agritan GSR (Green Super Rice)** yang tahan rendaman 14 hari dan hemat pupuk hingga 25%.
   - Jika menanam di musim kemarau di wilayah endemik hama: sistem memilih varietas yang tahan Wereng Batang Coklat (WBC) biotipe 1, 2, 3 dan berumur sangat genjah (contoh: **Inpari 33**).
   - Jika lahan berupa tadah hujan atau tanah masam ber-pH rendah (<5.5): sistem memilih varietas gogo yang toleran kekeringan dan tahan keracunan aluminium (contoh: **Inpago 8**).
   - Jika lahan berupa rawa lebak atau pasang surut: sistem memilih varietas toleran genangan air asam dan zat besi tinggi (contoh: **Inpara 3**).
   - Jika berada di dataran sedang-tinggi dengan air pegunungan jernih: sistem memberikan opsi varietas beras premium beraroma wangi (contoh: **Menthik Wangi / Pandan Wangi**) untuk margin keuntungan restoran hotel.
2. **Kesesuaian Daya Beli Pasar:**
   Bibit yang dipilih harus memiliki daya serap pasar yang tinggi di penggilingan padi nasional dan pasar induk grosir, sehingga hasil panen tidak mengalami diskon harga atau ditolak pedagang saat panen raya.

---

### Ringkasan Alur dari Data ke Keputusan

```
Satelit cuaca & GPS sawah petani
          ↓
Data suhu, hujan, angin, kelembapan, pH tanah
          ↓
Sistem mengecek kondisi vs. batas ambang ilmiah
          ↓
Menghasilkan skor atau status (aman / waspada / bahaya)
          ↓
Diterjemahkan ke instruksi yang langsung bisa diikuti petani
          ↓
Petani ambil tindakan yang tepat, di waktu yang tepat
```

Intinya, sistem tidak pernah "menebak". Semua keputusan mengikuti aturan berbasis data ilmiah yang sudah terverifikasi. Tugas sistem hanyalah membaca data itu lebih cepat dan lebih konsisten dari yang bisa dilakukan manusia, lalu menyampaikannya dalam bahasa yang bisa langsung dipahami petani.
