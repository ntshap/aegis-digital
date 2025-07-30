import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { FileUploadSection } from '../components/FileUploadSection';
import { FileListSection } from '../components/FileListSection';

export default function Home() {
      return (
        <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white">
          <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Aegis Digital
          </h1>
          <p className="text-xl mb-8 text-center text-gray-300 max-w-2xl">
            Penjaga Kedaulatan Diri Digital Anda. Dapatkan kembali kendali atas data Anda!
          </p>

          <div className="mb-12">
            <ConnectWalletButton />
          </div>

          <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-2xl space-y-10">
            <section>
              <h2 className="text-3xl font-bold mb-6 text-purple-300">Unggah & Kelola File Anda</h2>
              <FileUploadSection />
            </section>

            <section className="border-t border-gray-700 pt-10 mt-10">
              <h2 className="text-3xl font-bold mb-6 text-pink-300">Daftar & Kontrol Akses File</h2>
              <FileListSection />
            </section>
          </div>
        </main>
      );
    }
    