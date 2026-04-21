import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Projects',
  description: 'Track the progress of all your BlackDot Music studio projects. See production stages, completion percentages, and delivery status for every recording session.',
}

import { Plus, FolderOpen, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ProjectStatusBadge } from '@/components/ui/badge'
import type { Project } from '@/types'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: projects } = await supabase
    .from('projects')
    .select('*, talent:talents(name)')
    .eq('client_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Projects</h1>
        <Link href="/book">
          <Button glow size="sm">
            <Plus size={14} /> New Project
          </Button>
        </Link>
      </div>

      {!projects?.length ? (
        <div className="glass rounded-2xl p-16 text-center">
          <FolderOpen size={40} className="text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No projects yet</h3>
          <p className="text-white/40 text-sm mb-6">Book a session to get your first project started.</p>
          <Link href="/book"><Button glow>Book a Session</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {(projects as (Project & { talent?: { name: string } | null })[]).map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <div className="glass rounded-2xl p-6 border border-white/8 hover:border-purple-500/30 hover:shadow-glow-purple-sm transition-all duration-300 group cursor-pointer h-full">
                {/* Cover / placeholder */}
                <div className="w-full h-28 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/30 mb-5 flex items-center justify-center relative overflow-hidden">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-purple-400/30"
                        style={{ height: `${20 + Math.random() * 40}px` }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                    {project.title}
                  </h3>
                  <ProjectStatusBadge status={project.status} />
                </div>

                {project.talent && (
                  <p className="text-xs text-white/40 mb-3">With {project.talent.name}</p>
                )}

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-white/40 mb-1.5">
                    <span>Progress</span>
                    <span>{project.progress_pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all"
                      style={{ width: `${project.progress_pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
                  <span className="text-xs text-white/30">
                    Updated {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                  <ArrowRight size={14} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
