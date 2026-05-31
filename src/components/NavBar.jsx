'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
    const supabase = createClient()

    const [user, setUser] = useState(null)
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            setUser(user)
        }

        getUser()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        // Empty array ensures this listener mounts exactly ONCE per session lifecycle
        return () => subscription.unsubscribe()
    }, []) // <--- FIXED: Emptied dependency array to stop the cascading loop

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setShowProfileMenu(false)
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <span className="text-xl font-bold text-slate-900">
                            Aura-AI
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/">
                            <button className="navbar-link text-sm font-medium text-slate-700 hover:text-slate-900">
                                Home
                            </button>
                        </Link>

                        <Link href="/pricing">
                            <button className="navbar-link text-sm font-medium text-slate-700 hover:text-slate-900">
                                Pricing
                            </button>
                        </Link>

                        <Link href="/faq">
                            <button className="navbar-link text-sm font-medium text-slate-700 hover:text-slate-900">
                                FaQ
                            </button>
                        </Link>

                        <Link href="/about-us">
                            <button className="navbar-link text-sm font-medium text-slate-700 hover:text-slate-900">
                                About
                            </button>
                        </Link>

                        <Link href="/contact-us">
                            <button className="navbar-link text-sm font-medium text-slate-700 hover:text-slate-900">
                                Contact
                            </button>
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-300"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/signup"
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowProfileMenu(!showProfileMenu)
                                    }
                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300"
                                >
                                    {user.email
                                        ?.charAt(0)
                                        .toUpperCase() || 'U'}
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-slate-200 shadow-xl overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-200">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {user.user_metadata
                                                    ?.full_name || 'User'}
                                            </p>
                                            <p className="text-xs text-slate-600 truncate">
                                                {user.email}
                                            </p>
                                        </div>

                                        <Link
                                            href="/profile"
                                            className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                        >
                                            Profile Settings
                                        </Link>

                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                        >
                                            Dashboard
                                        </Link>

                                        <Link
                                            href="/billing"
                                            className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                        >
                                            Billing
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 border-t border-slate-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-300"
                    >
                        Home
                    </Link>

                    <Link
                        href="/about-us"
                        className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-300"
                    >
                        About
                    </Link>

                    <Link
                        href="/contact-us"
                        className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-300"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    )
}