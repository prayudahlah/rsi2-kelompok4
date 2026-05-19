'use client';

import { useCallback, useEffect, useState } from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearToken, getToken } from '@/lib/auth/token';
import { getMe } from '@/lib/api/auth';

type NavbarLink = {
    href: string;
    label: string;
    requiresAdmin?: boolean;
};

type NavbarProps = {
    darkMode: boolean;
    onToggleDarkMode: () => void;
    links?: NavbarLink[];
    isMounted?: boolean;
};

const defaultLinks: NavbarLink[] = [
    { href: '/about', label: 'Anggota' },
    { href: '/event-registration', label: 'Daftar Event' },
    { href: '/admin', label: 'Admin Panel', requiresAdmin: true },
];

export default function Navbar({ darkMode, onToggleDarkMode, links = defaultLinks, isMounted = true }: NavbarProps) {
    const [isLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const resolvedDarkMode = isMounted ? darkMode : false;

    const router = useRouter();

    const checkAuth = useCallback(() => {
        try {
            const token = getToken();
            const isLogged = !!token;
            setIsLogin(isLogged);
            if (!token) {
                setIsAdmin(false);
                return;
            }

            getMe()
                .then((me) => setIsAdmin(me.role?.toLowerCase() === 'admin'))
                .catch(() => setIsAdmin(false));
        } catch (e) {
            setIsLogin(false);
            setIsAdmin(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        const handleAuthChange = () => checkAuth();
        window.addEventListener('auth-changed', handleAuthChange);
        return () => window.removeEventListener('auth-changed', handleAuthChange);
    }, [checkAuth]);

    useEffect(() => {
        const handleLogout = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-logout]')) {
                setIsLoggingOut(true);
                if (typeof window !== 'undefined') {
                    clearToken();
                }
                router.push('/login');
            }
        };
        document.addEventListener('click', handleLogout);
        return () => document.removeEventListener('click', handleLogout);
    }, [setIsLoggingOut, router]);

    const visibleLinks = links.filter((link) => !link.requiresAdmin || isAdmin);

    return (
        <nav
            className="py-2 relative z-10 backdrop-blur-sm"
            style={{
                background: resolvedDarkMode ? 'rgba(10,4,22,0.05)' : 'rgba(255,255,255,0.05)',
                borderBottom: resolvedDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(124,58,237,0.12)',
                boxShadow: resolvedDarkMode ? '0 10px 30px rgba(0,0,0,0.18)' : '0 10px 30px rgba(124,58,237,0.08)',
            }}
        >
            <div className="w-full px-8 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <Link
                        href="/"
                        className="inline-flex items-center text-base font-extrabold tracking-[0.08em]"
                        style={{ color: resolvedDarkMode ? '#e9d5ff' : '#4c1d95' }}
                    >
                        BOARDIFY
                    </Link>

                    {visibleLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium hover:opacity-80 transition"
                            style={{ color: resolvedDarkMode ? '#e9d5ff' : '#4c1d95' }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onToggleDarkMode}
                        title="Toggle dark/light mode"
                        className="w-9 h-9 rounded-full grid place-items-center transition"
                        style={{
                            background: resolvedDarkMode ? 'rgba(124,58,237,0.18)' : 'rgba(237,233,254,0.9)',
                            color: resolvedDarkMode ? '#e9d5ff' : '#4c1d95',
                            border: resolvedDarkMode ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(124,58,237,0.2)',
                        }}
                    >
                        {resolvedDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <div
                        className="h-5 w-px"
                        style={{ background: resolvedDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(76,29,149,0.2)' }}
                    />

                    {!isMounted ? (
                        <div className="h-10 w-[170px]" style={{ visibility: 'hidden' }} />
                    ) : isLoggingOut ? (
                        <div className="h-10 w-[170px]" style={{ visibility: 'hidden' }} />
                    ) : isLogin ? (
                        <a
                            href="/login"
                            data-logout
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer"
                            style={{
                                color: '#ef4444',
                                background: resolvedDarkMode ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.1)',
                                border: resolvedDarkMode
                                    ? '1px solid rgba(239,68,68,0.3)'
                                    : '1px solid rgba(239,68,68,0.2)',
                                textDecoration: 'none',
                            }}
                        >
                            <LogOut size={16} />
                            Logout
                        </a>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/register"
                                className="rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                                style={{
                                    color: '#f8fafc',
                                    background: resolvedDarkMode
                                        ? 'linear-gradient(90deg, #6d28d9, #4338ca)'
                                        : 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                                    boxShadow: resolvedDarkMode
                                        ? '0 8px 20px rgba(124,58,237,0.25)'
                                        : '0 8px 18px rgba(99,102,241,0.2)',
                                }}
                            >
                                Daftar
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                                style={{
                                    color: resolvedDarkMode ? '#e9d5ff' : '#4c1d95',
                                    background: 'transparent',
                                    border: resolvedDarkMode
                                        ? '1px solid rgba(192,132,252,0.5)'
                                        : '1px solid rgba(124,58,237,0.4)',
                                }}
                            >
                                Masuk
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
