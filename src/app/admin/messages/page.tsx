import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { InboxClient } from './inbox-client'
import type { ContactMessage } from './inbox-client'

export const metadata: Metadata = {
  title: 'Message Inbox – Admin',
  description: 'Read, reply to, and archive client inquiries in the BlackDot Music admin message inbox — track conversation threads and manage unread messages efficiently.',
}


export default async function AdminMessagesPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('contact_inquiries')
    .select('id, name, email, phone, subject, message, created_at, read, archived, replies:contact_replies(id, inquiry_id, body, created_at)')
    .order('created_at', { ascending: false })

  const messages: ContactMessage[] = (data ?? []).map((m: any) => ({
    id: m.id,
    name: m.name ?? '',
    email: m.email ?? '',
    phone: m.phone ?? null,
    subject: m.subject ?? '(no subject)',
    message: m.message ?? '',
    created_at: m.created_at,
    read: m.read ?? false,
    archived: m.archived ?? false,
    replies: (m.replies ?? []).sort(
      (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
  }))

  return <InboxClient initialMessages={messages} />
}
