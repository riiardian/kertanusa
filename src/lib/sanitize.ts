// Input Validation & Sanitization Helper untuk Kertanusa
// Mencegah Stored XSS, Injeksi Karakter Liar, dan Overflow Data

export function sanitizeText(input: any, maxLength = 255): string {
  if (typeof input !== 'string') return '';
  
  // 1. Trim whitespace
  let clean = input.trim();
  
  // 2. Strip tag HTML, script, iframe, onload dsb
  clean = clean.replace(/<[^>]*>?/gm, '');
  
  // 3. Escape karakter berbahaya tertentu
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // 4. Batasi panjang maksimal
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  
  return clean;
}

export function sanitizeNumeric(input: any, min = 0, max = 100000000): number | null {
  const num = Number(input);
  if (isNaN(num)) return null;
  if (num < min || num > max) return null;
  return num;
}

export function isValidCoordinate(lat?: number, lon?: number): boolean {
  if (lat === undefined || lon === undefined) return false;
  if (typeof lat !== 'number' || typeof lon !== 'number') return false;
  if (isNaN(lat) || isNaN(lon)) return false;
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}
