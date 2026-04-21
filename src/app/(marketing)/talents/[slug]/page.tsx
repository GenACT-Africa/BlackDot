import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Music2, Youtube, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data: talent } = await supabase
    .from('talents')
    .select('name, bio')
    .eq('slug', params.slug)
    .single()

  return {
    title: talent?.name || 'Talent',
    description: talent?.bio || 'BlackDot Music talent profile.',
  }
}

export default async function TalentProfilePage({ params }: Props) {
  const supabase = await createClient()
  const { data: talent } = await supabase
    .from('talents')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!talent) notFound()

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-10">
          <div className="h-56 bg-gradient-to-br from-purple-900/60 to-blue-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 flex items-end gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 border-4 border-brand-black overflow-hidden">
              {talent.avatar_url ? (
                <Image src={talent.avatar_url} alt={talent.name} width={96} height={96} className="object-cover" />
              ) : (
                <span className="text-3xl font-black text-white">{talent.name[0]}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">{talent.name}</h1>
              <p className="text-white/60">{talent.roles.join(' · ')}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {talent.bio && (
              <div className="glass rounded-2xl p-6 mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">About</h2>
                <p className="text-white/80 leading-relaxed">{talent.bio}</p>
              </div>
            )}

            {talent.genres.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {talent.genres.map((genre: string) => (
                    <Badge key={genre} variant="purple" size="md">{genre}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Link href={`/book?talent=${talent.id}`}>
              <Button className="w-full" glow size="lg">
                Book {talent.name.split(' ')[0]}
                <ArrowRight size={14} />
              </Button>
            </Link>

            {/* Social links */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Links</h3>
              {talent.instagram_url && (
                <a href={talent.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                  <Instagram size={16} className="text-purple-400" /> Instagram
                </a>
              )}
              {talent.spotify_url && (
                <a href={talent.spotify_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                  <Music2 size={16} className="text-green-400" /> Spotify
                </a>
              )}
              {talent.youtube_url && (
                <a href={talent.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                  <Youtube size={16} className="text-red-400" /> YouTube
                </a>
              )}
              {!talent.instagram_url && !talent.spotify_url && !talent.youtube_url && (
                <p className="text-xs text-white/50">No links added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
