import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProjectsClient } from './projects-client'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Listen to projects produced and engineered at BlackDot Music.',
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
