import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, FileText, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BookingStatusBadge } from '@/components/ui/badge'
import { formatTZS } from '@/lib/utils/currency'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Booking Details' }

export default async function BookingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, service:services(name, billing_unit), talent:talents(name, roles)')
    .eq('id', params.id)
    .single()

  if (!booking || booking.client_id !== user.id) notFound()

  const service = booking.service as { name: string; billing_unit: string } | null
  const talent = booking.talent as { name: string; roles: string[] } | null

  return (
    <div>
      {/* Back */}
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Bookings
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-white">{booking.project_title}</h1>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="text-xs font-mono text-purple-400">{booking.booking_ref}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-black gradient-text">{formatTZS(booking.total_price)}</p>
          <p className="text-xs text-white/40">Total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Details */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Session Details</h2>
          <div className="space-y-4">
            {service && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">Service</p>
                  <p className="text-sm font-medium text-white">{service.name}</p>
                </div>
              </div>
            )}

            {talent && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">Producer / Engineer</p>
                  <p className="text-sm font-medium text-white">{talent.name}</p>
                  {talent.roles?.length > 0 && (
                    <p className="text-xs text-white/40">{talent.roles.join(' · ')}</p>
                  )}
                </div>
              </div>
            )}

            {booking.session_date && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                  <Calendar size={14} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">Session Date</p>
                  <p className="text-sm font-medium text-white">
                    {format(new Date(booking.session_date), 'EEEE, MMMM d, yyyy')}
                  </p>
                  {booking.start_time && (
                    <p className="text-xs text-white/50">{booking.start_time}</p>
                  )}
                </div>
              </div>
            )}

            {booking.duration_hours && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">Duration</p>
                  <p className="text-sm font-medium text-white">{booking.duration_hours} hour{booking.duration_hours !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Pricing</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/8">
              <span className="text-sm text-white/60">Quoted Price</span>
              <span className="text-sm font-medium text-white">{formatTZS(booking.quoted_price)}</span>
            </div>
            {booking.discount_tzs > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-white/8">
                <span className="text-sm text-white/60">Discount</span>
                <span className="text-sm font-medium text-green-400">− {formatTZS(booking.discount_tzs)}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-lg font-black gradient-text">{formatTZS(booking.total_price)}</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-white/8 flex items-center gap-2 text-xs text-white/40">
            <CreditCard size={12} />
            Payment is collected after booking confirmation.
          </div>
        </div>

        {/* Project Notes */}
        {booking.project_notes && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Project Notes</h2>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{booking.project_notes}</p>
          </div>
        )}

        {/* Admin Notes */}
        {booking.admin_notes && (
          <div className="glass rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Message from Studio</h2>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{booking.admin_notes}</p>
          </div>
        )}
      </div>

      {/* Footer meta */}
      <p className="text-xs text-white/25 mt-8">
        Booked on {format(new Date(booking.created_at), 'MMM d, yyyy')}
        {booking.confirmed_at && ` · Confirmed ${format(new Date(booking.confirmed_at), 'MMM d, yyyy')}`}
        {booking.cancelled_at && ` · Cancelled ${format(new Date(booking.cancelled_at), 'MMM d, yyyy')}`}
      </p>
    </div>
  )
}
