'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { Talent } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
  roles: z.string().min(1, 'At least one role required'),
  bio: z.string().optional(),
  genres: z.string().optional(),
  instagram_url: z.string().url().optional().or(z.literal('')),
  spotify_url: z.string().url().optional().or(z.literal('')),
  soundcloud_url: z.string().url().optional().or(z.literal('')),
  youtube_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  display_order: z.coerce.number().int().min(0).optional(),
})

type FormData = z.infer<typeof schema>

export default function EditTalentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [talent, setTalent] = useState<Talent | null>(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)

  // Avatar upload state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Fetch talent
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        toast.error('Talent not found')
        router.push('/admin/talents')
        return
      }

      const t = data as Talent
      setTalent(t)
      setAvatarUrl(t.avatar_url ?? null)
      setAvatarPreview(t.avatar_url ?? null)

      reset({
        name: t.name,
        slug: t.slug,
        roles: t.roles.join(', '),
        bio: t.bio ?? '',
        genres: t.genres.join(', '),
        instagram_url: t.instagram_url ?? '',
        spotify_url: t.spotify_url ?? '',
        soundcloud_url: t.soundcloud_url ?? '',
        youtube_url: t.youtube_url ?? '',
        is_featured: t.is_featured,
        is_active: t.is_active,
        display_order: t.display_order ?? 0,
      })
      setFetching(false)
    }
    load()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle avatar file selection & upload
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setAvatarPreview(objectUrl)
    setUploading(true)

    try {
      const ext = file.name.split('.').pop()
      const path = `talents/${id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      // Append cache-bust so the browser picks up the new image
      setAvatarUrl(`${urlData.publicUrl}?t=${Date.now()}`)
      toast.success('Photo uploaded')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      toast.error(msg)
      // Roll back preview to previous
      setAvatarPreview(avatarUrl)
    } finally {
      setUploading(false)
    }
  }

  function handleRemoveAvatar() {
    setAvatarPreview(null)
    setAvatarUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { error } = await supabase
      .from('talents')
      .update({
        name: data.name,
        slug: data.slug,
        roles: data.roles.split(',').map((r) => r.trim()).filter(Boolean),
        bio: data.bio || null,
        genres: data.genres ? data.genres.split(',').map((g) => g.trim()).filter(Boolean) : [],
        instagram_url: data.instagram_url || null,
        spotify_url: data.spotify_url || null,
        soundcloud_url: data.soundcloud_url || null,
        youtube_url: data.youtube_url || null,
        is_featured: data.is_featured,
        is_active: data.is_active,
        display_order: data.display_order ?? 0,
        avatar_url: avatarUrl,
      })
      .eq('id', id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Talent updated!')
      router.push('/admin/talents')
    }
    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-purple-400" size={32} />
      </div>
    )
  }

  const initials = talent?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? '?'

  return (
    <div>
      <Link
        href="/admin/talents"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Talents
      </Link>

      <h1 className="text-2xl font-black text-white mb-8">Edit Talent</h1>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ── Avatar Upload ── */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white/70 mb-4">Display Photo</h2>
            <div className="flex items-center gap-5">
              {/* Preview */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-3xl font-black text-white">{initials}</span>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={20} />
                  </div>
                )}
                {avatarPreview && !uploading && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mb-2"
                >
                  <Upload size={14} />
                  {uploading ? 'Uploading…' : 'Upload Photo'}
                </Button>
                <p className="text-xs text-white/30">PNG, JPG or WebP · Max 5 MB</p>
              </div>
            </div>
          </div>

          {/* ── Basic Info ── */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white/70 mb-2">Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                placeholder="Jay Kali"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Slug"
                placeholder="jay-kali"
                error={errors.slug?.message}
                hint="URL-friendly, lowercase"
                {...register('slug')}
              />
            </div>
            <Input
              label="Roles (comma-separated)"
              placeholder="Producer, Sound Engineer"
              error={errors.roles?.message}
              {...register('roles')}
            />
            <Input
              label="Genres (comma-separated)"
              placeholder="Afrobeats, Bongo Flava, R&B"
              {...register('genres')}
            />
            <Textarea
              label="Bio"
              placeholder="Short bio..."
              rows={3}
              {...register('bio')}
            />
            <Input
              label="Display Order"
              type="number"
              min={0}
              hint="Lower numbers appear first"
              {...register('display_order')}
            />
          </div>

          {/* ── Social Links ── */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white/70 mb-2">Social Links</h2>
            <Input label="Instagram URL" placeholder="https://instagram.com/..." {...register('instagram_url')} />
            <Input label="Spotify URL" placeholder="https://open.spotify.com/..." {...register('spotify_url')} />
            <Input label="SoundCloud URL" placeholder="https://soundcloud.com/..." {...register('soundcloud_url')} />
            <Input label="YouTube URL" placeholder="https://youtube.com/..." {...register('youtube_url')} />
          </div>

          {/* ── Visibility ── */}
          <div className="glass rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-bold text-white/70 mb-2">Visibility</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-purple-600" {...register('is_active')} />
              <span className="text-sm text-white">Active (visible on site)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-amber-500" {...register('is_featured')} />
              <span className="text-sm text-white">Featured (shown on homepage)</span>
            </label>
          </div>

          <div className="flex gap-3">
            <Link href="/admin/talents">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" loading={loading} glow className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
