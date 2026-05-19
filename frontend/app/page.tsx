'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/components/useDarkMode';
import { listEvents, type EventRecord } from '@/lib/api/events';
import { listRegistrations, type RegistrationRecord } from '@/lib/api/registrations';


// Komponen Utama
export default function Home() {
  const { darkMode, toggleDarkMode, isMounted } = useDarkMode(true);
  const resolvedDarkMode = isMounted ? darkMode : false;

  const [events, setEvents] = useState<EventRecord[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const [eventData, registrationData] = await Promise.all([
          listEvents(),
          listRegistrations(),
        ]);
        setEvents(eventData.slice(0, 6));
        setRegistrations(registrationData);
      } catch {
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    void loadEvents();
  }, []);

  const registrationMap = registrations.reduce<Record<number, number>>((acc, item) => {
    acc[item.event_id] = (acc[item.event_id] ?? 0) + 1;
    return acc;
  }, {});

  const getEventStatus = (event: EventRecord) => {
    const now = new Date();
    const start = new Date(event.started_at);
    const end = new Date(event.ended_at);

    if (now < start) return 'akan-datang';
    if (now > end) return 'sudah-tutup';
    return 'sedang-berjalan';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'akan-datang':
        return 'Akan Datang';
      case 'sedang-berjalan':
        return 'Sedang Berjalan';
      case 'sudah-tutup':
        return 'Sudah Tutup';
      default:
        return 'Status';
    }
  };

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
      <main className="flex items-center justify-center min-h-[60vh] px-4 relative z-10">
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
            Boardify
            <br />
            <span style={{ color: resolvedDarkMode ? '#c084fc' : lightPurpleAccent }}>
              Pusat pencarian event favoritmu
            </span>
          </h1>
          <p className="mt-3" style={{ color: resolvedDarkMode ? '#d1d5db' : lightSecondaryColor }}>
            Jelajahi event pilihan, simpan kursi, dan pantau agenda yang penting tanpa ribet.
          </p>
          <Link
            href="/event-registration"
            className={`mt-6 inline-flex px-8 py-3 rounded-full transition shadow-lg hover:scale-110 ${
              resolvedDarkMode
                ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-500/40'
                : 'bg-white/85 text-[#4a2a6e] border border-purple-200 hover:bg-white hover:shadow-purple-300/40'
            }`}
          >
            Jelajahi event →
          </Link>
        </motion.div>
      </main>

      <section className="relative z-10 px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">Jelajahi event</h2>
              <p className="mt-2 text-sm" style={{ color: resolvedDarkMode ? '#cbd5f5' : lightSecondaryColor }}>
                Pilihan event terbaru yang sedang ramai dibicarakan.
              </p>
            </div>
            <Link
              href="/event-registration"
              className="text-sm font-semibold transition hover:opacity-80"
              style={{ color: resolvedDarkMode ? '#c084fc' : '#6d28d9' }}
            >
              Lihat selengkapnya →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventsLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`event-skeleton-${index}`}
                  className="rounded-3xl border p-5"
                  style={{
                    borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
                    background: resolvedDarkMode ? 'rgba(12,6,26,0.5)' : 'rgba(255,255,255,0.85)',
                  }}
                >
                  <div className="h-4 w-2/3 rounded-full bg-white/20" />
                  <div className="mt-3 h-3 w-full rounded-full bg-white/10" />
                  <div className="mt-2 h-3 w-4/5 rounded-full bg-white/10" />
                </div>
              ))
            ) : events.length ? (
              events.map((event) => {
                const registeredCount = registrationMap[event.id] ?? 0;
                const remainingSlots = event.quota - registeredCount;
                const status = getEventStatus(event);

                const statusStyle = (() => {
                  if (status === 'sedang-berjalan') {
                    return {
                      background: resolvedDarkMode ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.12)',
                      color: resolvedDarkMode ? '#bbf7d0' : '#166534',
                      border: resolvedDarkMode
                        ? '1px solid rgba(16,185,129,0.35)'
                        : '1px solid rgba(16,185,129,0.25)',
                    };
                  }
                  if (status === 'sudah-tutup') {
                    return {
                      background: resolvedDarkMode ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.12)',
                      color: resolvedDarkMode ? '#fecaca' : '#991b1b',
                      border: resolvedDarkMode
                        ? '1px solid rgba(248,113,113,0.35)'
                        : '1px solid rgba(248,113,113,0.25)',
                    };
                  }
                  return {
                    background: resolvedDarkMode ? 'rgba(129,140,248,0.2)' : 'rgba(99,102,241,0.12)',
                    color: resolvedDarkMode ? '#c7d2fe' : '#3730a3',
                    border: resolvedDarkMode
                      ? '1px solid rgba(129,140,248,0.35)'
                      : '1px solid rgba(99,102,241,0.25)',
                  };
                })();

                const slotStyle = {
                  background: resolvedDarkMode ? 'rgba(0,0,0,0.45)' : 'rgba(139,92,246,0.1)',
                  color: resolvedDarkMode ? 'rgba(199,210,254,0.7)' : '#6b21a8',
                  border: resolvedDarkMode
                    ? '1px solid rgba(99,102,241,0.2)'
                    : '1px solid rgba(139,92,246,0.25)',
                };

                return (
                  <div
                    key={event.id}
                    className="rounded-3xl border p-5 transition hover:-translate-y-1"
                    style={{
                      borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
                      background: resolvedDarkMode ? 'rgba(12,6,26,0.6)' : 'rgba(255,255,255,0.9)',
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full" style={statusStyle}>
                        {getStatusLabel(status)}
                      </span>
                      <span className="px-2 py-1 rounded-full" style={slotStyle}>
                        {remainingSlots > 0
                          ? `Sisa ${remainingSlots} / Kuota ${event.quota}`
                          : `Penuh / Kuota ${event.quota}`}
                      </span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-wide" style={{ color: resolvedDarkMode ? '#cbd5f5' : '#6b21a8' }}>
                      {new Date(event.started_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold">{event.name}</h3>
                    <p
                      className="mt-2 text-sm"
                      style={{ color: resolvedDarkMode ? '#d1d5db' : lightSecondaryColor }}
                    >
                      {event.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs" style={{ color: resolvedDarkMode ? '#cbd5f5' : '#6b21a8' }}>
                      <span>Selesai {new Date(event.ended_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className="rounded-3xl border p-6 text-center"
                style={{
                  borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
                  background: resolvedDarkMode ? 'rgba(12,6,26,0.5)' : 'rgba(255,255,255,0.85)',
                }}
              >
                <p className="text-sm" style={{ color: resolvedDarkMode ? '#cbd5f5' : '#6b21a8' }}>
                  Belum ada event. Coba lagi nanti.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer
        className="text-center py-6 border-t relative z-10"
        style={{
          color: resolvedDarkMode ? '#9ca3af' : '#5b21b6',
          borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.1)' : '#c4b5fd',
        }}
      >
          Boardify · Temukan event yang layak untuk waktumu
      </footer>

    </div>
  );
}
