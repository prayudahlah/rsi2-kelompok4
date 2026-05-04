'use client';

import { useMemo, useState } from 'react';
import type { EventRecord } from '@/lib/api/events';
import { buildFormValues, formatDisplayDate, toIsoString, toLocalInputValue } from '@/components/events/eventUtils';

type EventTableProps = {
  items: EventRecord[];
  darkMode: boolean;
  onUpdate: (id: number, payload: Partial<EventRecord>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isBusy?: boolean;
  errorMessage?: string;
};

type EditState = {
  id: number | null;
  values: ReturnType<typeof buildFormValues>;
};

const inputBase =
  'w-full rounded-lg border px-3 py-2 text-xs outline-none transition focus:ring-2 focus:ring-purple-400/40';

export default function EventTable({
  items,
  darkMode,
  onUpdate,
  onDelete,
  isBusy = false,
  errorMessage,
}: EventTableProps) {
  const [editState, setEditState] = useState<EditState>({ id: null, values: buildFormValues() });
  const [localError, setLocalError] = useState('');

  const fieldStyle = useMemo(
    () => ({
      background: darkMode ? 'rgba(16,8,30,0.85)' : '#ffffff',
      borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
      color: darkMode ? '#f8f5ff' : '#2d1b4e',
    }),
    [darkMode]
  );

  const startEdit = (event: EventRecord) => {
    setLocalError('');
    setEditState({
      id: event.id,
      values: buildFormValues({
        name: event.name,
        description: event.description,
        quota: String(event.quota),
        startedAt: toLocalInputValue(event.started_at),
        endedAt: toLocalInputValue(event.ended_at),
      }),
    });
  };

  const cancelEdit = () => {
    setEditState({ id: null, values: buildFormValues() });
    setLocalError('');
  };

  const handleChange = (key: keyof EditState['values'], value: string) => {
    setEditState((prev) => ({ ...prev, values: { ...prev.values, [key]: value } }));
  };

  const handleSave = async () => {
    if (!editState.id) return;
    setLocalError('');

    const { name, description, quota, startedAt, endedAt } = editState.values;
    if (!name || !description || !quota) {
      setLocalError('Nama, deskripsi, dan kuota wajib diisi.');
      return;
    }

    const quotaValue = Number(quota);
    if (!Number.isFinite(quotaValue) || quotaValue <= 0) {
      setLocalError('Kuota harus lebih dari 0.');
      return;
    }

    const startedAtIso = toIsoString(startedAt);
    const endedAtIso = toIsoString(endedAt);
    if (!startedAtIso || !endedAtIso) {
      setLocalError('Tanggal mulai dan selesai wajib diisi.');
      return;
    }

    if (new Date(startedAtIso) > new Date(endedAtIso)) {
      setLocalError('Tanggal selesai harus setelah tanggal mulai.');
      return;
    }

    await onUpdate(editState.id, {
      name: name.trim(),
      description: description.trim(),
      quota: quotaValue,
      started_at: startedAtIso,
      ended_at: endedAtIso,
    });
    cancelEdit();
  };

  return (
    <section
      className="rounded-3xl border p-6 md:p-8 backdrop-blur-xl"
      style={{
        background: darkMode ? 'rgba(12,6,26,0.6)' : 'rgba(255,255,255,0.78)',
        borderColor: darkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
        boxShadow: darkMode
          ? '0 30px 90px rgba(10,0,35,0.4)'
          : '0 25px 60px rgba(124,58,237,0.2)',
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Management Events</h2>
          <p className="text-sm mt-1" style={{ color: darkMode ? '#cbd5f5' : '#5b21b6' }}>
            Update, ubah, atau hapus event yang sudah tersedia.
          </p>
        </div>
        <div className="text-xs font-medium" style={{ color: darkMode ? '#c084fc' : '#4c1d95' }}>
          Total: {items.length}
        </div>
      </div>

      {errorMessage && <p className="text-sm text-rose-400 mb-4">{errorMessage}</p>}
      {localError && <p className="text-sm text-rose-400 mb-4">{localError}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-separate border-spacing-y-3">
          <thead className="text-xs uppercase tracking-wide">
            <tr style={{ color: darkMode ? '#b794f4' : '#6d28d9' }}>
              <th className="pb-3">Nama</th>
              <th className="pb-3">Deskripsi</th>
              <th className="pb-3">Kuota</th>
              <th className="pb-3">Mulai</th>
              <th className="pb-3">Selesai</th>
              <th className="pb-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((event) => {
              const isEditing = editState.id === event.id;
              return (
                <tr
                  key={event.id}
                  className="rounded-2xl"
                  style={{
                    background: darkMode ? 'rgba(20,10,32,0.7)' : 'rgba(255,255,255,0.95)',
                    boxShadow: darkMode
                      ? '0 12px 30px rgba(10,0,35,0.35)'
                      : '0 12px 30px rgba(124,58,237,0.12)',
                  }}
                >
                  <td className="px-4 py-4 font-semibold">
                    {isEditing ? (
                      <input
                        value={editState.values.name}
                        onChange={(event) => handleChange('name', event.target.value)}
                        className={inputBase}
                        style={fieldStyle}
                      />
                    ) : (
                      event.name
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <textarea
                        value={editState.values.description}
                        onChange={(event) => handleChange('description', event.target.value)}
                        className={`${inputBase} min-h-[80px] resize-none`}
                        style={fieldStyle}
                      />
                    ) : (
                      <p className="line-clamp-2 text-xs" style={{ color: darkMode ? '#d8b4fe' : '#4c1d95' }}>
                        {event.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        value={editState.values.quota}
                        onChange={(event) => handleChange('quota', event.target.value)}
                        className={inputBase}
                        style={fieldStyle}
                      />
                    ) : (
                      event.quota
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs">
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        value={editState.values.startedAt}
                        onChange={(event) => handleChange('startedAt', event.target.value)}
                        className={inputBase}
                        style={fieldStyle}
                      />
                    ) : (
                      formatDisplayDate(event.started_at)
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs">
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        value={editState.values.endedAt}
                        onChange={(event) => handleChange('endedAt', event.target.value)}
                        className={inputBase}
                        style={fieldStyle}
                      />
                    ) : (
                      formatDisplayDate(event.ended_at)
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleSave}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: darkMode ? 'rgba(16,185,129,0.25)' : '#dcfce7',
                            color: darkMode ? '#a7f3d0' : '#166534',
                          }}
                          disabled={isBusy}
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: darkMode ? 'rgba(251,146,60,0.2)' : '#ffedd5',
                            color: darkMode ? '#fdba74' : '#9a3412',
                          }}
                          disabled={isBusy}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(event)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: darkMode ? 'rgba(59,130,246,0.2)' : '#dbeafe',
                            color: darkMode ? '#bfdbfe' : '#1d4ed8',
                          }}
                          disabled={isBusy}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(event.id)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: darkMode ? 'rgba(244,63,94,0.2)' : '#ffe4e6',
                            color: darkMode ? '#fda4af' : '#9f1239',
                          }}
                          disabled={isBusy}
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
