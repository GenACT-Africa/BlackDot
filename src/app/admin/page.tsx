import { Calendar, FolderOpen, Users, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/ui/card'
import { BookingStatusBadge, ProjectStatusBadge } from '@/components/ui/badge'
import { formatTZS } from '@/lib/utils/currency'
import { format } from 'date-fns'
import type { Booking, Project } from '@/types'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: bookingCount },
    { count: projectCount },
    { count: clientCount },
    { data: recentBookings },
    { data: activeProjects },
    { data: payments },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('bookings').select('*, service:services(name), client:profiles(full_name)').order('created_at', { ascending: false }).limit(8),
    supabase.from('projects').select('*, client:profiles(full_name)').neq('status', 'delivered').neq('status', 'archived').order('updated_at', { ascending: false }).limit(6),
    supabase.from('payments').select('amount_tzs, status'),
  ])

  const totalRevenue = payments?.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount_tzs, 0) || 0
  const pendingBookings = recentBookings?.filter((b) => b.status === 'pending').length || 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Studio Overview</h1>
        <p className="text-white/50 text-sm mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Bookings"
          value={bookingCount || 0}
          icon={<Calendar size={18} />}
          color="purple"
        />
        <StatCard
          label="Active Projects"
          value={projectCount || 0}
          icon={<FolderOpen size={18} />}
          color="blue"
        />
        <StatCard
          label="Clients"
          value={clientCount || 0}
          icon={<Users size={18} />}
          color="gold"
        />
        <StatCard
          label="Revenue (Paid)"
          value={formatTZS(totalRevenue)}
          icon={<TrendingUp size={18} />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Bookings */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="font-bold text-white text-sm">Recent Bookings</h2>
            {pendingBookings > 0 && (
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                {pendingBookings} pending
              </span>
            )}
          </div>
          <div className="divide-y divide-white/5">
            {recentBookings?.map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-white">{booking.project_title}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {booking.client?.full_name} · {booking.service?.name}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8">
            <h2 className="font-bold text-white text-sm">Active Projects</h2>
          </div>
          <div className="divide-y divide-white/5">
            {activeProjects?.map((project: any) => (
              <div key={project.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{project.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{project.client?.full_name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${project.progress_pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/30">{project.progress_pct}%</span>
                  </div>
                </div>
                <ProjectStatusBadge status={project.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
