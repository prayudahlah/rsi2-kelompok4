'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useDarkMode } from '@/components/useDarkMode';
import EventForm from '@/components/events/EventForm';
import EventsManagementPanel from '@/components/events/EventsManagementPanel';
import { createEvent, deleteEvent, listEvents, updateEvent } from '@/lib/api/events';
import type { EventRecord } from '@/lib/api/events';
import { buildExportFilename, downloadFile, toCsv } from '@/components/events/exportUtils';

type MessageState = {
    type: 'success' | 'error' | null;
    text: string;
};

export default function EventsPage() {
    const { darkMode, toggleDarkMode, isMounted } = useDarkMode(true);
    const resolvedDarkMode = isMounted ? darkMode : false;
    const [items, setItems] = useState<EventRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBusy, setIsBusy] = useState(false);
    const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
    const [role, setRole] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const lightTextColor = '#1e0a3c';

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
        const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
        setRole(r);
        if (r === 'admin') void loadEvents();
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

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const pageStart = (safePage - 1) * pageSize;
    const pageItems = items.slice(pageStart, pageStart + pageSize);

    const handlePageChange = (nextPage: number) => {
        setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
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
        <div
            className="min-h-screen relative overflow-hidden"
            style={{ color: resolvedDarkMode ? undefined : lightTextColor }}
        >
            {resolvedDarkMode ? (
                <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#120426] via-[#1d0a3a] to-[#06000b]" />
            ) : (
                <div
                    className="fixed inset-0 -z-20"
                    style={{ background: 'linear-gradient(140deg, #fff1f2, #fdf2ff, #eef2ff)' }}
                />
            )}

            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div
                    className="absolute w-[700px] h-[700px] blur-[180px]"
                    style={{
                        background: resolvedDarkMode ? '#9f7aea' : '#f0abfc',
                        opacity: resolvedDarkMode ? 0.16 : 0.18,
                    }}
                />
            </div>

            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute w-[420px] h-[420px] bg-sky-300 opacity-[0.1] blur-[140px] top-[-60px] left-[-60px]" />
                <div className="absolute w-[520px] h-[520px] bg-pink-300 opacity-[0.1] blur-[160px] bottom-[-120px] right-[-80px]" />
            </div>

            <Navbar
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
                isMounted={isMounted}
            />

            <main className="relative z-10 px-4 md:px-10 py-10">
                <div className="max-w-6xl mx-auto space-y-8">
                    <section
                        className="rounded-3xl border px-6 py-8 md:px-10"
                        style={bannerStyle}
                    >
                        <h1 className="text-3xl md:text-4xl font-semibold">Event Management</h1>
                        <p className="mt-2 text-sm md:text-base" style={{ color: resolvedDarkMode ? '#e2e8f0' : '#4c1d95' }}>
                            Kelola agenda event, kuota peserta, dan jadwal dalam satu halaman.
                        </p>
                    </section>

                    {role !== 'admin' ? (
                        <section
                            className="rounded-3xl border p-8 text-center"
                            style={{
                                background: resolvedDarkMode ? 'rgba(12,6,26,0.6)' : 'rgba(255,255,255,0.8)',
                                borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
                            }}
                        >
                            <h3 className="text-xl font-semibold" style={{ color: resolvedDarkMode ? '#e9d5ff' : '#4c1d95' }}>
                                Unauthorized
                            </h3>
                            <p className="text-sm mt-2" style={{ color: resolvedDarkMode ? '#cbd5f5' : '#6b21a8' }}>
                                Role kamu bukan admin. Simpan token admin lalu refresh role untuk membuka akses.
                            </p>
                        </section>
                    ) : isLoading ? (
                        <section
                            className="rounded-3xl border p-8 text-center"
                            style={{
                                background: resolvedDarkMode ? 'rgba(12,6,26,0.6)' : 'rgba(255,255,255,0.8)',
                                borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
                            }}
                        >
                            <p className="text-sm" style={{ color: resolvedDarkMode ? '#e9d5ff' : '#4c1d95' }}>
                                Memuat data event...
                            </p>
                        </section>
                    ) : (
                        <>
                            <EventForm
                                darkMode={resolvedDarkMode}
                                onSubmit={handleCreate}
                                isSubmitting={isBusy}
                                errorMessage={message.type === 'error' ? message.text : ''}
                                successMessage={message.type === 'success' ? message.text : ''}
                            />
                            <EventsManagementPanel
                                items={pageItems}
                                totalItems={items.length}
                                pageStart={pageStart}
                                pageSize={pageSize}
                                currentPage={safePage}
                                totalPages={totalPages}
                                darkMode={resolvedDarkMode}
                                isBusy={isBusy}
                                errorMessage={message.type === 'error' ? message.text : ''}
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
                </div>
            </main>
        </div>
    );
}
