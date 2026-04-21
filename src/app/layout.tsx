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

const BASE_URL = 'https://www.theblackdotmusic.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BlackDot Music | World-Class Recording Studio in Dar es Salaam',
    template: '%s | BlackDot Music',
  },
  description:
    "BlackDot Music is Dar es Salaam's premier recording studio. Professional recording, mixing, mastering & beats production — in studio or anywhere in the world.",
  keywords: [
    // Brand variations
    'BlackDot Music', 'Black Dot Music', 'The BlackDot Music', 'BlackDot Music Studio',
    'Black Dot Music Studio', 'BlackDot Tanzania', 'Blackdot TZ', 'BDM Studio', 'BlackDotMusic',
    // Recording studio – Dar es Salaam
    'recording studio Dar es Salaam', 'music studio Dar es Salaam', 'best recording studio Dar es Salaam',
    'professional recording studio DSM', 'music production Dar es Salaam', 'beat studio Dar es Salaam',
    'studio ya muziki Dar es Salaam', 'studio ya kurekodi Dar es Salaam',
    // Recording studio – Tanzania
    'recording studio Tanzania', 'best music studio Tanzania', 'music production Tanzania',
    'professional studio Tanzania', 'Tanzania music studio', 'music recording Tanzania',
    'vocal recording Tanzania', 'studio za muziki Tanzania',
    // Services
    'mixing and mastering Tanzania', 'audio mixing Tanzania', 'audio mastering Tanzania',
    'music mixing Dar es Salaam', 'beats production Tanzania', 'beat making Tanzania',
    'sound engineering Tanzania', 'audio production Tanzania', 'remote recording Tanzania',
    'book recording studio Tanzania', 'studio session booking Tanzania',
    // Genre & local music
    'Bongo Flava studio', 'Afrobeats studio Tanzania', 'Afropop recording studio Tanzania',
    'East Africa music studio', 'East African music production', 'Swahili music studio',
    'gospel recording studio Tanzania', 'Tanzania hip hop studio', 'Tanzanian music producer',
    // Artist & talent
    'music talents Tanzania', 'Tanzania music artists', 'music label Tanzania',
    'independent music label Tanzania', 'artist development Tanzania',
    // Discovery
    'best music studio in Tanzania', 'top music producers Tanzania', 'number one studio Tanzania',
    'music studio near me Dar es Salaam', 'studio karibu na mimi Dar es Salaam',
  ],
  openGraph: {
    title: 'BlackDot Music | World-Class Recording Studio in Dar es Salaam',
    description: "BlackDot Music is Dar es Salaam's premier recording studio. Professional recording, mixing, mastering & beats production — in studio or anywhere in the world.",
    siteName: 'BlackDot Music',
    url: BASE_URL,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackDot Music | Recording Studio Dar es Salaam',
    description: "East Africa's premier recording studio — recording, mixing, mastering & beats production worldwide from Dar es Salaam, Tanzania.",
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

// ── JSON-LD Structured Data ────────────────────────────────────────────────────

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'BlackDot Music',
  alternateName: [
    'Black Dot Music', 'The BlackDot Music', 'BlackDot Music Studio',
    'BlackDot Tanzania', 'Blackdot TZ', 'BD Music', 'BDM Studio', 'BlackDotMusic',
  ],
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/blackdot-logo.png`,
  },
  description: "East Africa's premier recording studio in Dar es Salaam, Tanzania — recording, mixing, mastering, and beats production.",
  telephone: '+255766942121',
  email: 'bookings@theblackdotmusic.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dar es Salaam',
    addressRegion: 'Dar es Salaam',
    addressCountry: 'TZ',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+255-766-942-121',
    email: 'bookings@theblackdotmusic.com',
    contactType: 'customer service',
    availableLanguage: ['English', 'Swahili'],
  },
  sameAs: ['https://www.instagram.com/blackdot_tz'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'BlackDot Music',
  url: BASE_URL,
  publisher: { '@id': `${BASE_URL}/#organization` },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'BlackDot Music Recording Studio',
  alternateName: ['Black Dot Music Studio', 'BlackDot Music Tanzania', 'Blackdot TZ Studio'],
  description: "East Africa's premier recording studio in Dar es Salaam. Professional recording, mixing, mastering, beats production, and remote sessions worldwide.",
  url: BASE_URL,
  telephone: '+255766942121',
  email: 'bookings@theblackdotmusic.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dar es Salaam',
    addressRegion: 'Dar es Salaam',
    addressCountry: 'TZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -6.7924,
    longitude: 39.2083,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '22:00',
    },
  ],
  priceRange: 'TZS',
  currenciesAccepted: 'TZS',
  paymentAccepted: 'Cash, Mobile Money',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Recording Studio Services Tanzania',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Studio Recording Session', description: 'Professional in-studio recording in Dar es Salaam, Tanzania' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Remote Recording Session', description: 'Remote recording sessions available worldwide' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Beats Production', description: 'Custom beat production — Afrobeats, Bongo Flava, Hip Hop, R&B, Gospel' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mixing & Mastering', description: 'Professional audio mixing and mastering for streaming platforms' } },
    ],
  },
  areaServed: [
    { '@type': 'City', name: 'Dar es Salaam' },
    { '@type': 'Country', name: 'Tanzania' },
    { '@type': 'Place', name: 'East Africa' },
  ],
  knowsAbout: [
    'Music Production', 'Audio Recording', 'Mixing', 'Mastering', 'Beats Production',
    'Afrobeats', 'Bongo Flava', 'Hip Hop', "R'n'B", 'Gospel', 'Sound Engineering',
    'Music Studio Tanzania', 'Recording Studio Dar es Salaam',
  ],
}

const siteNavigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'BlackDot Music Site Navigation',
  itemListElement: [
    { '@type': 'SiteNavigationElement', position: 1, name: 'Home', url: `${BASE_URL}/` },
    { '@type': 'SiteNavigationElement', position: 2, name: 'About', url: `${BASE_URL}/about` },
    { '@type': 'SiteNavigationElement', position: 3, name: 'Services', url: `${BASE_URL}/services` },
    { '@type': 'SiteNavigationElement', position: 4, name: 'Talents', url: `${BASE_URL}/talents` },
    { '@type': 'SiteNavigationElement', position: 5, name: 'Projects', url: `${BASE_URL}/projects` },
    { '@type': 'SiteNavigationElement', position: 6, name: 'Book a Session', url: `${BASE_URL}/book` },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }} />
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
