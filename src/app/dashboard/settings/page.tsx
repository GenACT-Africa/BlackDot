'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name required'),
  phone: z.string().optional(),
})

type ProfileData = z.infer<typeof profileSchema>

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  })

  const onSave = async (data: ProfileData) => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: data.full_name, phone: data.phone || null })
      .eq('id', user.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Profile updated!')
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Settings</h1>

      <div className="max-w-lg space-y-6">
        {/* Profile */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-5">Profile</h2>
          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <Input
              label="Full Name"
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <Input
              label="Phone (optional)"
              placeholder="+255..."
              {...register('phone')}
            />
            <Button type="submit" loading={loading} glow>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Password */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-2">Password</h2>
          <p className="text-sm text-white/50 mb-4">
            Change your password by requesting a reset link.
          </p>
          <Button
            variant="secondary"
            onClick={async () => {
              const { data: { user } } = await supabase.auth.getUser()
              if (!user?.email) return
              await supabase.auth.resetPasswordForEmail(user.email)
              toast.success('Reset link sent to your email')
            }}
          >
            Send Reset Link
          </Button>
        </div>
      </div>
    </div>
  )
}
