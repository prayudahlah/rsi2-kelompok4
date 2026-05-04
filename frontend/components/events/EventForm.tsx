'use client';

import { useMemo, useState } from 'react';
import type { EventCreatePayload } from '@/lib/api/events';
import { buildFormValues, toIsoString } from '@/components/events/eventUtils';

type EventFormProps = {
  onSubmit: (payload: EventCreatePayload) => Promise<void>;
  darkMode: boolean;
  isSubmitting?: boolean;
  errorMessage?: string;
  successMessage?: string;
};

const inputBase =
  'w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-purple-400/40';

export default function EventForm({
  onSubmit,
  darkMode,
  isSubmitting = false,
  errorMessage,
  successMessage,
}: EventFormProps) {
  const [values, setValues] = useState(() =>
    buildFormValues({
      startedAt: '',
      endedAt: '',
    })
  );
  const [localError, setLocalError] = useState('');

  const fieldStyle = useMemo(
    () => ({
      background: darkMode ? 'rgba(17,8,30,0.7)' : '#ffffff',
      borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
      color: darkMode ? '#f3e8ff' : '#2d1b4e',
    }),
    [darkMode]
  );

  const handleChange = (key: keyof typeof values, nextValue: string) => {
    setValues((prev) => ({ ...prev, [key]: nextValue }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError('');

    if (!values.name || !values.description || !values.quota) {
      setLocalError('Lengkapi nama, deskripsi, dan kuota.');
      return;
    }

    const quotaValue = Number(values.quota);
    if (!Number.isFinite(quotaValue) || quotaValue <= 0) {
      setLocalError('Kuota harus lebih dari 0.');
      return;
    }

    const startedAt = toIsoString(values.startedAt);
    const endedAt = toIsoString(values.endedAt);
    if (!startedAt || !endedAt) {
      setLocalError('Tanggal mulai dan selesai wajib diisi.');
      return;
    }

    if (new Date(startedAt) > new Date(endedAt)) {
      setLocalError('Tanggal selesai harus setelah tanggal mulai.');
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      quota: quotaValue,
      started_at: startedAt,
      ended_at: endedAt,
    });

    setValues(buildFormValues());
  };

  return (
    <section
      className="rounded-3xl border p-6 md:p-8 backdrop-blur-xl"
      style={{
        background: darkMode ? 'rgba(19,8,35,0.6)' : 'rgba(255,255,255,0.75)',
        borderColor: darkMode ? 'rgba(255,255,255,0.08)' : '#e9d5ff',
        boxShadow: darkMode
          ? '0 25px 80px rgba(10,0,35,0.45)'
          : '0 25px 60px rgba(124,58,237,0.2)',
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Tambah Event Baru</h2>
          <p className="text-sm mt-1" style={{ color: darkMode ? '#cbd5f5' : '#5b21b6' }}>
            Lengkapi detail event lalu simpan ke sistem.
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: darkMode ? 'rgba(126,34,206,0.3)' : '#ede9fe',
            color: darkMode ? '#e9d5ff' : '#4c1d95',
          }}
        >
          Admin
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wide uppercase">Nama Event</span>
          <input
            value={values.name}
            onChange={(event) => handleChange('name', event.target.value)}
            className={inputBase}
            placeholder="Workshop AI"
            style={fieldStyle}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wide uppercase">Kuota</span>
          <input
            type="number"
            min="1"
            value={values.quota}
            onChange={(event) => handleChange('quota', event.target.value)}
            className={inputBase}
            placeholder="100"
            style={fieldStyle}
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-xs font-semibold tracking-wide uppercase">Deskripsi</span>
          <textarea
            value={values.description}
            onChange={(event) => handleChange('description', event.target.value)}
            className={`${inputBase} min-h-[110px] resize-none`}
            placeholder="Rangkaian acara, fokus pembahasan, dan benefit peserta."
            style={fieldStyle}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wide uppercase">Mulai</span>
          <input
            type="datetime-local"
            value={values.startedAt}
            onChange={(event) => handleChange('startedAt', event.target.value)}
            className={inputBase}
            style={fieldStyle}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wide uppercase">Selesai</span>
          <input
            type="datetime-local"
            value={values.endedAt}
            onChange={(event) => handleChange('endedAt', event.target.value)}
            className={inputBase}
            style={fieldStyle}
          />
        </label>

        <div className="md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm">
            {(localError || errorMessage) && (
              <p className="text-rose-400 font-medium">{localError || errorMessage}</p>
            )}
            {!localError && successMessage && (
              <p className="text-emerald-400 font-medium">{successMessage}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-full text-sm font-semibold transition disabled:opacity-60"
            style={{
              background: darkMode
                ? 'linear-gradient(90deg,#7c3aed,#0ea5e9)'
                : 'linear-gradient(90deg,#6d28d9,#9333ea)',
              color: '#ffffff',
              boxShadow: darkMode
                ? '0 10px 30px rgba(124,58,237,0.35)'
                : '0 10px 30px rgba(124,58,237,0.25)',
            }}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Event'}
          </button>
        </div>
      </form>
    </section>
  );
}
