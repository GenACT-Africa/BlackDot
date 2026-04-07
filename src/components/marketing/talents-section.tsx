'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Instagram, Music } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import type { Talent } from '@/types'

// Placeholder talents for SSR/static rendering
const PLACEHOLDER_TALENTS: Talent[] = [
  {
    id: '1', name: 'Jay Kali', slug: 'jay-kali',
    roles: ['Producer', 'Sound Engineer'], bio: 'Multi-platinum producer. 10+ years crafting East African and Afrobeats hits.',
    avatar_url: null, cover_url: null, genres: ['Afrobeats', 'Bongo Flava', 'R&B'],
    is_featured: true, is_active: true, display_order: 1,
    instagram_url: null, soundcloud_url: null, spotify_url: null, youtube_url: null,
    profile_id: null, created_at: '',
  },
  {
    id: '2', name: 'Amira K.', slug: 'amira-k',
    roles: ['Songwriter', 'Vocal Producer'], bio: 'Award-winning songwriter with credits on chart-topping releases across Africa.',
    avatar_url: null, cover_url: null, genres: ['Pop', 'Soul', 'Gospel'],
    is_featured: true, is_active: true, display_order: 2,
    instagram_url: null, soundcloud_url: null, spotify_url: null, youtube_url: null,
    profile_id: null, created_at: '',
  },
  {
    id: '3', name: 'D-Wave', slug: 'd-wave',
    roles: ['Producer', 'Mix Engineer'], bio: 'Trap, drill, and Afro-fusion architect. Known for signature rolling 808s.',
    avatar_url: null, cover_url: null, genres: ['Trap', 'Drill', 'Afro-Fusion'],
    is_featured: true, is_active: true, display_order: 3,
    instagram_url: null, soundcloud_url: null, spotify_url: null, youtube_url: null,
    profile_id: null, created_at: '',
  },
]

function TalentCard({ talent, index }: { talent: Talent; index: number }) {
  const initials = talent.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const gradients = [
    'from-purple-600 to-blue-600',
    'from-violet-600 to-pink-600',
    'from-blue-600 to-cyan-600',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
    >
      <div className="group relative glass rounded-2xl overflow-hidden border border-white/8 hover:border-purple-500/30 transition-all duration-300 hover:shadow-glow-purple-sm">
        <Link href={`/talents/${talent.slug}`} className="absolute inset-0 z-10" aria-label={`View ${talent.name}'s profile`} />
        {/* Avatar */}
        <div className={`relative h-52 bg-gradient-to-br ${gradients[index % 3]} overflow-hidden`}>
          {talent.avatar_url ? (
            <Image
              src={talent.avatar_url}
              alt={talent.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-black text-white/20">{initials}</span>
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {/* Roles */}
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-1">
            {talent.roles.slice(0, 2).map((role) => (
              <span
                key={role}
                className="text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              {talent.name}
            </h3>
            {talent.instagram_url && (
              <a
                href={talent.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-20 text-white/30 hover:text-purple-400 transition-colors"
              >
                <Instagram size={14} />
              </a>
            )}
          </div>
          <p className="text-xs text-white/50 line-clamp-2 mb-3">{talent.bio}</p>
          {/* Genres */}
          <div className="flex flex-wrap gap-1">
            {talent.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-[10px] text-purple-400/80 bg-purple-500/10 px-2 py-0.5 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface TalentsSectionProps {
  talents?: Talent[]
}

export function TalentsSection({ talents = PLACEHOLDER_TALENTS }: TalentsSectionProps) {
  const displayed = talents.length > 0 ? talents : PLACEHOLDER_TALENTS

  return (
    <section className="py-24 bg-brand-black relative overflow-hidden">
      <div className="absolute -top-60 right-0 w-[500px] h-[500px] rounded-full bg-purple-900/8 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3">
              The Team
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              Meet the Producers
            </h2>
          </div>
          <ButtonLink href="/talents" variant="outline" className="group">
            All Talents
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </ButtonLink>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.slice(0, 3).map((talent, i) => (
            <TalentCard key={talent.id} talent={talent} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
