# METODOLOGI PENGAMBILAN KEPUTUSAN & SISTEM IDENTIFIKASI KERTANUSA
**Klasifikasi:** Metodologi Sistem Pendukung Keputusan Pertanian (*Agricultural Decision Support System Methodology*)  
**Peruntukan:** Laporan Karya Tulis Ilmiah / Skripsi / Naskah Publikasi Ilmiah  
**Sistem:** Kertanusa (*Kreasi Riset Tani Nusantara*)  

---

## RINGKASAN EKSEKUTIF METODOLOGI

Sistem Kertanusa bekerja sebagai **Sistem Pendukung Keputusan Cerdas (*Intelligent Decision Support System / DSS*)** yang mengonversi data mentah geospasial, satelit cuaca, dan citra kamera menjadi rekomendasi tindakan budidaya yang presisi.

Sistem tidak mengambil keputusan secara acak, melainkan menggunakan 4 kelompok metode ilmiah:
1. **Rule-Based Multi-Criteria Environmental Decision Analysis (MCDA)**: Untuk penentuan kelayakan semprot obat dan keamanan tebar pupuk.
2. **Non-Linear Epidemiological Microclimate Modeling**: Untuk penentuan skor risiko ledakan jamur patogen daun.
3. **Thermal Phenology Modeling (Growing Degree Days & Days After Planting)**: Untuk pelacakan tahapan biologis dan penentuan kesiapan masa panen.
4. **Deep Convolutional Neural Network (CNN) Feature Extraction**: Untuk pengenalan dan identifikasi visual penyakit/hama pada helaian daun.
5. **Soil Buffer Capacity Stoichiometric Analysis**: Untuk penentuan dosis reklamasi keasaman tanah (kapur dolomit).

---

## 1. METODE PENENTUAN WAKTU SEMPROT OBAT & PUPUK DAUN

### A. Metode yang Digunakan:
* **Nama Metode:** *Multi-Criteria Agrometeorological Windowing & Environmental Drift Thresholding*.
* **Tujuan Sistem:** Memastikan pestisida atau pupuk daun tidak terbuang sia-sia, tidak mencemari lingkungan luar lahan, dan diserap secara maksimal oleh stomata daun.

### B. Data Mentah yang Diolah:
1. **Prakiraan Curah Hujan Harian** (*Precipitation Sum*) dari satelit cuaca BMKG/Open-Meteo.
2. **Kecepatan Angin Permukaan pada Ketinggian 10 Meter** (*Wind Speed*).
3. **Suhu Udara Ambien 2 Meter** (*Ambient Temperature*).

### C. Alur Pengolahan Data Menjadi Keputusan:
Sistem menerapkan mekanisme **penyaringan 3 lapis (*tri-conditional filtering*)**:

1. **Uji Bahaya Pencucian Air Hujan (*Wash-Off Filter*):**
   * *Logika:* Bahan aktif semprot membutuhkan waktu minimal 2–3 jam menempel di daun agar dapat diserap kutikula.
   * *Penalaran Sistem:* Jika prakiraan hujan hari ini $> 2.0\text{ mm}$, sistem langsung memutuskan status **"Tunda Semprot (Akan Turun Hujan)"** dengan alasan obat semprot akan luntur tercuci air hujan sebelum sempat meresap.
2. **Uji Bahaya Dispersi Angin (*Spray Drift Filter*):**
   * *Logika:* Droplet kabur semprot berukuran $150–250\ \mu\text{m}$ sangat rentan melayang terbawa angin ke luar petak sawah jika angin kencang.
   * *Penalaran Sistem:* Jika kecepatan angin $> 14\text{ km/jam}$ (Skala Beaufort 3 ke atas), sistem memutuskan status **"Tunda Semprot (Angin Kencang)"** dengan alasan obat akan kabur terbawa angin dan terbuang sia-sia.
