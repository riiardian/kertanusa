# Cara Kerja Sistem Kertanusa: Dari Data ke Keputusan Petani

---

## Gambaran Besar

Kertanusa bekerja seperti seorang penyuluh pertanian digital. Setiap saat, sistem membaca data cuaca dan kondisi tanah dari satelit, lalu memproses data itu dan mengubahnya menjadi arahan yang bisa langsung diikuti petani di lapangan.

Secara garis besar prosesnya seperti ini:

> Data Cuaca Satelit → Diolah oleh Sistem → Keputusan & Arahan untuk Petani

---

## 1. Kapan Waktu Terbaik Semprot Obat?

**Sistem membaca 3 data:** kecepatan angin, suhu udara, dan prakiraan hujan hari ini.

Lalu sistem mengecek satu per satu:
- Kalau hujan diprediksi turun → obat yang disemprot akan langsung tercuci habis sebelum sempat meresap ke daun, jadi sistem bilang **"Tunda dulu"**.
- Kalau angin kencang di atas 14 km/jam → kabut semprot akan melayang terbawa angin dan tidak mengenai sasaran, jadi sistem bilang **"Tunda dulu"**.
- Kalau suhu udara di atas 32°C → obat menguap terlalu cepat dan bisa membakar daun tanaman, jadi sistem bilang **"Tunggu sore"**.
- Kalau ketiga kondisi itu aman semua → sistem memberi lampu hijau: **"Semprot sekarang, antara pagi jam 6-8 atau sore jam 3-5"**, karena di jam itu angin biasanya tenang dan stomata daun sedang terbuka lebar.

---

## 2. Seberapa Besar Risiko Serangan Jamur Daun?

**Sistem membaca 3 data:** kelembapan udara, suhu, dan apakah hari ini turun hujan.

Cara kerjanya sederhana: jamur tropis itu punya syarat hidupnya sendiri. Mereka butuh udara lembap, suhu sekitar 25°C, dan daun yang basah oleh air hujan agar bisa tumbuh dan menyebar.

Sistem menghitung seberapa dekat kondisi hari ini dengan "kondisi impian" jamur tersebut. Kalau ketiga syarat itu terpenuhi semua, maka skor risikonya tinggi dan sistem langsung memperingatkan petani untuk bersiap. Kalau udara kering dan matahari terik, risiko rendah dan sistem tidak memberi peringatan.

Hasilnya berupa angka skor (dari 15 sampai 96) yang diterjemahkan ke tiga level: **Aman, Waspada, atau Bahaya**.

---

## 3. Tanaman Sekarang di Fase Apa, dan Kapan Bisa Panen?

**Sistem membaca 2 data:** tanggal tanam yang diinput petani dan suhu rata-rata harian dari satelit.

Logika di baliknya: tanaman itu tidak bisa dihitung cukup dengan hitungan hari saja, karena cuaca mempengaruhi kecepatan tumbuhnya. Tanaman yang tumbuh di musim panas lebih cepat berkembang dibanding yang tumbuh saat cuaca dingin, meski umurnya sama dalam hari.

Jadi sistem menghitung "energi panas" yang diterima tanaman setiap hari (suhu hari itu dikurangi suhu minimum pertumbuhan 10°C), lalu dijumlahkan dari hari tanam sampai sekarang. Angka akumulasi itu yang menentukan tanaman sudah di fase mana:
- Fase 1 (masih kecil, jaga air)
- Fase 2 (anakan aktif, waktunya pupuk pertama)
- Fase 3 (mulai berbunga, jangan sampai kekurangan air)
- Fase 4 (isi buah/bulir, kasih pupuk kalium)
- Fase 5 (sudah menguning, siap panen)

Ketika masuk fase 5, sistem memberi tahu petani: **"Saatnya keringkan parit sawah 7-10 hari sebelum panen"**.

---

## 4. Aman atau Tidak untuk Tebar Pupuk?

