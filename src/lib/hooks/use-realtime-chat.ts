'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'

export function useRealtimeChat(projectId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load existing messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles(id, full_name, avatar_url)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })
        .limit(100)

      setMessages((data as Message[]) || [])
      setLoading(false)
    }

    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`project-chat-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          // Fetch sender info
          const { data: msg } = await supabase
            .from('messages')
            .select('*, sender:profiles(id, full_name, avatar_url)')
            .eq('id', payload.new.id)
            .single()

          if (msg) {
            setMessages((prev) => [...prev, msg as Message])
            setTimeout(() => {
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 50)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  const sendMessage = async (body: string, senderId: string) => {
    if (!body.trim()) return

    // Optimistic
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      project_id: projectId,
      sender_id: senderId,
      body,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])

    await supabase.from('messages').insert({
      project_id: projectId,
      sender_id: senderId,
      body,
    })
  }

  return { messages, loading, sendMessage, bottomRef }
}
