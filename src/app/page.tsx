'use client';

import { Header } from '../components/landing-page/Header';
import HeroSection from '../components/landing-page/HeroSection';
import { FeaturesSectionSimple } from '../components/FeaturesSectionSimple';
import { FileUploadSection } from '../components/FileUploadSection';
import dynamic from 'next/dynamic';

// Dynamic import to avoid hydration issues
const FileListSection = dynamic(() => import('../components/FileListSection').then(mod => ({ default: mod.FileListSection })), {
  ssr: false,
  loading: () => (
    <section id="file-list" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          YOUR DIGITAL <span className="bg-cyan-400 text-black px-2">ASSET LIBRARY</span>
        </h2>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading your files...</p>
        </div>
      </div>
    </section>
  )
});

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <HeroSection />
      <FeaturesSectionSimple />
      <FileUploadSection />
      <FileListSection />
    </div>
  );
}
