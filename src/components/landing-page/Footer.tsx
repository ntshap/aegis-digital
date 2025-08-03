'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-slate-900 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Technology Stack */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">
            ⚡ Powered by <span className="gradient-text">Leading Technologies</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
            <div className="bento-card text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:scale-110 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mx-auto mb-4 flex items-center justify-center floating">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-blue-400 text-lg">Lisk</span>
            </div>
            <div className="bento-card text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 hover:scale-110 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mx-auto mb-4 flex items-center justify-center floating-delayed">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="font-bold text-purple-400 text-lg">IPFS</span>
            </div>
            <div className="bento-card text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 hover:scale-110 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 mx-auto mb-4 flex items-center justify-center floating">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-green-400 text-lg">FastAPI</span>
            </div>
            <div className="bento-card text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20 hover:scale-110 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 mx-auto mb-4 flex items-center justify-center floating-delayed">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="font-bold text-orange-400 text-lg">OpenZeppelin</span>
            </div>
            <div className="bento-card text-center p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20 hover:scale-110 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 mx-auto mb-4 flex items-center justify-center floating">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-cyan-400 text-lg">Next.js</span>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center floating">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 6V12C3 17.52 7.48 22 12 22C16.52 22 21 17.52 21 12V6L12 2Z" fill="white"/>
              </svg>
            </div>
            <div>
              <h2 className="text-4xl font-black text-white">
                Aegis <span className="gradient-text">Digital</span>
              </h2>
              <p className="text-slate-400 text-lg">Data sovereignty reimagined</p>
            </div>
          </div>

          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            🚀 Built with passion for the decentralized future. 
            <br />
            Empowering users with true data ownership since 2025.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white/10">📚 Documentation</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white/10">🐛 GitHub</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white/10">💬 Discord</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white/10">🐦 Twitter</a>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-slate-500 text-lg">
              © 2025 Aegis Digital. Built with 💜 for the Lisk ecosystem.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