**Sistem membaca 2 data:** tingkat kebasahan tanah dan prakiraan curah hujan hari ini.

Masalahnya sederhana: pupuk yang ditabur di tanah yang terlalu becek akan hanyut kebawa air parit sebelum sempat diserap akar. Sebaliknya, kalau tanahnya terlalu kering, pupuk tidak bisa larut dan terbuang percuma.

Sistem membandingkan dua angka itu dengan batas yang sudah ditentukan:
- Tanah terlalu becek atau mau hujan deras → **"Tunda dulu"**
- Tanah terlalu kering → **"Alirkan sedikit air dulu baru tabur"**
- Tanah cukup lembap dan cuaca cerah → **"Aman, tabur sekarang"**

---

## 5. Berapa Banyak Kapur Dolomit yang Dibutuhkan?

**Sistem membaca 2 data:** nilai pH tanah di lokasi lahan dan luas lahan petani.

Kalau pH tanah di bawah 6, sistem tahu tanah itu masam dan perlu dinetralkan. Berdasarkan standar penelitian pertanian, untuk menaikkan 1 angka pH diperlukan kapur dolomit sebanyak 2.000 kg per hektar. Sistem tinggal mengalikan selisih pH itu dengan luas lahan petani, lalu mengubah hasilnya ke satuan yang praktis: **berapa karung sak 50 kg yang harus dibeli**.

---

## 6. Penyakit Apa yang Menyerang Daun?

**Sistem membaca 1 data:** foto daun yang diambil lewat kamera HP petani.

Sistem menggunakan teknologi yang sama dengan pengenalan wajah di smartphone, tapi dilatih khusus untuk mengenali pola penyakit tanaman dari ribuan foto daun yang sudah dianotasi oleh peneliti.

Cara kerjanya: foto daun dipecah menjadi ribuan "potongan kecil", lalu setiap potongan dicek pola, warna, dan teksturnya. Bercak cekung melingkar? Kemungkinan Antraknosa. Daun mengeriting ke atas dengan bintik kuning? Kemungkinan Kutu Kebul. Setelah semua pola dicocokkan, sistem memilih diagnosis dengan tingkat kemiripan tertinggi dan menampilkan **nama penyakit beserta solusi penanganannya**, lengkap dengan tingkat akurasi deteksinya (93–98%).

---

## 7. Komoditas Apa yang Aman Ditanam Sekarang?

**Sistem membaca:** data produksi nasional 5 tahun terakhir (dari BPS), indeks kesejahteraan petani (NTP), dan fluktuasi harga pasar (dari Bapanas).

Cara sistem menilainya sederhana: komoditas yang bagus untuk ditanam adalah yang punya tren produksi stabil, NTP-nya di atas 100 (artinya petani masih untung), dan pasar penyerapannya jelas. Kalau ketiga syarat itu terpenuhi, sistem memberi label **"Aman Ditanam"**. Kalau harganya sering anjlok saat musim panen raya karena semua petani menanam serentak, sistem memberi catatan peringatan.

---

## Ringkasan Alur dari Data ke Keputusan

```
Satelit cuaca & GPS
       ↓
Data suhu, hujan, angin, kelembapan
       ↓
Sistem mengecek kondisi vs. batas ambang yang sudah ditentukan
       ↓
Menghasilkan skor atau status (aman / perlu waspada / berbahaya)
       ↓
Diterjemahkan ke instruksi yang langsung bisa diikuti petani
       ↓
Petani mengambil tindakan yang tepat di waktu yang tepat
```

Intinya, sistem tidak pernah "menebak". Semua keputusan mengikuti aturan berbasis data ilmiah yang sudah terverifikasi. Tugas sistem hanyalah membaca data itu lebih cepat dan lebih konsisten dari yang bisa dilakukan manusia, lalu menyampaikannya dalam bahasa yang bisa langsung dipahami petani.
