import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Track your active BlackDot Music projects, upcoming session bookings, and payment history — all from your personal studio dashboard, updated in real time.',
}

import { Plus, ArrowRight, Calendar, FolderOpen, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/card'
import { BookingStatusBadge, ProjectStatusBadge } from '@/components/ui/badge'
import { formatTZS } from '@/lib/utils/currency'
import type { Booking, Project } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const [
    { data: profile },
    { data: bookings },
    { data: projects },
    { data: payments },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('bookings').select('*, service:services(name)').eq('client_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('projects').select('*').eq('client_id', user.id).order('updated_at', { ascending: false }).limit(5),
    supabase.from('payments').select('amount_tzs, status').eq('client_id', user.id),
  ])

  const activeProjects = projects?.filter((p) => p.status !== 'delivered' && p.status !== 'archived').length || 0
  const pendingBookings = bookings?.filter((b) => b.status === 'pending' || b.status === 'confirmed').length || 0
  const totalPaid = payments?.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount_tzs, 0) || 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-white/50 text-sm">{greeting}</p>
          <h1 className="text-2xl font-black text-white">
            {profile?.full_name?.split(' ')[0] || 'Artist'} 👋
          </h1>
        </div>
        <Link href="/book">
          <Button glow size="sm" className="gap-1.5">
            <Plus size={14} />
            New Booking
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Active Projects"
          value={activeProjects}
          icon={<FolderOpen size={18} />}
          color="purple"
        />
        <StatCard
          label="Pending Bookings"
          value={pendingBookings}
          icon={<Calendar size={18} />}
          color="blue"
        />
        <StatCard
          label="Total Paid"
          value={formatTZS(totalPaid)}
          icon={<CreditCard size={18} />}
          color="gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Projects</h2>
            <Link href="/dashboard/projects" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {!projects?.length ? (
            <div className="text-center py-8">
              <FolderOpen size={28} className="text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">No projects yet</p>
              <Link href="/book" className="text-xs text-purple-400 hover:text-purple-300 transition-colors mt-1 inline-block">
                Start a booking
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(projects as Project[]).map((project) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                  <div className="flex items-center justify-between py-3 border-b border-white/8 last:border-0 hover:bg-white/3 -mx-2 px-2 rounded-lg transition-colors group">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors truncate">
                        {project.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all"
                            style={{ width: `${project.progress_pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/40">{project.progress_pct}%</span>
                      </div>
                    </div>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Bookings</h2>
            <Link href="/dashboard/bookings" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {!bookings?.length ? (
            <div className="text-center py-8">
              <Calendar size={28} className="text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">No bookings yet</p>
              <Link href="/book" className="text-xs text-purple-400 hover:text-purple-300 transition-colors mt-1 inline-block">
                Book a session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(bookings as Booking[]).map((booking) => (
                <Link key={booking.id} href={`/dashboard/bookings/${booking.id}`}>
                  <div className="flex items-center justify-between py-3 border-b border-white/8 last:border-0 hover:bg-white/3 -mx-2 px-2 rounded-lg transition-colors group">
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                        {booking.project_title}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {(booking as any).service?.name} · {booking.booking_ref}
                      </p>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
