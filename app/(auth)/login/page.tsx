import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-slate-400">Silakan login untuk melanjutkan.</p>
        <div className="mt-6 space-y-3">
          <button className="w-full rounded-lg bg-white px-4 py-2 font-medium text-slate-900">
            Masuk
          </button>
          <p className="text-center text-sm text-slate-400">
            Belum punya akun?{' '}
            <Link href="/register" className="text-sky-400 hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
