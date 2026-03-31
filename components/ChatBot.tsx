'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_QUESTIONS = [
  '👨‍💻 Tell me about Vansh',
  '🛠️ What are his skills?',
  '🏆 Any achievements?',
  '📩 How to contact him?',
]

const WELCOME: Message = {
  role: 'assistant',
  content: "Hi! I'm **VanshBot** 👋 — Vansh's AI assistant. Ask me anything about his skills, projects, education, or how to get in touch!",
}

import ReactMarkdown from 'react-markdown'

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'


  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #7F77DD, #C5C0FF)'
            : 'linear-gradient(135deg, #5DCAA5, #7AE6C0)',
        }}
      >
        {isUser
          ? <User size={13} className="text-white" />
          : <Bot  size={13} className="text-[#003829]" />
        }
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'rounded-tr-sm text-white'
            : 'rounded-tl-sm text-text/90 [&>p]:mb-3 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-3 last:[&>ul]:mb-0 [&>ol]:mb-3 [&>ol]:list-decimal [&>ol]:ml-4 [&_strong]:text-mint [&_strong]:font-semibold'
        }`}
        style={
          isUser
            ? { background: 'linear-gradient(135deg, #7F77DD, #5DCAA5)' }
            : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(93,202,165,0.12)' }
        }
      >
        {isUser ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
      </div>

    </motion.div>
  )
}



function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="flex gap-2.5"
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #5DCAA5, #7AE6C0)' }}
      >
        <Bot size={13} className="text-[#003829]" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(93,202,165,0.12)' }}
      >
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-mint/60"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function ChatBot() {
  const [open,      setOpen]      = useState(false)
  const [messages,  setMessages]  = useState<Message[]>([WELCOME])
  const [input,     setInput]     = useState('')
  const [streaming, setStreaming] = useState(false)
  const [unread,    setUnread]    = useState(false)

  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const abortRef   = useRef<AbortController | null>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
      setUnread(false)
    }
  }, [open])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setStreaming(true)

    // Placeholder for the streaming assistant response
    const assistantPlaceholder: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantPlaceholder])

    try {
      abortRef.current = new AbortController()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error('API error')

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        // Update last message live
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: accumulated }
          return updated
        })
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Sorry, I couldn't reach the AI service. Please try again or contact Vansh directly at ${process.env.NEXT_PUBLIC_EMAIL || ''}`,
        }
        return updated
      })
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }, [messages, streaming])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuick = (q: string) => {
    // Determine the raw text without the leading emoji if possible, or just send the whole string.
    // For simplicity and to avoid ES6 regex target errors, we'll just send the string as-is.
    const clean = q.replace(/^[^\w]+/, '').trim()
    sendMessage(clean || q)
  }


  return (
    <>
      {/* ── Attractive Tooltip ── */}
      <AnimatePresence>
        {!open && (
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 10 }}
             transition={{ duration: 0.3, ease: 'easeOut' }}
             className="fixed bottom-8 right-24 z-50 px-4 py-2 rounded-2xl flex items-center gap-2 cursor-pointer shadow-2xl"
             style={{
               background: 'rgba(10,15,30,0.85)',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(93,202,165,0.3)',
             }}
             onClick={() => setOpen(true)}
           >
             <span className="text-sm font-medium text-white">Chat with <span className="text-mint font-semibold">VanshBot</span></span>
             <Sparkles size={14} className="text-mint animate-pulse" />
             {/* CSS Pointer Triangle */}
             <div 
               className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rotate-45"
               style={{ background: 'rgba(10,15,30,0.95)', borderTop: '1px solid rgba(93,202,165,0.3)', borderRight: '1px solid rgba(93,202,165,0.3)' }}
             />
           </motion.div>
        )}
      </AnimatePresence>

      {/* ── Outer Pulse Ring ── */}
      {!open && (
        <motion.div
          animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #5DCAA5, #7F77DD)' }}
        />
      )}

      {/* ── Floating button ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open AI chat'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: open
            ? 'rgba(10,15,30,0.95)'
            : 'linear-gradient(135deg, #5DCAA5, #7F77DD)',
          border: open ? '1px solid rgba(255,255,255,0.1)' : '2px solid rgba(255,255,255,0.15)',
          boxShadow: open ? 'none' : '0 10px 30px rgba(93,202,165,0.4)',
        }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={22} className="text-white" /></motion.span>
            : <motion.span key="chat" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><MessageCircle size={24} className="text-white drop-shadow-md" /></motion.span>
          }
        </AnimatePresence>

        {/* Unread badge */}
        {!open && unread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#0A0F1E] text-white text-[9px] font-black flex items-center justify-center animate-bounce">!</span>
        )}
      </motion.button>


      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatpanel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 flex flex-col w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden"
            style={{
              height: 'min(550px, calc(100vh - 7rem))',
              background: 'rgba(10,15,30,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(93,202,165,0.2)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 30px rgba(93,202,165,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(93,202,165,0.12)' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5DCAA5, #7AE6C0)' }}
              >
                <Sparkles size={16} className="text-[#003829]" />
              </div>
              <div>
                <p className="text-text font-semibold text-sm leading-tight">VanshBot</p>
                <p className="text-muted text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block" />
                  Powered by Llama 3.1
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              <AnimatePresence>
                {streaming && messages[messages.length - 1]?.content === '' && <TypingIndicator />}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Quick question chips */}
            {messages.length <= 2 && !streaming && (
              <div
                className="px-4 pb-3 flex flex-wrap gap-2 flex-shrink-0"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
              >
                {QUICK_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => handleQuick(q)}
                    className="text-[11px] px-3 py-1.5 rounded-full font-medium transition-colors duration-200"
                    style={{
                      background: 'rgba(93,202,165,0.08)',
                      border: '1px solid rgba(93,202,165,0.2)',
                      color: '#5DCAA5',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(93,202,165,0.16)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(93,202,165,0.08)')}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3 flex gap-2 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(93,202,165,0.12)' }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything about Vansh…"
                disabled={streaming}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-text placeholder-muted/50 focus:outline-none focus:border-mint/40 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #5DCAA5, #7AE6C0)' }}
              >
                {streaming
                  ? <Loader2 size={16} className="text-[#003829] animate-spin" />
                  : <Send     size={15} className="text-[#003829]" />
                }
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
