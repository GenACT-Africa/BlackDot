import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      {/* Minimal header */}
      <header className="px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center shadow-glow-purple-sm">
            <span className="text-white font-black text-xs">B</span>
          </div>
          <span className="font-bold text-sm text-white">BlackDot Music</span>
        </Link>
        <Link href="/" className="text-xs text-white/40 hover:text-white transition-colors">
          ← Back to site
        </Link>
      </header>

      {/* Background */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-50" />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center p-4 py-12">
        {children}
      </div>
    </div>
  )
}
