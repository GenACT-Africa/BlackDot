import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Book a Session',
  description: 'Book a professional recording session at BlackDot Music in minutes. Choose your services, pick a date, and start your project — studio or remote, worldwide.',
}

import { ArrowLeft } from 'lucide-react'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-black">
      {/* Background */}
      <div className="fixed inset-0 bg-hero-glow pointer-events-none opacity-40" />
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/8 bg-brand-black/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">B</span>
            </div>
            <span className="font-bold text-sm text-white hidden sm:block">BlackDot Music</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} />
            Cancel
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {children}
      </div>
    </div>
  )
}
