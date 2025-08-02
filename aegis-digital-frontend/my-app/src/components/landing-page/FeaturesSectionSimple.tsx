'use client';

import React from 'react';

export function FeaturesSectionSimple() {
  return (
    <section className="bg-slate-900 py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-white mb-6">
            Why Choose Aegis Digital?
          </h2>
          <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
            Experience the future of data sovereignty
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Secure File Upload</h3>
            <p>Upload and register your files to IPFS and the Lisk Blockchain.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">AI Content Analysis</h3>
            <p>Advanced AI analyzes your content for security vulnerabilities.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Granular Access Control</h3>
            <p>Share or revoke access permissions to your files securely.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
