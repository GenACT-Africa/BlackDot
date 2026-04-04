import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Play, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import type { Project } from '@/types'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Listen to projects produced and engineered at BlackDot Music.',
}

const GRADIENTS = [
  'from-purple-900/60 to-blue-900/40',
  'from-violet-900/60 to-pink-900/40',
  'from-blue-900/60 to-cyan-900/40',
  'from-indigo-900/60 to-purple-900/40',
]

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, talent:talents(name)')
    .eq('is_public', true)
    .order('delivered_at', { ascending: false })
    .limit(20)

  const items = projects || []

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-40" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Portfolio</p>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-5">Our Work</h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            A selection of productions, mixes, and sessions from the BlackDot catalog.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          /* Demo grid while empty */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`glass rounded-2xl overflow-hidden border border-white/8 group`}>
                <div className={`relative h-48 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <div
                        key={j}
                        className="w-1 rounded-full bg-white/20"
                        style={{ height: `${16 + Math.random() * 32}px` }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play size={18} className="text-white ml-1" />
                    </div>
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-sm font-bold text-white">Track {i + 1}</p>
                  <p className="text-xs text-white/40 mt-0.5">Coming soon</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((project: Project & { talent?: { name: string } | null }, i) => (
              <div key={project.id} className="glass rounded-2xl overflow-hidden border border-white/8 hover:border-purple-500/30 transition-all group">
                <div className={`relative h-48 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}>
                  {project.cover_art_url ? (
                    <Image
                      src={project.cover_art_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex gap-1">
                        {Array.from({ length: 10 }).map((_, j) => (
                          <div
                            key={j}
                            className="w-1 rounded-full bg-white/20"
                            style={{ height: `${16 + Math.random() * 32}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {project.genre && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        {project.genre}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-white mb-1">{project.title}</h3>
                  {project.talent && (
                    <p className="text-xs text-white/40">Produced by {(project.talent as any).name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-white/50 mb-4">Hear your sound here next.</p>
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
