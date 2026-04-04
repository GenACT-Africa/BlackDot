'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  full_name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ full_name, email, password }: FormData) => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    toast.success('Account created! Welcome to BlackDot.')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Create account</h1>
        <p className="text-white/50 text-sm">Join 200+ artists on BlackDot</p>
      </div>

      <div className="glass rounded-2xl p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Your name"
            icon={<User size={15} />}
            error={errors.full_name?.message}
            autoComplete="name"
            {...register('full_name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            icon={<Mail size={15} />}
            error={errors.email?.message}
            autoComplete="email"
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={15} />}
            error={errors.password?.message}
            hint="At least 8 characters"
            autoComplete="new-password"
            {...register('password')}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={15} />}
            error={errors.confirm?.message}
            autoComplete="new-password"
            {...register('confirm')}
          />

          <Button type="submit" loading={loading} className="w-full" size="lg" glow>
            Create Account
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-white/40 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
          Log in
        </Link>
      </p>
    </div>
  )
}
