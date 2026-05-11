'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/components/useDarkMode';


// Hook counter animasi
function useCountUp(target: number, duration = 1200, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

// Komponen Utama
export default function Home() {
  const { darkMode, toggleDarkMode, isMounted } = useDarkMode(true);
  const resolvedDarkMode = isMounted ? darkMode : false;

  const countMembers = useCountUp(4, 1000, true);
  const countGroup = useCountUp(1, 800, true);

  // Warna teks light mode (kontras tinggi)
  const lightTextColor = '#1e0a3c';      // ungu sangat gelap untuk judul
  const lightSecondaryColor = '#4a2a6e'; // ungu gelap untuk deskripsi
  const lightPurpleAccent = '#8b5cf6';   // ungu terang untuk aksen (purple-500)

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ color: resolvedDarkMode ? undefined : lightTextColor }}
    >
      {/* BACKGROUND */}
      {resolvedDarkMode ? (
        <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#120426] via-[#1d0a3a] to-[#06000b]" />
      ) : (
        <div
          className="fixed inset-0 -z-20"
          style={{
            background: 'linear-gradient(135deg, #ffffff, #f3f0ff, #e9d5ff)',          }}
        />
      )}

      {/* CENTER GLOW */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] blur-[200px]"
          style={{
            background: resolvedDarkMode ? '#b46bff' : '#c4b5fd',
            opacity: resolvedDarkMode ? 0.16 : 0.15,
          }}
        />
      </div>

      {/* NEBULA */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-300 opacity-[0.08] blur-[180px] top-[-100px] left-[-120px]" />
        <div className="absolute w-[500px] h-[500px] bg-purple-200 opacity-[0.08] blur-[160px] bottom-[-100px] right-[-120px]" />
      </div>

      {/* NAVBAR */}
      <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} isMounted={isMounted} />

      {/* MAIN */}
      <main className="flex items-center justify-center min-h-[80vh] px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ color: resolvedDarkMode ? '#ffffff' : lightTextColor }}
          >
            Welcome to Our Team <br />
            <span style={{ color: resolvedDarkMode ? '#c084fc' : lightPurpleAccent }}>Website</span>
          </h1>
          <p className="mt-4" style={{ color: resolvedDarkMode ? '#d1d5db' : lightSecondaryColor }}>
            Klik tombol untuk melihat anggota kelompok
          </p>
          <div className="mt-8 flex justify-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: resolvedDarkMode ? '#c084fc' : '#6d28d9' }}>
                {countMembers}
              </div>
              <div className="text-xs mt-0.5" style={{ color: resolvedDarkMode ? '#9ca3af' : lightSecondaryColor }}>
                People
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: resolvedDarkMode ? '#c084fc' : '#6d28d9' }}>
                {countGroup}
              </div>
              <div className="text-xs mt-0.5" style={{ color: resolvedDarkMode ? '#9ca3af' : '#6b21a8' }}>
                Vision
              </div>
            </div>
          </div>
          <Link
            href="/about"
            className={`mt-8 inline-flex px-8 py-3 rounded-full transition shadow-lg hover:scale-110 ${
              resolvedDarkMode
                ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-500/40'
                : 'bg-white/85 text-[#4a2a6e] border border-purple-200 hover:bg-white hover:shadow-purple-300/40'
            }`}
          >
            Kelompok 4 →
          </Link>
        </motion.div>
      </main>

      <footer
        className="text-center py-6 border-t relative z-10"
        style={{
          color: resolvedDarkMode ? '#9ca3af' : '#5b21b6',
          borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.1)' : '#c4b5fd',
        }}
      >
          RSI Praktikum - Kelompok4
      </footer>

    </div>
  );
}
