'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { ProjectStatusBadge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { ProjectStatus } from '@/types'

const STATUS_OPTIONS: ProjectStatus[] = [
  'briefing', 'pre_production', 'recording', 'mixing', 'mastering', 'review', 'delivered', 'archived',
]

const PROGRESS_MAP: Record<ProjectStatus, number> = {
  briefing: 5,
  pre_production: 15,
  recording: 35,
  mixing: 60,
  mastering: 80,
  review: 90,
  delivered: 100,
  archived: 100,
}

export function AdminProjectRow({ project }: { project: any }) {
  const router = useRouter()
  const [status, setStatus] = useState<ProjectStatus>(project.status)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (newStatus === status) return
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .update({
        status: newStatus,
        progress_pct: PROGRESS_MAP[newStatus],
        delivered_at: newStatus === 'delivered' ? new Date().toISOString() : null,
      })
      .eq('id', project.id)

    if (error) {
      toast.error('Failed to update')
    } else {
      setStatus(newStatus)
      toast.success('Project updated')
      router.refresh()
    }
    setUpdating(false)
  }

  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
      <td className="px-5 py-4">
        <p className="text-sm font-medium text-white">{project.title}</p>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-white/70">{project.client?.full_name}</p>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-white/70">{project.talent?.name || '—'}</p>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${PROGRESS_MAP[status]}%` }}
            />
          </div>
          <span className="text-xs text-white/40">{PROGRESS_MAP[status]}%</span>
        </div>
      </td>
      <td className="px-5 py-4">
        <ProjectStatusBadge status={status} />
      </td>
      <td className="px-5 py-4">
        <p className="text-xs text-white/40">
          {format(new Date(project.updated_at), 'MMM d')}
        </p>
      </td>
      <td className="px-5 py-4">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
          disabled={updating}
          className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/70 focus:outline-none focus:ring-1 focus:ring-purple-500/50 disabled:opacity-40 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-gray-900">
              {s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </td>
    </tr>
  )
}
