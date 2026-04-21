'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ArrowRight, Music, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getYoutubeThumbnail, isYoutubeUrl } from '@/lib/utils/youtube'

type Project = {
  id: string
  title: string
  cover_art_url: string | null
  genre: string | null
  description: string | null    // artist name
  key_signature: string | null  // producer names
  delivered_at: string | null
}

const GRADIENTS = [
  'from-purple-900/60 to-blue-900/40',
  'from-violet-900/60 to-pink-900/40',
  'from-blue-900/60 to-cyan-900/40',
  'from-indigo-900/60 to-purple-900/40',
]

const DISPLAY_OPTIONS = [6, 12, 24]

function getYear(dateStr: string | null) {
  if (!dateStr) return null
  return new Date(dateStr).getFullYear().toString()
}

interface Props { projects: Project[] }

export function ProjectsClient({ projects }: Props) {
  const [filterGenre, setFilterGenre] = useState<string>('')
  const [filterProducer, setFilterProducer] = useState<string>('')
  const [filterYear, setFilterYear] = useState<string>('')
  const [displayCount, setDisplayCount] = useState(6)
  const [showAll, setShowAll] = useState(false)

  // Derive unique filter options from data
  const genres = useMemo(() => {
    const set = new Set<string>()
    projects.forEach(p => { if (p.genre) p.genre.split(',').forEach(g => set.add(g.trim())) })
    return Array.from(set).sort()
  }, [projects])

  const producers = useMemo(() => {
    const set = new Set<string>()
    projects.forEach(p => {
      if (p.key_signature) p.key_signature.split(',').forEach(n => set.add(n.trim()))
    })
    return Array.from(set).sort()
  }, [projects])

  const years = useMemo(() => {
    const set = new Set<string>()
    projects.forEach(p => { const y = getYear(p.delivered_at); if (y) set.add(y) })
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [projects])

  // Apply filters
  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (filterGenre && !p.genre?.toLowerCase().includes(filterGenre.toLowerCase())) return false
      if (filterProducer && !p.key_signature?.toLowerCase().includes(filterProducer.toLowerCase())) return false
      if (filterYear && getYear(p.delivered_at) !== filterYear) return false
      return true
    })
  }, [projects, filterGenre, filterProducer, filterYear])

  const activeFilters = [filterGenre, filterProducer, filterYear].filter(Boolean).length
  const visibleItems = showAll ? filtered : filtered.slice(0, displayCount)
  const hasMore = !showAll && filtered.length > displayCount

  const clearFilters = () => {
    setFilterGenre('')
    setFilterProducer('')
    setFilterYear('')
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-24">

      {/* Hero */}
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

        {/* ── Filter Bar ── */}
        {projects.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-8">

            {/* Genre */}
            <div className="relative">
              <select
                value={filterGenre}
                onChange={e => setFilterGenre(e.target.value)}
                className={`appearance-none glass rounded-xl px-4 py-2 pr-8 text-sm border transition-all cursor-pointer outline-none ${
                  filterGenre ? 'border-purple-500/50 text-white bg-purple-500/5' : 'border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                <option value="">All Genres</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>

            {/* Producer */}
            <div className="relative">
              <select
                value={filterProducer}
                onChange={e => setFilterProducer(e.target.value)}
                className={`appearance-none glass rounded-xl px-4 py-2 pr-8 text-sm border transition-all cursor-pointer outline-none ${
                  filterProducer ? 'border-purple-500/50 text-white bg-purple-500/5' : 'border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                <option value="">All Producers</option>
                {producers.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>

            {/* Year */}
            <div className="relative">
              <select
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                className={`appearance-none glass rounded-xl px-4 py-2 pr-8 text-sm border transition-all cursor-pointer outline-none ${
                  filterYear ? 'border-purple-500/50 text-white bg-purple-500/5' : 'border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>

            {/* Clear filters */}
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
              >
                <X size={12} />
                Clear {activeFilters > 1 ? `(${activeFilters})` : ''}
              </button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Display count — only when not "see all" */}
            {!showAll && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/60">Show</span>
                {DISPLAY_OPTIONS.map(n => (
                  <button
                    key={n}
                    onClick={() => setDisplayCount(n)}
                    aria-label={`Show ${n} projects`}
                    aria-pressed={displayCount === n}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                      displayCount === n
                        ? 'bg-purple-600 text-white'
                        : 'glass border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            {/* Results count */}
            <span className="text-xs text-white/60">
              {filtered.length} track{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* ── Empty state ── */}
        {projects.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden border border-white/8">
                <div className={`relative h-52 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                  <div className="flex gap-1 items-end">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <div key={j} className="w-1 rounded-full bg-white/20" style={{ height: `${16 + (j * 5 % 32)}px` }} />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-5">
                  <p className="text-sm font-bold text-white">Track {i + 1}</p>
                  <p className="text-xs text-white/40 mt-0.5">Coming soon</p>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm mb-4">No tracks match your filters.</p>
            <button onClick={clearFilters} className="text-xs text-purple-400 hover:text-white transition-colors underline underline-offset-4">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {visibleItems.map((project, i) => {
                  const mediaUrl = project.cover_art_url
                  const ytThumbnail = mediaUrl ? getYoutubeThumbnail(mediaUrl) : null
                  const isYT = mediaUrl ? isYoutubeUrl(mediaUrl) : false
                  const hasLink = !!mediaUrl
                  const year = getYear(project.delivered_at)

                  const card = (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.22, delay: (i % displayCount) * 0.04 }}
                      className={`glass rounded-2xl overflow-hidden border border-white/8 transition-all group ${
                        hasLink ? 'hover:border-purple-500/40 hover:shadow-glow-purple-sm cursor-pointer' : ''
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className={`relative h-52 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}>
                        {ytThumbnail ? (
                          <Image src={ytThumbnail} alt={project.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex gap-1 items-end">
                              {Array.from({ length: 10 }).map((_, j) => (
                                <div key={j} className="w-1 rounded-full bg-white/20" style={{ height: `${16 + (j * 5 % 32)}px` }} />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Genre + year badges */}
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                          {project.genre && (
                            <span className="text-[10px] font-semibold text-white/80 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                              {project.genre}
                            </span>
                          )}
                          {year && (
                            <span className="text-[10px] font-medium text-white/50 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                              {year}
                            </span>
                          )}
                        </div>

                        {/* Play / Listen overlay */}
                        {hasLink && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                              {isYT
                                ? <Play size={22} className="text-white ml-1" />
                                : <Music size={18} className="text-white" />
                              }
                            </div>
                          </div>
                        )}

                        {/* Stream badge */}
                        {hasLink && !isYT && (
                          <div className="absolute bottom-3 left-3">
                            <span className="text-[10px] font-semibold text-white/70 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Music size={8} />
                              Listen
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <h3 className="text-sm font-bold text-white mb-0.5 leading-snug">{project.title}</h3>
                        {project.description && (
                          <p className="text-xs text-white/60">{project.description}</p>
                        )}
                        {project.key_signature && (
                          <p className="text-xs text-white/50 mt-1">Prod. {project.key_signature}</p>
                        )}
                      </div>
                    </motion.div>
                  )

                  return hasLink ? (
                    <a key={project.id} href={mediaUrl!} target="_blank" rel="noopener noreferrer">
                      {card}
                    </a>
                  ) : (
                    <div key={project.id}>{card}</div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* See all / Show less */}
            {filtered.length > displayCount && (
              <div className="flex flex-col items-center mt-10 gap-3">
                {!showAll ? (
                  <>
                    <p className="text-xs text-white/30">
                      Showing {visibleItems.length} of {filtered.length} tracks
                    </p>
                    <button
                      onClick={() => setShowAll(true)}
                      className="flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-white transition-colors group"
                    >
                      See all {filtered.length} tracks
                      <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setShowAll(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="text-sm font-semibold text-white/30 hover:text-white transition-colors"
                  >
                    Show less ↑
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="text-center mt-20">
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
