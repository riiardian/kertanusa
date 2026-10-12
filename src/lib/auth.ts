// Helper Otentikasi & Otorisasi Kertanusa Admin
// Melindungi operasi mutasi destruktif (DELETE/UPDATE) dari akses tanpa izin (Broken Access Control)

export function verifyAdminAuthorization(request: Request): boolean {
  const adminKey = process.env.KERTANUSA_ADMIN_KEY || 'kertanusa-admin-2026';

  // 1. Periksa header x-admin-key
  const headerKey = request.headers.get('x-admin-key');
  if (headerKey && headerKey.trim() === adminKey) {
    return true;
  }

  // 2. Periksa header Authorization: Bearer <key>
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken === adminKey) {
      return true;
    }
  }

  // 3. Periksa query parameter ?admin_key=
  try {
    const url = new URL(request.url);
    const queryKey = url.searchParams.get('admin_key');
    if (queryKey && queryKey.trim() === adminKey) {
      return true;
    }
  } catch {
    // Abaikan kegagalan parsing URL
  }

  return false;
}
