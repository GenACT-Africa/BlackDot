'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, ClipboardList, CheckCircle2, ArrowLeft, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

type Method = 'receipt' | 'transaction' | null

function PaymentConfirmContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingRef = searchParams.get('ref')
  const bookingId = searchParams.get('booking_id')

  const [method, setMethod] = useState<Method>(null)
  const [transactionId, setTransactionId] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  const handleSubmit = async () => {
    if (method === 'receipt' && !file) {
      toast.error('Please select a receipt file to upload')
      return
    }
    if (method === 'transaction' && !transactionId.trim()) {
      toast.error('Please enter your transaction ID')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(`/login?redirectTo=/dashboard/payments/confirm?ref=${bookingRef}&booking_id=${bookingId}`); return }

      let receiptUrl: string | null = null

      // Upload receipt file if provided
      if (method === 'receipt' && file) {
        const ext = file.name.split('.').pop()
        const path = `receipts/${user.id}/${bookingRef}-${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(path, file, { upsert: false })

        if (uploadError) throw new Error('Failed to upload receipt: ' + uploadError.message)
        receiptUrl = path
      }

      // Save payment record
      const { error } = await supabase.from('payments').insert({
        booking_id: bookingId || null,
        client_id: user.id,
        amount_tzs: 0, // admin will confirm exact amount
        status: 'processing',
        payment_method: method === 'receipt' ? 'receipt_upload' : 'bank_transfer',
        gateway_ref: method === 'transaction' ? transactionId.trim() : receiptUrl,
        notes: notes.trim() || null,
      })

      if (error) throw error

      setDone(true)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={40} className="text-green-400" />
        </motion.div>
        <h1 className="text-3xl font-black text-white mb-3">Payment Submitted!</h1>
        <p className="text-white/50 mb-2">
          We've received your payment confirmation for booking <span className="text-purple-400 font-mono font-bold">{bookingRef}</span>.
        </p>
        <p className="text-white/40 text-sm mb-8">Our team will verify and update your booking status within a few hours.</p>
        <Button glow onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white mb-2">Confirm Payment</h1>
        <p className="text-white/50 mb-2">
          Booking reference: <span className="text-purple-400 font-mono font-bold">{bookingRef}</span>
        </p>
        <p className="text-white/40 text-sm mb-8">
          Choose how you'd like to confirm your payment below.
        </p>

        {/* Method selection */}
        {!method && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setMethod('receipt')}
              className="glass rounded-2xl p-6 text-left border border-white/8 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500/25 transition-colors">
                <Upload size={20} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Upload Receipt</h3>
              <p className="text-xs text-white/40">Upload a screenshot or PDF of your M-Pesa or bank receipt</p>
            </button>

            <button
              onClick={() => setMethod('transaction')}
              className="glass rounded-2xl p-6 text-left border border-white/8 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500/25 transition-colors">
                <ClipboardList size={20} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Transaction ID</h3>
              <p className="text-xs text-white/40">Paste your M-Pesa confirmation code or bank transaction reference</p>
            </button>
          </div>
        )}

        {/* Receipt upload */}
        {method === 'receipt' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white">Upload Receipt</h2>
              <button onClick={() => { setMethod(null); setFile(null) }} className="text-white/30 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <label className="block">
              <div className={`glass rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
                file ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 hover:border-purple-500/30'
              }`}>
                <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                {file ? (
                  <div>
                    <CheckCircle2 size={32} className="text-green-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-white/40 mt-1">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} className="text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/60">Click to upload receipt</p>
                    <p className="text-xs text-white/30 mt-1">PNG, JPG, or PDF · Max 10MB</p>
                  </div>
                )}
              </div>
            </label>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Additional Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Paid via M-Pesa on April 5 at 10:30am..."
                rows={3}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 border border-white/8 focus:outline-none focus:border-purple-500/50 resize-none"
              />
            </div>

            <Button onClick={handleSubmit} loading={loading} glow className="w-full" size="lg">
              Submit Payment Confirmation
            </Button>
          </motion.div>
        )}

        {/* Transaction ID */}
        {method === 'transaction' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white">Enter Transaction Details</h2>
              <button onClick={() => { setMethod(null); setTransactionId(''); setNotes('') }} className="text-white/30 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Transaction ID / Confirmation Code</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. QK7X2ABCDE or TXN123456789"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 border border-white/8 focus:outline-none focus:border-purple-500/50 font-mono"
              />
              <p className="text-xs text-white/30 mt-1">This is the code you received via SMS after paying</p>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Additional Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Paid via Equity Bank on April 5, amount TZS 500,000..."
                rows={3}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 border border-white/8 focus:outline-none focus:border-purple-500/50 resize-none"
              />
            </div>

            <Button onClick={handleSubmit} loading={loading} glow className="w-full" size="lg">
              Submit Payment Confirmation
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default function PaymentConfirmPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <PaymentConfirmContent />
    </Suspense>
  )
}
