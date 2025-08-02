'use client';

import React from 'react';

function TrustedBySection() {
  return (
    <section className="py-32 bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-black text-white mb-8">
            🔒 Secure, 🌐 Transparent, 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">⚡ Decentralized</span>
          </h2>
          <p className="text-2xl text-slate-300 leading-relaxed mb-16">
            Built on proven blockchain technology to ensure your data ownership is 
            transparent, immutable, and fully under your control. Join thousands of users 
            who trust Aegis Digital for their data sovereignty needs.
          </p>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 hover:scale-110 transition-all duration-500">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto mb-6 flex items-center justify-center">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">🛡️ Bank-Grade Security</h3>
                <p className="text-lg text-slate-300">Military-grade encryption and blockchain immutability protect your data</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 hover:scale-110 transition-all duration-500">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mx-auto mb-6 flex items-center justify-center">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">👁️ Full Transparency</h3>
                <p className="text-lg text-slate-300">Every action is recorded on-chain and publicly verifiable</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 hover:scale-110 transition-all duration-500">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-6 flex items-center justify-center">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">🌐 Truly Decentralized</h3>
                <p className="text-lg text-slate-300">No single point of failure, your data is distributed globally</p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:scale-105 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-white mb-2">24/7</div>
                <div className="text-lg text-slate-300">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">256-bit</div>
                <div className="text-lg text-slate-300">Encryption Standard</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">15K+</div>
                <div className="text-lg text-slate-300">Files Protected</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">99.9%</div>
                <div className="text-lg text-slate-300">Data Integrity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustedBySection;
