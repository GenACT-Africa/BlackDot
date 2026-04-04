'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({ email: z.string().email('Valid email required') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-400" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Check your email</h1>
        <p className="text-white/50 text-sm mb-6">
          We&apos;ve sent a password reset link. Check your inbox.
        </p>
        <Link href="/login">
          <Button variant="secondary" className="w-full">Back to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Forgot password?</h1>
        <p className="text-white/50 text-sm">Enter your email to get a reset link.</p>
      </div>
      <div className="glass rounded-2xl p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            icon={<Mail size={15} />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" loading={loading} className="w-full" size="lg" glow>
            Send Reset Link
          </Button>
        </form>
      </div>
      <p className="text-center text-sm text-white/40 mt-5">
        <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
          Back to Login
        </Link>
      </p>
    </div>
  )
}
