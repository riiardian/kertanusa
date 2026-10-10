// Vector SVG illustrations of crop samples for Computer Vision AI Demonstration
// Designed with natural botanical details and clear visual symptoms

export const SAMPLE_CROP_SVGS: Record<string, string> = {
  // 1. Cabai Terserang Antraknosa (Patek Buah)
  'antraknosa': `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="bgG" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </radialGradient>
        <linearGradient id="chiliG" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="50%" stop-color="#dc2626"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
        <linearGradient id="stemG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="100%" stop-color="#15803d"/>
        </linearGradient>
        <radialGradient id="lesionG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ea580c"/>
          <stop offset="30%" stop-color="#451a03"/>
          <stop offset="70%" stop-color="#1c1917"/>
          <stop offset="100%" stop-color="#78350f"/>
        </radialGradient>
      </defs>
      
      <!-- Latar Alami Meja Pemeriksaan Laboratorium -->
      <rect width="600" height="450" fill="url(#bgG)"/>
      <ellipse cx="300" cy="380" rx="220" ry="24" fill="#cbd5e1" opacity="0.6"/>

      <!-- Daun Latar Belakang -->
      <path d="M120,200 Q200,120 340,160 Q260,260 120,200 Z" fill="#166534" opacity="0.85"/>
      <path d="M140,195 Q230,150 330,165" stroke="#4ade80" stroke-width="2" fill="none" opacity="0.6"/>

      <!-- Tangkai Buah Cabai -->
      <path d="M180,110 Q210,140 250,170 Q240,180 230,180 Q195,145 170,120 Z" fill="url(#stemG)"/>
      <path d="M220,160 C240,150 270,160 280,185 C260,195 240,185 220,160 Z" fill="#166534"/>

      <!-- Buah Cabai Merah -->
      <path d="M245,175 C310,190 380,240 370,330 C360,370 310,400 290,400 C270,400 285,340 280,280 C275,230 235,190 245,175 Z" fill="url(#chiliG)" filter="drop-shadow(0 15px 15px rgba(0,0,0,0.15))"/>
      
      <!-- Kilauan Cahaya Permukaan Kulit Cabai -->
      <path d="M260,195 C285,215 320,250 325,290 C328,320 310,350 298,365" stroke="#fca5a5" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.45"/>

      <!-- GEJALA ANTRAKNOSA: Lesi Cekung Melingkar Kehitaman (Bercak Patek) -->
      <g transform="translate(315, 275) rotate(12)">
        <!-- Lingkaran konsentris terluar -->
        <ellipse cx="0" cy="0" rx="36" ry="28" fill="#78350f" opacity="0.85"/>
        <!-- Lingkaran tengah nekrotik gelap -->
        <ellipse cx="0" cy="0" rx="28" ry="20" fill="url(#lesionG)"/>
        <!-- Pusat spora jingga/merah muda khas Colletotrichum -->
        <ellipse cx="-2" cy="-1" rx="14" ry="10" fill="#f97316" opacity="0.9"/>
        <circle cx="2" cy="1" r="5" fill="#fdba74"/>
        <circle cx="-5" cy="-2" r="3" fill="#fdba74"/>
        <circle cx="0" cy="3" r="3" fill="#fed7aa"/>
      </g>

      <!-- Lesi Sekunder Lebih Kecil di Ujung Buah -->
      <g transform="translate(300, 360)">
        <ellipse cx="0" cy="0" rx="18" ry="12" fill="#451a03" opacity="0.9"/>
        <ellipse cx="0" cy="0" rx="10" ry="7" fill="#ea580c" opacity="0.85"/>
        <circle cx="0" cy="0" r="3" fill="#fed7aa"/>
      </g>
    </svg>
  `)}`,

  // 2. Cabai Terserang Kutu Kebul & Virus Kuning (Gemini)
  'kutu-kebul': `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="bgG2" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </radialGradient>
        <linearGradient id="leafG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#84cc16"/>
          <stop offset="50%" stop-color="#65a30d"/>
          <stop offset="100%" stop-color="#3f6212"/>
        </linearGradient>
      </defs>

      <rect width="600" height="450" fill="url(#bgG2)"/>
      <ellipse cx="300" cy="390" rx="210" ry="20" fill="#cbd5e1" opacity="0.5"/>

      <!-- Batang Cabang Tanaman Cabai -->
      <path d="M120,400 Q220,320 280,240 Q340,160 410,100" stroke="#4d7c0f" stroke-width="12" stroke-linecap="round" fill="none"/>
      
      <!-- Daun Sehat Bawah -->
      <path d="M180,330 Q260,370 340,320 Q280,280 180,330 Z" fill="#15803d" opacity="0.7"/>

      <!-- Daun Utama Keriting & Menguning (Gejala Cupping & Klorosis Belang) -->
      <g transform="translate(180, 110)">
        <!-- Bentuk daun berkerut melengkung ke atas -->
        <path d="M20,130 C40,40 140,10 230,40 C280,70 310,150 250,190 C180,220 80,210 20,130 Z" 
              fill="url(#leafG)" filter="drop-shadow(0 12px 14px rgba(0,0,0,0.14))"/>

        <!-- Belang-belang Klorosis Virus Kuning (Mosaic Yellow Patches) -->
        <path d="M60,90 C80,60 120,50 140,80 C130,110 90,120 60,90 Z" fill="#eab308" opacity="0.8"/>
        <path d="M150,60 C180,45 220,65 210,100 C180,110 150,90 150,60 Z" fill="#facc15" opacity="0.85"/>
        <path d="M170,120 C200,110 240,135 225,165 C190,175 165,150 170,120 Z" fill="#fef08a" opacity="0.75"/>
        <path d="M90,140 C120,130 150,155 140,180 C100,190 80,165 90,140 Z" fill="#eab308" opacity="0.75"/>

        <!-- Tulang Daun Utama & Cabang Berkerut -->
        <path d="M30,125 Q130,105 240,120" stroke="#ca8a04" stroke-width="3.5" fill="none"/>
        <path d="M90,115 Q115,80 150,65" stroke="#a16207" stroke-width="2" fill="none"/>
        <path d="M140,112 Q175,85 215,80" stroke="#a16207" stroke-width="2" fill="none"/>
        <path d="M110,120 Q130,150 160,165" stroke="#a16207" stroke-width="2" fill="none"/>

        <!-- Koloni Kutu Kebul (Serangga Putih Bersayap Tepung Kecil) -->
        <g fill="#ffffff" stroke="#94a3b8" stroke-width="0.5">
          <ellipse cx="120" cy="95" rx="3.5" ry="2"/>
          <ellipse cx="125" cy="98" rx="3" ry="1.8"/>
          <ellipse cx="118" cy="102" rx="3.2" ry="2"/>
          <ellipse cx="170" cy="135" rx="3.5" ry="2"/>
          <ellipse cx="175" cy="138" rx="3" ry="1.8"/>
          <ellipse cx="165" cy="142" rx="3" ry="2"/>
          <ellipse cx="180" cy="75" rx="3.2" ry="2"/>
          <ellipse cx="185" cy="78" rx="2.8" ry="1.6"/>
          <ellipse cx="140" cy="155" rx="3" ry="2"/>
        </g>
      </g>
    </svg>
  `)}`,

  // 3. Bawang Merah Terserang Ulat Grayak (Spodoptera)
  'ulat-grayak': `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="bgG3" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </radialGradient>
        <linearGradient id="onionLeaf" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#15803d"/>
          <stop offset="40%" stop-color="#22c55e"/>
          <stop offset="80%" stop-color="#166534"/>
          <stop offset="100%" stop-color="#14532d"/>
        </linearGradient>
      </defs>

      <rect width="600" height="450" fill="url(#bgG3)"/>
      <ellipse cx="300" cy="410" rx="230" ry="20" fill="#cbd5e1" opacity="0.6"/>

      <!-- Umbi Bawang Merah di Pangkal Bawah -->
      <g transform="translate(240, 310)">
        <ellipse cx="60" cy="50" rx="45" ry="40" fill="#9f1239"/>
        <path d="M30,40 Q60,-10 90,40 Z" fill="#be123c"/>
        <path d="M45,30 Q60,10 75,30" stroke="#f43f5e" stroke-width="2" fill="none" opacity="0.6"/>
      </g>

      <!-- Helai Daun Silindris Bawang Merah Tegak -->
      <!-- Daun 1 Kiri -->
      <path d="M260,330 C230,220 200,140 180,80 C195,85 230,170 275,330 Z" fill="url(#onionLeaf)"/>

      <!-- Daun 2 Tengah (Terserang Parah dengan Lubang Transparan Jendela) -->
      <g>
        <path d="M285,320 C290,200 300,100 310,50 C325,55 320,180 305,320 Z" fill="url(#onionLeaf)" filter="drop-shadow(0 10px 10px rgba(0,0,0,0.12))"/>
        
        <!-- Lubang Gerekan Memanjang Transparan (Window Feeding Hole) -->
        <path d="M296,140 C293,165 292,190 295,215 C308,210 310,185 307,145 Z" fill="#fef08a" opacity="0.95" stroke="#ca8a04" stroke-width="1.5"/>
        <path d="M298,150 C296,170 295,190 297,205" stroke="#854d0e" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/>
        
        <!-- Kotoran Ulat (Frass Hitam) di Rongga Daun -->
        <circle cx="300" cy="180" r="2.5" fill="#1c1917"/>
        <circle cx="302" cy="188" r="2" fill="#1c1917"/>
        <circle cx="298" cy="195" r="2.2" fill="#1c1917"/>

        <!-- Tubuh Larva Ulat Grayak (Spodoptera) Aktif Menggerek -->
        <g transform="translate(302, 160) rotate(15)">
          <path d="M-4,0 Q0,-12 4,0 Q0,15 -4,0 Z" fill="#3f6212"/>
          <circle cx="0" cy="-10" r="3" fill="#1c1917"/>
          <line x1="-3" y1="-5" x2="3" y2="-5" stroke="#facc15" stroke-width="1"/>
          <line x1="-4" y1="0" x2="4" y2="0" stroke="#facc15" stroke-width="1"/>
          <line x1="-3" y1="6" x2="3" y2="6" stroke="#facc15" stroke-width="1"/>
        </g>
      </g>

      <!-- Daun 3 Kanan -->
      <path d="M315,330 C340,210 380,120 410,70 C418,80 375,190 335,330 Z" fill="url(#onionLeaf)"/>
      <!-- Gerekan Kecil di Daun Kanan -->
      <ellipse cx="365" cy="160" rx="4" ry="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
    </svg>
  `)}`,

  // 4. Padi Terserang Hawar Daun Bakteri (Kresek / Xanthomonas)
  'hawar-daun': `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="bgG4" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </radialGradient>
        <linearGradient id="paddyGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#15803d"/>
          <stop offset="50%" stop-color="#22c55e"/>
          <stop offset="100%" stop-color="#166534"/>
        </linearGradient>
      </defs>

      <rect width="600" height="450" fill="url(#bgG4)"/>
      <ellipse cx="300" cy="410" rx="220" ry="18" fill="#cbd5e1" opacity="0.6"/>

      <!-- Rumpun Daun Padi Sawah Latar Belakang -->
      <path d="M180,410 C160,280 120,180 80,100 C110,120 180,260 210,410 Z" fill="#15803d" opacity="0.5"/>
      <path d="M380,410 C420,270 470,160 520,80 C480,130 410,270 370,410 Z" fill="#15803d" opacity="0.5"/>

      <!-- Helaian Daun Padi Utama (Fokus Analisis Mikroskopik) -->
      <g transform="translate(140, 30)">
        <!-- Batas helai daun memanjang diagonal -->
        <path d="M120,380 C140,240 180,110 240,20 C250,20 220,140 190,380 Z" 
              fill="url(#paddyGreen)" filter="drop-shadow(0 15px 15px rgba(0,0,0,0.12))"/>

        <!-- Tulang Daun Tengah -->
        <path d="M155,380 C175,240 205,120 245,20" stroke="#86efac" stroke-width="2.5" fill="none" opacity="0.8"/>

        <!-- GEJALA KRESEK: Garis Gelombang Kuning Kecokelatan di Tepi Helai (Hawar Bakteri) -->
        <!-- Lesi Tepi Kanan Daun -->
        <path d="M190,380 C205,300 200,240 215,180 C210,130 230,80 240,20 C238,40 220,90 205,140 C195,200 185,280 175,380 Z" 
              fill="#eab308" opacity="0.95"/>
        <path d="M192,360 C208,290 205,230 220,170 C216,120 234,70 241,20" 
              stroke="#ca8a04" stroke-width="1.8" fill="none"/>

        <!-- Area Nekrosis Mengering Terbakar (Ujung Daun Kresek Abu-abu Kecokelatan) -->
        <path d="M225,120 C218,80 235,50 240,20 C235,40 218,80 210,130 Z" 
              fill="#b45309" opacity="0.9"/>
        <path d="M230,80 C228,60 238,40 240,20" stroke="#78350f" stroke-width="2" fill="none"/>

        <!-- Eksudat Tetesan Bakteri Pagi Hari -->
        <circle cx="212" cy="185" r="3" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8"/>
        <circle cx="218" cy="155" r="2.5" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8"/>
      </g>
    </svg>
  `)}`,

  // 5. Jagung Terserang Bulai Klorotik (Peronosclerospora maydis)
  'bulai-jagung': `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="bgG5" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </radialGradient>
        <linearGradient id="cornLeafGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#15803d"/>
          <stop offset="50%" stop-color="#16a34a"/>
          <stop offset="100%" stop-color="#166534"/>
        </linearGradient>
      </defs>

      <rect width="600" height="450" fill="url(#bgG5)"/>
      <ellipse cx="300" cy="410" rx="220" ry="20" fill="#cbd5e1" opacity="0.6"/>

      <!-- Batang Jagung Kokoh di Tengah Bawah -->
      <path d="M270,420 L270,300 C270,270 290,260 300,260 C310,260 330,270 330,300 L330,420 Z" fill="#15803d"/>

      <!-- Daun Jagung Lebar Melengkung (Helai Daun Terserang Bulai) -->
      <g transform="translate(100, 50)">
        <!-- Bentuk daun lebar melengkung dramatis -->
        <path d="M200,320 C180,200 130,100 40,40 C100,50 260,120 310,320 Z" 
              fill="url(#cornLeafGreen)" filter="drop-shadow(0 15px 15px rgba(0,0,0,0.15))"/>

        <!-- Tulang Daun Utama Putih Sejajar -->
        <path d="M255,320 C215,200 160,110 40,40" stroke="#f8fafc" stroke-width="4" fill="none" opacity="0.9"/>

        <!-- GEJALA BULAI: Garis-Garis Klorotik Putih Sejajar Tulang Daun (Bleached White Stripes) -->
        <path d="M245,315 C205,195 150,110 50,45" stroke="#fef08a" stroke-width="3" fill="none" opacity="0.85"/>
        <path d="M235,310 C195,190 142,112 60,52" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.9"/>
        <path d="M225,305 C185,188 135,115 72,60" stroke="#fef08a" stroke-width="2.2" fill="none" opacity="0.85"/>
        <path d="M215,300 C178,185 128,118 85,70" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.8"/>
        
        <!-- Sisi kanan tulang daun -->
        <path d="M265,318 C225,200 170,115 55,42" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.9"/>
        <path d="M275,315 C235,202 182,120 70,50" stroke="#fef08a" stroke-width="2.5" fill="none" opacity="0.85"/>
        <path d="M285,312 C245,205 195,125 90,62" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.8"/>

        <!-- Lapisan Spora Jamur Bedak Tepung Putih -->
        <ellipse cx="140" cy="120" rx="25" ry="12" fill="#ffffff" opacity="0.35"/>
        <ellipse cx="190" cy="180" rx="30" ry="15" fill="#ffffff" opacity="0.3"/>
      </g>
    </svg>
  `)}`,

  // 6. Cabai Prima Siap Panen (Optimal Grade A)
  'siap-panen-grade-a': `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <radialGradient id="bgG6" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </radialGradient>
        <linearGradient id="chiliGradeA" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stop-color="#f87171"/>
          <stop offset="25%" stop-color="#ef4444"/>
          <stop offset="70%" stop-color="#dc2626"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
        <linearGradient id="freshStem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#86efac"/>
          <stop offset="100%" stop-color="#15803d"/>
        </linearGradient>
      </defs>

      <rect width="600" height="450" fill="url(#bgG6)"/>
      <ellipse cx="300" cy="390" rx="220" ry="22" fill="#cbd5e1" opacity="0.6"/>

      <!-- Daun Segar Pendamping -->
      <path d="M110,210 Q210,120 330,170 Q240,270 110,210 Z" fill="#15803d" opacity="0.85"/>
      <path d="M130,205 Q220,155 310,175" stroke="#4ade80" stroke-width="2.5" fill="none" opacity="0.7"/>

      <!-- Tangkai Segar Hijau Cerah -->
      <path d="M190,110 Q225,145 260,175 Q250,185 240,185 Q205,150 180,120 Z" fill="url(#freshStem)"/>
      <!-- Kelopak Bunga/Tangkai Daun (Calyx) -->
      <path d="M230,165 C250,155 285,165 290,190 C270,200 245,190 230,165 Z" fill="#15803d"/>

      <!-- Buah Cabai Merah Matang Sempurna, Berkilau Padat & Mulus -->
      <path d="M255,180 C320,195 390,245 380,335 C370,375 320,405 300,405 C280,405 295,345 290,285 C285,235 245,195 255,180 Z" 
            fill="url(#chiliGradeA)" filter="drop-shadow(0 18px 20px rgba(0,0,0,0.18))"/>

      <!-- Kilau Pantulan Cahaya Kulit Buah Sehat (Specular High Gloss) -->
      <path d="M275,200 C300,220 335,255 340,295 C343,325 325,355 312,370" 
            stroke="#ffffff" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.65"/>
      <path d="M280,205 C305,225 330,250 335,285" 
            stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.85"/>

      <!-- Ujung Buah Meruncing Padat -->
      <circle cx="300" cy="402" r="4" fill="#991b1b"/>
    </svg>
  `)}`
};
