import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminBookingRow } from './booking-row'

export const metadata: Metadata = {
  title: 'Manage Bookings – Admin',
  description: 'Review and manage all BlackDot Music studio booking requests — approve, update, or cancel sessions and track client booking status from the admin panel.',
}


export default async function AdminBookingsPage() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(name),
      client:profiles(full_name),
      talent:talents(name),
      payments(id, status, gateway_ref, payment_method, notes)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Bookings</h1>
        <p className="text-sm text-white/40">{bookings?.length || 0} total</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-white/8">
                {['Ref', 'Client', 'Project', 'Service', 'Date', 'Total', 'Payment', 'Receipt', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-4 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings?.length === 0 || !bookings ? (
                <tr>
                  <td colSpan={10} className="px-5 py-16 text-center text-white/30 text-sm">
                    No bookings yet. They will appear here once clients start booking sessions.
                  </td>
                </tr>
              ) : (
                bookings.map((booking: any) => (
                  <AdminBookingRow key={booking.id} booking={booking} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
