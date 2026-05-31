'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Thank you for your message! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }

  const contactMethods = [
    { icon: '✉️', title: 'Email', description: 'support@aura-ai.com', link: 'mailto:support@aura-ai.com' },
    { icon: '💬', title: 'Live Chat', description: 'Available 24/7', link: '#' },
    { icon: '📞', title: 'Phone', description: '+1 (555) 123-4567', link: 'tel:+15551234567' },
    { icon: '🏢', title: 'Office', description: 'San Francisco, CA', link: '#' },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        input, textarea { transition: all 0.3s ease-out; }
        input:focus, textarea:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
      `}</style>

      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-br from-white via-slate-50 to-blue-50 px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl md:text-6xl font-bold text-slate-900" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.1s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.3s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            Have a question or feedback? We&apos;d love to hear from you. Get in touch with our team.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="relative w-full bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <a key={index} href={method.link} className="group rounded-lg border border-slate-200 bg-white p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-center" style={{ animation: isLoaded ? `slideUpFade 0.6s ease-out ${0.2 + index * 0.1}s forwards` : 'none', opacity: isLoaded ? 1 : 0 }}>
                <p className="mb-4 text-4xl">{method.icon}</p>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{method.title}</h3>
                <p className="text-slate-600">{method.description}</p>
              </a>
            ))}
          </div>

          {/* Form Section */}
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-900">Send us a Message</h2>
              <p className="text-lg text-slate-600">We typically respond within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" required className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more about your inquiry..." rows="6" required className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 transition-all duration-300">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              <p className="text-center text-sm text-slate-600">
                By submitting this form, you agree to our <button className="text-blue-600 hover:underline">Terms of Service</button> and <button className="text-blue-600 hover:underline">Privacy Policy</button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative w-full bg-gradient-to-b from-blue-50 to-white px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Quick Answers</h2>
            <p className="text-lg text-slate-600">Find answers to common questions</p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'What is the average response time?', a: 'Our support team responds to emails within 24 hours. For urgent issues, use our live chat available 24/7.' },
              { q: 'Do you offer phone support?', a: 'Yes! Phone support is available for our GROWTH and SCALE plan customers during business hours.' },
              { q: 'Can I schedule a demo?', a: 'Absolutely! Click on "Schedule Demo" or reply to any email and we\'ll find a time that works for you.' },
              { q: 'Is there a knowledge base?', a: 'Yes, our comprehensive documentation and tutorials are available at docs.aura-ai.com.' },
            ].map((item, index) => (
              <details key={index} className="group border border-slate-200 rounded-lg hover:border-blue-300 transition-all duration-300">
                <summary className="flex cursor-pointer items-center justify-between bg-white px-6 py-4 font-semibold text-slate-900">
                  {item.q}
                  <svg className="h-5 w-5 text-slate-600 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </summary>
                <div className="bg-slate-50 px-6 py-4 text-slate-600">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

    </>
  )
}
