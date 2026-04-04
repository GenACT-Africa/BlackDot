import { createClient } from '@/lib/supabase/server'
import { ProjectStatusBadge } from '@/components/ui/badge'
import { AdminProjectRow } from './project-row'

export default async function AdminProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, client:profiles(full_name), talent:talents(name)')
    .order('updated_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Projects</h1>
        <p className="text-sm text-white/40">{projects?.length || 0} total</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/8">
                {['Project', 'Client', 'Talent', 'Progress', 'Status', 'Updated', 'Action'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects?.map((project: any) => (
                <AdminProjectRow key={project.id} project={project} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
