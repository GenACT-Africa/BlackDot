import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { TalentCard } from './talent-card'
import type { Talent } from '@/types'

export const metadata: Metadata = {
  title: 'Producers & Creators – Meet the Team',
  description: "Meet BlackDot Music's team of world-class music producers, sound engineers, and songwriters in Tanzania — the creative force behind East African and global hits.",
}

export default async function TalentsPage() {
  const supabase = await createClient()
  const { data: talents } = await supabase
    .from('talents')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const items: Talent[] = talents || [
    { id: '1', name: 'Jay Kali', slug: 'jay-kali', roles: ['Producer', 'Sound Engineer'], bio: 'Multi-platinum producer crafting East African and Afrobeats hits.', avatar_url: null, cover_url: null, genres: ['Afrobeats', 'Bongo Flava', 'R&B'], is_featured: true, is_active: true, display_order: 1, instagram_url: null, soundcloud_url: null, spotify_url: null, youtube_url: null, profile_id: null, created_at: '' },
    { id: '2', name: 'Amira K.', slug: 'amira-k', roles: ['Songwriter', 'Vocal Producer'], bio: 'Award-winning songwriter with credits across Africa.', avatar_url: null, cover_url: null, genres: ['Pop', 'Soul', 'Gospel'], is_featured: true, is_active: true, display_order: 2, instagram_url: null, soundcloud_url: null, spotify_url: null, youtube_url: null, profile_id: null, created_at: '' },
    { id: '3', name: 'D-Wave', slug: 'd-wave', roles: ['Producer', 'Mix Engineer'], bio: 'Trap, drill, and Afro-fusion architect.', avatar_url: null, cover_url: null, genres: ['Trap', 'Drill', 'Afro-Fusion'], is_featured: true, is_active: true, display_order: 3, instagram_url: null, soundcloud_url: null, spotify_url: null, youtube_url: null, profile_id: null, created_at: '' },
  ]

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-50" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">The Team</p>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-5">
            Music Producers &amp; Creators
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            The talent behind your sound — each one handpicked for their craft, versatility, and vision.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((talent, i) => (
            <TalentCard key={talent.id} talent={talent} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <p className="text-white/50 mb-4 text-lg">Ready to work with the best?</p>
          <Link href="/book">
            <Button size="lg" glow className="group">
              Book a Session
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
