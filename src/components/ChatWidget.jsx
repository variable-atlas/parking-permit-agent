import { useState, useRef, useEffect } from 'react'
import { resident } from '../data/residentData'
import styles from './ChatWidget.module.css'

const WELCOME = {
  id: 'welcome',
  role: 'agent',
  text: `Hello ${resident.name.split(' ')[0]}! I'm the Hamberly digital assistant. I can help you with your parking permit, bin collections, local roadworks, council tax, and other services. What can I help you with today?`,
}

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 9l13-6.5L9 9l6 6.5L2 9zm0 0h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const AgentAvatar = () => (
  <div className={styles.avatar} aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 100 108" fill="none">
      <path d="M49 92 Q38 97 24 104" stroke="#1a0c05" strokeWidth="3" strokeLinecap="round"/>
      <path d="M51 92 Q62 97 76 104" stroke="#1a0c05" strokeWidth="3" strokeLinecap="round"/>
      <path d="M44 92 C43 78 43 64 45 52 C47 44 48 38 50 30" stroke="#2c1810" strokeWidth="9" strokeLinecap="round"/>
      <path d="M56 92 C57 78 57 64 55 52 C53 44 52 38 50 30" stroke="#4a2818" strokeWidth="6" strokeLinecap="round"/>
      <path d="M46 62 C37 57 26 50 16 43" stroke="#2c1810" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M54 62 C63 57 74 50 84 43" stroke="#2c1810" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M50 30 C50 22 50 14 50 6" stroke="#2c1810" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 20 C43 14 34 9 26 4" stroke="#2c1810" strokeWidth="2" strokeLinecap="round"/>
      <path d="M50 20 C57 14 66 9 74 4" stroke="#2c1810" strokeWidth="2" strokeLinecap="round"/>
      <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(50,4)" fill="#4a9c22"/>
      <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(24,2) rotate(-50)" fill="#3a7c1a"/>
      <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(76,2) rotate(50)" fill="#4a9c22"/>
      <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(4,28) rotate(-80)" fill="#3a7c1a"/>
      <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(96,28) rotate(80)" fill="#3a7c1a"/>
    </svg>
  </div>
)

export default function ChatWidget() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [session, setSession] = useState(null) // { accessToken, conversationId }
  const [connecting, setConnecting] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const eventSourceRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Clean up SSE on unmount
  useEffect(() => {
    return () => eventSourceRef.current?.close()
  }, [])

  const startSession = async () => {
    setConnecting(true)
    setError(null)
    try {
      const res = await fetch('/api/chat/session', { method: 'POST' })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSession(data)
      connectStream(data)
      return data
    } catch (err) {
      setError(`Could not connect to assistant: ${err.message}`)
      return null
    } finally {
      setConnecting(false)
    }
  }

  const connectStream = ({ accessToken, conversationId }) => {
    eventSourceRef.current?.close()
    const url = `/api/chat/stream?conversationId=${encodeURIComponent(conversationId)}&accessToken=${encodeURIComponent(accessToken)}`
    const es = new EventSource(url)

    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data)
        handleStreamEvent(payload)
      } catch {
        // non-JSON heartbeat lines — ignore
      }
    }

    es.onerror = () => {
      // SSE reconnects automatically; only surface persistent errors
    }

    eventSourceRef.current = es
  }

  const handleStreamEvent = (event) => {
    // Salesforce MIAW SSE event types
    const type = event?.conversationEntry?.entryType || event?.type

    if (type === 'Message') {
      const entry = event.conversationEntry
      const text = entry?.entryPayload?.abstractMessage?.staticContent?.text
        || entry?.entryPayload?.text
        || ''
      if (text && entry?.sender?.role !== 'EndUser') {
        setMessages((prev) => [
          ...prev,
          { id: entry.identifier || Date.now(), role: 'agent', text },
        ])
        setLoading(false)
      }
    }

    if (type === 'TypingStartedIndicator') setLoading(true)
    if (type === 'TypingStoppedIndicator') setLoading(false)
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading || connecting) return

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text }])
    setLoading(true)

    try {
      let activeSession = session
      if (!activeSession) {
        activeSession = await startSession()
        if (!activeSession) return
      }

      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: activeSession.accessToken,
          conversationId: activeSession.conversationId,
          text,
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)
      // Response will arrive via SSE stream
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }

    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section className={`${styles.widget} ${collapsed ? styles.collapsed : ''}`} aria-label="Hamberly digital assistant">
      <div className={styles.widgetHeader}>
        <div className={styles.widgetHeaderLeft}>
          <div className={styles.onlineDot} aria-hidden="true" />
          <div>
            <div className={styles.widgetTitle}>Hamberly Assistant</div>
            <div className={styles.widgetSubtitle}>
              {connecting ? 'Connecting…' : 'Powered by Salesforce Einstein'}
            </div>
          </div>
        </div>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand chat' : 'Collapse chat'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {!collapsed && (
        <>
          <div className={styles.thread} role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.agentMessage}`}>
                {msg.role === 'agent' && <AgentAvatar />}
                <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.agentBubble}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className={`${styles.message} ${styles.agentMessage}`}>
                <AgentAvatar />
                <div className={`${styles.bubble} ${styles.agentBubble} ${styles.loadingBubble}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorMsg} role="alert">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className={styles.inputArea}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your Hamberly services…"
              rows={1}
              aria-label="Chat message"
              disabled={loading || connecting}
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!input.trim() || loading || connecting}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </>
      )}
    </section>
  )
}
