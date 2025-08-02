'use client';

import React, { useState } from 'react';
import { ConnectWalletButton } from '../ConnectWalletButton';
import { Shield, Globe, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white neubrutal-border border-t-0 border-l-0 border-r-0 sticky top-0 z-50">
      <nav className="container mx-auto max-w-7xl flex justify-between items-center py-4 lg:py-6 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 neubrutal-bg-yellow neubrutal-border neubrutal-shadow-light flex items-center justify-center">
            <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
          </div>
          <span className="neubrutal-text-bold text-xl lg:text-3xl">
            AEGIS <span className="neubrutal-bg-pink px-1 lg:px-2">DIGITAL</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex space-x-6">
          <li>
            <a href="#features" className="neubrutal-button-secondary text-sm">
              FEATURES
            </a>
          </li>
          <li>
            <a href="#scanner" className="neubrutal-button-secondary text-sm">
              SCANNER
            </a>
          </li>
          <li>
            <a href="#analytics" className="neubrutal-button-secondary text-sm">
              ANALYTICS
            </a>
          </li>
          <li>
            <a href="#documentation" className="neubrutal-button-secondary text-sm">
              DOCS
            </a>
          </li>
        </ul>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-3 px-4 py-2 neubrutal-bg-lime neubrutal-border neubrutal-shadow-light ml-16">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <Globe className="w-4 h-4 text-black" />
            <span className="text-black font-bold text-sm">LISK SEPOLIA</span>
          </div>
          <ConnectWalletButton />
        </div>

        {/* Mobile Menu Button and Wallet */}
        <div className="flex lg:hidden items-center space-x-3">
          <div className="hidden sm:block">
            <ConnectWalletButton />
          </div>
          <button
            onClick={toggleMenu}
            className="neubrutal-button text-sm p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white neubrutal-border border-t-0 neubrutal-shadow z-40">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {/* Network Status for Mobile */}
            <div className="flex items-center justify-center space-x-3 px-4 py-3 neubrutal-bg-lime neubrutal-border neubrutal-shadow-light">
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <Globe className="w-4 h-4 text-black" />
              <span className="text-black font-bold text-sm">LISK SEPOLIA</span>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <a 
                href="#features" 
                className="block w-full neubrutal-button-secondary text-center text-sm py-3"
                onClick={() => setIsMenuOpen(false)}
              >
                FEATURES
              </a>
              <a 
                href="#scanner" 
                className="block w-full neubrutal-button-secondary text-center text-sm py-3"
                onClick={() => setIsMenuOpen(false)}
              >
                SCANNER
              </a>
              <a 
                href="#analytics" 
                className="block w-full neubrutal-button-secondary text-center text-sm py-3"
                onClick={() => setIsMenuOpen(false)}
              >
                ANALYTICS
              </a>
              <a 
                href="#documentation" 
                className="block w-full neubrutal-button-secondary text-center text-sm py-3"
                onClick={() => setIsMenuOpen(false)}
              >
                DOCS
              </a>
            </div>

            {/* Mobile Wallet Button (for very small screens) */}
            <div className="sm:hidden pt-4 border-t-4 border-black">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
