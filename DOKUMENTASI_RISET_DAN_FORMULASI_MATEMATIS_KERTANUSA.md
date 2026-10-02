# DOKUMENTASI SUMBER DATA RISET & FORMULASI MATEMATIS SISTEM PERTANIAN CERDAS KERTANUSA
**Klasifikasi:** Laporan Teknis Metodologi & Landasan Matematis (*Technical & Mathematical Reference Report*)  
**Peruntukan:** Laporan Karya Tulis Ilmiah / Skripsi / Naskah Publikasi Ilmiah  
**Tanggal Rilis:** 2 Oktober 2026  
**Sistem:** Kertanusa (*Kreasi Riset Tani Nusantara*)  

---

## DAFTAR ISI
1. [BAB I: SUMBER DATA RISET (DATA PROVENANCE & CITATIONS)](#bab-i-sumber-data-riset-data-provenance--citations)
   - 1.1 Suhu, Kelembapan, dan Kondisi Cuaca Permukaan
   - 1.2 Kebasahan dan Kadar Air Tanah (*Soil Moisture*)
   - 1.3 Kadar Asam Tanah (*Soil pH*) Regional
   - 1.4 Statistik Panen, Produksi, dan Pasokan Pangan Nasional
   - 1.5 Peta Sebaran Spasial dan Geocoding Lahan
   - 1.6 Kondisi Daun dan Dataset Patologi Tanaman (Computer Vision)
   - 1.7 Panduan Agronomi dan Pengendalian Hama Terpadu
2. [BAB II: FORMULASI MATEMATIS ALGORITMA SISTEM](#bab-ii-formulasi-matematis-algoritma-sistem)
   - 2.1 Model Defisit Tekanan Uap (*Vapor Pressure Deficit* - VPD) & Konduktansi Stomata
   - 2.2 Model Dinamika Kadar Air Tanah Lapisan Atas (*Topsoil Moisture Balance*)
   - 2.3 Model Indeks Risiko Infeksi Patogen Jamur Daun (*Fungal Risk Index* - FRI)
   - 2.4 Model Evaluasi Kelayakan Penyemprotan Pestisida (*Spray Window Decision Model*)
   - 2.5 Model Pelindian Hara & Keamanan Pemupukan (*Nutrient Leaching Model*)
   - 2.6 Model Fenologi Termal Satuan Derajat Hari (*Growing Degree Days* - GDD)
   - 2.7 Model Stoikiometri Netralisasi Asam Tanah & Kebutuhan Kapur Dolomit
   - 2.8 Model Jaringan Konvolusional Penyakit Daun (*Deep Convolutional Neural Network*)
   - 2.9 Model Estimasi Luas Panen Kerangka Sampel Area (KSA) & Proyeksi Produksi
3. [BAB III: DAFTAR PUSTAKA ACUAN ILMIAH](#bab-iii-daftar-pustaka-acuan-ilmiah)

---

## BAB I: SUMBER DATA RISET (DATA PROVENANCE & CITATIONS)

Sistem Kertanusa mengintegrasikan data empiris dari berbagai institusi riset agrometeorologi, geospasial, dan badan statistik resmi nasional maupun internasional.

### 1.1 Suhu, Kelembapan, dan Kondisi Cuaca Permukaan
* **Penyedia Data Primer:** Konsorsium *Open-Meteo Weather API* yang terintegrasi secara *real-time* dengan:
  1. **ECMWF** (*European Centre for Medium-Range Weather Forecasts*) melalui model reanalisis atmosfer resolusi tinggi **ERA5 High-Resolution Land**.
  2. **NOAA** (*National Oceanic and Atmospheric Administration*, Amerika Serikat) melalui model numerik **GFS** (*Global Forecast System*).
  3. Kalibrasi stasiun cuaca permukaan dan radar cuaca dari **Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)** Indonesia.
* **Karakteristik Data:**
  * Resolusi spasial: Grid $0.01^\circ \times 0.01^\circ$ (interpolasi $\pm 1 - 2\text{ km}$ pada koordinat GPS WGS84).
  * Parameter observasi: Temperatur pada ketinggian 2 meter ($T_{2m}$), Kelembapan relatif 2 meter ($RH_{2m}$), Kecepatan angin ketinggian 10 meter ($v_{10m}$), Radiasi matahari langsung ($R_s$), serta kode cuaca internasional standar **WMO Code 4677** (*World Meteorological Organization*).
  * Frekuensi pembaruan: Setiap 60 menit dengan prakiraan ke depan hingga 14 hari.

### 1.2 Kebasahan dan Kadar Air Tanah (*Soil Moisture*)
* **Penyedia Data & Model:**
  Data estimasi kelembapan tanah dihitung menggunakan model keseimbangan hidrologi lapisan olah (*topsoil layer* kedalaman $0 - 10\text{ cm}$) yang memadukan data curah hujan harian ($P$), laju penguapan atmosferik, dan basis data sifat hidrofisik tanah lokal. Rujukan parameter hidrofisik tanah mengacu pada standar **FAO Irrigation and Drainage Paper No. 56**.

### 1.3 Kadar Asam Tanah (*Soil pH*) Regional
* **Penyedia Data Primer:**
  1. **Balai Besar Litbang Sumberdaya Lahan Pertanian (BBLSDLP)** / **Badan Riset dan Inovasi Nasional (BRIN)**: Basis Data Peta Satuan Lahan dan Karakteristik Tanah Skala 1:50.000.
  2. **ISRIC – World Soil Information**: Peta global **SoilGrids250m** berbasis machine learning spasial.
* **Karakteristik Regional:**
  * Brebes (Jawa Tengah): Tanah Alluvial dan Grumosol (Lempung endapan sungai), $\text{pH rata-rata} = 6.5$.
  * Malang/Batu (Jawa Timur): Tanah Andosol Vulkanis Pegunungan, $\text{pH rata-rata} = 6.2$.
  * Cianjur (Jawa Barat): Tanah Latosol dan Andosol, $\text{pH rata-rata} = 5.9$.
  * Lombok Timur (NTB): Tanah Regosol dan Litosol berpasir, $\text{pH rata-rata} = 6.8$.

### 1.4 Statistik Panen, Produksi, dan Pasokan Pangan Nasional
* **Penyedia Data Primer:**
  1. **Badan Pusat Statistik (BPS) Republik Indonesia**: Laporan Resmi Hasil Survei Pertanian Berbasis Kerangka Sampel Area (KSA) Padi dan Jagung periode 2021 hingga 2024.
  2. **Kementerian Pertanian Republik Indonesia (Kementan)**: Buku Outlook Komoditas Pertanian Tanaman Pangan dan Hortikultura.
  3. **Badan Pangan Nasional (Bapanas)**: Neraca Pangan Nasional, data Cadangan Beras Pemerintah (CBP) di Perum BULOG, serta indikator Nilai Tukar Petani (NTP).
* **Cakupan Data Historis dan Proyeksi:**
  * Periode 2021–2024: Data realisasi final hasil penghitungan citra satelit dan survei lapangan BPS.
  * Periode 2025: Angka estimasi sementara dengan memperhitungkan intervensi program pompanisasi dan perluasan areal tanam (PAT) Kementan.
  * Periode 2026: Angka target strategis selaras dengan *Roadmap* Swasembada Pangan Nasional.

### 1.5 Peta Sebaran Spasial dan Geocoding Lahan
* **Penyedia Citra Satelit & Vektor:**
  1. **Esri World Imagery**: Citra komposit satelit bumi resolusi sub-meter (*Earthstar Geographics / Maxar Technologies*).
  2. **OpenStreetMap (OSM) Nominatim Reverse Geocoding**: Algoritma konversi koordinat garis lintang (*latitude*) dan bujur (*longitude*) menjadi hierarki administratif resmi (Desa/Kelurahan, Kecamatan, Kabupaten/Kota, Provinsi).
  3. **Badan Informasi Geospasial (BIG)**: Peta batas wilayah Republik Indonesia skala 1:250.000.

### 1.6 Kondisi Daun dan Dataset Patologi Tanaman (Computer Vision)
* **Penyedia Dataset Primer:**
  * Konsorsium **PlantVillage** (*Penn State University & EPFL*), diperluas dengan basis data fitopatologi dari **Institut Pertanian Bogor (IPB University)** dan **Balai Penelitian Tanaman Sayuran (Balitsa / BRIN)**.
  * Korpus memuat lebih dari 54.000 citra daun beranotasi patologi spesifik tanaman tropis:
    * Penyakit Antraknosa / Patek (*Colletotrichum capsici* pada cabai dan tomat).
    * Hama Kutu Kebul / Vektor Virus Kuning (*Bemisia tabaci* dan *Gemini Virus*).
    * Penyakit Hawar Daun Bakteri / Kresek (*Xanthomonas oryzae pv. oryzae* pada padi).
    * Kondisi Tanaman Sehat Siap Panen (*Super Grade A*).

### 1.7 Panduan Agronomi dan Pengendalian Hama Terpadu
* **Sumber Standar:**
  1. **FAO Good Agricultural Practices (GAP)**: Pedoman operasional budidaya ramah lingkungan dan aman pangan.
  2. **International Rice Research Institute (IRRI)**: *Standard Evaluation System for Rice (SES)*.
  3. **Balai Penelitian Tanah (Balittanah - BRIN)**: Petunjuk Teknis Rekomendasi Pemupukan N, P, K Spesifik Lokasi.

---

## BAB II: FORMULASI MATEMATIS ALGORITMA SISTEM

Bagian ini menyajikan formulasi analitik, persamaan fisis, dan logika predikat matematis murni tanpa melibatkan sintaks bahasa pemrograman.

---

### 2.1 Model Defisit Tekanan Uap (*Vapor Pressure Deficit* - VPD) & Konduktansi Stomata

Defisit Tekanan Uap mengukur selisih antara tekanan uap jenuh air di dalam ruang interseluler daun dengan tekanan uap aktual di udara ambien. VPD merupakan pendorong utama laju transpirasi dan penyerapan hara oleh akar tanaman.

#### 1. Persamaan Tekanan Uap Jenuh (*Saturation Vapor Pressure* - SVP)
Berdasarkan formulasi Tetens (1930) yang dimodifikasi oleh Murray (1967):

$$\text{SVP}(T) = a \cdot \exp\left( \frac{b \cdot T}{T + c} \right) \quad [\text{kPa}]$$

*Dimana konstanta empiris untuk rentang suhu $T \ge 0^\circ\text{C}$ adalah:*
* $a = 0.61078\text{ kPa}$
* $b = 17.27$
* $c = 237.3^\circ\text{C}$
* $T$ = Suhu udara permukaan ($^\circ\text{C}$)

#### 2. Persamaan Tekanan Uap Aktual (*Actual Vapor Pressure* - AVP)
Dihitung dari kelembapan relatif udara ($RH$):

$$\text{AVP}(T, RH) = \text{SVP}(T) \times \left( \frac{RH}{100} \right) \quad [\text{kPa}]$$

*Dimana:*
* $RH$ = Kelembapan relatif udara ($0\% \le RH \le 100\%$)

#### 3. Persamaan Defisit Tekanan Uap (VPD)

$$\text{VPD} = \text{SVP}(T) - \text{AVP}(T, RH) = \text{SVP}(T) \cdot \left( 1 - \frac{RH}{100} \right) \quad [\text{kPa}]$$

#### 4. Model Matematis Respon Transpirasi Tanaman
Fungsi evaluasi status stomata daun $S(VPD)$ didefinisikan sebagai fungsi tangga bertingkat (*piecewise step function*):

$$S(VPD) = \begin{cases} 
\text{Saturasi Embun / Kelembapan Ekstrem}, & \text{bila } 0 \le VPD < 0.45\text{ kPa} \\ 
\text{Kondisi Sangat Ideal (Konduktansi Stomata Maksimal)}, & \text{bila } 0.45 \le VPD \le 1.25\text{ kPa} \\ 
\text{Transpirasi Cepat (Evaporasi Moderat)}, & \text{bila } 1.25 < VPD \le 1.65\text{ kPa} \\ 
\text{Stres Kekeringan (Penutupan Stomata Daun)}, & \text{bila } VPD > 1.65\text{ kPa} 
\end{cases}$$

#### 5. Contoh Perhitungan Numerik:
* Diketahui data lapangan: Suhu $T = 29.7^\circ\text{C}$, Kelembapan $RH = 67\%$.
* Langkah 1:
  $$\text{SVP}(29.7) = 0.61078 \times \exp\left( \frac{17.27 \times 29.7}{29.7 + 237.3} \right) = 0.61078 \times \exp(1.9213) \approx 4.172\text{ kPa}$$
* Langkah 2:
  $$\text{AVP} = 4.172 \times \left( \frac{67}{100} \right) \approx 2.795\text{ kPa}$$
* Langkah 3:
  $$\text{VPD} = 4.172 - 2.795 = 1.377\text{ kPa}$$
* Kesimpulan Fisiologis: Tanaman berada pada kondisi evaporasi transpirasi cepat ($1.25 < VPD \le 1.65$), membutuhkan ketersediaan air tanah yang stabil.

---

### 2.2 Model Dinamika Kadar Air Tanah Lapisan Atas (*Topsoil Moisture Balance*)

Kadar air tanah volumetrik ($\theta_{\text{soil}}$) pada lapisan perakaran dangkal ($0 - 10\text{ cm}$) dimodelkan melalui persamaan linear terbobot antara kelembapan relatif atmosfer, curah hujan efektif harian, dan kapasitas lapang dasar tanah regional:

#### 1. Persamaan Neraca Air Permukaan:

$$\theta_{\text{kalkulasi}} = w_1 \cdot RH + w_2 \cdot P + w_3 \cdot \theta_{\text{base}} \quad [\%]$$

*Dimana parameter pembobotan empiris adalah:*
* $w_1 = 0.60$ (Faktor transfer uap kondensasi atmosferik)
* $w_2 = 2.50\text{ mm}^{-1}$ (Faktor infiltrasi presipitasi curah hujan)
* $w_3 = 0.30$ (Faktor retensi air kapasitas lapang tanah dasar)
* $P$ = Presipitasi harian ($\text{mm/hari}$)
* $\theta_{\text{base}}$ = Nilai acuan kelembapan dasar jenis tanah regional (%)

#### 2. Fungsi Pembatas Fisik (*Physical Bounding Function*):

$$\theta_{\text{soil}} = \max\Big(30, \min\big(95, \text{round}(\theta_{\text{kalkulasi}})\big)\Big) \quad [\%]$$

#### 3. Fungsi Predikat Klasifikasi Air Tanah:

$$\text{Status}(\theta_{\text{soil}}) = \begin{cases} 
\text{Kering (Defisit Air / Membutuhkan Irigasi)}, & \text{bila } \theta_{\text{soil}} < 50\% \\ 
\text{Optimal (Kondisi Macak-Macak / Kapasitas Lapang)}, & \text{bila } 50\% \le \theta_{\text{soil}} \le 80\% \\ 
\text{Jenuh Air (Waterlogged / Membutuhkan Drainase)}, & \text{bila } \theta_{\text{soil}} > 80\% 
\end{cases}$$

---

### 2.3 Model Indeks Risiko Infeksi Patogen Jamur Daun (*Fungal Risk Index* - FRI)

Model memprediksi probabilitas germinasi konidia jamur (*Pyricularia oryzae*, *Colletotrichum*, dll.) berdasarkan fungsi interaksi non-linear antara kelembapan udara, suhu termofilik jamur, dan keberadaan lapisan air bebas pada daun.

#### 1. Fungsi Respon Kelembapan Relatif ($f_{RH}$):

$$f_{RH}(RH) = \begin{cases} 
0, & \text{bila } RH < 60\% \\ 
\min\left(1.0, \frac{RH - 60}{30}\right), & \text{bila } RH \ge 60\% 
\end{cases}$$

*Artinya, risiko meningkat secara linear dari $0$ pada $RH = 60\%$ hingga mencapai nilai saturasi $1.0$ pada $RH \ge 90\%$.*

#### 2. Fungsi Respon Suhu Termofilik ($f_T$):
Respon suhu jamur berbentuk kurva simetris segitiga dengan titik optimum sporulasi $T_{\text{opt}} = 25^\circ\text{C}$ dan rentang batas toleransi $[14^\circ\text{C}, 36^\circ\text{C}]$:

$$f_T(T) = \max\left( 0, 1 - \frac{|T - 25|}{11} \right)$$

*Pada $T = 25^\circ\text{C}$, nilai $f_T = 1.0$. Pada $T \le 14^\circ\text{C}$ atau $T \ge 36^\circ\text{C}$, nilai $f_T = 0$.*

#### 3. Faktor Amplifikasi Lapisan Air Bebas Hujan ($M_{\text{rain}}$):

$$M_{\text{rain}}(P) = \begin{cases} 
1.3, & \text{bila } P > 0\text{ mm} \\ 
1.0, & \text{bila } P = 0\text{ mm} 
\end{cases}$$

#### 4. Nilai Skor Risiko Gabungan (*Composite Score*):

$$\text{FRI} = \max\Big(15, \min\big(96, \text{round}(f_{RH}(RH) \cdot f_T(T) \cdot M_{\text{rain}}(P) \cdot 100)\big)\Big)$$

#### 5. Tingkat Bahaya Epidemiologis:
* $\text{FRI} < 45$: **Rendah (Aman)** – Lingkungan tidak kondusif bagi perkecambahan spora.
* $45 \le \text{FRI} < 70$: **Sedang (Waspada Sanitasi)** – Diperlukan pembersihan gulma dan pemangkasan daun tua.
* $\text{FRI} \ge 70$: **Tinggi (Bahaya Infeksi Aktif)** – Waspada penularan cepat penyakit blas dan patek; aplikasi agens hayati/fungisida preventif direkomendasikan.

---

### 2.4 Model Evaluasi Kelayakan Penyemprotan Pestisida (*Spray Window Decision Model*)

Keberhasilan penyemprotan pestisida/pupuk daun bergantung pada kondisi mikroklimat. Model ini memvalidasi tiga parameter vektor cuaca utama: Presipitasi ($P$), Kecepatan Angin ($v_{\text{wind}}$), dan Suhu Udara ($T$).

#### 1. Relasi Predikat Evaluasi Jendela Semprot:

$$\Phi(P, v_{\text{wind}}, T) = \begin{cases} 
\text{Ditolak: Risiko Pencucian Air Hujan (Wash-off)}, & \text{bila } P > 2.0\text{ mm} \\ 
\text{Ditolak: Risiko Dispersi Melayang (Spray Drift)}, & \text{bila } v_{\text{wind}} > 14.0\text{ km/jam} \quad (\approx 3.89\text{ m/s}) \\ 
\text{Ditolak: Risiko Volatilisasi \& Daun Terbakar (Leaf Scorch)}, & \text{bila } T > 32.0^\circ\text{C} \\ 
\text{Diterima: Jendela Waktu Sangat Efektif (Aman)}, & \text{bila seluruh kriteria di atas terpenuhi} 
\end{cases}$$

#### 2. Kriteria Jendela Waktu Biologis (*Biological Time Window*):
Bila $\Phi = \text{Diterima}$, sistem merekomendasikan jendela waktu:
* **Pagi Hari:** Pukul $06.30 - 08.30\text{ WIB}$ (Stomata membuka, angin tenang, kelembapan daun mendukung).
* **Sore Hari:** Pukul $15.30 - 17.30\text{ WIB}$ (Intensitas radiasi matahari menurun, suhu sejuk).

---

### 2.5 Model Pelindian Hara & Keamanan Pemupukan (*Nutrient Leaching Model*)

Mencegah kehilangan pupuk butiran (Urea, NPK) akibat aliran permukaan (*surface runoff*) atau pelindian ion nitrat ($NO_3^-$) ke lapisan tanah dalam melebihi zona perakaran.

#### 1. Aturan Keputusan Keamanan Tebar Pupuk:

$$\Psi(\theta_{\text{soil}}, P) = \begin{cases} 
\text{Tunda Pemupukan (Risiko Pelindian \& Hanyut Ekstrem)}, & \text{bila } \theta_{\text{soil}} > 80\% \lor P > 12.0\text{ mm} \\ 
\text{Alirkan Irigasi Awal (Tanah Terlalu Kering untuk Pelarutan)}, & \text{bila } \theta_{\text{soil}} < 45\% \\ 
\text{Aman Ditebar (Efisiensi Serapan Nutrisi Maksimum)}, & \text{bila } 45\% \le \theta_{\text{soil}} \le 80\% \land P \le 12.0\text{ mm} 
\end{cases}$$

---

### 2.6 Model Fenologi Termal Satuan Derajat Hari (*Growing Degree Days* - GDD)

Laju perkembangan morfologi tanaman dikendalikan oleh akumulasi energi panas lingkungan di atas ambang suhu pertumbuhan dasar (*base temperature*).

#### 1. Persamaan Derajat Hari Harian ($GDD_{\text{daily}}$):

$$GDD_{\text{daily}} = \max\left( 0, \frac{T_{\max} + T_{\min}}{2} - T_{\text{base}} \right) \approx \max(0, T_{\text{avg}} - T_{\text{base}})$$

*Dimana:*
* $T_{\text{base}} = 10.0^\circ\text{C}$ (Temperatur nol biologis bagi tanaman padi dan jagung tropis).
* $T_{\text{avg}}$ = Temperatur rata-rata harian ($^\circ\text{C}$).

#### 2. Akumulasi Satuan Panas Fisiologis Kumulatif:

$$GDD_{\text{total}} = \sum_{t=1}^{\text{HST}} GDD_{\text{daily}}(t)$$

*Bila nilai harian konstan rata-rata didekati dengan $\bar{T}$, maka:*

$$GDD_{\text{total}} \approx \text{HST} \cdot \max(0, \bar{T} - T_{\text{base}})$$

*Dimana $\text{HST}$ adalah Hari Setelah Tanam (*Days After Planting*).*

#### 3. Pemetaan Fase Pertumbuhan Biologis Berdasarkan $GDD_{\text{total}}$:

$$\text{Fase}(GDD) = \begin{cases} 
\text{Fase 1: Awal Tanam \& Diferensiasi Akar (HST 1–14)}, & \text{bila } GDD < 250 \\ 
\text{Fase 2: Pertumbuhan Anakan \& Daun Aktif (HST 15–35)}, & \text{bila } 250 \le GDD < 650 \\ 
\text{Fase 3: Bunting \& Inisiasi Malai Bunga (HST 36–60)}, & \text{bila } 650 \le GDD < 1050 \\ 
\text{Fase 4: Pengisian Bulir / Buah (Grain Filling) (HST 61–85)}, & \text{bila } 1050 \le GDD < 1450 \\ 
\text{Fase 5: Pematangan Sempurna \& Siap Panen (HST > 85)}, & \text{bila } GDD \ge 1450 
\end{cases}$$

---

### 2.7 Model Stoikiometri Netralisasi Asam Tanah & Kebutuhan Kapur Dolomit

Pada tanah bereaksi masam ($pH < 6.0$), kelarutan ion aluminium ($Al^{3+}$) dan besi ($Fe^{3+}$) meningkat sehingga meracuni perakaran dan mengikat ion fosfat ($PO_4^{3-}$). Netralisasi dilakukan dengan kapur dolomit ($\text{CaMg}(\text{CO}_3)_2$).

#### 1. Reaksi Kimia Stoikiometri:

$$\text{CaMg}(\text{CO}_3)_2 + 4\text{H}^+ \longrightarrow \text{Ca}^{2+} + \text{Mg}^{2+} + 2\text{CO}_2 \uparrow + 2\text{H}_2\text{O}$$

#### 2. Formulasi Kebutuhan Dosis per Hektar ($D_{\text{ha}}$):

$$\Delta pH = \max(0, pH_{\text{target}} - pH_{\text{aktual}}) \quad \text{dengan } pH_{\text{target}} = 6.5$$

$$D_{\text{ha}} = \Delta pH \times k_{\text{tanah}} \quad [\text{kg/hektar}]$$

*Dimana konstanta kapasitas sangga tanah (*buffering factor*) lempung tropis adalah:*
* $k_{\text{tanah}} = 2.000\text{ kg}\cdot\text{ha}^{-1}\cdot\Delta pH^{-1}$

#### 3. Formulasi Kebutuhan Total Berdasarkan Luas Petak Lahan ($A$):

$$M_{\text{total}} = \text{round}\left( \frac{D_{\text{ha}} \times A}{10.000} \right) \quad [\text{kg}]$$

$$N_{\text{karung}} = \left\lceil \frac{M_{\text{total}}}{50} \right\rceil \quad [\text{sak kemasan 50 kg}]$$

*Dimana $A$ adalah luas riil lahan dalam meter persegi ($\text{m}^2$).*

---

### 2.8 Model Jaringan Konvolusional Penyakit Daun (*Deep Convolutional Neural Network*)

Analisis citra visual daun memanfaatkan *Deep Learning* berbasis arsitektur *Convolutional Neural Network* (CNN).

#### 1. Transformasi Tensor Citra Masukan:
Citra daun digital berukuran arbitrer dinormalisasi menjadi tensor $\mathbf{X} \in \mathbb{R}^{224 \times 224 \times 3}$:

$$\mathbf{X}_{i,j,k} = \frac{\mathbf{X}_{i,j,k}^{\text{raw}} - \mu_k}{\sigma_k} \quad \forall k \in \{R, G, B\}$$

#### 2. Operasi Konvolusi Dua Dimensi (Feature Extraction):
Pada lapisan konvolusi ke-$l$, *feature map* $\mathbf{H}^l$ dihasilkan melalui perkalian silang kernel pembobot $\mathbf{W}$ terhadap *feature map* lapisan sebelumnya $\mathbf{H}^{l-1}$:

$$\mathbf{H}_{i, j, m}^l = \text{ReLU}\left( \sum_{u=-k}^{k} \sum_{v=-k}^{k} \sum_{c=1}^{C} \mathbf{H}_{i+u, j+v, c}^{l-1} \cdot \mathbf{W}_{u, v, c, m}^l + b_m^l \right)$$

*Dimana fungsi aktivasi non-linear Rectified Linear Unit (ReLU) didefinisikan sebagai:*

$$\text{ReLU}(z) = \max(0, z)$$

#### 3. Global Average Pooling (GAP):
Mereduksi dimensi spasial $(H \times W)$ pada lapisan akhir konvolusi menjadi vektor representasi 1-dimensi $\mathbf{v} \in \mathbb{R}^M$:

$$v_m = \frac{1}{H \times W} \sum_{i=1}^{H} \sum_{j=1}^{W} \mathbf{H}_{i, j, m}^{\text{final}}$$

#### 4. Klasifikasi Probabilitas Softmax:
Distribusi probabilitas untuk $K$ kelas penyakit dihitung menggunakan fungsi Softmax:

$$P(y = c \mid \mathbf{X}) = \frac{\exp\left( \mathbf{w}_c^T \mathbf{v} + b_c \right)}{\sum_{j=1}^{K} \exp\left( \mathbf{w}_j^T \mathbf{v} + b_j \right)}$$

#### 5. Penentuan Kelas Output dan Derajat Kepercayaan (*Confidence Score*):

$$\hat{y} = \arg\max_{c \in \{1, \dots, K\}} P(y = c \mid \mathbf{X})$$

$$\text{Confidence Score} = \max_{c} P(y = c \mid \mathbf{X}) \times 100\% \quad [\%]$$

---

### 2.9 Model Estimasi Luas Panen Kerangka Sampel Area (KSA) & Proyeksi Produksi

Statistik pasokan pangan pada sistem Kertanusa mengacu pada metode objektif Kerangka Sampel Area (KSA) yang dikembangkan oleh BPS dan BPPT/BRIN.

#### 1. Estimasi Luas Panen Nasional ($\hat{L}_{\text{panen}}$):

$$\hat{L}_{\text{panen}} = \sum_{h=1}^{H} \frac{N_h}{n_h} \sum_{i=1}^{n_h} A_{hi} \cdot p_{hi,\text{panen}} \quad [\text{hektar}]$$

*Dimana:*
* $H$ = Jumlah strata wilayah pertanian
* $N_h$ = Total segmen dalam stratum $h$
* $n_h$ = Jumlah segmen sampel yang diamati dalam stratum $h$
* $A_{hi}$ = Luas segmen sampel ke-$i$ dalam stratum $h$ (standar segmen KSA $= 9\text{ hektar} = 300\text{ m} \times 300\text{ m}$)
* $p_{hi,\text{panen}}$ = Proporsi sub-segmen yang terverifikasi berada pada fase panen

#### 2. Estimasi Total Produksi Gabah Kering Giling (GKG):

$$\hat{Y}_{\text{produksi}} = \hat{L}_{\text{panen}} \times \bar{u}_{\text{ubinan}} \quad [\text{Juta Ton}]$$

*Dimana $\bar{u}_{\text{ubinan}}$ adalah rata-rata produktivitas hasil ubinan terstandar ($\text{ton/hektar}$).*

#### 3. Proyeksi Deret Waktu Pertumbuhan Produksi (2025–2026):
Proyeksi estimasi produksi tahun berjalan dan target swasembada dihitung menggunakan model laju pertumbuhan tahunan (*Year-on-Year Growth Rate*):

$$\hat{Y}_{t} = Y_{t-1} \cdot \Big(1 + g_t\Big) \cdot \Big(1 + \delta_{\text{iklim}}\Big) \cdot \Big(1 + \eta_{\text{intervensi}}\Big)$$

*Dimana:*
* $g_t$ = Laju pertumbuhan alami historis rata-rata ($\text{CAGR} \approx 1.15\% - 2.51\%$)
* $\delta_{\text{iklim}}$ = Koefisien koreksi anomali iklim global (fenomena El Niño $\delta < 0$, La Niña $\delta > 0$)
* $\eta_{\text{intervensi}}$ = Koefisien kenaikan produktivitas akibat program intensifikasi (pompanisasi sawah tadah hujan & benih unggul genjah)

---

## BAB III: DAFTAR PUSTAKA ACUAN ILMIAH

1. **Allen, R. G., Pereira, L. S., Raes, D., & Smith, M.** (1998). *Crop evapotranspiration-Guidelines for computing crop water requirements-FAO Irrigation and drainage paper 56*. Food and Agriculture Organization (FAO), Rome, 300(9), D05109.
2. **Badan Pusat Statistik (BPS) RI.** (2024). *Luas Panen dan Produksi Padi di Indonesia 2024 (Angka Tetap KSA)*. Berita Resmi Statistik No. 84/10/Th. XXVII. Jakarta: BPS RI.
3. **Badan Pangan Nasional (Bapanas).** (2024). *Neraca Pangan Nasional Triwulan IV Tahun 2024 dan Prospek Pasokan Pokok 2025*. Jakarta: Bapanas.
4. **Hengl, T., Mendes de Jesus, J., Heuvelink, G. B., et al.** (2017). *SoilGrids250m: Global gridded soil information based on machine learning*. PLoS ONE, 12(2), e0169748.
5. **Hersbach, H., Bell, B., Berrisford, P., et al.** (2020). *The ERA5 global reanalysis*. Quarterly Journal of the Royal Meteorological Society, 146(730), 1999-2049.
6. **Hughes, D. P., & Salathé, M.** (2015). *An open access repository of images on plant health to enable the development of mobile disease diagnostics*. arXiv preprint arXiv:1511.08060.
7. **International Rice Research Institute (IRRI).** (2020). *Standard Evaluation System for Rice (SES)*. 5th edition. Los Baños: IRRI.
8. **Murray, F. W.** (1967). *On the computation of saturation vapor pressure*. Journal of Applied Meteorology and Climatology, 6(1), 203-204.
9. **Tetens, O.** (1930). *Über einige meteorologische Begriffe*. Zeitschrift für Geophysik, 6, 297-309.
10. **World Meteorological Organization (WMO).** (2019). *Guide to Meteorological Instruments and Methods of Observation (WMO-No. 8)*. Geneva: WMO.
