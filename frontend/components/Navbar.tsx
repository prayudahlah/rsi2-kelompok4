'use client';

import { motion } from 'framer-motion';
import { House } from 'lucide-react';
import Link from 'next/link';

type NavbarLink = {
    href: string;
    label: string;
};

type NavbarProps = {
    darkMode: boolean;
    onToggleDarkMode: () => void;
    links?: NavbarLink[];
};

const defaultLinks: NavbarLink[] = [
    { href: '/about', label: 'Anggota' },
    { href: '/events', label: 'Management Events' },
];

export default function Navbar({ darkMode, onToggleDarkMode, links = defaultLinks }: NavbarProps) {
    return (
        <nav
            className="py-2 relative z-10 backdrop-blur-sm"
            style={{
                background: darkMode ? 'rgba(10,4,22,0.05)' : 'rgba(255,255,255,0.05)',
                borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(124,58,237,0.12)',
                boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.18)' : '0 10px 30px rgba(124,58,237,0.08)',
            }}
        >
            <div className="w-full px-8 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-lg font-semibold tracking-wide"
                        style={{ color: darkMode ? '#c084fc' : '#5b21b6' }}
                    >
                        <span
                            className="grid place-items-center w-9 h-9 rounded-full border"
                            style={{
                                borderColor: darkMode ? 'rgba(192,132,252,0.5)' : 'rgba(91,33,182,0.5)',
                                background: darkMode
                                    ? 'linear-gradient(140deg, rgba(76,29,149,0.4), rgba(12,74,110,0.4))'
                                    : 'linear-gradient(140deg, rgba(253,230,138,0.6), rgba(251,191,36,0.6))',
                            }}
                        >
                            <House size={18} />
                        </span>
                    </Link>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium hover:opacity-80 transition"
                            style={{ color: darkMode ? '#e9d5ff' : '#4c1d95' }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <button
                    onClick={onToggleDarkMode}
                    title="Toggle dark/light mode"
                    className="w-14 h-7 rounded-full relative focus:outline-none"
                    style={{
                        background: darkMode
                            ? 'linear-gradient(90deg,#4c1d95,#0c4a6e)'
                            : 'linear-gradient(90deg,#fde68a,#fbbf24)',
                    }}
                >
                    <motion.div
                        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-[11px]"
                        animate={{ x: darkMode ? 2 : 26 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                        {darkMode ? '🌙' : '☀️'}
                    </motion.div>
                </button>
            </div>
        </nav>
    );
}
