import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';

// Force all routes to be dynamically rendered on every request
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CineWave - Unlimited Movies & Series Streaming',
  description: 'CineWave - Watch unlimited movies and series. Stream the best content in English and Bangla.',
  keywords: 'cinewave, movie, streaming, series, bangladesh, bangla',
  icons: { icon: '/favicon.ico' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#141414',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-cw-bg text-white antialiased min-h-screen">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
