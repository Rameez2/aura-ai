'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function UserUsageDocumentation() {
  const [activeStep, setActiveStep] = useState('onboarding')
  const [copiedId, setCopiedId] = useState(false)

  const steps = [
    { id: 'onboarding', title: '1. Account Onboarding' },
    { id: 'knowledge', title: '2. Training Your Bot' },
    { id: 'iframe', title: '3. Embedding via Iframe' },
    { id: 'quotas', title: '4. Monitoring Token Quotas' }
  ]

  const iframeCode = `<iframe
  src="https://auraai.io/embed/your-chatbot-id"
  width="100%"
  height="600px"
  frameborder="0"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);"
  allow="microphone">
</iframe>`

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const scrollToStep = (id) => {
    setActiveStep(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navbar Context */}
        <header className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-lg font-bold font-mono text-slate-900 tracking-wider uppercase">Aura AI Knowledge Base</h1>
            <p className="text-xs text-slate-400 font-medium pt-0.5">TENANT INTEGRATION & USAGE GUIDE</p>
          </div>
          <Link href="/dashboard" className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition">
            ← TO DASHBOARD
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Side Step Index */}
          <aside className="md:col-span-1">
            <div className="sticky top-6 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
              <p className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest px-2 mb-2">Setup Milestones</p>
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => scrollToStep(step.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition font-medium ${
                    activeStep === step.id
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Core Content Flow */}
          <main className="md:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-12">
            
            {/* Step 1: Account Onboarding */}
            <section id="onboarding" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                1. Workspace Authentication & Account Onboarding
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you register your workspace profile, Aura AI provisions an isolated database instance configuration for your brand. Upon entry, navigate to your settings to configure your baseline profile metadata.
              </p>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
                <p>• Provide a distinct <strong>Business Name</strong> to brand client interactions inside your iframe window.</p>
                <p>• Verify your base plan metrics assigned on your billing summary card.</p>
              </div>
            </section>

            {/* Step 2: Training Your Bot */}
            <section id="knowledge" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                2. Syncing Knowledge Repositories
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                To train your conversational bot on your distinct business operational metrics, utilize the knowledge parameters on your main workspace control deck.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <span className="font-mono font-bold text-slate-800 block text-[11px] uppercase tracking-wide">Document Uploads</span>
                  <span className="text-[11px] text-slate-500 block pt-1">Attach PDFs, TXT, or markdown documentation up to your tier limit. Documents are parsed and indexed automatically into vector storage.</span>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <span className="font-mono font-bold text-slate-800 block text-[11px] uppercase tracking-wide">System Prompts</span>
                  <span className="text-[11px] text-slate-500 block pt-1">Inject custom behavior constraints (e.g., "Act as a formal customer success engineer for a web consultancy").</span>
                </div>
              </div>
            </section>

            {/* Step 3: Embedding via Iframe */}
            <section id="iframe" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                3. Deploying Web Widgets via Iframes
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                To embed your tailored AI chat instance right into your application layouts or customer portals, copy and include our native iframe snippet directly inside your site's codebase structure:
              </p>
              
              {/* Code Sandbox Wrapper */}
              <div className="relative border border-slate-200 rounded-xl bg-slate-900 p-4 font-mono text-[11px] text-slate-300 shadow-inner group">
                <button
                  onClick={handleCopy}
                  className="absolute right-3 top-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white text-[10px] text-slate-400 font-bold px-2 py-1 rounded transition uppercase"
                >
                  {copiedId ? 'Copied!' : 'Copy Snippet'}
                </button>
                <pre className="overflow-x-auto whitespace-pre">{iframeCode}</pre>
              </div>
            </section>

            {/* Step 4: Monitoring Token Quotas */}
            <section id="quotas" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                4. Monitoring Token Quotas & Volume Allowances
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every context window processing request generated by client interactions subtracts credits directly from your global profile allowance balance.
              </p>
              <div className="p-3 border border-amber-200 bg-amber-50/40 rounded-xl text-amber-900 text-xs flex gap-2">
                <span className="text-sm">⚠️</span>
                <p className="leading-relaxed">
                  <strong>Quota Exhaustion Warning:</strong> If your active balance hits 0, chat responses inside your embedded elements will pause automatically until your subscription refreshes or an upgrade parameters package is manually assigned.
                </p>
              </div>
            </section>

          </main>
        </div>

      </div>
    </div>
  )
}