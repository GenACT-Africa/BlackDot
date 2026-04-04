import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-glow opacity-40 pointer-events-none" />
      <div className="relative text-center">
        <p className="text-8xl font-black gradient-text mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-white/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button glow>
            <Home size={16} />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
