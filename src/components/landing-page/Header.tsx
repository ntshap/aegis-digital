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
      <div className="container mx-auto max-w-6xl px-4">{/* Reduced max-width for better fit */}
        {/* Mobile Layout - Centered & Compact */}
        <div className="flex lg:hidden justify-center items-center py-3">
          <div className="flex items-center justify-between w-full max-w-md">
            {/* Logo - Compact */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 neubrutal-bg-yellow neubrutal-border neubrutal-shadow-light flex items-center justify-center">
                <Shield className="w-3 h-3 text-black" />
              </div>
              <span className="neubrutal-text-bold text-base whitespace-nowrap">
                AEGIS <span className="neubrutal-bg-pink px-1">DIGITAL</span>
              </span>
            </div>

            {/* Mobile Right Side - Compact */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block">
                <ConnectWalletButton />
              </div>
              <button
                onClick={toggleMenu}
                className="neubrutal-button text-xs p-2 flex-shrink-0"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Centered & Grouped */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-6">
              {/* Left Group: Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 neubrutal-bg-yellow neubrutal-border neubrutal-shadow-light flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black" />
                </div>
                <span className="neubrutal-text-bold text-2xl whitespace-nowrap">
                  AEGIS <span className="neubrutal-bg-pink px-2">DIGITAL</span>
                </span>
              </div>

              {/* Center Group: Navigation */}
              <div className="flex items-center">
                <ul className="flex items-center space-x-3">
                  <li>
                    <a href="#features" className="neubrutal-button-secondary text-sm whitespace-nowrap px-3 py-2">
                      FEATURES
                    </a>
                  </li>
                  <li>
                    <a href="#scanner" className="neubrutal-button-secondary text-sm whitespace-nowrap px-3 py-2">
                      SCANNER
                    </a>
                  </li>
                  <li>
                    <a href="#analytics" className="neubrutal-button-secondary text-sm whitespace-nowrap px-3 py-2">
                      ANALYTICS
                    </a>
                  </li>
                  <li>
                    <a href="#docs" className="neubrutal-button-secondary text-sm whitespace-nowrap px-3 py-2">
                      DOCS
                    </a>
                  </li>
                </ul>
              </div>

              {/* Right Group: Network & Wallet */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 neubrutal-bg-lime neubrutal-border neubrutal-shadow-light">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <Globe className="w-4 h-4 text-black" />
                  <span className="text-black font-bold text-sm whitespace-nowrap">LISK SEPOLIA</span>
                </div>
                <ConnectWalletButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Compact */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white neubrutal-border border-t-0 neubrutal-shadow z-40">
          <div className="container mx-auto px-4 py-4 space-y-3 max-w-md">
            {/* Network Status for Mobile */}
            <div className="flex items-center justify-center space-x-2 px-3 py-2 neubrutal-bg-lime neubrutal-border neubrutal-shadow-light">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <Globe className="w-4 h-4 text-black" />
              <span className="text-black font-bold text-sm">LISK SEPOLIA</span>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <a 
                href="#features" 
                className="block w-full neubrutal-button-secondary text-center text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FEATURES
              </a>
              <a 
                href="#scanner" 
                className="block w-full neubrutal-button-secondary text-center text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                SCANNER
              </a>
              <a 
                href="#analytics" 
                className="block w-full neubrutal-button-secondary text-center text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                ANALYTICS
              </a>
              <a 
                href="#docs" 
                className="block w-full neubrutal-button-secondary text-center text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                DOCS
              </a>
            </div>

            {/* Mobile Wallet Button (for very small screens) */}
            <div className="sm:hidden pt-3 border-t-2 border-black">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
