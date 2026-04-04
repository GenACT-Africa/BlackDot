'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, LayoutDashboard, MessageSquare, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function BookingConfirmationContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  useEffect(() => {
    try { sessionStorage.removeItem('booking_draft') } catch {}
  }, [])

  return (
    <div className="flex flex-col items-center text-center py-10">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
      >
        <CheckCircle2 size={40} className="text-green-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-4xl font-black text-white mb-3">Booking Confirmed!</h1>
        <p className="text-white/50 mb-6 max-w-sm mx-auto">
          Your session has been booked. Our team will reach out within 24 hours to confirm details.
        </p>

        {ref && (
          <div className="glass-purple rounded-xl px-6 py-4 mb-8 inline-block">
            <p className="text-xs text-purple-400 uppercase tracking-widest mb-1">Booking Reference</p>
            <p className="text-2xl font-black text-white tracking-widest">{ref}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
          {[
            { icon: '📧', title: 'Check Your Email', body: 'Confirmation and payment instructions sent.' },
            { icon: '📊', title: 'Track Progress', body: 'Log into your dashboard to monitor status.' },
            { icon: '💬', title: 'Stay in Touch', body: 'Chat directly with your producer in-app.' },
          ].map((item) => (
            <div key={item.title} className="glass rounded-xl p-5">
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-white/50">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button size="lg" glow className="group">
              <LayoutDashboard size={16} />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function BookingConfirmation() {
  return (
    <Suspense fallback={null}>
      <BookingConfirmationContent />
    </Suspense>
  )
}
