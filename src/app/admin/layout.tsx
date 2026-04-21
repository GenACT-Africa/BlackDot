import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/layout/admin-layout-client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const [{ count: pendingPayments }, { count: unreadMessages }] = await Promise.all([
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
    supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('read', false).eq('archived', false),
  ])

  return (
    <AdminLayoutClient pendingPayments={pendingPayments || 0} unreadMessages={unreadMessages || 0}>
      {children}
    </AdminLayoutClient>
  )
}
