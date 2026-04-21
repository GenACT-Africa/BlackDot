import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'BlackDot Music | World-Class Recording Studio',
    template: '%s | BlackDot Music',
  },
  description:
    "BlackDot Music is Dar es Salaam's premier recording studio. Professional recording, mixing, mastering & beats production — in studio or anywhere in the world.",
  keywords: [
    'recording studio Dar es Salaam',
    'remote recording Tanzania',
    'mixing mastering Africa',
    'beats production',
    'online music studio',
    'BlackDot Music',
  ],
  openGraph: {
    title: 'BlackDot Music | World-Class Recording Studio',
    description: "BlackDot Music is Dar es Salaam's premier recording studio. Professional recording, mixing, mastering & beats production — in studio or anywhere in the world.",
    siteName: 'BlackDot Music',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackDot Music',
    description: "BlackDot Music is Dar es Salaam's premier recording studio — recording, mixing, mastering & beats production worldwide.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-brand-black text-white`}
        suppressHydrationWarning
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e1e',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#7C3AED',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
