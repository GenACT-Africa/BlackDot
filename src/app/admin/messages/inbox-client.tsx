'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { Mail, Phone, Archive, ArchiveRestore, Send, Reply, Inbox, AlertCircle, Loader2 } from 'lucide-react'
import { format, isToday, isThisWeek } from 'date-fns'
import { cn } from '@/lib/utils/cn'
import { markAsRead, toggleArchive, sendReply } from './actions'
import type { SavedReply } from './actions'

export type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  created_at: string
  read: boolean | null
  archived: boolean | null
  replies: SavedReply[]
}

type Filter = 'inbox' | 'unread' | 'archived'

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  if (isToday(date)) return format(date, 'h:mm a')
  if (isThisWeek(date)) return format(date, 'EEE')
  return format(date, 'MMM d')
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' }
  return (
    <div className={cn('rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-white', sizes[size])}>
      {name[0].toUpperCase()}
    </div>
  )
}

function AdminAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' }
  return (
    <div className={cn('rounded-full bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center flex-shrink-0 font-bold text-white border border-purple-400/30', sizes[size])}>
      B
    </div>
  )
}

export function InboxClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialMessages.find(m => !m.archived)?.id ?? initialMessages[0]?.id ?? null
  )
  const [filter, setFilter] = useState<Filter>('inbox')
  const [replyText, setReplyText] = useState('')
  const [replyStatus, setReplyStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [replyError, setReplyError] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const threadBottomRef = useRef<HTMLDivElement>(null)

  const selected = messages.find(m => m.id === selectedId) ?? null

  const filtered = messages.filter(m => {
    if (filter === 'archived') return !!m.archived
    if (filter === 'unread') return !m.read && !m.archived
    return !m.archived
  })

  const unreadCount = messages.filter(m => !m.read && !m.archived).length

  // Scroll to bottom of thread when replies change
  useEffect(() => {
    threadBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.replies.length])

  const handleSelect = (msg: ContactMessage) => {
    setSelectedId(msg.id)
    setReplyText('')
    setReplyStatus('idle')
    setReplyError(null)
    if (!msg.read) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
      startTransition(() => markAsRead(msg.id))
    }
  }

  const handleArchive = (msg: ContactMessage) => {
    const newArchived = !msg.archived
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, archived: newArchived } : m))
    if (newArchived && selectedId === msg.id) {
      const remaining = filtered.filter(m => m.id !== msg.id)
      setSelectedId(remaining[0]?.id ?? null)
    }
    startTransition(() => toggleArchive(msg.id, newArchived))
  }

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return
    const body = replyText.trim()
    setReplyStatus('sending')
    setReplyError(null)

    const result = await sendReply(
      selected.id,
      selected.email,
      selected.name,
      selected.subject,
      body,
    )

    if (result.success) {
      // Append reply to thread optimistically (use returned DB row if available)
      const newReply: SavedReply = result.reply ?? {
        id: crypto.randomUUID(),
        inquiry_id: selected.id,
        body,
        created_at: new Date().toISOString(),
      }
      setMessages(prev =>
        prev.map(m =>
          m.id === selected.id
            ? { ...m, replies: [...m.replies, newReply] }
            : m
        )
      )
      setReplyText('')
      setReplyStatus('idle')
    } else {
      setReplyStatus('error')
      setReplyError(result.error ?? 'Failed to send.')
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-white">Messages</h1>
          {unreadCount > 0 && (
            <span className="text-xs font-bold text-purple-300 bg-purple-500/15 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
          {(['inbox', 'unread', 'archived'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex items-center gap-1.5',
                filter === f
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              )}
            >
              {f}
              {f === 'unread' && unreadCount > 0 && (
                <span className={cn(
                  'text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none',
                  filter === 'unread' ? 'bg-white/20 text-white' : 'bg-purple-500/30 text-purple-300'
                )}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex-1 min-h-0 flex gap-4">

        {/* ── Left panel: message list ── */}
        <div className="w-72 flex-shrink-0 glass rounded-2xl overflow-hidden flex flex-col border border-white/6">
          {filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <Inbox size={18} className="text-white/20" />
              </div>
              <p className="text-white/30 text-sm">No messages</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {filtered.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={cn(
                    'w-full text-left px-4 py-3.5 transition-all flex items-start gap-2.5',
                    selectedId === msg.id
                      ? 'bg-purple-500/12 border-l-2 border-purple-500'
                      : 'border-l-2 border-transparent hover:bg-white/4'
                  )}
                >
                  {/* Unread dot */}
                  <div className="mt-2 flex-shrink-0 w-2">
                    {!msg.read && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  </div>

                  <Avatar name={msg.name} size="sm" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-1 mb-0.5">
                      <p className={cn(
                        'text-sm truncate leading-tight',
                        !msg.read ? 'font-semibold text-white' : 'font-medium text-white/60'
                      )}>
                        {msg.name}
                      </p>
                      <p className="text-[10px] text-white/25 flex-shrink-0 leading-tight">
                        {/* Show time of last reply if exists, else original */}
                        {msg.replies.length > 0
                          ? formatTime(msg.replies[msg.replies.length - 1].created_at)
                          : formatTime(msg.created_at)}
                      </p>
                    </div>
                    <p className={cn(
                      'text-xs truncate leading-snug',
                      !msg.read ? 'text-white/60' : 'text-white/35'
                    )}>
                      {msg.subject}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {msg.replies.length > 0 && (
                        <span className="text-[10px] text-purple-400/70 flex items-center gap-0.5">
                          <Reply size={9} />
                          {msg.replies.length}
                        </span>
                      )}
                      <p className="text-xs text-white/20 truncate leading-snug">
                        {msg.replies.length > 0
                          ? msg.replies[msg.replies.length - 1].body.substring(0, 45)
                          : msg.message.substring(0, 55)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right panel: message detail + thread ── */}
        {selected ? (
          <div className="flex-1 min-w-0 glass rounded-2xl flex flex-col overflow-hidden border border-white/6">

            {/* Message header */}
            <div className="px-6 py-4 border-b border-white/8 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <Avatar name={selected.name} size="lg" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-base">{selected.name}</p>
                      {!selected.read && (
                        <span className="text-[9px] font-black text-purple-400 bg-purple-500/15 border border-purple-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <a
                        href={`mailto:${selected.email}`}
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-300 transition-colors"
                      >
                        <Mail size={11} />
                        {selected.email}
                      </a>
                      {selected.phone && (
                        <a
                          href={`tel:${selected.phone}`}
                          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-300 transition-colors"
                        >
                          <Phone size={11} />
                          {selected.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-xs text-white/25">
                    {format(new Date(selected.created_at), 'MMM d, yyyy · h:mm a')}
                  </p>
                  <button
                    onClick={() => handleArchive(selected)}
                    title={selected.archived ? 'Move to inbox' : 'Archive'}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                      selected.archived
                        ? 'text-amber-400 bg-amber-500/12 border border-amber-500/20 hover:bg-amber-500/20'
                        : 'text-white/35 hover:text-white/70 hover:bg-white/8 border border-transparent'
                    )}
                  >
                    {selected.archived
                      ? <><ArchiveRestore size={13} /> Unarchive</>
                      : <><Archive size={13} /> Archive</>
                    }
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/6">
                <h2 className="text-base font-bold text-white">{selected.subject}</h2>
              </div>
            </div>

            {/* Thread: original message + replies */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Original message bubble */}
              <div className="flex items-start gap-3">
                <Avatar name={selected.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <p className="text-xs font-semibold text-white/70">{selected.name}</p>
                    <p className="text-[10px] text-white/25">{format(new Date(selected.created_at), 'MMM d · h:mm a')}</p>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm text-white/65 leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reply bubbles */}
              {selected.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-3 flex-row-reverse">
                  <AdminAvatar size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1.5 flex-row-reverse">
                      <p className="text-xs font-semibold text-purple-300">You</p>
                      <p className="text-[10px] text-white/25">{format(new Date(reply.created_at), 'MMM d · h:mm a')}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl rounded-tr-sm px-4 py-3 ml-auto">
                      <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                        {reply.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Anchor for auto-scroll */}
              <div ref={threadBottomRef} />
            </div>

            {/* Reply composer */}
            <div className="px-6 py-4 border-t border-white/8 flex-shrink-0 bg-white/2">
              <div className="flex items-center gap-2 mb-2.5">
                <Reply size={12} className="text-white/30" />
                <p className="text-xs font-semibold text-white/35 uppercase tracking-wider">
                  Reply to {selected.name}
                </p>
              </div>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleReply()
                }}
                placeholder={`Write your reply to ${selected.name}...`}
                rows={3}
                disabled={replyStatus === 'sending'}
                className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors resize-none disabled:opacity-50"
              />
              {replyStatus === 'error' && replyError && (
                <div className="flex items-center gap-2 mt-2 text-xs text-red-400">
                  <AlertCircle size={12} />
                  {replyError}
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-white/20">
                  ⌘ + Enter to send · directly to {selected.email}
                </p>
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim() || replyStatus === 'sending'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
                >
                  {replyStatus === 'sending' ? (
                    <><Loader2 size={13} className="animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={13} /> Send Reply</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 glass rounded-2xl flex flex-col items-center justify-center text-center border border-white/6">
            <div className="w-14 h-14 rounded-2xl bg-white/4 flex items-center justify-center mb-4">
              <Mail size={22} className="text-white/15" />
            </div>
            <p className="text-white/30 text-sm font-medium">Select a message to read</p>
            <p className="text-white/15 text-xs mt-1">
              {filtered.length === 0 ? 'Your inbox is empty' : `${filtered.length} message${filtered.length !== 1 ? 's' : ''} in ${filter}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
