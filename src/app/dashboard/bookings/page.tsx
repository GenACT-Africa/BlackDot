import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Bookings',
  description: 'View and manage all your BlackDot Music studio bookings. Track booking status, session dates, services selected, and total pricing from your personal dashboard.',
}

import { Calendar, Plus, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { BookingStatusBadge } from '@/components/ui/badge'
import { formatTZS } from '@/lib/utils/currency'
import { format } from 'date-fns'
import type { Booking } from '@/types'

export default async function BookingsPage() {
  const supabase = await createClient()

  // ✅ Get user safely
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return (
      <div className="p-6 text-white">
        <p>Authentication error. Please log in again.</p>
      </div>
    )
  }

  // ✅ Fetch bookings safely
  const { data, error } = await supabase
    .from('bookings')
    .select('*, service:services(name)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 text-red-400">
        <p>Failed to load bookings.</p>
      </div>
    )
  }

  const bookings = (data || []) as (Booking & {
    service?: { name: string }
  })[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Bookings</h1>
        <Link href="/book">
          <Button glow size="sm">
            <Plus size={14} /> New Booking
          </Button>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Calendar size={40} className="text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">
            No bookings yet
          </h3>
          <p className="text-white/40 text-sm mb-6">
            Book your first studio session.
          </p>
          <Link href="/book">
            <Button glow>Book a Session</Button>
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Ref', 'Project', 'Service', 'Date', 'Total', 'Status'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/bookings/${booking.id}`} className="text-xs font-mono text-purple-400 group-hover:text-purple-300 transition-colors">
                      {booking.booking_ref || '—'}
                    </Link>
                  </td>

                  <td className="px-5 py-4">
                    <Link href={`/dashboard/bookings/${booking.id}`} className="block text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                      {booking.project_title || 'Untitled'}
                    </Link>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-white/60">
                      {booking.service?.name || '—'}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-white/60">
                      {booking.session_date
                        ? format(
                            new Date(booking.session_date),
                            'MMM d, yyyy'
                          )
                        : '—'}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-white">
                      {formatTZS(booking.total_price || 0)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <BookingStatusBadge
                        status={booking.status || 'pending'}
                      />
                      <ArrowRight size={13} className="text-white/20 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}