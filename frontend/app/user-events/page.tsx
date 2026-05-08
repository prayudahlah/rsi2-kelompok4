'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listEvents, registerEvent, type EventRecord } from '@/lib/api/events';
import { getToken } from '@/lib/auth/token';

export default function UserEventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
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
      console.error(err);
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
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0d0b20 0%, #12103a 50%, #1a1040 100%)' }}
      >
        <div className="text-white/70 text-lg animate-pulse">Memuat event...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: 'linear-gradient(135deg, #0d0b20 0%, #130f38 40%, #1c1245 70%, #150e35 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="space-y-3">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#a5b4fc',
              }}
            >
              Event Terbaru
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Daftar Event
            </h1>
            <p style={{ color: 'rgba(199,210,254,0.75)' }} className="max-w-xl text-sm md:text-base">
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
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <p style={{ color: 'rgba(165,180,252,0.6)' }}>Belum ada event tersedia saat ini.</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(165,180,252,0.35)' }}>Cek kembali nanti ya!</p>
            </div>
          ) : (
            events.map((event, idx) => (
              <div
                key={event.id}
                className="group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: 'rgba(20,16,55,0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(99,102,241,0.18)',
                  boxShadow: '0 4px 24px rgba(13,11,40,0.5)',
                  animationDelay: `${idx * 0.05}s`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.45)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(109,40,217,0.25)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.18)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(13,11,40,0.5)';
                }}
              >
                {/* Badge kuota */}
                <div
                  className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full"
                  style={{
                    background: 'rgba(0,0,0,0.45)',
                    color: 'rgba(199,210,254,0.7)',
                    border: '1px solid rgba(99,102,241,0.2)',
                  }}
                >
                  Kuota: {event.quota}
                </div>

                <div className="flex flex-col h-full">
                  <div className="mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
                    >
                      🎪
                    </div>
                  </div>

                  <h2
                    className="text-xl font-semibold text-white transition-colors"
                    style={{ color: '#e0e7ff' }}
                  >
                    {event.name}
                  </h2>

                  <p
                    className="text-sm mt-2 line-clamp-2 flex-1"
                    style={{ color: 'rgba(165,180,252,0.6)' }}
                  >
                    {event.description}
                  </p>

                  <div
                    className="mt-4 pt-3 text-sm flex items-center gap-2"
                    style={{
                      borderTop: '1px solid rgba(99,102,241,0.15)',
                      color: 'rgba(165,180,252,0.5)',
                    }}
                  >
                    <span>📅 {new Date(event.started_at).toLocaleDateString('id-ID')}</span>
                  </div>

                  <button
                    onClick={() => handleRegister(event.id)}
                    className="mt-4 w-full py-2 rounded-xl font-semibold text-white text-sm transition-all duration-200 active:scale-95"
                    style={{
                      background: 'linear-gradient(90deg, #6d28d9, #4338ca)',
                      boxShadow: '0 4px 14px rgba(109,40,217,0.35)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #7c3aed, #4f46e5)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(124,58,237,0.45)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #6d28d9, #4338ca)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(109,40,217,0.35)';
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
    </div>
  );
}
