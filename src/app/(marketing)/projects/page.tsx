import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProjectsClient } from './projects-client'

export const metadata: Metadata = {
  title: 'Portfolio – Productions & Studio Work',
  description: 'Browse the BlackDot Music studio portfolio — productions, mixes & recording sessions spanning Afrobeats, Bongo Flava, R&B and more from artists across the globe.',
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, cover_art_url, genre, description, key_signature, delivered_at')
    .eq('is_public', true)
    .order('delivered_at', { ascending: false })

  return <ProjectsClient projects={projects || []} />
}
