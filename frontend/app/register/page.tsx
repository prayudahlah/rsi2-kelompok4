"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, User, Phone } from "lucide-react"
import { register } from "@/lib/api/auth"
import { setToken } from "@/lib/auth/token"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")

    if (!email || !username || !password || !confirmPassword || !firstName || !lastName || !whatsapp) {
      setMessage("Semua field wajib diisi.")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi password tidak sama.")
      return
    }

    if (password.length < 6) {
      setMessage("Password minimal 6 karakter.")
      return
    }

    try {
      setLoading(true)

      const data = await register({
        email,
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        whatsapp,
        role_name: "user",
      })

      const token = data.access_token || data.token

      if (!token) {
        setMessage("Token tidak ditemukan dari backend.")
        return
      }

      setToken(token)
      router.push("/events")
    } catch (error) {
      console.error(error)

      const errorText =
        error instanceof Error ? error.message : "Tidak bisa terhubung ke server."

      if (errorText.includes("Email already registered")) {
        setMessage("Email sudah terdaftar.")
      } else if (errorText.includes("detail")) {
        setMessage("Registrasi gagal. Periksa kembali data Anda.")
      } else {
        setMessage(errorText)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#14011f] via-[#25053f] to-[#07010d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#9333ea40_0%,#581c8750_35%,transparent_75%)]" />
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[140px]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[34px] border border-white/10 bg-[#090111]/75 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-xl md:grid-cols-2">
          <div className="flex items-center justify-center p-10 sm:p-14">
            <div className="w-full max-w-md">
              <div className="mb-10 text-center">
                <h1 className="text-5xl font-black tracking-tight">Sign Up</h1>
                <p className="mt-3 text-sm text-purple-100/60">
                  Daftar untuk mengakses sistem event kampus.
                </p>
              </div>

              <form onSubmit={handleRegister} autoComplete="off" className="space-y-4">
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  className="hidden"
                  tabIndex={-1}
                />

                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  className="hidden"
                  tabIndex={-1}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">
                    Email
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 transition hover:bg-white/[0.08] focus-within:border-fuchsia-400">
                    <Mail size={18} className="text-purple-200/80" />

                    <input
                      type="email"
                      name="register-email"
                      autoComplete="new-password"
                      required
                      placeholder="Masukkan email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-input w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">
                    Username
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 transition hover:bg-white/[0.08] focus-within:border-fuchsia-400">
                    <User size={18} className="text-purple-200/80" />

                    <input
                      type="text"
                      name="register-username"
                      autoComplete="new-password"
                      required
                      placeholder="Masukkan username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="login-input w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white/90">
                      First Name
                    </label>

                    <input
                      type="text"
                      name="register-firstname"
                      autoComplete="new-password"
                      required
                      placeholder="Nama depan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="login-input w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/35 transition hover:bg-white/[0.08] focus-within:border-fuchsia-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white/90">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="register-lastname"
                      autoComplete="new-password"
                      required
                      placeholder="Nama belakang"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="login-input w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/35 transition hover:bg-white/[0.08] focus-within:border-fuchsia-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">
                    WhatsApp
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 transition hover:bg-white/[0.08] focus-within:border-fuchsia-400">
                    <Phone size={18} className="text-purple-200/80" />

                    <input
                      type="tel"
                      name="register-whatsapp"
                      autoComplete="new-password"
                      required
                      placeholder="Nomor WhatsApp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="login-input w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">
                    Password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 transition hover:bg-white/[0.08] focus-within:border-fuchsia-400">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="register-password"
                      autoComplete="new-password"
                      required
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-purple-200/70 transition hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">
                    Konfirmasi Password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 transition hover:bg-white/[0.08] focus-within:border-fuchsia-400">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="register-confirm-password"
                      autoComplete="new-password"
                      required
                      placeholder="Konfirmasi password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="login-input w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-purple-200/70 transition hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {message && (
                  <p className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-violet-500 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(168,85,247,0.45)] transition hover:scale-[1.015] hover:shadow-[0_20px_50px_rgba(192,38,211,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Memproses..." : "Daftar"}
                </button>

                <p className="pt-2 text-center text-sm text-white/65">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="font-bold text-fuchsia-300 transition hover:text-white"
                  >
                    Login
                  </button>
                </p>
              </form>
            </div>
          </div>

          <div className="relative hidden min-h-[650px] items-center justify-center overflow-hidden bg-[#12011d] md:flex">
            <img
              src="/login2.jpg"
              alt="Register Illustration"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#090111]/20" />
          </div>
        </div>
      </section>
    </main>
  )
}
