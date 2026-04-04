'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { useRealtimeChat } from '@/lib/hooks/use-realtime-chat'
import { format } from 'date-fns'

export function ChatSection({
  projectId,
  userId,
}: {
  projectId: string
  userId: string
}) {
  const { messages, loading, sendMessage, bottomRef } = useRealtimeChat(projectId)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    setInput('')
    await sendMessage(input.trim(), userId)
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-80">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-xs text-white/30">No messages yet.</p>
            <p className="text-xs text-white/20">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === userId
            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isOwn
                      ? 'bg-purple-600'
                      : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  }`}
                >
                  {isOwn ? 'Y' : ((msg as any).sender?.full_name?.[0] || 'P')}
                </div>
                <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? 'bg-purple-600 text-white rounded-tr-sm'
                        : 'glass text-white/90 rounded-tl-sm'
                    }`}
                  >
                    {msg.body}
                  </div>
                  <span className="text-[10px] text-white/25 px-1">
                    {format(new Date(msg.created_at), 'HH:mm')}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/8 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
