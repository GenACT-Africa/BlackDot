'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, ArrowRight } from 'lucide-react'
import type { Talent } from '@/types'

const GRADIENTS = [
  'from-purple-600 to-blue-600',
  'from-violet-600 to-pink-600',
  'from-blue-600 to-cyan-600',
  'from-pink-600 to-rose-600',
  'from-indigo-600 to-purple-600',
  'from-teal-600 to-blue-600',
]

export function TalentCard({ talent, index }: { talent: Talent; index: number }) {
  const initials = talent.name.split(' ').map((n) => n[0]).join('').toUpperCase()

  return (
    <Link href={`/talents/${talent.slug}`} className="group block" suppressHydrationWarning>
      <div className="glass rounded-2xl overflow-hidden border border-white/8 hover:border-purple-500/30 transition-all duration-300 hover:shadow-glow-purple-sm h-full">
        {/* Avatar */}
        <div className={`relative h-56 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} overflow-hidden`}>
          {talent.avatar_url ? (
            <Image
              src={talent.avatar_url}
              alt={talent.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-black text-white/15">{initials}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-1">
            {talent.roles.slice(0, 2).map((role) => (
              <span key={role} className="text-[10px] font-semibold text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                {role}
              </span>
            ))}
          </div>
          {talent.is_featured && (
            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-amber-500/30">
                Featured
              </span>
            </div>
          )}
        </div>

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
                onClick={(e) => e.stopPropagation()}
                className="text-white/30 hover:text-purple-400 transition-colors"
              >
                <Instagram size={14} />
              </a>
            )}
          </div>
          <p className="text-xs text-white/50 line-clamp-2 mb-4">{talent.bio}</p>
          <div className="flex flex-wrap gap-1.5">
            {talent.genres.slice(0, 4).map((genre) => (
              <span key={genre} className="text-[10px] text-purple-400/80 bg-purple-500/10 px-2 py-0.5 rounded-full">
                {genre}
              </span>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
            <span className="text-xs text-white/40">View profile</span>
            <ArrowRight size={14} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
