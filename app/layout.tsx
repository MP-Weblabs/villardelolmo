import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CookieConsentProvider } from '@/lib/cookie-consent'
import { CookieBanner } from '@/components/cookie-banner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-display',
  weight: ['400', '500', '600', '700']
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'C.D. Unión Deportiva Villar del Olmo | Página Oficial',
  description: 'Página web oficial del C.D. Unión Deportiva Villar del Olmo. Fútbol base y amateur en el corazón de Madrid.',
  keywords: ['Villar del Olmo', 'fútbol', 'club deportivo', 'Madrid', 'fútbol base'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#2a4a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased overflow-x-hidden`}>
        <CookieConsentProvider>
          <div className="contents">
            {children}
          </div>
          <CookieBanner />
        </CookieConsentProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
