'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PricingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const plans = [
    { name: 'FREE', price: '0', period: '/month', description: 'Perfect for trying Aura-AI', features: ['1 chatbot', '500 conversations/month', 'Basic analytics', 'Email support', 'Community access'], cta: 'Get Started', popular: false },
    { name: 'STARTER', price: billingPeriod === 'monthly' ? '29' : '290', period: '/month', description: 'For small businesses', features: ['5 chatbots', '10K conversations/month', 'Advanced analytics', 'Priority email support', 'Custom branding', 'API access'], cta: 'Start Free Trial', popular: false },
    { name: 'GROWTH', price: billingPeriod === 'monthly' ? '99' : '990', period: '/month', description: 'For growing teams', features: ['25 chatbots', '100K conversations/month', 'Real-time analytics', '24/7 phone & chat support', 'Advanced customization', 'Team collaboration', 'Integrations library'], cta: 'Start Free Trial', popular: true },
    { name: 'SCALE', price: 'Custom', period: '', description: 'For enterprise', features: ['Unlimited chatbots', 'Unlimited conversations', 'Custom analytics', 'Dedicated support team', 'White-label solution', 'Advanced security', 'Custom integrations'], cta: 'Contact Sales', popular: false },
  ]

  const faqs = [
    { question: 'Can I change my plan later?', answer: 'Yes! You can upgrade or downgrade your plan anytime. Changes take effect at your next billing cycle.' },
    { question: 'Do you offer annual billing discounts?', answer: 'Absolutely. Pay annually and save 20% on all plans. Contact our sales team for enterprise discounts.' },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and bank transfers for enterprise customers.' },
    { question: 'Is there a free trial?', answer: 'All paid plans include a 14-day free trial with full access to all features. No credit card required.' },
    { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time. No contracts, no hidden fees.' },
    { question: 'Do you offer refunds?', answer: 'We offer a 30-day money-back guarantee if you\'re not satisfied with our service.' },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .pricing-header { animation: ${isLoaded ? 'fadeInUp 0.8s ease-out' : 'none'} }
        .pricing-card { transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1); }
        .pricing-card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2); }
        .faq-item { transition: all 0.3s ease-out; }
      `}</style>


      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-br from-white via-slate-50 to-blue-50 px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="pricing-header mb-6 text-5xl md:text-6xl font-bold text-slate-900" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.1s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            Simple, Transparent Pricing
          </h1>
          <p className="pricing-header mb-8 text-xl text-slate-600" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.3s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            Choose the perfect plan for your business. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="pricing-header mb-12 inline-flex items-center gap-4 rounded-lg bg-slate-100 p-1" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.4s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            <button onClick={() => setBillingPeriod('monthly')} className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-600'}`}>
              Monthly
            </button>
            <button onClick={() => setBillingPeriod('annual')} className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${billingPeriod === 'annual' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-600'}`}>
              Annual <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">Save 20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative w-full bg-gradient-to-b from-blue-50 to-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card group relative rounded-2xl border transition-all duration-500 overflow-hidden ${plan.popular ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white lg:col-span-1 lg:scale-105' : 'border-slate-200 bg-white'}`} style={{ animation: isLoaded ? `slideUpFade 0.6s ease-out ${0.2 + index * 0.1}s forwards` : 'none', opacity: isLoaded ? 1 : 0 }}>
                <div className="h-1 w-full" style={{ background: plan.popular ? 'linear-gradient(90deg, #3b82f6, #0ea5e9)' : '#cbd5e1' }} />
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-bold text-white">Most Popular</div>}
                <div className="p-8">
                  <h3 className="mb-2 text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="mb-6 text-sm text-slate-600">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-slate-900">${plan.price}</span>
                    {plan.period && <span className="text-slate-600">{plan.period}</span>}
                  </div>
                  <button className={`w-full rounded-lg py-3 font-bold transition-all duration-300 mb-8 ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30' : 'border-2 border-slate-200 text-slate-900 hover:border-blue-300 hover:bg-blue-50'}`}>
                    {plan.cta}
                  </button>
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
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
          <div className="mt-12 text-center">
            <p className="text-slate-600">All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative w-full bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Find answers to common questions about our pricing and plans</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group faq-item border border-slate-200 rounded-lg hover:border-blue-300 transition-all duration-300">
                <summary className="flex cursor-pointer items-center justify-between bg-white px-6 py-4 font-semibold text-slate-900">
                  {faq.question}
                  <svg className="h-5 w-5 text-slate-600 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </summary>
                <div className="bg-slate-50 px-6 py-4 text-slate-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-white">Ready to get started?</h2>
          <p className="mb-8 text-lg text-blue-100">Join thousands of companies using Aura-AI to power their customer support.</p>
          <button className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            Start Your Free Trial Today
          </button>
        </div>
      </div>


    </>
  )
}
