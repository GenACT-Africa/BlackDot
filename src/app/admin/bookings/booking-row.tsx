'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { BookingStatusBadge } from '@/components/ui/badge'
import { formatTZS } from '@/lib/utils/currency'
import { createClient } from '@/lib/supabase/client'
import type { BookingStatus } from '@/types'

const STATUS_OPTIONS: BookingStatus[] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']

const PAYMENT_STATUS_STYLES: Record<string, { label: string; className: string }> = {
  processing: { label: 'Submitted', className: 'text-amber-400 bg-amber-500/15' },
  paid:        { label: 'Paid',      className: 'text-green-400 bg-green-500/15' },
  pending:     { label: 'Unpaid',    className: 'text-white/40 bg-white/5' },
  failed:      { label: 'Failed',    className: 'text-red-400 bg-red-500/15' },
  refunded:    { label: 'Refunded',  className: 'text-blue-400 bg-blue-500/15' },
}

export function AdminBookingRow({ booking }: { booking: any }) {
  const router = useRouter()
  const [status, setStatus] = useState<BookingStatus>(booking.status)
  const [updating, setUpdating] = useState(false)

  // Get latest payment for this booking
  const payment = booking.payments?.[0] ?? null
  const paymentStatus = payment?.status ?? 'pending'
  const paymentStyle = PAYMENT_STATUS_STYLES[paymentStatus] ?? PAYMENT_STATUS_STYLES.pending

  const handleViewReceipt = async () => {
    if (!payment) return
    if (payment.payment_method === 'bank_transfer') {
      toast(`Transaction ID: ${payment.gateway_ref}`, { icon: '🏦', duration: 6000 })
      return
    }
    if (payment.payment_method === 'receipt_upload' && payment.gateway_ref) {
      const supabase = createClient()
      const { data } = await supabase.storage
        .from('project-files')
        .createSignedUrl(payment.gateway_ref, 60)
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      } else {
        toast.error('Could not load receipt')
      }
    }
  }

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (newStatus === status) return
    setUpdating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('bookings')
      .update({
        status: newStatus,
        confirmed_at: newStatus === 'confirmed' ? new Date().toISOString() : undefined,
        cancelled_at: newStatus === 'cancelled' ? new Date().toISOString() : undefined,
      })
      .eq('id', booking.id)

    if (error) {
      toast.error('Failed to update status')
      setUpdating(false)
      return
    }

    // Auto-create project when booking is confirmed
    if (newStatus === 'confirmed') {
      const { error: projectError } = await supabase.from('projects').insert({
        booking_id: booking.id,
        client_id: booking.client_id,
        talent_id: booking.talent_id || null,
        title: booking.project_title,
        status: 'briefing',
        progress_pct: 0,
      })
      if (projectError) {
        // Don't block booking update if project creation fails (might already exist)
        console.warn('Project creation warning:', projectError.message)
      } else {
        toast.success('Booking confirmed & project created!')
      }
    } else {
      toast.success('Status updated')
    }

    setStatus(newStatus)
    router.refresh()
    setUpdating(false)
  }

  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
      {/* Ref */}
      <td className="px-4 py-4">
        <span className="text-xs font-mono text-purple-400">{booking.booking_ref}</span>
      </td>

      {/* Client */}
      <td className="px-4 py-4">
        <p className="text-sm font-medium text-white">{booking.client?.full_name ?? '—'}</p>
      </td>

      {/* Project name */}
      <td className="px-4 py-4">
        <p className="text-sm text-white/80 max-w-[140px] truncate">{booking.project_title}</p>
      </td>

      {/* Service */}
      <td className="px-4 py-4">
        <p className="text-sm text-white/60">{booking.service?.name ?? '—'}</p>
      </td>

      {/* Date */}
      <td className="px-4 py-4">
        <p className="text-sm text-white/60">
          {booking.session_date ? format(new Date(booking.session_date), 'MMM d, yyyy') : '—'}
        </p>
      </td>

      {/* Total */}
      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-white">{formatTZS(booking.total_price)}</p>
      </td>

      {/* Payment status */}
      <td className="px-4 py-4">
        <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${paymentStyle.className}`}>
          {paymentStyle.label}
        </span>
      </td>

      {/* View receipt */}
      <td className="px-4 py-4">
        {payment && (payment.payment_method === 'receipt_upload' || payment.payment_method === 'bank_transfer') ? (
          <button
            onClick={handleViewReceipt}
            className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
          >
            {payment.payment_method === 'receipt_upload' ? 'View Receipt' : 'View TXN ID'}
          </button>
        ) : (
          <span className="text-xs text-white/20">—</span>
        )}
      </td>

      {/* Booking status badge */}
      <td className="px-4 py-4">
        <BookingStatusBadge status={status} />
      </td>

      {/* Action dropdown */}
      <td className="px-4 py-4">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
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
