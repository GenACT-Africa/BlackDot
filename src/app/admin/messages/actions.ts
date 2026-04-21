'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import * as postmark from 'postmark'

export type SavedReply = {
  id: string
  inquiry_id: string
  body: string
  created_at: string
}

export async function markAsRead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_inquiries')
    .update({ read: true })
    .eq('id', id)
  if (error) console.error('[markAsRead]', error.message)
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}

export async function toggleArchive(id: string, archived: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_inquiries')
    .update({ archived })
    .eq('id', id)
  if (error) console.error('[toggleArchive]', error.message)
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}

export async function sendReply(
  inquiryId: string,
  toEmail: string,
  toName: string,
  subject: string,
  body: string,
): Promise<{ success: boolean; error?: string; reply?: SavedReply }> {
  const apiKey = process.env.POSTMARK_API_KEY
  if (!apiKey) return { success: false, error: 'Email service not configured.' }

  const client = new postmark.ServerClient(apiKey)
  const fromAddress = process.env.REPLY_FROM_EMAIL ?? 'BlackDot Music <bookings@theblackdotmusic.com>'

  // 1. Send the email
  try {
    await client.sendEmail({
      From: fromAddress,
      To: toEmail,
      Subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
      TextBody: body,
      HtmlBody: `<div style="font-family:sans-serif;font-size:14px;color:#333;line-height:1.6">${body.replace(/\n/g, '<br/>')}</div>`,
    })
  } catch (err: any) {
    return { success: false, error: err.message }
  }

  // 2. Persist the reply so it shows in the thread on refresh
  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('contact_replies')
    .insert({ inquiry_id: inquiryId, body })
    .select('id, inquiry_id, body, created_at')
    .single()

  if (dbError) {
    console.error('[sendReply] DB insert failed:', dbError.message)
    return { success: false, error: `Email sent but reply not saved: ${dbError.message}` }
  }

  revalidatePath('/admin/messages')

  return { success: true, reply: data }
}
