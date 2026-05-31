'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: '1. Architecture Overview' },
    { id: 'database', title: '2. Database Blueprints' },
    { id: 'workflows', title: '3. Administrative Cascades' },
    { id: 'security', title: '4. Security Guardrails' },
    { id: 'matrix', title: '5. Sprint Deployment Matrix' }
  ]

  const scrollToSection = (id) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Node */}
        <header className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-lg font-bold font-mono text-slate-900 tracking-wider uppercase">Aura AI Core Spec</h1>
            <p className="text-xs text-slate-400 font-medium pt-0.5">INTERNAL SYSTEM COMPONENT REFERENCE</p>
          </div>
          <Link href="/admin/dashboard" className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition">
            ← BACK TO HUB
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sticky Left Navigation Index */}
          <aside className="md:col-span-1">
            <div className="sticky top-6 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
              <p className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest px-2 mb-2">Documentation Index</p>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition font-medium ${
                    activeSection === sec.id
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Informational Engine */}
          <main className="md:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-10">
            
            {/* Section 1: Overview */}
            <section id="overview" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                1. System Architecture Overview
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aura AI operates on a modern full-stack multi-tenant design utilizing <strong>Next.js (App Router)</strong> client components connected to a robust <strong>Supabase (PostgreSQL)</strong> cluster instance. 
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1.5 font-mono">
                <div className="flex gap-2"><strong>• Workspace Tenancy:</strong> Isolated structural workspaces calculated dynamically at runtime.</div>
                <div className="flex gap-2"><strong>• Interface Nodes:</strong> Built to seamlessly process direct multi-tenant iframes and WhatsApp gateway streams.</div>
                <div className="flex gap-2"><strong>• State Engine:</strong> Decoupled configuration architecture ensures system metrics stay persistent even with zero users.</div>
              </div>
            </section>

            {/* Section 2: Database Blueprint */}
            <section id="database" className="space-y-4 scroll-mt-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                2. Relational Database Tables
              </h2>
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 font-mono">A. Configuration Blueprints (`public.plans`)</p>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                        <th className="p-2.5 font-bold">Column</th>
                        <th className="p-2.5 font-bold">Type</th>
                        <th className="p-2.5 font-bold">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr><td className="p-2.5 font-bold text-slate-800">id</td><td className="p-2.5">text (PK)</td><td className="p-2.5">Unique tier identifier identifier slug (e.g., `free`, `growth`)</td></tr>
                      <tr><td className="p-2.5 font-bold text-slate-800">price</td><td className="p-2.5">numeric</td><td className="p-2.5">Base recurring tier subscription billing fee</td></tr>
                      <tr><td className="p-2.5 font-bold text-slate-800">tokens</td><td className="p-2.5">integer</td><td className="p-2.5">Global baseline maximum token allowance metrics</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 font-mono">B. Live Workspace States (`public.profiles`)</p>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
                        <th className="p-2.5 font-bold">Column</th>
                        <th className="p-2.5 font-bold">Type</th>
                        <th className="p-2.5 font-bold">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr><td className="p-2.5 font-bold text-slate-800">id</td><td className="p-2.5">uuid (PK)</td><td className="p-2.5">Matches Core Supabase Auth relational identifier</td></tr>
                      <tr><td className="p-2.5 font-bold text-slate-800">plan_tier</td><td className="p-2.5">text</td><td className="p-2.5">Points to explicit blueprint key string on `plans` table</td></tr>
                      <tr><td className="p-2.5 font-bold text-slate-800">token_allowance</td><td className="p-2.5">integer</td><td className="p-2.5">Live current balance of usable token credits</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 3: Workflows */}
            <section id="workflows" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                3. Administrative Sync Cascades
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                When modifying system resource metrics inside the core parameters editor view, the platform executes an atomic two-phased pipeline stream to ensure structural permanence:
              </p>
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-2 border border-slate-800 shadow-inner">
                <p className="text-blue-400 font-bold">// Execute dual-layer cascading writes to cloud database cluster</p>
                <p>1. Update baseline target model configuration matrix in <span className="text-emerald-400">"plans"</span> table.</p>
                <p>2. Push dynamic modifications to all active rows matching criteria inside <span className="text-emerald-400">"profiles"</span> table.</p>
                <p className="text-slate-400 text-[10px] pt-1">Result: Changes remain perfectly loaded on hard refreshing, regardless of total active user counts.</p>
              </div>
            </section>

            {/* Section 4: Security */}
            <section id="security" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                4. Operational Security Guardrails
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Security routes and direct administrative execution scopes utilize validation parameters:
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pl-4 list-disc font-mono">
                <li><strong className="text-slate-800">Role Verification:</strong> App-metadata claims check for specific <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600 font-bold">admin</code> flags.</li>
                <li><strong className="text-slate-800">Developer Backdoor Gate:</strong> Hardcoded developer authentication checks safely process critical root emails directly during network sync updates.</li>
                <li><strong className="text-slate-800">Deterministic Component Keys:</strong> Components are forced to compute state updates safely through compound reactive mapping keys to block loop anomalies.</li>
              </ul>
            </section>

            {/* Section 5: Matrix */}
            <section id="matrix" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                5. Current Feature Deployment Matrix
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 border border-emerald-200 bg-emerald-50/50 rounded-lg text-emerald-800">
                  <div className="font-bold uppercase text-[10px] tracking-wide text-emerald-600">TOKENS & PRICING</div>
                  <p className="text-[11px] pt-1 font-medium">Fully operational, synced dynamically via decoupled cloud structures.</p>
                </div>
                <div className="p-3 border border-blue-200 bg-blue-50/50 rounded-lg text-blue-800">
                  <div className="font-bold uppercase text-[10px] tracking-wide text-blue-600">CHATBOT PARAMETERS</div>
                  <p className="text-[11px] pt-1 font-medium">Temporarily frozen to safeguard scaling integrity for the next sprint iteration.</p>
                </div>
              </div>
            </section>

          </main>
        </div>

      </div>
    </div>
  )
}