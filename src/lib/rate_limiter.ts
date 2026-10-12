// In-Memory Sliding Window Rate Limiter untuk Kertanusa API
// Mencegah DoS, spamming database, dan penyalahgunaan kuota AI Vision

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Bersihkan memori setiap 5 menit dari IP yang sudah expired
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(request: Request): string {
  // 1. Prioritaskan header Cloudflare True Client IP (Anti-Spoofing di balik CDN Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp && cfIp.trim()) {
    return cfIp.trim();
  }

  // 2. Prioritaskan header Nginx X-Real-IP (Ditetapkan langsung dari remote_addr server Nginx terpercaya)
  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  // 3. Fallback X-Forwarded-For: Ambil IP paling kanan (yang di-append oleh proxy internal terpercaya)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  return '127.0.0.1';
}

export function checkRateLimit(
  ip: string,
  actionKey: string,
  maxRequests: number,
  windowSeconds: number
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = `${actionKey}:${ip}`;

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    // Record baru atau sudah expired
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: windowSeconds
    };
  }

  // Masih dalam window waktu
  if (existing.count >= maxRequests) {
    const resetIn = Math.ceil((existing.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: resetIn
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, maxRequests - existing.count);
  const resetIn = Math.ceil((existing.resetAt - now) / 1000);

  return {
    allowed: true,
    remaining,
    resetInSeconds: resetIn
  };
}
