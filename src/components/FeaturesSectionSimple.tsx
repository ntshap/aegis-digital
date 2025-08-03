import { Upload, Shield, Zap } from 'lucide-react';

export function FeaturesSectionSimple() {
  return (
    <section className="bg-gray-100 py-24 relative overflow-hidden">
      {/* Neubrutalism background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 neubrutal-bg-yellow neubrutal-border neubrutal-shadow rotate-12"></div>
        <div className="absolute top-20 right-20 w-16 h-16 neubrutal-bg-pink neubrutal-border neubrutal-shadow -rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 neubrutal-bg-cyan neubrutal-border neubrutal-shadow rotate-45"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 neubrutal-bg-lime neubrutal-border neubrutal-shadow -rotate-45"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="neubrutal-text-title text-5xl md:text-6xl mb-6">
            WHY CHOOSE <span className="neubrutal-bg-yellow px-4">AEGIS DIGITAL?</span>
          </h2>
          <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed font-bold">
            Experience the future of decentralized file management with cutting-edge blockchain technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="neubrutal-card p-8 text-center hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center w-20 h-20 neubrutal-bg-yellow neubrutal-border neubrutal-shadow mx-auto mb-8">
              <Upload className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">SECURE FILE UPLOAD</h3>
            <p className="text-black font-medium leading-relaxed">
              Upload and register your files to IPFS and the Lisk Blockchain.
            </p>
          </div>

          <div className="neubrutal-card p-8 text-center hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center w-20 h-20 neubrutal-bg-pink neubrutal-border neubrutal-shadow mx-auto mb-8">
              <Shield className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">DATA SOVEREIGNTY</h3>
            <p className="text-black font-medium leading-relaxed">
              Maintain complete control and ownership of your digital assets.
            </p>
          </div>

          <div className="neubrutal-card p-8 text-center hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center w-20 h-20 neubrutal-bg-cyan neubrutal-border neubrutal-shadow mx-auto mb-8">
              <Zap className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">AI VALIDATION</h3>
            <p className="text-black font-medium leading-relaxed">
              Advanced AI analysis ensures content authenticity and integrity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
