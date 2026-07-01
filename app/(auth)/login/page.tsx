"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  LockPasswordIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

const DUMMY_USERNAME = "student";
const DUMMY_PASSWORD = "kontrilab123";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState(DUMMY_USERNAME);
  const [password, setPassword] = useState(DUMMY_PASSWORD);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (username.trim() === DUMMY_USERNAME && password === DUMMY_PASSWORD) {
      setError("");
      router.push("/student");
      return;
    }

    setError("Username atau password dummy belum sesuai.");
  }

  return (
    <main className="ktr-app-shell mx-auto min-h-screen w-full max-w-[430px] bg-ktr-surface-bg-app px-4 py-6 sm:rounded-[32px]">
      <div className="flex min-h-[calc(100vh-48px)] flex-col justify-between">
        <div className="pt-7">
          <Link href="/" className="text-sm font-semibold text-ktr-text-secondary hover:text-ktr-primary-dark">
            Kembali
          </Link>

          <div className="mt-9 space-y-3">
            <p className="text-sm font-semibold text-ktr-primary-dark">Student App</p>
            <h1 className="text-[32px] font-bold leading-ktr-tight text-ktr-text-primary">
              Masuk ke Kontrilab
            </h1>
            <p className="max-w-[330px] text-base leading-ktr-relaxed text-ktr-text-tertiary">
              Lanjutkan kontribusi proyek kelompokmu dengan akun student dummy.
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-ktr-border-light bg-white px-4 py-3 text-sm text-ktr-text-secondary">
            <p className="font-semibold text-ktr-text-primary">Akun dummy</p>
            <p className="mt-1">Username: <span className="font-semibold text-ktr-primary-dark">student</span></p>
            <p>Password: <span className="font-semibold text-ktr-primary-dark">kontrilab123</span></p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-ktr-text-primary">Username</span>
              <span className="flex h-12 items-center gap-3 rounded-2xl border border-ktr-border-input bg-white px-4 text-ktr-text-primary focus-within:border-ktr-border-focus focus-within:ring-3 focus-within:ring-ktr-primary/15">
                <HugeiconsIcon icon={UserIcon} size={20} strokeWidth={1.8} color="currentColor" className="text-ktr-text-tertiary" aria-hidden="true" />
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ktr-text-disabled"
                  placeholder="student"
                />
              </span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-ktr-text-primary">Password</span>
              <span className="flex h-12 items-center gap-3 rounded-2xl border border-ktr-border-input bg-white px-4 text-ktr-text-primary focus-within:border-ktr-border-focus focus-within:ring-3 focus-within:ring-ktr-primary/15">
                <HugeiconsIcon icon={LockPasswordIcon} size={20} strokeWidth={1.8} color="currentColor" className="text-ktr-text-tertiary" aria-hidden="true" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ktr-text-disabled"
                  placeholder="kontrilab123"
                />
              </span>
            </label>

            {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}

            <button className="flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-ktr-primary px-4 text-base font-medium text-white shadow-[0_12px_24px_rgba(87,193,133,0.25)] hover:bg-ktr-primary-hover">
              Masuk
              <HugeiconsIcon icon={ArrowRight02Icon} size={22} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
            </button>
          </form>
        </div>

        <p className="pb-3 text-center text-sm text-ktr-text-secondary">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-ktr-primary-dark hover:text-ktr-primary-hover">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  );
}
