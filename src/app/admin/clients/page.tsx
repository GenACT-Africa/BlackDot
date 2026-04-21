import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Clients – Admin',
  description: 'View all registered BlackDot Music client accounts — browse profiles, check booking history, and monitor activity across the platform from the admin panel.',
}


export default async function AdminClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('profiles')
    .select('*, bookings:bookings(count), projects:projects(count)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Clients</h1>
        <p className="text-sm text-white/40">{clients?.length || 0} total</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">Name</th>
                <th className="hidden sm:table-cell text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">Role</th>
                <th className="hidden sm:table-cell text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">Bookings</th>
                <th className="hidden md:table-cell text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">Projects</th>
                <th className="hidden md:table-cell text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients?.map((client: any) => (
                <tr key={client.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{client.full_name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{client.full_name}</p>
                        {client.phone && <p className="text-xs text-white/40">{client.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-5 py-4">
                    <Badge variant={client.role === 'admin' ? 'gold' : 'purple'}>
                      {client.role}
                    </Badge>
                  </td>
                  <td className="hidden sm:table-cell px-5 py-4">
                    <span className="text-sm text-white/70">
                      {(client.bookings as any)?.[0]?.count || 0}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-5 py-4">
                    <span className="text-sm text-white/70">
                      {(client.projects as any)?.[0]?.count || 0}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-5 py-4">
                    <span className="text-sm text-white/50 whitespace-nowrap">
                      {format(new Date(client.created_at), 'MMM d, yyyy')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
