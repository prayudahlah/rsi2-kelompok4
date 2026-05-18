'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/components/useDarkMode';
import { listEvents, registerEvent, type EventRecord } from '@/lib/api/events';

export default function UserEventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const { darkMode, toggleDarkMode, isMounted } = useDarkMode(true);
  const resolvedDarkMode = isMounted ? darkMode : false;

  const lightTextColor = '#1e0a3c';
  const lightSecondaryColor = '#4a2a6e';
  const lightMutedColor = '#6d28d9';

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    fetchEvents();
  }, [router]);

  const fetchEvents = async () => {
    try {
      const data = await listEvents();
      setEvents(data);
    } catch (err: any) {
            setMessage({ type: 'error', text: 'Gagal memuat daftar event' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: number) => {
    try {
      await registerEvent(eventId);
      setMessage({ type: 'success', text: 'Berhasil mendaftar event!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal mendaftar event';
      setMessage({ type: 'error', text: errorMsg });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{
        background: resolvedDarkMode
          ? 'linear-gradient(135deg, #0d0b20 0%, #12103a 50%, #1a1040 100%)'
          : 'linear-gradient(135deg, #ffffff, #f3f0ff, #e9d5ff)',
      }}>
        <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} isMounted={isMounted} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div
            className="text-lg animate-pulse"
            style={{ color: resolvedDarkMode ? 'rgba(255,255,255,0.7)' : lightSecondaryColor }}
          >
            Memuat event...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ color: resolvedDarkMode ? undefined : lightTextColor }}>
      {resolvedDarkMode ? (
        <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#0d0b20] via-[#130f38] to-[#150e35]" />
      ) : (
        <div className="fixed inset-0 -z-20" style={{ background: 'linear-gradient(135deg, #ffffff, #f3f0ff, #e9d5ff)' }} />
      )}

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] blur-[200px]"
          style={{
            background: resolvedDarkMode ? '#b46bff' : '#c4b5fd',
            opacity: resolvedDarkMode ? 0.16 : 0.15,
          }}
        />
      </div>

      <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} isMounted={isMounted} />

      <main className="relative z-10 px-4 md:px-10 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="space-y-3">

              <h1
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ color: resolvedDarkMode ? '#ffffff' : lightTextColor }}
              >
                Daftar Event
              </h1>
              <p
                className="max-w-xl text-sm md:text-base"
                style={{ color: resolvedDarkMode ? 'rgba(199,210,254,0.75)' : lightSecondaryColor }}
              >
                Temukan acara menarik dan daftarkan dirimu sekarang juga
              </p>
            </div>
          </div>

          {/* Notifikasi */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-center text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}
              style={{
                color: message.type === 'success'
                  ? (resolvedDarkMode ? '#86efac' : '#166534')
                  : (resolvedDarkMode ? '#fca5a5' : '#991b1b'),
              }}
            >
              {message.text}
            </div>
          )}

          {/* Grid Event */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div
                className="col-span-full text-center py-16 rounded-2xl"
                style={{
                  background: resolvedDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(139,92,246,0.06)',
                  border: resolvedDarkMode ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(139,92,246,0.2)',
                }}
              >
                <p style={{ color: resolvedDarkMode ? 'rgba(165,180,252,0.6)' : lightMutedColor }}>
                  Belum ada event tersedia saat ini.
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: resolvedDarkMode ? 'rgba(165,180,252,0.35)' : lightSecondaryColor }}
                >
                  Cek kembali nanti ya!
                </p>
              </div>
            ) : (
              events.map((event, idx) => (
                <div
                  key={event.id}
                  className="group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-2"
                  style={{
                    background: resolvedDarkMode ? 'rgba(20,16,55,0.7)' : '#ffffff',
                    backdropFilter: resolvedDarkMode ? 'blur(12px)' : undefined,
                    border: resolvedDarkMode
                      ? '1px solid rgba(99,102,241,0.18)'
                      : '1px solid rgba(139,92,246,0.2)',
                    boxShadow: resolvedDarkMode
                      ? '0 4px 24px rgba(13,11,40,0.5)'
                      : '0 4px 20px rgba(139,92,246,0.1)',
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = resolvedDarkMode
                      ? 'rgba(139,92,246,0.45)'
                      : 'rgba(139,92,246,0.5)';
                    (e.currentTarget as HTMLElement).style.boxShadow = resolvedDarkMode
                      ? '0 8px 32px rgba(109,40,217,0.25)'
                      : '0 8px 32px rgba(139,92,246,0.2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = resolvedDarkMode
                      ? 'rgba(99,102,241,0.18)'
                      : 'rgba(139,92,246,0.2)';
                    (e.currentTarget as HTMLElement).style.boxShadow = resolvedDarkMode
                      ? '0 4px 24px rgba(13,11,40,0.5)'
                      : '0 4px 20px rgba(139,92,246,0.1)';
                  }}
                >
                  {/* Badge kuota */}
                  <div
                    className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full"
                    style={{
                      background: resolvedDarkMode ? 'rgba(0,0,0,0.45)' : 'rgba(139,92,246,0.1)',
                      color: resolvedDarkMode ? 'rgba(199,210,254,0.7)' : lightMutedColor,
                      border: resolvedDarkMode
                        ? '1px solid rgba(99,102,241,0.2)'
                        : '1px solid rgba(139,92,246,0.25)',
                    }}
                  >
                    Kuota: {event.quota}
                  </div>

                  <div className="flex flex-col h-full">
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: resolvedDarkMode ? '#e0e7ff' : lightTextColor }}
                    >
                      {event.name}
                    </h2>

                    <p
                      className="text-sm mt-2 line-clamp-2 flex-1"
                      style={{ color: resolvedDarkMode ? 'rgba(165,180,252,0.6)' : lightSecondaryColor }}
                    >
                      {event.description}
                    </p>

                    <div
                      className="mt-4 pt-3 text-xs flex items-center gap-4"
                      style={{
                        borderTop: resolvedDarkMode
                          ? '1px solid rgba(99,102,241,0.15)'
                          : '1px solid rgba(139,92,246,0.2)',
                        color: resolvedDarkMode ? 'rgba(165,180,252,0.5)' : lightMutedColor,
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Mulai: {new Date(event.started_at).toLocaleDateString('id-ID')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Selesai: {new Date(event.ended_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRegister(event.id)}
                      className="mt-4 w-full py-2 rounded-xl font-semibold text-white text-sm transition-all duration-200 active:scale-95"
                      style={{
                        background: 'linear-gradient(90deg, #6d28d9, #4338ca)',
                        boxShadow: resolvedDarkMode
                          ? '0 4px 14px rgba(109,40,217,0.35)'
                          : '0 4px 14px rgba(99,102,241,0.3)',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #7c3aed, #4f46e5)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(124,58,237,0.45)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #6d28d9, #4338ca)';
                        (e.currentTarget as HTMLElement).style.boxShadow = resolvedDarkMode
                          ? '0 4px 14px rgba(109,40,217,0.35)'
                          : '0 4px 14px rgba(99,102,241,0.3)';
                      }}
                    >
                      Daftar Sekarang
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
