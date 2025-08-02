'use client';

import React from 'react';
import { ConnectWalletButton } from '../ConnectWalletButton';

export function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <nav className="container mx-auto max-w-7xl flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center floating">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 6V12C3 17.52 7.48 22 12 22C16.52 22 21 17.52 21 12V6L12 2Z" fill="white"/>
            </svg>
          </div>
          <span className="text-2xl font-black text-white">
            Aegis <span className="gradient-text">Digital</span>
          </span>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-lg font-semibold">
          <li><a href="#features" className="text-white/80 hover:text-white transition-all duration-300 relative group px-4 py-3 rounded-xl hover:bg-white/10">
            🚀 Features 
            <span className="absolute left-4 -bottom-1 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-[calc(100%-32px)] transition-all duration-300 rounded-full"></span>
          </a></li>
          <li><a href="#scanner" className="text-white/80 hover:text-white transition-all duration-300 relative group px-4 py-3 rounded-xl hover:bg-white/10">
            🔍 Scanner
            <span className="absolute left-4 -bottom-1 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-[calc(100%-32px)] transition-all duration-300 rounded-full"></span>
          </a></li>
          <li><a href="#analytics" className="text-white/80 hover:text-white transition-all duration-300 relative group px-4 py-3 rounded-xl hover:bg-white/10">
            📊 Analytics
            <span className="absolute left-4 -bottom-1 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-[calc(100%-32px)] transition-all duration-300 rounded-full"></span>
          </a></li>
          <li><a href="#documentation" className="text-white/80 hover:text-white transition-all duration-300 relative group px-4 py-3 rounded-xl hover:bg-white/10">
            📚 Docs
            <span className="absolute left-4 -bottom-1 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-[calc(100%-32px)] transition-all duration-300 rounded-full"></span>
          </a></li>
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-bold text-sm">🌐 Lisk Sepolia</span>
          </div>
          <ConnectWalletButton />
        </div>
      </nav>
    </header>
  );
}
