'use client';

import { useEffect, useMemo, useState } from 'react';
import { listEvents, type EventRecord } from '@/lib/api/events';
import { listRegistrations, type RegistrationRecord } from '@/lib/api/registrations';
import { listUsers, type UserRecord } from '@/lib/api/users';

type ParticipantManagementTabProps = {
  darkMode: boolean;
};

export default function ParticipantManagementTab({ darkMode }: ParticipantManagementTabProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const [eventData, registrationData, userData] = await Promise.all([
        listEvents(),
        listRegistrations(),
        listUsers(),
      ]);
      setEvents(eventData);
      setRegistrations(registrationData);
      setUsers(userData);
      setSelectedEventId((prev) => prev ?? eventData[0]?.id ?? null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal memuat data peserta.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;
  const eventParticipants = useMemo(() => {
    if (!selectedEventId) return [];
    return registrations
      .filter((item) => item.event_id === selectedEventId)
      .map((item) => {
        const user = users.find((u) => u.id === item.user_id);
        return {
          id: item.id,
          userId: item.user_id,
          name: user ? `${user.first_name} ${user.last_name}`.trim() : `User #${item.user_id}`,
          whatsapp: user?.whatsapp ?? '-',
        };
      });
  }, [registrations, selectedEventId, users]);

  const panelStyle = {
    background: darkMode ? 'rgba(12,6,26,0.6)' : 'rgba(255,255,255,0.82)',
    borderColor: darkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
    color: darkMode ? '#f8fafc' : '#2d1b4e',
  } as const;

  return (
    <section
      className="rounded-3xl border p-6 md:p-8 shadow-sm"
      style={{
        background: darkMode ? 'rgba(12,6,26,0.6)' : 'rgba(255,255,255,0.85)',
        borderColor: darkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
        color: darkMode ? '#f8fafc' : '#1e0a3c',
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div>
          <h2 className="text-2xl font-semibold">Management Peserta</h2>
          <p className="mt-2 text-sm" style={{ color: darkMode ? '#cbd5f5' : '#6b21a8' }}>
            Pilih event lalu lihat daftar peserta yang sudah registrasi.
          </p>
        </div>

        <label className="w-full md:w-80">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide" style={{ color: darkMode ? '#e9d5ff' : '#4c1d95' }}>
            Pilih Event
          </span>
          <select
            value={selectedEventId ?? ''}
            onChange={(e) => setSelectedEventId(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
            style={{
              background: darkMode ? 'rgba(17,8,30,0.7)' : '#ffffff',
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
              color: darkMode ? '#f3e8ff' : '#2d1b4e',
            }}
          >
            {events.length === 0 ? (
              <option value="">Tidak ada event</option>
            ) : (
              events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))
            )}
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="mt-2 rounded-2xl border p-6 text-center" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe' }}>
          <p className="text-sm" style={{ color: darkMode ? '#e9d5ff' : '#4c1d95' }}>
            Memuat data peserta...
          </p>
        </div>
      ) : message ? (
        <div className="mt-2 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
          {message}
        </div>
      ) : (
        <div className="mt-2 space-y-4">
          <div className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe' }}>
            <div className="font-semibold">{selectedEvent?.name ?? 'Belum ada event dipilih'}</div>
            <div className="mt-1" style={{ color: darkMode ? '#cbd5f5' : '#6b21a8' }}>
              Total peserta: {eventParticipants.length}
            </div>
          </div>

          {eventParticipants.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe' }}>
              <p className="text-sm" style={{ color: darkMode ? '#cbd5f5' : '#6b21a8' }}>
                Belum ada peserta untuk event ini.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe' }}>
              <table className="w-full text-sm">
                <thead style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(139,92,246,0.06)' }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Nama</th>
                    <th className="px-4 py-3 text-left font-semibold">WhatsApp</th>
                    <th className="px-4 py-3 text-left font-semibold">User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {eventParticipants.map((participant) => (
                    <tr key={participant.id} style={{ borderTop: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3e8ff' }}>
                      <td className="px-4 py-3">{participant.name}</td>
                      <td className="px-4 py-3">{participant.whatsapp}</td>
                      <td className="px-4 py-3">{participant.userId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
