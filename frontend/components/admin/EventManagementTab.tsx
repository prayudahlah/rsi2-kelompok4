'use client';

import { useEffect, useMemo, useState } from 'react';
import EventForm from '@/components/events/EventForm';
import EventsManagementPanel from '@/components/events/EventsManagementPanel';
import { createEvent, deleteEvent, listEvents, updateEvent } from '@/lib/api/events';
import type { EventRecord } from '@/lib/api/events';
import { buildExportFilename, downloadFile, toCsv } from '@/components/events/exportUtils';
import { X } from 'lucide-react';

type MessageState = {
    type: 'success' | 'error' | null;
    text: string;
};

type EventManagementTabProps = {
    darkMode: boolean;
};

export default function EventManagementTab({ darkMode }: EventManagementTabProps) {
    const [items, setItems] = useState<EventRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBusy, setIsBusy] = useState(false);
    const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const lightTextColor = '#1e0a3c';

    const resolvedDarkMode = darkMode;

    const loadEvents = async () => {
        setIsLoading(true);
        setMessage({ type: null, text: '' });
        try {
            const data = await listEvents();
            setItems(data);
            setCurrentPage(1);
        } catch (error) {
            const messageText = error instanceof Error ? error.message : 'Gagal memuat event.';
            setMessage({ type: 'error', text: messageText });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadEvents();
    }, []);

    const handleCreate = async (payload: Omit<EventRecord, 'id'>) => {
        setIsBusy(true);
        setMessage({ type: null, text: '' });
        try {
            const created = await createEvent(payload);
            setItems((prev) => [created, ...prev]);
            setCurrentPage(1);
            setMessage({ type: 'success', text: 'Event berhasil ditambahkan.' });
        } catch (error) {
            const messageText = error instanceof Error ? error.message : 'Gagal menambah event.';
            setMessage({ type: 'error', text: messageText });
        } finally {
            setIsBusy(false);
        }
    };

    const handleUpdate = async (id: number, payload: Partial<EventRecord>) => {
        setIsBusy(true);
        setMessage({ type: null, text: '' });
        try {
            const updated = await updateEvent(id, payload);
            setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
            setMessage({ type: 'success', text: 'Event berhasil diperbarui.' });
        } catch (error) {
            const messageText = error instanceof Error ? error.message : 'Gagal memperbarui event.';
            setMessage({ type: 'error', text: messageText });
        } finally {
            setIsBusy(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Hapus event ini? Tindakan tidak bisa dibatalkan.');
        if (!confirmed) return;
        setIsBusy(true);
        setMessage({ type: null, text: '' });
        try {
            await deleteEvent(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
            setCurrentPage(1);
            setMessage({ type: 'success', text: 'Event berhasil dihapus.' });
        } catch (error) {
            const messageText = error instanceof Error ? error.message : 'Gagal menghapus event.';
            setMessage({ type: 'error', text: messageText });
        } finally {
            setIsBusy(false);
        }
    };

    const bannerStyle = useMemo(
        () => ({
            background: resolvedDarkMode
                ? 'linear-gradient(120deg, rgba(76,29,149,0.5), rgba(2,132,199,0.4))'
                : 'linear-gradient(120deg, rgba(244,114,182,0.18), rgba(56,189,248,0.2))',
            borderColor: resolvedDarkMode ? 'rgba(124,58,237,0.3)' : '#e9d5ff',
            color: resolvedDarkMode ? '#f8fafc' : '#2d1b4e',
        }),
        [resolvedDarkMode]
    );

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return items;

        return items.filter((item) => {
            return (
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
        });
    }, [items, searchQuery]);

    const filteredTotalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
    const safePage = Math.min(currentPage, filteredTotalPages);
    const pageStart = (safePage - 1) * pageSize;
    const pageItems = filteredItems.slice(pageStart, pageStart + pageSize);

    const handlePageChange = (nextPage: number) => {
        setCurrentPage(Math.min(Math.max(nextPage, 1), filteredTotalPages));
    };

    const handleExport = (format: 'json' | 'csv') => {
        if (!items.length) return;
        if (format === 'json') {
            const content = JSON.stringify(items, null, 2);
            downloadFile(buildExportFilename('events', 'json'), content, 'application/json');
            return;
        }

        const content = toCsv(items);
        downloadFile(buildExportFilename('events', 'csv'), content, 'text/csv');
    };

    return (
        <section className="space-y-8 pr-0 lg:pr-4" style={{ color: resolvedDarkMode ? undefined : lightTextColor }}>
            <section className="rounded-2xl border px-6 py-8 md:px-8" style={bannerStyle}>
                <h1 className="text-3xl md:text-4xl font-semibold">Event Management</h1>
                <p className="mt-2 text-sm md:text-base" style={{ color: resolvedDarkMode ? '#e2e8f0' : '#4c1d95' }}>
                    Kelola agenda event, kuota peserta, dan jadwal dalam satu halaman.
                </p>
            </section>

            {message.type && message.text ? (
                <div
                    className="rounded-2xl border px-4 py-3 text-sm"
                    style={{
                        borderColor: message.type === 'error' ? 'rgba(248,113,113,0.35)' : 'rgba(52,211,153,0.35)',
                        background: message.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                        color: message.type === 'error' ? '#fca5a5' : '#86efac',
                    }}
                >
                    {message.text}
                </div>
            ) : null}

            {isLoading ? (
                <section className="rounded-2xl border p-8 text-center" style={{ borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe' }}>
                    <p className="text-sm" style={{ color: resolvedDarkMode ? '#e9d5ff' : '#4c1d95' }}>
                        Memuat data event...
                    </p>
                </section>
            ) : (
                <>
                    <EventsManagementPanel
                        items={pageItems}
                        totalItems={items.length}
                        pageStart={pageStart}
                        pageSize={pageSize}
                        currentPage={safePage}
                        totalPages={filteredTotalPages}
                        darkMode={resolvedDarkMode}
                        isBusy={isBusy}
                        errorMessage={message.type === 'error' ? message.text : ''}
                        searchQuery={searchQuery}
                        onSearchChange={(value) => {
                            setSearchQuery(value);
                            setCurrentPage(1);
                        }}
                        onAddEvent={() => setIsCreateOpen(true)}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onExport={handleExport}
                        onPageChange={handlePageChange}
                        onPageSizeChange={(nextSize) => {
                            setPageSize(nextSize);
                            setCurrentPage(1);
                        }}
                    />
                </>
            )}

            {isCreateOpen ? (
                <div className="fixed inset-0 z-50 grid place-items-center px-4 py-8">
                    <div className="absolute inset-0 bg-black/45" />
                    <div
                        className="relative w-full max-w-4xl rounded-3xl border p-6 md:p-8 shadow-2xl"
                        style={{
                            background: resolvedDarkMode ? 'rgba(19,8,35,0.96)' : 'rgba(255,255,255,0.98)',
                            borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
                        }}
                    >
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold" style={{ color: resolvedDarkMode ? '#f8fafc' : '#2d1b4e' }}>
                                    Tambah Event Baru
                                </h3>
                                <p className="text-sm" style={{ color: resolvedDarkMode ? '#cbd5f5' : '#5b21b6' }}>
                                    Lengkapi detail event lalu simpan ke sistem.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:opacity-80"
                                style={{
                                    borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.12)' : '#e9d5ff',
                                    color: resolvedDarkMode ? '#e9d5ff' : '#4c1d95',
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <EventForm
                            darkMode={resolvedDarkMode}
                            variant="compact"
                            onSubmit={handleCreate}
                            isSubmitting={isBusy}
                            errorMessage={message.type === 'error' ? message.text : ''}
                        />
                    </div>
                </div>
            ) : null}
        </section>
    );
}
