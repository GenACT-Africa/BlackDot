import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/layout/admin-sidebar'

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
    <div className="flex h-screen overflow-hidden bg-brand-black">
      <AdminSidebar pendingPayments={pendingPayments || 0} unreadMessages={unreadMessages || 0} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
