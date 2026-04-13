'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Lock, Shield, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

// ── Schemas ──────────────────────────────────────────────────

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

type ProfileData = z.infer<typeof profileSchema>
type PasswordData = z.infer<typeof passwordSchema>

// ── Section wrapper ───────────────────────────────────────────

function Section({ title, description, icon: Icon, children }: {
  title: string
  description: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/6">
      <div className="px-6 py-5 border-b border-white/8 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={16} className="text-purple-400" />
        </div>
        <div>
          <h2 className="font-bold text-white text-sm">{title}</h2>
          <p className="text-xs text-white/40 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  })

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  })

  // Load current profile
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single()

      if (profile) {
        profileForm.reset({
          full_name: profile.full_name ?? '',
          phone: profile.phone ?? '',
        })
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSaveProfile = async ({ full_name, phone }: ProfileData) => {
    setProfileLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({ full_name, phone: phone || null })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Profile updated')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const onChangePassword = async ({ password }: PasswordData) => {
    setPasswordLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      passwordForm.reset()
      setPasswordSaved(true)
      setTimeout(() => setPasswordSaved(false), 4000)
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your admin account</p>
      </div>

      <div className="space-y-5">

        {/* Account info (read-only email) */}
        <Section title="Account" description="Your login credentials" icon={Shield}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Email address</label>
            <div className="w-full rounded-xl bg-white/3 border border-white/8 px-4 py-2.5 text-sm text-white/40 select-all">
              {email || '—'}
            </div>
            <p className="text-xs text-white/25">Email cannot be changed here. Contact your Supabase project to update it.</p>
          </div>
        </Section>

        {/* Profile */}
        <Section title="Profile" description="Update your display name and contact info" icon={User}>
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your name"
              error={profileForm.formState.errors.full_name?.message}
              {...profileForm.register('full_name')}
            />
            <Input
              label="Phone (optional)"
              placeholder="+255..."
              {...profileForm.register('phone')}
            />
            <div className="flex justify-end pt-1">
              <Button type="submit" loading={profileLoading} size="sm">
                Save Profile
              </Button>
            </div>
          </form>
        </Section>

        {/* Password */}
        <Section title="Change Password" description="Set a new password for your account" icon={Lock}>
          {passwordSaved ? (
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={16} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-400">Password updated successfully</p>
                <p className="text-xs text-white/30 mt-0.5">You may need to log in again on other devices.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                hint="At least 8 characters"
                error={passwordForm.formState.errors.password?.message}
                autoComplete="new-password"
                {...passwordForm.register('password')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                error={passwordForm.formState.errors.confirm?.message}
                autoComplete="new-password"
                {...passwordForm.register('confirm')}
              />
              <div className="flex justify-end pt-1">
                <Button type="submit" loading={passwordLoading} size="sm">
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </Section>

      </div>
    </div>
  )
}
