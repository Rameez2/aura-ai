'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', image: '👩‍💼', bio: 'AI researcher with 10+ years experience in NLP and chatbot development.' },
    { name: 'Michael Chen', role: 'CTO', image: '👨‍💻', bio: 'Full-stack engineer passionate about scalable AI infrastructure.' },
    { name: 'Emma Williams', role: 'Head of Product', image: '👩‍🔬', bio: 'Product strategist focused on delivering intuitive AI experiences.' },
    { name: 'James Park', role: 'Head of Sales', image: '👨‍🎓', bio: 'Enterprise software expert with a track record of hypergrowth.' },
  ]

  const values = [
    { icon: '🎯', title: 'Innovation First', description: 'We push boundaries to create cutting-edge AI solutions that matter.' },
    { icon: '🤝', title: 'Customer Obsessed', description: 'Your success is our mission. We listen, learn, and iterate relentlessly.' },
    { icon: '🔒', title: 'Trust & Security', description: 'Enterprise-grade security with GDPR, CCPA, and SOC 2 compliance.' },
    { icon: '🌱', title: 'Sustainable Growth', description: 'We build for the long term, prioritizing quality over quick wins.' },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .team-card { transition: all 0.4s ease-out; }
        .team-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15); }
      `}</style>


      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-br from-white via-slate-50 to-blue-50 px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold text-blue-600">About Aura-AI</p>
          <h1 className="mb-6 text-5xl md:text-6xl font-bold text-slate-900" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.1s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            Empowering Businesses with Intelligent AI
          </h1>
          <p className="mb-8 text-xl text-slate-600" style={{ animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.3s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
            We&apos;re on a mission to make advanced AI accessible to every business, regardless of size or technical expertise. Since 2022, we&apos;ve helped thousands of companies transform their customer support with intelligent chatbots.
          </p>
          <div className="grid grid-cols-3 gap-8 mx-auto max-w-2xl mt-16">
            <div style={{ animation: isLoaded ? 'slideUpFade 0.6s ease-out 0.4s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
              <p className="text-4xl font-bold text-blue-600">5K+</p>
              <p className="text-slate-600">Active Users</p>
            </div>
            <div style={{ animation: isLoaded ? 'slideUpFade 0.6s ease-out 0.5s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
              <p className="text-4xl font-bold text-blue-600">50M+</p>
              <p className="text-slate-600">Conversations</p>
            </div>
            <div style={{ animation: isLoaded ? 'slideUpFade 0.6s ease-out 0.6s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
              <p className="text-4xl font-bold text-blue-600">99.9%</p>
              <p className="text-slate-600">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="relative w-full bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div style={{ animation: isLoaded ? 'slideInLeft 0.8s ease-out 0.2s forwards' : 'none', opacity: isLoaded ? 1 : 0 }}>
              <div className="rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 p-8 aspect-square flex items-center justify-center text-7xl">
                🤖
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-3xl md:text-4xl font-bold text-slate-900">Our Story</h2>
              <p className="mb-4 text-slate-600 leading-relaxed">
                Aura-AI was founded when our CEO, Sarah Johnson, struggled to deploy a custom chatbot for her previous company. What should have taken days took months, and the solution cost a fortune.
              </p>
              <p className="mb-4 text-slate-600 leading-relaxed">
                She realized that powerful AI tools existed, but they were fragmented, expensive, and required deep technical knowledge to implement. So she set out to create something better.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Today, Aura-AI has become the go-to platform for businesses wanting to deploy intelligent chatbots without the complexity. We&apos;ve processed over 50 million conversations and serve customers across every industry imaginable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="relative w-full bg-gradient-to-b from-blue-50 to-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Our Core Values</h2>
            <p className="text-lg text-slate-600">What guides us every single day</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-white p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300" style={{ animation: isLoaded ? `slideUpFade 0.6s ease-out ${0.2 + index * 0.1}s forwards` : 'none', opacity: isLoaded ? 1 : 0 }}>
                <p className="mb-4 text-4xl">{value.icon}</p>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="relative w-full bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Meet Our Team</h2>
            <p className="text-lg text-slate-600">Talented people building the future of AI</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="team-card rounded-lg border border-slate-200 bg-white overflow-hidden" style={{ animation: isLoaded ? `slideUpFade 0.6s ease-out ${0.3 + index * 0.1}s forwards` : 'none', opacity: isLoaded ? 1 : 0 }}>
                <div className="flex items-center justify-center h-40 bg-gradient-to-br from-blue-100 to-blue-50 text-6xl">
                  {member.image}
                </div>
                <div className="p-6">
                  <h3 className="mb-1 text-lg font-bold text-slate-900">{member.name}</h3>
                  <p className="mb-4 text-sm font-semibold text-blue-600">{member.role}</p>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-white">Join us on our mission</h2>
          <p className="mb-8 text-lg text-blue-100">Be part of the AI revolution. Start building smarter chatbots today.</p>
          <button className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            Get Started Free
          </button>
        </div>
      </div>

    </>
  )
}
