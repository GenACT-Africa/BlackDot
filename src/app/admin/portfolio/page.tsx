'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Globe, Edit2, Youtube, Music2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { getYoutubeThumbnail, isYoutubeUrl } from '@/lib/utils/youtube'
import toast from 'react-hot-toast'

type PortfolioItem = {
  id: string
  title: string
  cover_art_url: string | null
  genre: string | null
  description: string | null   // artist name
  key_signature: string | null // producer names (comma-separated)
  delivered_at: string | null
}

type PromotableProject = {
  id: string
  title: string
  status: string
  delivered_at: string | null
  genre: string | null
  talent: { name: string } | null
  client: { full_name: string } | null
}

const GRADIENTS = [
  'from-purple-900/60 to-blue-900/40',
  'from-violet-900/60 to-pink-900/40',
  'from-blue-900/60 to-cyan-900/40',
  'from-indigo-900/60 to-purple-900/40',
]

export default function AdminPortfolioPage() {
  const supabase = createClient()
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [promotable, setPromotable] = useState<PromotableProject[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const [{ data: pub }, { data: comp }] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title, cover_art_url, genre, description, key_signature, delivered_at')
        .eq('is_public', true)
        .order('delivered_at', { ascending: false }),
      supabase
        .from('projects')
        .select('id, title, status, delivered_at, genre, talent:talents(name), client:profiles(full_name)')
        .in('status', ['delivered', 'archived'])
        .eq('is_public', false)
        .order('delivered_at', { ascending: false }),
    ])
    setPortfolio((pub || []) as unknown as PortfolioItem[])
    setPromotable((comp || []) as unknown as PromotableProject[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const removeFromPortfolio = async (id: string) => {
    setTogglingId(id)
    const { error } = await supabase.from('projects').update({ is_public: false }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Removed from portfolio'); fetchData() }
    setTogglingId(null)
  }

  const publishToPortfolio = async (id: string) => {
    setTogglingId(id)
    const { error } = await supabase.from('projects').update({ is_public: true }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Published to portfolio!'); fetchData() }
    setTogglingId(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Portfolio</h1>
          <p className="text-sm text-white/40 mt-1">
            Manage what&apos;s shown on the public /projects page
          </p>
        </div>
        <Link href="/admin/portfolio/new">
          <Button glow size="sm"><Plus size={14} /> Add Entry</Button>
        </Link>
      </div>

      {/* ── Published ────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest">Published</h2>
          <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{portfolio.length}</span>
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : portfolio.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center border border-dashed border-white/10">
            <p className="text-white/30 text-sm">
              No portfolio items yet. Promote a completed project or add a new entry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {portfolio.map((item, i) => (
              <div key={item.id} className="glass rounded-2xl overflow-hidden border border-white/8 hover:border-purple-500/20 transition-all">
                {/* Thumbnail */}
                {(() => {
                  const mediaUrl = item.cover_art_url
                  const ytThumb = mediaUrl ? getYoutubeThumbnail(mediaUrl) : null
                  const isYT = mediaUrl ? isYoutubeUrl(mediaUrl) : false
                  return (
                    <div className={`relative h-40 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}>
                      {ytThumb ? (
                        <Image src={ytThumb} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex gap-1 items-end">
                            {Array.from({ length: 8 }).map((_, j) => (
                              <div key={j} className="w-1 rounded-full bg-white/20" style={{ height: `${14 + (j * 7 % 28)}px` }} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {item.genre && (
                        <span className="absolute top-3 right-3 text-[10px] font-semibold text-white/80 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {item.genre}
                        </span>
                      )}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <div className="flex items-center gap-1 bg-green-500/20 border border-green-500/30 px-2 py-0.5 rounded-full">
                          <Globe size={9} className="text-green-400" />
                          <span className="text-[9px] font-semibold text-green-400">Live</span>
                        </div>
                        {mediaUrl && (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${isYT ? 'bg-red-500/15 border-red-500/25' : 'bg-green-500/10 border-green-500/20'}`}>
                            {isYT
                              ? <Youtube size={9} className="text-red-400" />
                              : <Music2 size={9} className="text-green-400" />
                            }
                            <span className={`text-[9px] font-semibold ${isYT ? 'text-red-400' : 'text-green-400'}`}>
                              {isYT ? 'YouTube' : 'Stream'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}

                {/* Info + actions */}
                <div className="p-4 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-white/60 mt-0.5 truncate">{item.description}</p>
                    )}
                    {item.key_signature && (
                      <p className="text-xs text-white/30 mt-0.5 truncate">
                        Prod. {item.key_signature}
                      </p>
                    )}
                    {item.delivered_at && (
                      <p className="text-xs text-white/20 mt-0.5">
                        {new Date(item.delivered_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                    <Link href={`/admin/portfolio/${item.id}`}>
                      <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-purple-500/20 flex items-center justify-center text-white/40 hover:text-purple-400 transition-all" title="Edit">
                        <Edit2 size={12} />
                      </button>
                    </Link>
                    <button
                      onClick={() => removeFromPortfolio(item.id)}
                      disabled={togglingId === item.id}
                      className="w-7 h-7 rounded-lg bg-green-500/10 hover:bg-red-500/15 flex items-center justify-center text-green-400 hover:text-red-400 transition-all"
                      title="Remove from portfolio"
                    >
                      {togglingId === item.id
                        ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        : <Globe size={12} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Completed Projects — ready to promote ────── */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest">Completed Projects</h2>
          <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{promotable.length}</span>
          <span className="text-xs text-white/25">— promote these to portfolio</span>
        </div>

        {!loading && promotable.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center border border-dashed border-white/10">
            <p className="text-white/30 text-sm">No completed projects ready to promote yet.</p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden border border-white/8">
            {promotable.map((project, i) => (
              <div
                key={project.id}
                className={`flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/3 transition-colors ${i > 0 ? 'border-t border-white/8' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{project.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {(project.client as any)?.full_name
                      ? `${(project.client as any).full_name} · `
                      : ''}
                    {(project.talent as any)?.name
                      ? `${(project.talent as any).name} · `
                      : ''}
                    {project.delivered_at
                      ? new Date(project.delivered_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : 'Delivered'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/portfolio/${project.id}`}>
                    <Button variant="secondary" size="sm">
                      <Edit2 size={12} />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    glow
                    onClick={() => publishToPortfolio(project.id)}
                    loading={togglingId === project.id}
                  >
                    <Globe size={12} />
                    Publish
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
