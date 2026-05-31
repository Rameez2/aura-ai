import React from 'react';

const Footer = () => {

  const footerLinks = {
    Product: ['Features', 'Pricing', 'Security', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Resources: ['Documentation', 'API', 'Support', 'Community'],
    Legal: ['Privacy', 'Terms', 'Cookies', 'License'],
  }

    return (
      <footer className="relative w-full border-t border-slate-200 bg-slate-900 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-5">
            <div className="footer-section md:col-span-1">
              <h3 className="mb-4 text-xl font-bold text-blue-400">Aura-AI</h3>
              <p className="text-sm text-slate-400">Empower your business with intelligent chatbots that understand your customers.</p>
              <div className="mt-6 flex gap-4">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                  <button key={social} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-all duration-300 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-500/10">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-10-10z" /></svg>
                  </button>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([category, links], index) => (
              <div key={category} className="footer-section" style={{ animationDelay: `${0.1 + index * 0.1}s`, opacity: isLoaded ? 1 : 0 }}>
                <h4 className="mb-6 font-bold text-white">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <button className="text-sm text-slate-400 transition-colors duration-300 hover:text-blue-400">{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="my-12 h-px bg-slate-700" />

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-slate-500">© 2024 Aura-AI. All rights reserved.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
              <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40">Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    );
}

export default Footer;
