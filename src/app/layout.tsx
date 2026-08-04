import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PotholeHofile | Kasba (854330) Road Defects & AI Meme Feed',
  description: 'Mobile-first zero-login AI civic tech platform for Kasba (PIN: 854330). Instagram Reels style vertical road roast feed with live AR camera scanner.',
  applicationName: 'PotholeHofile',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PotholeHofile',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#090a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0f] text-slate-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
