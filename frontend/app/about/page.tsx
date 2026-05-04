'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@//components/Navbar';
import { useDarkMode } from '@/components/useDarkMode';

const anggotaKelompok = [
  { nama: 'Aulia Rahma Bidayah', nim: 'L0224003', foto: '/auliaa.jpg' },
  { nama: 'Prayuda Afifan Handoyo', nim: 'L0224008', foto: '/yuda.jpeg' },
  { nama: 'Dien Akmalin Rizqi Akbar', nim: 'L0224028', foto: '/dien.png' },
  { nama: 'Gloria Dana Praisylia', nim: 'L0224043', foto: '/gloria.jpeg' },
];

function MemberModal({
  member,
  onClose,
  darkMode,
}: {
  member: (typeof anggotaKelompok)[0];
  onClose: () => void;
  darkMode: boolean;
}) {
  const lightTextColor = '#2d1b4e';
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.82, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="relative z-10 rounded-2xl overflow-hidden max-w-sm w-full"
        style={{
          background: darkMode
            ? 'linear-gradient(145deg,#120826,#0d0420)'
            : 'linear-gradient(145deg,#ffffff,#f0eaff)',
          border: '1px solid rgba(167,139,250,0.4)',
          boxShadow: '0 30px 80px rgba(120,60,200,0.45)',
        }}
      >
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#7c3aed,#06b6d4,#ec4899)' }} />
        <div className="p-7 flex flex-col items-center gap-4">
          <motion.img
            src={member.foto}
            alt={member.nama}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 300 }}
            className="w-32 h-32 rounded-full border-4 border-purple-400 object-cover shadow-lg shadow-purple-500/30"
          />
          <div className="text-center">
            <h2 className="text-lg font-bold" style={{ color: darkMode ? '#f0eaff' : lightTextColor }}>
              {member.nama}
            </h2>
            <p className="text-xs font-mono text-purple-400 tracking-widest mt-0.5">{member.nim}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: 'linear-gradient(90deg,#7c3aed,#0891b2)' }}
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AboutPage() {
  const { darkMode, toggleDarkMode } = useDarkMode(true);
  const [selected, setSelected] = useState<(typeof anggotaKelompok)[0] | null>(null);

  const lightTextColor = '#1e0a3c';
  const lightSecondaryColor = '#4a2a6e';
  const lightPurpleAccent = '#8b5cf6';

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ color: darkMode ? undefined : lightTextColor }}>
      {darkMode ? (
        <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#120426] via-[#1d0a3a] to-[#06000b]" />
      ) : (
        <div
          className="fixed inset-0 -z-20"
          style={{ background: 'linear-gradient(135deg, #ffffff, #f3f0ff, #e9d5ff)' }}
        />
      )}

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] blur-[200px]"
          style={{
            background: darkMode ? '#b46bff' : '#c4b5fd',
            opacity: darkMode ? 0.16 : 0.15,
          }}
        />
      </div>

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-300 opacity-[0.08] blur-[180px] top-[-100px] left-[-120px]" />
        <div className="absolute w-[500px] h-[500px] bg-purple-200 opacity-[0.08] blur-[160px] bottom-[-100px] right-[-120px]" />
      </div>

      <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="flex items-center justify-center min-h-[80vh] px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-6xl mx-auto"
        >
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: darkMode ? '#c084fc' : lightTextColor }}
          >
            Anggota Kelompok
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {anggotaKelompok.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.08, y: -10 }}
                onClick={() => setSelected(m)}
                className={`p-6 rounded-xl backdrop-blur-xl border text-center transition cursor-pointer
                ${darkMode
                  ? i % 2 === 0
                    ? 'bg-gradient-to-br from-purple-500/10 to-transparent border-purple-400/20'
                    : 'bg-gradient-to-br from-white/10 to-transparent border-white/10'
                  : 'bg-white border border-purple-200 shadow-md'}
                  hover:shadow-2xl hover:shadow-purple-500/20`}
              >
                <motion.img
                  src={m.foto}
                  alt={m.nama}
                  whileHover={{ scale: 1.1 }}
                  className="w-32 h-32 rounded-full mx-auto mb-5 border-4 border-purple-400 shadow-lg shadow-purple-500/40 object-cover"
                />
                <h3 className="text-lg font-semibold" style={{ color: darkMode ? '#ffffff' : lightTextColor }}>
                  {m.nama}
                </h3>
                <p style={{ color: darkMode ? '#c084fc' : lightPurpleAccent }} className="font-medium">
                  {m.nim}
                </p>
                <p
                  className="text-[11px] mt-2"
                  style={{ color: darkMode ? '#c084fc80' : '#7c3aed' }}
                >
                  Klik untuk detail →
                </p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition"
              style={{ color: darkMode ? undefined : lightSecondaryColor }}
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </main>

      <footer
        className="text-center py-6 border-t relative z-10"
        style={{
          color: darkMode ? '#9ca3af' : '#5b21b6',
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#c4b5fd',
        }}
      >
        RSI Praktikum - Kelompok4
      </footer>

      <AnimatePresence>
        {selected && (
          <MemberModal member={selected} onClose={() => setSelected(null)} darkMode={darkMode} />
        )}
      </AnimatePresence>
    </div>
  );
}
