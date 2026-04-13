'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Globe, GlobeOff, Music2, Youtube, Check } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { extractYoutubeId } from '@/lib/utils/youtube'

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  artist_name: z.string().optional(),
  genre: z.string().optional(),
  video_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  stream_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_public: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function EditPortfolioEntryPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [talents, setTalents] = useState<{ id: string; name: string }[]>([])
  const [selectedTalents, setSelectedTalents] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(false)

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_public: false },
  })

  useEffect(() => {
    async function load() {
      const [{ data: project }, { data: talentList }] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        supabase.from('talents').select('id, name').eq('is_active', true).order('display_order'),
      ])
      if (project) {
        const existingUrl = project.cover_art_url || ''
        const isYoutube = existingUrl && !!extractYoutubeId(existingUrl)
        reset({
          title: project.title,
          artist_name: project.description || '',
          genre: project.genre || '',
          video_url: isYoutube ? existingUrl : '',
          stream_url: !isYoutube && existingUrl ? existingUrl : '',
          is_public: project.is_public,
        })
        setIsPublic(project.is_public)
        if (project.key_signature) {
          const names = project.key_signature.split(',').map((n: string) => n.trim()).filter(Boolean)
          setSelectedTalents(names)
        }
      }
      setTalents(talentList || [])
      setFetching(false)
    }
    load()
  }, [id, supabase, reset])

  const toggleTalent = (name: string) => {
    setSelectedTalents(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const mediaUrl = data.video_url || data.stream_url || null
      const primaryTalentId = selectedTalents.length > 0
        ? (talents.find(t => t.name === selectedTalents[0])?.id ?? null)
        : null

      const { error } = await supabase.from('projects').update({
        title: data.title,
        description: data.artist_name || null,
        genre: data.genre || null,
        key_signature: selectedTalents.join(', ') || null,
        talent_id: primaryTalentId,
        cover_art_url: mediaUrl,
        is_public: data.is_public,
      }).eq('id', id)

      if (error) throw error
      toast.success('Saved!')
      router.push('/admin/portfolio')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <Link href="/admin/portfolio" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} /> Portfolio
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Edit Portfolio Entry</h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
          isPublic
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-white/5 border-white/10 text-white/40'
        }`}>
          {isPublic ? <Globe size={12} /> : <GlobeOff size={12} />}
          {isPublic ? 'Live on /projects' : 'Not published'}
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Media Link */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white/70 mb-1">Media Link</h2>
              <p className="text-xs text-white/30">YouTube thumbnail is used as the cover on the portfolio page.</p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-white/60 mb-1.5">
                <Youtube size={13} className="text-red-400" />
                YouTube Link <span className="text-purple-400">(preferred)</span>
              </label>
              <Input placeholder="https://www.youtube.com/watch?v=..." error={errors.video_url?.message} {...register('video_url')} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-white/25">or</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-white/60 mb-1.5">
                <Music2 size={13} className="text-green-400" />
                Streaming Link
              </label>
              <Input placeholder="Spotify, SoundCloud, Apple Music, Audiomack…" error={errors.stream_url?.message} {...register('stream_url')} />
            </div>
          </div>

          {/* Track Info */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white/70 mb-2">Track Info</h2>
            <Input
              label="Title"
              error={errors.title?.message}
              {...register('title')}
            />
            <Input
              label="Artist Name"
              placeholder="e.g. Sauti Sol, Harmonize…"
              {...register('artist_name')}
            />
            <Input
              label="Genre"
              placeholder="Afrobeats, Bongo Flava…"
              {...register('genre')}
            />
          </div>

          {/* Producer / Engineer — multi-select */}
          <div className="glass rounded-2xl p-6">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white/70">Producer / Engineer</h2>
              <p className="text-xs text-white/30 mt-0.5">Select all who contributed to this project.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {talents.map((t) => {
                const checked = selectedTalents.includes(t.name)
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTalent(t.name)}
                    className={`glass rounded-xl p-3 text-left border transition-all relative ${
                      checked ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/8 hover:border-purple-500/20'
                    }`}
                  >
                    {checked && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                        <Check size={9} className="text-white" />
                      </div>
                    )}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-1.5">
                      <span className="text-xs font-bold text-white">{t.name[0]}</span>
                    </div>
                    <p className="text-xs font-medium text-white pr-4">{t.name}</p>
                  </button>
                )
              })}
            </div>
            {selectedTalents.length > 0 && (
              <p className="text-xs text-purple-400/70 mt-3">
                Selected: {selectedTalents.join(', ')}
              </p>
            )}
          </div>

          {/* Visibility */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white/70 mb-3">Visibility</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-purple-600"
                {...register('is_public')}
                onChange={(e) => {
                  setValue('is_public', e.target.checked)
                  setIsPublic(e.target.checked)
                }}
              />
              <div>
                <span className="text-sm text-white block">Published to portfolio</span>
                <span className="text-xs text-white/40">Shows on the public /projects page</span>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <Link href="/admin/portfolio"><Button variant="secondary">Cancel</Button></Link>
            <Button type="submit" loading={loading} glow className="flex-1">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}