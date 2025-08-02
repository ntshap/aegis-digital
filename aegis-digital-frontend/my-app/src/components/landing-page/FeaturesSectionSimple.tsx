'use client';

import React from 'react';
import { Shield, Brain, Lock, Upload, Zap, FileCheck } from 'lucide-react';

export function FeaturesSectionSimple() {
  return (
    <section id="features" className="bg-gray-100 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="neubrutal-text-title text-3xl sm:text-4xl lg:text-5xl mb-4 lg:mb-6">
            WHY CHOOSE 
            <span className="neubrutal-bg-pink px-2 lg:px-4 block mt-1 lg:mt-2 inline-block">AEGIS DIGITAL?</span>
          </h2>
          <p className="text-lg lg:text-2xl text-black max-w-4xl mx-auto font-bold">
            Experience the future of data sovereignty with our neubrutalist approach
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          <div className="neubrutal-card p-6 lg:p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 neubrutal-bg-yellow neubrutal-border neubrutal-shadow-light mx-auto mb-4 lg:mb-6">
              <Upload className="w-8 h-8 lg:w-10 lg:h-10 text-black" />
            </div>
            <h3 className="neubrutal-text-bold text-xl lg:text-2xl mb-3 lg:mb-4">SECURE FILE UPLOAD</h3>
            <p className="text-black font-bold text-sm lg:text-base">
              Upload and register your files to IPFS and the Lisk Blockchain with military-grade security.
            </p>
          </div>
          
          <div className="neubrutal-card p-6 lg:p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 neubrutal-bg-cyan neubrutal-border neubrutal-shadow-light mx-auto mb-4 lg:mb-6">
              <Brain className="w-8 h-8 lg:w-10 lg:h-10 text-black" />
            </div>
            <h3 className="neubrutal-text-bold text-xl lg:text-2xl mb-3 lg:mb-4">AI CONTENT ANALYSIS</h3>
            <p className="text-black font-bold text-sm lg:text-base">
              Advanced AI analyzes your content for security vulnerabilities and authenticity verification.
            </p>
          </div>
          
          <div className="neubrutal-card p-6 lg:p-8 text-center hover:scale-105 transition-transform duration-300 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 neubrutal-bg-lime neubrutal-border neubrutal-shadow-light mx-auto mb-4 lg:mb-6">
              <Lock className="w-8 h-8 lg:w-10 lg:h-10 text-black" />
            </div>
            <h3 className="neubrutal-text-bold text-xl lg:text-2xl mb-3 lg:mb-4">GRANULAR ACCESS CONTROL</h3>
            <p className="text-black font-bold text-sm lg:text-base">
              Share or revoke access permissions to your files securely with blockchain-powered authentication.
            </p>
          </div>
        </div>

        {/* Additional Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mt-8 lg:mt-12">
          <div className="neubrutal-card p-6 lg:p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 neubrutal-bg-pink neubrutal-border">
                <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-black" />
              </div>
              <div className="text-right">
                <div className="text-2xl lg:text-3xl font-bold text-black">99.9%</div>
                <div className="text-xs lg:text-sm text-black font-bold">UPTIME</div>
              </div>
            </div>
            <h3 className="neubrutal-text-bold text-lg lg:text-xl mb-2 lg:mb-3">LIGHTNING FAST</h3>
            <p className="text-black font-bold text-sm lg:text-base">
              Instant file verification and blockchain registration with enterprise-grade performance.
            </p>
          </div>
          
          <div className="neubrutal-card p-6 lg:p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 neubrutal-bg-yellow neubrutal-border">
                <FileCheck className="w-6 h-6 lg:w-8 lg:h-8 text-black" />
              </div>
              <div className="text-right">
                <div className="text-2xl lg:text-3xl font-bold text-black">100%</div>
                <div className="text-xs lg:text-sm text-black font-bold">IMMUTABLE</div>
              </div>
            </div>
            <h3 className="neubrutal-text-bold text-lg lg:text-xl mb-2 lg:mb-3">PROOF OF OWNERSHIP</h3>
            <p className="text-black font-bold text-sm lg:text-base">
              Cryptographic proof of file ownership and integrity stored permanently on blockchain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
