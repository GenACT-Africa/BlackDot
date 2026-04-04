import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin, Globe, Award, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind BlackDot Music — East Africa\'s premier recording studio.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-black pt-24">
      {/* Hero */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-50" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">
              Our Story
            </p>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
              Built for the
              <br />
              <span className="gradient-text">New Era</span>
              <br />
              of Music.
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-6">
              BlackDot Music was founded with one vision: to give every artist — regardless of where
              they are in the world — access to world-class studio quality.
            </p>
            <p className="text-white/50 leading-relaxed mb-8">
              Based in Dar es Salaam, Tanzania, we combine East African musical soul with
              internationally recognized engineering standards. Our team has worked with artists
              from over 15 countries, producing music that competes on the global stage.
            </p>
            <Link href="/book">
              <Button size="lg" glow className="group">
                Start a Project
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="glass rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/5" />
              <div className="relative space-y-6">
                {[
                  { icon: MapPin, label: 'Based In', value: 'Dar es Salaam, Tanzania' },
                  { icon: Globe, label: 'Reach', value: '15+ Countries Served' },
                  { icon: Award, label: 'Experience', value: '10+ Years in Music' },
                  { icon: Users, label: 'Team', value: 'World-Class Engineers & Producers' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-semibold text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-brand-black-2 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Mission</p>
          <h2 className="text-4xl font-black text-white mb-6">
            We&apos;re Not Competing With Studios in Dar.
          </h2>
          <p className="text-xl text-white/60 leading-relaxed">
            We&apos;re competing with studios in London, online engineers on Fiverr, and global
            beat marketplaces. Our standard is global — and our price is accessible.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white">What Drives Us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Quality Without Compromise',
              body: 'Every track that leaves BlackDot is engineered to the highest international standard. No shortcuts.',
            },
            {
              title: 'Artists First',
              body: 'Your vision drives everything. We listen, adapt, and work until the sound is exactly right.',
            },
            {
              title: 'Transparent & Organized',
              body: 'Real-time project tracking, clear pricing, fast communication. You always know where your project stands.',
            },
          ].map((v) => (
            <div key={v.title} className="glass rounded-2xl p-7 hover:border-purple-500/20 transition-all border border-white/8">
              <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
