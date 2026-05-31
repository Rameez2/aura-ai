'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .floating-404 { animation: float 6s ease-in-out infinite; }
        .pulse-dot { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {/* 404 Content */}
      <div className="relative w-full min-h-[calc(100vh-73px)] bg-gradient-to-br from-white via-slate-50 to-blue-50 flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', animation: 'float 25s ease-in-out infinite' }} />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #1e40af, transparent)', animation: 'float 30s ease-in-out infinite reverse' }} />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* Animated 404 */}
          <div className="mb-8 floating-404">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-4">
                <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">4</span>
                <div className="relative">
                  <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">0</div>
                  <div className="pulse-dot absolute top-8 right-0 h-4 w-4 rounded-full bg-blue-600" />
                </div>
                <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">4</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.2s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            <h1 className="mb-4 text-4xl md:text-5xl font-bold text-slate-900">Page Not Found</h1>
            <p className="mb-8 text-lg text-slate-600 leading-relaxed">
              Oops! It seems like you&apos;ve ventured into uncharted territory. The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.4s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl transition-all duration-300">
              Go Back Home
            </Link>
            <Link href="/contact-us" className="inline-flex items-center justify-center rounded-lg border-2 border-slate-200 bg-white px-8 py-4 font-semibold text-slate-900 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
              Contact Support
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-16 pt-16 border-t border-slate-200">
            <p className="mb-8 text-sm font-semibold text-slate-600 uppercase">Here are some helpful links:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Login', href: '/login' },
                { label: 'Sign Up', href: '/signup' },
                { label: 'Documentation', href: '/documentation' },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors duration-300 font-medium text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Fun Message */}
          <div className="mt-16 rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 border border-slate-200 p-8" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.6s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            <p className="text-sm text-slate-600">
              <span className="text-2xl">🤖</span> Don&apos;t worry! Our AI chatbots won&apos;t let you get lost next time. They&apos;ll help you find exactly what you need!
            </p>
          </div>
        </div>
      </div>

    </>
  )
}
