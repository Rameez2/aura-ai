'use client'

import { useState, useEffect, useRef } from 'react'

export default function Page() {

  const [isLoaded, setIsLoaded] = useState(false)
  const [visibleIndexes, setVisibleIndexes] = useState(new Set())
  const [visibleCards, setVisibleCards] = useState(new Set())
  const cardRefs = useRef([])
  const pricingRefs = useRef([])

  useEffect(() => {
    setIsLoaded(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target)
          if (entry.isIntersecting && index !== -1) {
            setVisibleIndexes((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.1 }
    )

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = pricingRefs.current.indexOf(entry.target)
          if (entry.isIntersecting && index !== -1) {
            setVisibleCards((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.2 }
    )

    pricingRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const features = [
    { icon: '⚡', title: 'Lightning Fast Setup', description: 'Create a custom chatbot in minutes, not weeks. Upload your business details once.', color: 'blue' },
    { icon: '🧠', title: 'Intelligent AI Engine', description: 'Advanced machine learning ensures your chatbot understands context perfectly.', color: 'indigo' },
    { icon: '📊', title: 'Real-Time Analytics', description: 'Track conversations, sentiment, and customer satisfaction with detailed insights.', color: 'blue' },
    { icon: '🔒', title: 'Enterprise Security', description: 'Bank-level encryption with GDPR, CCPA, and SOC 2 compliance.', color: 'slate' },
    { icon: '🌍', title: 'Multi-Language Support', description: 'Serve customers globally with 50+ languages built-in.', color: 'blue' },
    { icon: '🔗', title: 'Seamless Integration', description: 'Connect to Slack, Teams, WhatsApp, and 100+ platforms instantly.', color: 'indigo' },
  ]

  const plans = [
    { name: 'FREE', price: '0', description: 'Perfect for trying Aura-AI', features: ['1 chatbot', '500 conversations/month', 'Basic analytics', 'Email support', 'Community access'], cta: 'Get Started', popular: false },
    { name: 'STARTER', price: '29', description: 'For small businesses', features: ['5 chatbots', '10K conversations/month', 'Advanced analytics', 'Priority email support', 'Custom branding', 'API access'], cta: 'Start Free Trial', popular: false },
    { name: 'GROWTH', price: '99', description: 'For growing teams', features: ['25 chatbots', '100K conversations/month', 'Real-time analytics & reporting', '24/7 phone & chat support', 'Advanced customization', 'Team collaboration', 'Integrations library', 'Custom domains'], cta: 'Start Free Trial', popular: true },
    { name: 'SCALE', price: 'Custom', description: 'For enterprise', features: ['Unlimited chatbots', 'Unlimited conversations', 'Custom analytics', 'Dedicated support team', 'White-label solution', 'Advanced security', 'Custom integrations', 'SLA guarantee'], cta: 'Contact Sales', popular: false },
  ]



  return (
    <>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(40px) translateX(20px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .navbar-link { transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1); position: relative; }
        .navbar-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background: #3b82f6; transition: width 0.3s ease-out; }
        .navbar-link:hover::after { width: 100%; }
        .feature-card { transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1); }
        .feature-card.visible { animation: slideUpFade 0.6s ease-out forwards; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15); }
        .pricing-card { transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1); }
        .pricing-card.visible { animation: slideUpFade 0.6s ease-out forwards; }
        .pricing-card.popular { animation: scaleIn 0.6s ease-out forwards; }
        .pricing-card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2); }
        .step-card { transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1); }
        .step-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15); }
        .pulse-dot { animation: pulse 2s ease-in-out infinite; }
        .footer-section { animation: ${isLoaded ? 'fadeInUp' : 'none'} 0.6s ease-out forwards; }
      `}</style>

      

      {/* HERO */}
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 pt-24 pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-64 -right-64 h-96 w-96 rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', animation: 'float 25s ease-in-out infinite' }} />
          <div className="absolute -bottom-64 -left-64 h-96 w-96 rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #1e40af, transparent)', animation: 'float 30s ease-in-out infinite reverse' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center px-6">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700" style={{ animation: isLoaded ? 'slideInDown 0.6s ease-out' : 'none' }}>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Trusted AI-Powered Solution
          </div>

          <h1 className="mb-6 max-w-4xl text-center text-5xl font-bold leading-tight text-slate-900 md:text-6xl lg:text-7xl" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.1s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            Create Intelligent Chatbots <span className="text-blue-600">in Minutes</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-600" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.3s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            Upload your business details and let Aura-AI generate custom chatbots. Deploy intelligent customer support 24/7 with advanced AI technology.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.5s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40">Start Free Trial</button>
            <button className="inline-flex items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-white px-8 py-4 font-semibold text-slate-900 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50">
              Watch Demo
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>

          <div className="mt-20 flex flex-col items-center gap-8" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.7s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            <p className="text-sm font-semibold text-slate-500">TRUSTED BY LEADING COMPANIES</p>
            <div className="flex flex-wrap justify-center gap-8">
              {[{ name: 'TechCorp' }, { name: 'RetailMax' }, { name: 'SaaS Pro' }, { name: 'ServiceHub' }].map((company) => (
                <div key={company.name} className="flex h-12 w-28 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50">
                  <span className="text-xs font-bold text-slate-700">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="relative w-full bg-gradient-to-b from-blue-50 via-white to-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">Everything You Need to Succeed</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">Powerful features designed for businesses that want to deliver exceptional customer experiences.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} ref={(el) => { cardRefs.current[index] = el }} className={`feature-card group relative rounded-xl border border-slate-200 bg-white p-8 transition-all duration-300 ${visibleIndexes.has(index) ? 'visible' : ''}`} style={{ transitionDelay: `${index * 0.08}s` }}>
                <div className="absolute top-0 left-0 h-1 rounded-t-xl" style={{ width: '100%', background: feature.color === 'blue' ? '#3b82f6' : '#4f46e5' }} />
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg text-2xl" style={{ background: feature.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(79, 70, 229, 0.1)' }}>
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROCESS TIMELINE */}
      <div className="relative w-full bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">Your Journey to AI Success</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">Three simple steps to create and deploy your intelligent chatbot</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: '📋', title: 'Upload Your Details', desc: 'Share your business information. Our system instantly processes and understands your unique requirements.' },
              { icon: '⚡', title: 'Train & Customize', desc: 'Our AI learns from your business context. Fine-tune responses and behavior with our intuitive interface.' },
              { icon: '🚀', title: 'Deploy & Scale', desc: 'Launch your chatbot instantly. Monitor performance and scale seamlessly as your customer base grows.' },
            ].map((step, index) => (
              <div key={index} className="relative" style={{ animation: isLoaded ? `fadeInUp 0.8s ease-out ${0.2 + index * 0.2}s forwards` : 'none', opacity: isLoaded ? 1 : 0 }}>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative" style={{ animation: isLoaded ? `scaleUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.1 + index * 0.2}s forwards` : 'none', opacity: isLoaded ? 1 : 0 }}>
                    <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-600">
                      <span className="text-3xl">{step.icon}</span>
                    </div>
                    <div className="pulse-dot absolute top-0 right-0 h-3 w-3 rounded-full bg-blue-600" />
                  </div>
                  <div className="step-card relative rounded-lg bg-white p-6 border border-slate-200 shadow-sm">
                    <h3 className="mb-2 text-xl font-bold text-slate-900">{step.title}</h3>
                    <p className="text-sm text-slate-600">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40">
              Get Started Now
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
            <p className="mt-4 text-sm text-slate-600">No credit card required. Start your free trial today.</p>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div className="relative w-full bg-gradient-to-br from-white via-blue-50 to-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">Simple, Transparent Pricing</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">Choose the perfect plan for your business. No hidden fees, cancel anytime.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
            {plans.map((plan, index) => (
              <div key={index} ref={(el) => { pricingRefs.current[index] = el }} className={`pricing-card group relative rounded-2xl border transition-all duration-500 overflow-hidden ${visibleCards.has(index) ? 'visible' : ''} ${plan.popular ? 'popular border-blue-300 bg-gradient-to-br from-blue-50 to-white lg:col-span-1 lg:scale-105' : 'border-slate-200 bg-white'}`} style={{ transitionDelay: `${index * 0.1}s` }}>
                <div className="h-1 w-full" style={{ background: plan.popular ? 'linear-gradient(90deg, #3b82f6, #0ea5e9)' : '#cbd5e1' }} />
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-bold text-white">Most Popular</div>}
                <div className="p-8">
                  <h3 className="mb-2 text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="mb-6 text-sm text-slate-600">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-slate-900">${plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-slate-600">/month</span>}
                  </div>
                  <button className={`w-full rounded-lg py-3 font-bold transition-all duration-300 mb-8 ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30' : 'border-2 border-slate-200 text-slate-900 hover:border-blue-300 hover:bg-blue-50'}`}>
                    {plan.cta}
                  </button>
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3" style={{ animation: visibleCards.has(index) ? `slideUpFade 0.6s ease-out ${0.1 + featureIndex * 0.05}s forwards` : 'none', opacity: visibleCards.has(index) ? 1 : 0 }}>
                        <svg className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-blue-600' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-600">All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </div>

      
    </>
  )
}
