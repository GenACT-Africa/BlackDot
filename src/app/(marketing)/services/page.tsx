import type { Metadata } from 'next'
import Link from 'next/link'
import { Mic, Globe, Music, SlidersHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react'
import { SERVICES } from '@/lib/constants/services'
import { formatTZS } from '@/lib/utils/currency'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Recording, mixing, mastering, and beats production. Premium studio services with world-class quality.',
}

const ICONS: Record<string, React.ReactNode> = {
  Mic: <Mic size={28} />,
  Globe: <Globe size={28} />,
  Music: <Music size={28} />,
  Sliders: <SlidersHorizontal size={28} />,
}

const FEATURES: Record<string, string[]> = {
  'recording-studio': [
    'Acoustically treated recording rooms',
    'Top-tier microphone selection (Neumann, AKG, Shure)',
    'Experienced recording engineer included',
    'Setup and mixdown preparation',
    'Real-time monitor mixing',
  ],
  'recording-remote': [
    'Studio-grade remote session tools',
    'Real-time engineer monitoring & feedback',
    'Low-latency collaboration software',
    'Session recording + stems delivery',
    'Available worldwide, any time zone',
  ],
  'beats-production': [
    'Custom beat to your references',
    'Up to 3 revision rounds included',
    'Full stems delivery (kick, bass, melody, etc.)',
    'Exclusive ownership on final payment',
    'Genre: Afrobeats, Bongo, Trap, R&B, Pop, and more',
  ],
  'mixing-mastering': [
    'Full stereo mix with spatial balance',
    'Dynamic and tonal control',
    'Streaming-optimised master (Spotify, Apple, YouTube)',
    'WAV + MP3 delivery',
    '2 revision rounds included',
  ],
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-24">
      {/* Hero */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-60" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">
            What We Offer
          </p>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-5">
            Studio-Grade Services
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Every service is engineered for the highest quality output — whether you&apos;re in Dar es Salaam or across the world.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {SERVICES.map((service, i) => (
          <div
            key={service.id}
            className="glass rounded-3xl p-8 sm:p-10 border border-white/8 hover:border-purple-500/20 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
              {/* Left */}
              <div className="flex-1">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-400 flex-shrink-0">
                    {ICONS[service.icon || 'Mic']}
                  </div>
                  <div>
                    {service.is_remote && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/15 rounded-full px-2 py-0.5 mb-2">
                        <Globe size={8} /> Remote Available
                      </span>
                    )}
                    <h2 className="text-2xl font-black text-white">{service.name}</h2>
                  </div>
                </div>

                <p className="text-white/60 leading-relaxed mb-6">
                  {service.long_desc || service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5">
                  {(FEATURES[service.slug] || []).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
                      <CheckCircle2 size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — pricing + CTA */}
              <div className="lg:w-72 flex-shrink-0">
                <div className="glass-purple rounded-2xl p-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3">
                    Starting From
                  </p>
                  <p className="text-4xl font-black gradient-text mb-1">
                    {formatTZS(service.price_tzs)}
                  </p>
                  <p className="text-sm text-white/40 mb-6">
                    per {service.billing_unit}
                  </p>
                  <Link href={`/book?service=${service.slug}`}>
                    <Button className="w-full group" glow>
                      Book Now
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <p className="text-xs text-white/30 mt-3">
                    Payment after confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-2xl mx-auto px-4 text-center mt-20">
        <h3 className="text-2xl font-bold text-white mb-3">
          Not sure which service fits?
        </h3>
        <p className="text-white/50 mb-6">
          Tell us about your project and we&apos;ll recommend the right package.
        </p>
        <Link href="/contact">
          <Button variant="secondary" size="lg">
            Talk to Us
          </Button>
        </Link>
      </div>
    </div>
  )
}
