import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Paperclip, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProjectStatusBadge } from '@/components/ui/badge'
import { ChatSection } from './chat-section'
import { FilesSection } from './files-section'

const STATUS_STEPS = [
  'briefing', 'pre_production', 'recording', 'mixing', 'mastering', 'review', 'delivered',
]

const STATUS_LABELS: Record<string, string> = {
  briefing: 'Briefing',
  pre_production: 'Pre-Production',
  recording: 'Recording',
  mixing: 'Mixing',
  mastering: 'Mastering',
  review: 'Review',
  delivered: 'Delivered',
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: project } = await supabase
    .from('projects')
    .select('*, talent:talents(name, avatar_url, roles), milestones:project_milestones(*)')
    .eq('id', params.id)
    .single()

  if (!project || project.client_id !== user.id) notFound()

  const currentStepIdx = STATUS_STEPS.indexOf(project.status)

  return (
    <div>
      {/* Back */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-black text-white">{project.title}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          {project.talent && (
            <p className="text-sm text-white/50">
              Producer: <span className="text-white">{(project.talent as any).name}</span>
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-3xl font-black gradient-text">{project.progress_pct}%</p>
          <p className="text-xs text-white/40">Complete</p>
        </div>
      </div>

      {/* Progress timeline */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-bold text-white/70 mb-5">Production Progress</h3>
        <div className="flex items-center gap-0">
          {STATUS_STEPS.map((step, i) => {
            const isDone = i < currentStepIdx
            const isCurrent = i === currentStepIdx

            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      isDone
                        ? 'bg-purple-600 border-purple-600'
                        : isCurrent
                        ? 'bg-purple-600/30 border-purple-500 shadow-glow-purple-sm'
                        : 'bg-transparent border-white/20'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={12} className="text-white fill-white" />
                    ) : isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-medium text-center hidden sm:block w-16 leading-tight ${
                      isCurrent ? 'text-purple-300' : isDone ? 'text-white/50' : 'text-white/25'
                    }`}
                  >
                    {STATUS_LABELS[step]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 transition-all ${
                      i < currentStepIdx ? 'bg-purple-600' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
            <MessageSquare size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-white">Messages</h3>
          </div>
          <ChatSection projectId={project.id} userId={user.id} />
        </div>

        {/* Files */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
            <Paperclip size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-white">Files</h3>
          </div>
          <FilesSection projectId={project.id} userId={user.id} />
        </div>
      </div>
    </div>
  )
}