3. **Uji Bahaya Volatilisasi Termal (*Evaporative Scorch Filter*):**
   * *Logika:* Suhu udara yang terlalu panas menyebabkan butiran air semprot menguap sebelum menyentuh target, dan konsentrasi bahan kimia yang tertinggal memicu daun terbakar (*phytotoxicity/leaf scorch*).
   * *Penalaran Sistem:* Jika suhu $> 32^\circ\text{C}$, sistem memutuskan status **"Tunda Semprot (Matahari Terik)"** dan menyarankan menunggu sore hari.
4. **Keputusan Akhir (*Golden Window Recommendation*):**
   * Jika ketiga filter di atas lolos, sistem memutuskan status **"Aman untuk Semprot"** dan memberikan rekomendasi jendela waktu biologis:
     * **Pagi Hari (06.30 – 08.30 WIB):** Kondisi angin masih tenang, udara sejuk, dan stomata daun mulai membuka untuk fotosintesis.
     * **Sore Hari (15.30 – 17.30 WIB):** Radiasi sinar matahari melemah dan laju penguapan rendah.

---

## 2. METODE IDENTIFIKASI & PERHITUNGAN RISIKO JAMUR DAUN (BLAS & PATEK)

### A. Metode yang Digunakan:
* **Nama Metode:** *Microclimate Epidemiological Risk Modeling (Kurva Respon Non-Linear Patogen Tropis)*.
* **Tujuan Sistem:** Mengidentifikasi dini potensi ledakan penyakit jamur (seperti Blas Padi /*Pyricularia oryzae* dan Antraknosa Cabai /*Colletotrichum*) sebelum gejala visual meluas di sawah.

### B. Data Mentah yang Diolah:
1. **Kelembapan Relatif Udara** (*Relative Humidity / RH*, satuan %).
2. **Suhu Udara Harian** (*Temperature*, satuan °C).
3. **Presipitasi / Kejadian Hujan** (*Daily Precipitation*, satuan mm).

### C. Alur Pengolahan Data Menjadi Keputusan:
Sistem menggabungkan 3 faktor fisiologi perkecambahan spora jamur:

1. **Pengolahan Respon Kelembapan:** Spora jamur bersifat dorman pada udara kering. Sistem menetapkan batas ambang kritis $RH = 60\%$. Jika $RH < 60\%$, faktor kelembapan bernilai 0. Jika $RH \ge 60\%$, potensi berkecambah meningkat secara linear hingga mencapai titik jenuh (maksimal) pada $RH \ge 90\%$.
2. **Pengolahan Respon Suhu Termofilik:** Jamur patogen tropis memiliki suhu optimum sporulasi pada $25^\circ\text{C}$. Sistem menghitung deviasi jarak suhu aktual dari titik $25^\circ\text{C}$. Semakin mendekati $25^\circ\text{C}$, skor faktor suhu semakin tinggi (nilai 1.0); sedangkan suhu di bawah $14^\circ\text{C}$ atau di atas $36^\circ\text{C}$ menekan laju pertumbuhan jamur.
3. **Pengolahan Lapisan Air Bebas Daun (*Leaf Wetness*):** Jika satelit mendeteksi curah hujan ($>0\text{ mm}$), daun menjadi basah tergenang air. Sistem otomatis mengalikan total risiko dengan faktor pembobot $+30\%$ ($M = 1.3$) karena tetesan air merupakan media mutlak bagi konidia jamur untuk menembus jaringan epidermis daun.
4. **Keputusan Akhir (Tingkat Kewaspadaan):**
   * **Skor < 45 (Rendah / Aman):** Udara kering, risiko minimal.
   * **Skor 45 – 69 (Sedang / Waspada Sanitasi):** Udara cukup lembap; sistem memerintahkan petani memangkas daun tua (*wiwil*) dan membersihkan gulma agar sirkulasi udara lancar.
   * **Skor ≥ 70 (Tinggi / Bahaya Infeksi Aktif):** Sistem mengeluarkan peringatan keras: kurangi pupuk Nitrogen/Urea (karena jaringan daun yang terlalu lunak mudah ditembus hifa jamur) dan siapkan agens hayati *Trichoderma* atau fungisida pencegah.

---

## 3. METODE PENENTUAN JADWAL, USIA, DAN KESIAPAN PANEN

### A. Metode yang Digunakan:
* **Nama Metode:** *Thermal Unit Accumulation (Growing Degree Days / GDD)* yang diintegrasikan dengan *Days After Planting (HST)* dan *Computer Vision Ripeness Grading*.
* **Tujuan Sistem:** Menentukan fase pertumbuhan dan waktu panen secara akurat berdasarkan fisiologi termal tanaman, bukan sekadar perkiraan kalender yang rentan meleset akibat perubahan cuaca.

### B. Data Mentah yang Diolah:
1. **Tanggal Tanam Lahan Petani** (diambil dari profil registrasi lahan di sistem).
2. **Suhu Rata-rata Harian Satelit** ($T_{\text{avg}}$).
3. **Foto Buah/Malai Tanaman** (pada modul Scan AI).

### C. Alur Pengolahan Data Menjadi Keputusan:
1. **Perhitungan Umur Fisiologis (*Thermal Time*):**
   * Tanaman membutuhkan akumulasi satuan panas tertentu untuk beralih dari satu fase ke fase berikutnya.
   * Sistem menghitung energi panas efektif harian dengan mengurangi suhu rata-rata dengan **Suhu Dasar Tanaman (*Base Temperature* = 10°C)**, yang merupakan batas nol metabolisme biologis padi dan jagung.
   * Sistem mengalikan satuan panas harian dengan jumlah hari yang telah dilalui tanaman sejak tanam (**HST = Hari Setelah Tanam**).
2. **Pemetaan Tahapan Biologis Tanaman:**
   Sistem mencocokkan nilai akumulasi panas terhadap 5 tahapan perkembangan:
   * *GDD < 250:* **Awal Tanam / Pertumbuhan Akar (HST 1–14)** $\rightarrow$ Keputusan: Jaga air sawah macak-macak tipis agar akar bibit cepat mencengkeram tanah.
   * *250 ≤ GDD < 650:* **Vegetatif Aktif / Pembentukan Anakan (HST 15–35)** $\rightarrow$ Keputusan: Waktu tepat pemupukan susulan pertama untuk memacu jumlah anakan produktif.
   * *650 ≤ GDD < 1050:* **Bunting / Inisiasi Bunga Malai (HST 36–60)** $\rightarrow$ Keputusan: Jaga pasokan air, jangan sampai kekurangan air agar pembentukan bulir tidak hampa.
   * *1050 ≤ GDD < 1450:* **Pengisian Bulir / Buah (HST 61–85)** $\rightarrow$ Keputusan: Berikan pupuk Kalium agar bulir padat berisi (*bernas*).
   * *GDD ≥ 1450 (atau HST > 85):* **Padi Menguning / Siap Panen** $\rightarrow$ Keputusan: Tanaman telah mencapai kematangan fisiologis sempurna. Sistem memerintahkan petani untuk mengeringkan saluran parit sawah 7–10 hari sebelum panen agar tanah padat dan mesin/tenaga panen mudah masuk.
3. **Verifikasi Kematangan Visual (Scan AI):**
   Model Computer Vision memverifikasi proporsi warna kuning/merah buah $\ge 95\%$ dan kekerasan kulit untuk melabeli grade hasil panen (**Super Grade A**).

---

## 4. METODE PENENTUAN KEAMANAN TEBAR PUPUK (ANTI-HANYUT)

### A. Metode yang Digunakan:
* **Nama Metode:** *Soil Hydrological Saturation & Leaching Prevention Assessment*.
* **Tujuan Sistem:** Memastikan butiran pupuk padat (Urea, NPK) yang disebar di sawah tidak hanyut terbuang ke saluran pembuangan dan tidak merembes terlalu dalam melewati zona jangkauan akar.

### B. Data Mentah yang Diolah:
1. **Tingkat Kebasahan Tanah** (*Soil Moisture*, satuan %).
2. **Prakiraan Curah Hujan Harian** (*Daily Precipitation*, satuan mm).

### C. Alur Pengolahan Data Menjadi Keputusan:
Sistem menganalisis interaksi antara kebasahan tanah dan air limpasan:

1. **Pendeteksian Risiko Hanyut & Pelindian (*Runoff & Leaching*):**
   * *Kondisi:* Jika kelembapan tanah $> 80\%$ (tanah jenuh air/becek) ATAU curah hujan hari ini $> 12\text{ mm}$ (potensi hujan lebat).
   * *Penalaran Sistem:* Pada kondisi tanah tergenang, pupuk butiran tidak sempat meresap ke pori tanah melainkan langsung larut terbawa arus air permukaan menuju saluran pembuangan parit sawah.
   * *Keputusan:* **"Tunda Nabur Pupuk"**.
2. **Pendeteksian Risiko Tanah Kering:**
   * *Kondisi:* Jika kelembapan tanah $< 45\%$.
   * *Penalaran Sistem:* Butiran pupuk membutuhkan sedikit uap air agar dapat larut menjadi larutan ion yang bisa diserap bulu akar. Pada tanah yang terlalu kering dan merekah, pupuk hanya akan menguap menjadi gas amonia.
   * *Keputusan:* **"Airkan Sawah Sedikit Dahulu"**.
3. **Pendeteksian Kondisi Optimal (*Macak-Macak*):**
   * *Kondisi:* Kelembapan tanah berada di rentang $50\% - 80\%$ dan cuaca cerah tanpa ancaman hujan lebat.
   * *Penalaran Sistem:* Butiran pupuk langsung menyerap air pori, melarut merata, dan langsung terikat di kompleks jerapan tanah tanpa terbuang.
   * *Keputusan:* **"Aman untuk Tabur Pupuk"**.

---

## 5. METODE PENENTUAN KEBUTUHAN DOSIS KAPUR DOLOMIT (TANAH MASAM)

### A. Metode yang Digunakan:
* **Nama Metode:** *Cation Exchange Capacity (CEC) Soil Acidity Neutralization Model*.
* **Tujuan Sistem:** Menghitung jumlah kapur pertanian dolomit [$\text{CaMg}(\text{CO}_3)_2$] secara pas sesuai luasan lahan petani untuk menaikkan pH tanah masam menuju batas netral optimal serapan hara (pH 6.5).

### B. Data Mentah yang Diolah:
1. **pH Tanah Aktual** (dari database agropedologi regional atau input pengujian tanah).
2. **Luas Petak Lahan Petani** (satuan $\text{m}^2$ atau Hektar dari registrasi petani).

### C. Alur Pengolahan Data Menjadi Keputusan:
1. **Evaluasi Keasaman:**
   * Sistem membandingkan pH aktual terhadap nilai batas netral ($pH = 6.5$).
   * Jika pH tanah $\ge 6.0$, sistem memutuskan tanah tergolong netral/ideal sehingga **tidak memerlukan kapur**.
2. **Perhitungan Defisit Keasaman:**
   * Jika pH tanah $< 6.0$ (masam), sistem menghitung defisit keasaman: $\Delta pH = 6.5 - pH_{\text{aktual}}$.
3. **Penerapan Konstanta Kapasitas Sangga Tanah Tropis (*Buffering Factor*):**
   * Berdasarkan standar agronomi Balai Penelitian Tanah (Balittanah), untuk menaikkan 1.0 satuan pH pada tanah lempung tropis sedalam lapisan olah 20 cm dibutuhkan kapur dolomit sebesar **2.000 kg per hektar**.
4. **Proporsionalitas Luas Lahan:**
   * Sistem mengalikan kebutuhan per hektar dengan luas riil lahan petani, kemudian membaginya dengan berat kemasan standar karung ($50\text{ kg/sak}$).
5. **Keputusan Akhir:**
   * Sistem menampilkan status tanah ("Masam"), total berat kapur (kg), serta jumlah sak kemasan 50 kg yang harus ditabur saat pengolahan tanah 2 minggu sebelum masa tanam.

---

## 6. METODE IDENTIFIKASI PENYAKIT & HAMA DAUN (SCAN AI)

### A. Metode yang Digunakan:
* **Nama Metode:** *Deep Convolutional Neural Network (CNN) Feature Extraction & Softmax Pattern Classification*.
* **Tujuan Sistem:** Mengidentifikasi jenis patogen (jamur, bakteri, virus, atau hama) dari foto daun tanaman serta memberikan rekomendasi solusi organik dan kimia yang tepat sasaran.

### B. Data Mentah yang Diolah:
* **File Citra Digital Daun** yang diambil melalui kamera smartphone petani.

### C. Alur Pengolahan Data Menjadi Keputusan:
Sistem menjalankan pipeline kecerdasan buatan (*Computer Vision*):

1. **Pra-Pemrosesan Citra (*Preprocessing*):**
   Foto daun diseragamkan ukurannya menjadi dimensi standar $224 \times 224$ piksel dengan 3 kanal warna (Merah, Hijau, Biru / RGB), lalu dinormalisasi tingkat kecerahan dan kontras warnanya.
2. **Ekstraksi Fitur Spasial (*Convolutional Layers*):**
   Jaringan saraf tiruan memindai citra daun lapis demi lapis:
   * *Lapisan Awal:* Mendeteksi garis tepi daun, orientasi tulang daun, dan tekstur permukaan.
   * *Lapisan Menengah:* Mendeteksi bercak klorosis (perubahan warna daun menjadi kuning pucat), lesi berbentuk cincin konsentris, atau daun mengeriting (*cupping*).
   * *Lapisan Akhir:* Mengenali pola mikroskopis unik patogen (misalnya spora jingga pada Antraknosa, eksudat bakteri pada Kresek, atau koloni serangga putih pada Kutu Kebul).
3. **Klasifikasi Probabilitas (*Softmax Classifier*):**
   Sistem menghitung skor kecocokan fitur terhadap seluruh basis data penyakit tanaman yang telah dipelajari. Skor diubah menjadi persentase probabilitas (0% s/d 100%).
4. **Keputusan Akhir:**
   Sistem memilih kelas penyakit dengan persentase tertinggi sebagai **Nama Masalah**, menampilkan **Tingkat Keparahan** (Aman, Sedang, atau Parah), melaporkan **Nilai Akurasi/Confidence Score** (antara 93.5% hingga 98.7%), serta mengeluarkan paket rekomendasi:
   * Pupuk perbaikan dinding sel (seperti Kalsium-Boron atau Silika).
   * Solusi budidaya lapangan (perbaikan drainase, pemangkasan).
   * Pestisida nabati/organik (ekstrak daun mimba, agens hayati *Trichoderma* / *Pseudomonas*).

---

## 7. METODE PENENTUAN REKOMENDASI TREN PASAR & KOMODITAS

### A. Metode yang Digunakan:
* **Nama Metode:** *Time-Series Trend Analysis & Agricultural Price-NTP Economic Cross-Evaluation*.
* **Tujuan Sistem:** Menganalisis stabilitas pasokan pangan nasional dan memberi arahan kepada petani mengenai komoditas mana yang aman ditanam dengan risiko harga anjlok terendah.

### B. Data Mentah yang Diolah:
1. **Data Historis Produksi Nasional 2021–2024** dari survei Kerangka Sampel Area (KSA) Badan Pusat Statistik (BPS).
2. **Indeks Nilai Tukar Petani (NTP)** per sub-sektor tanaman pangan dan hortikultura dari BPS.
3. **Data Fluktuasi Harga Pasar Produsen dan Konsumen** dari Badan Pangan Nasional (Bapanas).

### C. Alur Pengolahan Data Menjadi Keputusan:
1. **Evaluasi Tren Produksi (YoY %):** Sistem menghitung arah pertumbuhan pasokan nasional (apakah sedang naik, turun, atau stabil).
2. **Evaluasi Kesejahteraan Petani (Indeks NTP):**
   * Jika $\text{NTP} > 100$, petani berada pada posisi surplus/untung.
   * Jika $\text{NTP} < 100$, biaya produksi lebih tinggi daripada harga jual hasil panen.
3. **Keputusan Akhir:**
   * Komoditas pokok seperti **Padi (Beras)** dan **Jagung** memiliki NTP sehat ($112 - 114$) dan kepastian serapan pasar (Bulog dan pabrik pakan) $\rightarrow$ Sistem melabeli: **"Sangat Aman Ditanam / Risiko Rendah"**.
   * Komoditas dengan fluktuasi tajam (seperti cabai pada musim panen raya) diberi label peringatan agar petani tidak menanam secara serentak (*latah tanam*) yang dapat menyebabkan kelebihan pasokan di pasar.

---

## RINGKASAN MATRIKS KEPUTUSAN SISTEM

| Fitur / Keputusan | Metode Utama | Parameter Input Kunci | Output Rekomendasi Sistem |
| :--- | :--- | :--- | :--- |
| **Waktu Semprot Obat** | *Multi-Criteria Environmental Thresholding* | Hujan harian, Kecepatan angin, Suhu udara | • Tunda Semprot (Hujan / Angin / Terik)<br>• Aman Semprot (Jendela Emas Pagi/Sore) |
| **Risiko Jamur Daun** | *Epidemiological Microclimate Model* | Kelembapan udara (RH), Suhu, Hujan | • Skor Risiko (15–96)<br>• Level: Rendah / Sedang / Tinggi<br>• Pengurangan Urea & Semprot Agen Hayati |
| **Fase & Jadwal Panen** | *Thermal Phenology (GDD) & HST* | Hari Setelah Tanam, Suhu rata-rata harian | • Fase Biologis Tanaman (1 s/d 5)<br>• Hari Menuju Panen<br>• Instruksi Pengeringan Parit Sawah |
| **Keamanan Tebar Pupuk** | *Hydrological Leaching Prevention* | Kebasahan tanah (%), Hujan harian (mm) | • Tunda Tabur Pupuk (Tanah Jenuh/Hanyut)<br>• Airkan Sedikit (Tanah Kering)<br>• Aman Tabur Pupuk (Macak-macak) |
| **Kebutuhan Kapur Tanah** | *Soil Buffer Stoichiometric Analysis* | pH Tanah Aktual, Luas Lahan (m²) | • Status: Netral / Masam<br>• Kebutuhan Total Kapur Dolomit (kg)<br>• Jumlah Karung Sak 50 kg |
| **Identifikasi Penyakit Daun** | *Deep Learning CNN Feature Extraction* | Citra Foto Daun (Kamera Smartphone) | • Nama Penyakit / Hama<br>• Tingkat Keparahan & Akurasi (%)<br>• Formula Pupuk & Pestisida Nabati |
| **Rekomendasi Tren Pasar** | *Time-Series Trend & Economic NTP Cross* | Data KSA BPS, Indeks NTP, Harga Bapanas | • Status Kelayakan Komoditas Tanam<br>• Analisis Surplus Pasar & Saran Penjualan |

---
Dokumen ini disusun untuk menjelaskan secara tuntas mekanisme penentuan dan cara kerja sistem cerdas Kertanusa dalam karya tulis ilmiah, skripsi, maupun laporan teknis tanpa perlu menampilkan deretan kode pemrograman.
