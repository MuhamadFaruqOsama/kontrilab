export function getFriendlyAuthError(message?: string) {
  const normalized = (message || "").toLowerCase();

  if (normalized.includes("invalid login credentials") || normalized.includes("invalid credentials")) {
    return "Email atau kata sandi belum sesuai. Coba periksa lagi.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Email belum diverifikasi. Cek kotak masukmu dulu, ya.";
  }

  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi.";
  }

  if (normalized.includes("network") || normalized.includes("fetch")) {
    return "Koneksi sedang bermasalah. Coba lagi sebentar lagi.";
  }

  if (normalized.includes("user already registered") || normalized.includes("already registered")) {
    return "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.";
  }

  if (normalized.includes("password")) {
    return "Kata sandi belum memenuhi ketentuan. Gunakan minimal 6 karakter.";
  }

  return message || "Permintaan belum berhasil diproses. Coba lagi sebentar lagi.";
}
