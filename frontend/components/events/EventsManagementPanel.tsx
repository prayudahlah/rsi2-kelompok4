'use client';

import { FileJson, FileSpreadsheet, Search } from 'lucide-react';
import EventTable from '@/components/events/EventTable';
import type { EventRecord } from '@/lib/api/events';

type EventsManagementPanelProps = {
    items: EventRecord[];
    totalItems: number;
    pageStart: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    darkMode: boolean;
    isBusy: boolean;
    errorMessage?: string;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onAddEvent: () => void;
    onUpdate: (id: number, payload: Partial<EventRecord>) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onExport: (format: 'json' | 'csv') => void;
    onPageChange: (nextPage: number) => void;
    onPageSizeChange: (nextSize: number) => void;
};

export default function EventsManagementPanel({
    items,
    totalItems,
    pageStart,
    pageSize,
    currentPage,
    totalPages,
    darkMode,
    isBusy,
    errorMessage,
    searchQuery,
    onSearchChange,
    onAddEvent,
    onUpdate,
    onDelete,
    onExport,
    onPageChange,
    onPageSizeChange,
}: EventsManagementPanelProps) {
    return (
        <section
            className="rounded-3xl border px-6 py-6 md:px-8 backdrop-blur-xl"
            style={{
                background: darkMode ? 'rgba(12,6,26,0.6)' : 'rgba(255,255,255,0.8)',
                borderColor: darkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
            }}
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-lg md:text-xl font-semibold">Management Events</h2>
                    <p className="text-xs mt-1" style={{ color: darkMode ? '#cbd5f5' : '#5b21b6' }}>
                        Update, ubah, atau hapus event yang sudah tersedia.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onAddEvent}
                        className="rounded-full px-4 py-2 text-xs font-semibold"
                        style={{
                            background: darkMode ? 'linear-gradient(90deg,#7c3aed,#0ea5e9)' : 'linear-gradient(90deg,#6d28d9,#9333ea)',
                            color: '#ffffff',
                        }}
                    >
                        Tambah Event
                    </button>
                    <button
                        type="button"
                        onClick={() => onExport('json')}
                        title="Export JSON"
                        className="w-9 h-9 rounded-full grid place-items-center"
                        style={{
                            background: darkMode ? 'rgba(59,130,246,0.2)' : '#dbeafe',
                            color: darkMode ? '#bfdbfe' : '#1d4ed8',
                        }}
                    >
                        <FileJson size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onExport('csv')}
                        title="Export CSV"
                        className="w-9 h-9 rounded-full grid place-items-center"
                        style={{
                            background: darkMode ? 'rgba(16,185,129,0.2)' : '#dcfce7',
                            color: darkMode ? '#bbf7d0' : '#166534',
                        }}
                    >
                        <FileSpreadsheet size={16} />
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: darkMode ? '#e9d5ff' : '#4c1d95' }}>
                    Search Event
                </label>
                <div
                    className="mt-2 flex items-center gap-2 rounded-2xl border px-4 py-2.5 shadow-sm"
                    style={{
                        borderColor: darkMode ? 'rgba(255,255,255,0.12)' : '#e5e7eb',
                        background: '#ffffff',
                    }}
                >
                    <Search size={16} style={{ color: '#6b7280' }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Cari berdasarkan nama atau deskripsi"
                        className="w-full bg-transparent text-sm outline-none"
                        style={{ color: '#111827' }}
                    />
                </div>
            </div>

            <EventTable
                items={items}
                darkMode={darkMode}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isBusy={isBusy}
                errorMessage={errorMessage}
            />

            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-xs" style={{ color: darkMode ? '#cbd5f5' : '#5b21b6' }}>
                    Menampilkan {totalItems ? pageStart + 1 : 0}–{Math.min(pageStart + pageSize, totalItems)} dari {totalItems} event
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="text-xs" style={{ color: darkMode ? '#cbd5f5' : '#5b21b6' }}>
                        Rows:
                        <select
                            value={pageSize}
                            onChange={(event) => onPageSizeChange(Number(event.target.value))}
                            className="ml-2 rounded-lg border px-2 py-1 text-xs"
                            style={{
                                background: darkMode ? 'rgba(17,8,30,0.7)' : '#ffffff',
                                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                                color: darkMode ? '#f3e8ff' : '#2d1b4e',
                            }}
                        >
                            {[5, 8, 10, 20].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold disabled:opacity-60"
                        style={{
                            background: darkMode ? 'rgba(148,163,184,0.2)' : '#e2e8f0',
                            color: darkMode ? '#e2e8f0' : '#334155',
                        }}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{
                                background:
                                    page === currentPage
                                        ? darkMode
                                            ? 'rgba(124,58,237,0.5)'
                                            : '#ddd6fe'
                                        : darkMode
                                            ? 'rgba(148,163,184,0.2)'
                                            : '#f1f5f9',
                                color: darkMode ? '#f8fafc' : '#4c1d95',
                            }}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold disabled:opacity-60"
                        style={{
                            background: darkMode ? 'rgba(148,163,184,0.2)' : '#e2e8f0',
                            color: darkMode ? '#e2e8f0' : '#334155',
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}
