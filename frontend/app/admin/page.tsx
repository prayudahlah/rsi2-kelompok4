'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useDarkMode } from '@/components/useDarkMode';
import { getMe } from '@/lib/api/auth';
import EventManagementTab from '@/components/admin/EventManagementTab';
import ParticipantManagementTab from '@/components/admin/ParticipantManagementTab';

type AdminTab = 'events' | 'participants';

export default function AdminPage() {
    const { darkMode, isMounted } = useDarkMode(true);
    const resolvedDarkMode = isMounted ? darkMode : false;
    const [role, setRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTab>('events');

    useEffect(() => {
        const loadRole = async () => {
            setIsRoleLoading(true);
            try {
                const me = await getMe();
                setRole(me.role?.toLowerCase() ?? null);
            } catch {
                setRole(null);
            } finally {
                setIsRoleLoading(false);
            }
        };

        void loadRole();
    }, []);

    const shellStyle = useMemo(
        () => ({
            color: resolvedDarkMode ? undefined : '#1e0a3c',
        }),
        [resolvedDarkMode]
    );

    const tabButtonStyle = (selected: boolean) => ({
        background: selected
            ? resolvedDarkMode
                ? 'linear-gradient(90deg, #6d28d9, #4338ca)'
                : 'linear-gradient(90deg, #8b5cf6, #6366f1)'
            : 'transparent',
        color: selected ? '#ffffff' : resolvedDarkMode ? '#e9d5ff' : '#4c1d95',
        borderColor: selected ? 'transparent' : resolvedDarkMode ? 'rgba(255,255,255,0.08)' : '#e9d5ff',
    });

    if (!isRoleLoading && role !== 'admin') {
        return (
            <div className="min-h-screen" style={shellStyle}>
                {resolvedDarkMode ? (
                    <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#120426] via-[#1d0a3a] to-[#06000b]" />
                ) : (
                    <div className="fixed inset-0 -z-20" style={{ background: 'linear-gradient(140deg, #fff1f2, #fdf2ff, #eef2ff)' }} />
                )}
                <main className="relative z-10 min-h-screen pl-72">
                    <div className="px-4 md:px-8 py-10">
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
                                Role kamu bukan admin.
                            </p>
                        </section>
                    </div>
                </main>
            </div>
        );
    }

    if (isRoleLoading) {
        return (
            <div className="min-h-screen" style={shellStyle}>
                {resolvedDarkMode ? (
                    <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#120426] via-[#1d0a3a] to-[#06000b]" />
                ) : (
                    <div className="fixed inset-0 -z-20" style={{ background: 'linear-gradient(140deg, #fff1f2, #fdf2ff, #eef2ff)' }} />
                )}
                <main className="relative z-10 min-h-screen pl-72">
                    <div className="px-4 md:px-8 py-10">
                        <section
                            className="rounded-3xl border p-8 text-center"
                            style={{
                                background: resolvedDarkMode ? 'rgba(12,6,26,0.6)' : 'rgba(255,255,255,0.8)',
                                borderColor: resolvedDarkMode ? 'rgba(255,255,255,0.08)' : '#ede9fe',
                            }}
                        >
                            <p className="text-sm" style={{ color: resolvedDarkMode ? '#e9d5ff' : '#4c1d95' }}>
                                Memuat role admin...
                            </p>
                        </section>
                    </div>
                </main>
            </div>
        );
    }

    return (
            <div className="min-h-screen relative overflow-hidden" style={shellStyle}>
            {resolvedDarkMode ? (
                <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#120426] via-[#1d0a3a] to-[#06000b]" />
            ) : (
                <div className="fixed inset-0 -z-20" style={{ background: 'linear-gradient(140deg, #fff1f2, #fdf2ff, #eef2ff)' }} />
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

            <main className="relative z-10 min-h-screen pl-72">
                <aside
                    className="fixed left-0 top-0 z-20 flex h-screen w-72 flex-col overflow-y-auto border-r bg-white px-6 py-8"
                    style={{ borderColor: '#ece7f6' }}
                >
                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-80"
                        style={{ color: '#4c1d95' }}
                    >
                        <ArrowLeft size={16} />
                        Kembali ke Beranda
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-xl font-semibold" style={{ color: '#2d1b4e' }}>
                            Admin Panel
                        </h1>
                            <p className="mt-1 text-sm" style={{ color: '#6b21a8' }}>
                                Pilih modul.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('events')}
                                className="w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition"
                                style={tabButtonStyle(activeTab === 'events')}
                            >
                                Management Event
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('participants')}
                                className="w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition"
                                style={tabButtonStyle(activeTab === 'participants')}
                            >
                                Management Peserta
                            </button>
                        </div>
                </aside>

                <div className="min-h-screen px-4 md:px-8 py-10">
                    {activeTab === 'events' ? (
                        <EventManagementTab darkMode={resolvedDarkMode} />
                    ) : (
                        <ParticipantManagementTab darkMode={resolvedDarkMode} />
                    )}
                </div>
            </main>
        </div>
    );
}
