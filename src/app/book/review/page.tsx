'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Calendar, Clock, User, FileText, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/lib/hooks/use-booking'
import { formatTZS } from '@/lib/utils/currency'
import { createClient } from '@/lib/supabase/client'

const STEPS = ['Service', 'Details', 'Schedule', 'Review']

export default function BookStep4() {
  const router = useRouter()
  const { state, hydrated, totalPrice, goBack, reset } = useBooking()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hydrated && (!state.service || !state.projectTitle)) router.replace('/book')
  }, [hydrated, state.service, state.projectTitle, router])

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/login?redirectTo=/book/review`)
        return
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          service_id: state.service!.id,
          talent_id: state.talentId || null,
          project_title: state.projectTitle,
          project_notes: state.projectNotes || null,
          session_date: state.sessionDate,
          start_time: state.startTime,
          duration_hours: state.durationHours,
          quoted_price: totalPrice,
          total_price: totalPrice,
          status: 'pending',
        })
        .select('id, booking_ref, total_price')
        .single()

      if (error) throw error

      // Send confirmation email (non-blocking — don't fail booking if email fails)
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        await fetch('/api/bookings/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingRef: data.booking_ref,
            bookingId: data.id,
            clientEmail: authUser?.email,
            clientName: profile?.full_name,
            serviceName: state.service?.name,
            sessionDate: state.sessionDate,
            startTime: state.startTime,
            totalPrice: totalPrice,
          }),
        })
      } catch (emailErr) {
        console.error('Email sending failed (non-critical):', emailErr)
      }

      router.push(`/book/confirmation?ref=${data.booking_ref}`)
    } catch (err: any) {
      console.error('Booking error:', err)
      toast.error(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!state.service) return null

  return (
    <div>
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 text-purple-400`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                  i < 3
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-purple-600 border-purple-600 text-white'
                }`}>
                  {i < 3 ? <Check size={12} /> : '4'}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-3 bg-purple-500/40" />
              )}
            </div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white mb-2">Review & Confirm</h1>
        <p className="text-white/50 mb-8">Double-check your booking before confirming.</p>

        <div className="glass rounded-2xl overflow-hidden mb-6">
          {/* Summary rows */}
          {[
            {
              icon: FileText,
              label: 'Service',
              value: state.service.name,
            },
            {
              icon: FileText,
              label: 'Project',
              value: state.projectTitle,
            },
            ...(state.sessionDate
              ? [{
                  icon: Calendar,
                  label: 'Date',
                  value: format(new Date(state.sessionDate), 'EEEE, MMMM d, yyyy'),
                }]
              : []),
            ...(state.startTime
              ? [{
                  icon: Clock,
                  label: 'Time',
                  value: `${state.startTime}${state.durationHours > 1 ? ` · ${state.durationHours} hours` : ''}`,
                }]
              : []),
            ...(state.talentId
              ? [{
                  icon: User,
                  label: 'Talent',
                  value: 'Selected producer',
                }]
              : []),
          ].map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className={`flex items-start gap-4 px-6 py-4 ${i > 0 ? 'border-t border-white/8' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                <Icon size={15} />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-sm font-medium text-white">{value}</p>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="bg-purple-500/8 border-t border-purple-500/20 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <CreditCard size={15} />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide">Total Due</p>
                <p className="text-xs text-white/40">Payment collected after confirmation</p>
              </div>
            </div>
            <p className="text-2xl font-black gradient-text">{formatTZS(totalPrice)}</p>
          </div>
        </div>

        {/* Notes */}
        {state.projectNotes && (
          <div className="glass rounded-xl p-4 mb-6">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Project Notes</p>
            <p className="text-sm text-white/70 leading-relaxed">{state.projectNotes}</p>
          </div>
        )}

        <p className="text-xs text-white/30 mb-6 text-center">
          By confirming, you agree to our terms. Payment details will be sent via email.
        </p>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft size={14} />
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            loading={loading}
            glow
            className="flex-1"
            size="lg"
          >
            Confirm Booking
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
