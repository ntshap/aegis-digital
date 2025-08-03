import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Aegis Digital - Secure File Management on Lisk',
  description: 'Decentralized file management with AI analysis and blockchain security',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
