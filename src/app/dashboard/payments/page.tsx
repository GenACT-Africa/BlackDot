import { CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PaymentStatusBadge } from '@/components/ui/badge'
import { formatTZS } from '@/lib/utils/currency'
import { format } from 'date-fns'
import type { Payment } from '@/types'

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const totalPaid = payments?.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount_tzs, 0) || 0
  const totalPending = payments?.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount_tzs, 0) || 0

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Payments</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-white/50 mb-1">Total Paid</p>
          <p className="text-3xl font-black gradient-text">{formatTZS(totalPaid)}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-white/50 mb-1">Pending</p>
          <p className="text-3xl font-black text-amber-400">{formatTZS(totalPending)}</p>
        </div>
      </div>

      {/* Payment history */}
      {!payments?.length ? (
        <div className="glass rounded-2xl p-16 text-center">
          <CreditCard size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-sm">No payment history yet.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Date', 'Amount', 'Method', 'Reference', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(payments as Payment[]).map((payment) => (
                <tr key={payment.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4 text-sm text-white/60">
                    {format(new Date(payment.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">
                    {formatTZS(payment.amount_tzs)}
                  </td>
                  <td className="px-5 py-4 text-sm text-white/60 capitalize">
                    {payment.payment_method || '—'}
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-purple-400">
                    {payment.gateway_ref || '—'}
                  </td>
                  <td className="px-5 py-4">
                    <PaymentStatusBadge status={payment.status} />
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
