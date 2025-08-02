'use client';

import { Header } from '../components/landing-page/Header';
import HeroSection from '../components/landing-page/HeroSection';
import { FeaturesSectionSimple } from '../components/FeaturesSectionSimple';
import { FileUploadSection } from '../components/FileUploadSection';
import { FileListSection } from '../components/FileListSection';

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
