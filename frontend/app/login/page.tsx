"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail } from "lucide-react"
import Navbar from "@/components/Navbar"
import { useDarkMode } from "@/components/useDarkMode"
import { setToken } from "@/lib/auth/token"
// using legacy localStorage-based auth (no NextAuth)

export default function LoginPage() {
    const router = useRouter()
    const { darkMode, toggleDarkMode, isMounted } = useDarkMode(true)
    const resolvedDarkMode = isMounted ? darkMode : false

    const lightTextColor = "#1e0a3c"
    const lightSecondaryColor = "#4a2a6e"
    const lightAccent = "#8b5cf6"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage("")

        if (!email || !password) {
            setMessage("Email dan password wajib diisi.")
            return
        }

        try {
            setLoading(true)

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                const txt = await res.text()
                setMessage('Email atau password salah.')
                return
            }

            const data = await res.json()
            // store tokens like legacy flow
            setToken(data.access_token)
            if (typeof window !== 'undefined') {
                if (data.refresh_token) localStorage.setItem('refreshToken', data.refresh_token)
                localStorage.setItem('accountId', String(data.account_id))
                localStorage.setItem('role', data.role)
                localStorage.setItem('expiresAt', String(Date.now() + 15 * 60 * 1000))
            }
            router.push('/')
        } catch (error) {
            console.error(error)

            const errorText =
                error instanceof Error ? error.message : "Tidak bisa terhubung ke server."

            if (
                errorText.includes("Invalid email or password") ||
                errorText.includes("detail")
            ) {
                setMessage("Email atau password salah.")
            } else {
                setMessage(errorText)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main
            className="relative min-h-screen overflow-hidden"
            style={{ color: resolvedDarkMode ? "#ffffff" : lightTextColor }}
        >
            {resolvedDarkMode ? (
                <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#14011f] via-[#25053f] to-[#07010d]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#9333ea40_0%,#581c8750_35%,transparent_75%)]" />
                    <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[140px]" />
                </>
            ) : (
                <>
                    <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(140deg, #fff1f2, #fdf2ff, #eef2ff)" }}
                    />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#c4b5fd2a_0%,#e9d5ff2a_35%,transparent_75%)]" />
          <div
            className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
            style={{ background: "rgba(196,181,253,0.28)" }}
          />
                </>
            )}

            <div className="relative z-10">
                <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} isMounted={isMounted} />
            </div>

            <section className="relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12">
                <div
                    className="grid w-full max-w-5xl overflow-hidden rounded-[34px] border backdrop-blur-xl md:grid-cols-2 md:h-[680px] md:min-h-[680px]"
          style={{
            background: resolvedDarkMode ? "rgba(9,1,17,0.75)" : "rgba(255,255,255,0.85)",
            borderColor: resolvedDarkMode ? "rgba(255,255,255,0.1)" : "#ede9fe",
          }}
        >
          <div
            className="flex h-full items-center justify-center p-8 sm:p-10"
            style={{ boxShadow: resolvedDarkMode ? "-14px 0 40px rgba(0,0,0,0.45)" : "none" }}
          >
                        <div className="w-full max-w-md max-h-full overflow-y-auto pr-1">
                            <div className="mb-6 text-center">
                                <h1
                                    className="text-xl font-black tracking-tight"
                                    style={{ color: resolvedDarkMode ? "#ffffff" : lightTextColor }}
                                >
                                    Login
                                </h1>
                                <p
                                    className="mt-2 text-sm"
                                    style={{ color: resolvedDarkMode ? "rgba(209,213,219,0.8)" : lightSecondaryColor }}
                                >
                                    Masuk untuk mengakses halaman event.
                                </p>
                            </div>

                            <div
                                className="mb-5 h-px w-full"
                                style={{
                                    background: resolvedDarkMode
                                        ? "linear-gradient(90deg, transparent, rgba(192,132,252,0.45), transparent)"
                                        : "linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent)",
                                }}
                            />

                            <form onSubmit={handleLogin} autoComplete="off" className="space-y-3">
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
                                    autoComplete="current-password"
                                    className="hidden"
                                    tabIndex={-1}
                                />

                                <div>
                                    <label
                                        className="mb-2 block text-xs font-semibold"
                                        style={{ color: resolvedDarkMode ? "rgba(255,255,255,0.9)" : "#4c1d95" }}
                                    >
                                        Email
                                    </label>

                                    <div
                                        className="flex items-center gap-3 rounded-2xl border px-4 py-1.5 transition focus-within:border-fuchsia-400"
                                        style={{
                                            background: resolvedDarkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
                                            borderColor: resolvedDarkMode ? "rgba(255,255,255,0.1)" : "#e9d5ff",
                                        }}
                                    >
                                        <Mail size={18} className={resolvedDarkMode ? "text-purple-200/80" : "text-purple-700/70"} />

                                        <input
                                            type="text"
                                            name="login-email"
                                            autoComplete="new-password"
                                            required
                                            placeholder="Masukkan email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="login-input w-full border-none bg-transparent text-sm outline-none"
                                            style={{ color: resolvedDarkMode ? "#ffffff" : lightTextColor }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="mb-2 block text-xs font-semibold"
                                        style={{ color: resolvedDarkMode ? "rgba(255,255,255,0.9)" : "#4c1d95" }}
                                    >
                                        Password
                                    </label>

                                    <div
                                        className="flex items-center gap-3 rounded-2xl border px-4 py-1.5 transition focus-within:border-fuchsia-400"
                                        style={{
                                            background: resolvedDarkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
                                            borderColor: resolvedDarkMode ? "rgba(255,255,255,0.1)" : "#e9d5ff",
                                        }}
                                    >
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="login-password"
                                            autoComplete="new-password"
                                            required
                                            placeholder="Masukkan password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="login-input w-full border-none bg-transparent text-sm outline-none"
                                            style={{ color: resolvedDarkMode ? "#ffffff" : lightTextColor }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="transition"
                                            style={{ color: resolvedDarkMode ? "rgba(226,232,240,0.7)" : "#6d28d9" }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                                    className="w-full rounded-2xl py-1.5 text-sm font-bold text-white transition hover:scale-[1.015] disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{
                                        background: resolvedDarkMode
                                            ? "linear-gradient(90deg, #6d28d9, #4338ca)"
                                            : "linear-gradient(90deg, #8b5cf6, #6366f1)",
                                        boxShadow: resolvedDarkMode
                                            ? "0 4px 12px rgba(168,85,247,0.28)"
                                            : "0 4px 14px rgba(99,102,241,0.35)",
                                    }}
                                >
                                    {loading ? "Memproses..." : "Login"}
                                </button>

                <p
                  className="pt-2 text-center text-sm"
                  style={{ color: resolvedDarkMode ? "rgba(255,255,255,0.65)" : "#4a2a6e" }}
                >
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="font-bold transition"
                    style={{ color: resolvedDarkMode ? "#e879f9" : "#6d28d9" }}
                  >
                    Sign Up
                  </button>
                </p>
                            </form>
                        </div>
                    </div>

                    <div className="relative hidden min-h-[650px] items-center justify-center overflow-hidden md:flex md:min-h-full"
                        style={{ background: resolvedDarkMode ? "#12011d" : "#f3e8ff" }}
                    >
                        <img
                            src="/login2.jpg"
                            alt="Login Illustration"
                            className="h-full w-full object-cover"
                        />

                        <div
                            className="absolute inset-0"
                            style={{
                                background: resolvedDarkMode
                                    ? "linear-gradient(to left, transparent, transparent, rgba(9,1,17,0.2))"
                                    : "linear-gradient(to left, transparent, transparent, rgba(255,255,255,0.35))",
                            }}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}
