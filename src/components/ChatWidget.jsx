import { useState, useRef, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { resident, parkingPermit } from '../data/residentData'
import styles from './ChatWidget.module.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
const RENEWAL_AMOUNT = 65.00

// ── Conversation engine ────────────────────────────────────────────────────

const detectIntent = (text) => {
  const t = text.toLowerCase()
  if (/\b(hi|hello|hey|morning|afternoon|evening)\b/.test(t)) return 'greet'
  if (/\b(renew|renewal|permit|parking|pay|payment|expire|expiry)\b/.test(t)) return 'permit'
  if (/\b(yes|yeah|yep|please|go ahead|sure|ok|okay|proceed|confirm)\b/.test(t)) return 'confirm'
  if (/\b(bin|bins|collection|rubbish|recycling|waste|green bin|blue bin)\b/.test(t)) return 'bins'
  if (/\b(road|roadwork|works|digging|traffic|closed|chester)\b/.test(t)) return 'roadworks'
  if (/\b(council tax|tax)\b/.test(t)) return 'tax'
  return 'default'
}

const RESPONSES = {
  greet: () => `Hello ${resident.name.split(' ')[0]}! How can I help you today? I can assist with your parking permit, bin collections, local roadworks, council tax, and other Hamberly services.`,
  permit: () => `I can see your parking permit **${parkingPermit.permitNumber}** registered to ${resident.address.line1}, ${resident.address.postcode}. It's currently active and expires on 31 March 2027.\n\nThe annual renewal fee is £${RENEWAL_AMOUNT.toFixed(2)}. Would you like me to process a renewal for you now?`,
  bins: () => `Your next collections for ${resident.address.line1} are:\n\n• **General waste** (black bin) — Thursday 11 June\n• **Recycling** (blue bin) — Thursday 18 June\n• **Garden waste** (green bin) — Wednesday 17 June\n\nAll collections are fortnightly. Garden waste runs until 28 November.`,
  roadworks: () => `I can see one planned roadwork near your address:\n\n**Severn Trent Water** are carrying out water main replacement on Elm Close from **16–20 June 2026**. The road will be closed to through traffic but resident access will be maintained at all times.\n\nFor enquiries contact Severn Trent on 0800 783 4444.`,
  tax: () => `Your council tax for ${resident.address.line1} is managed under Band C. You can view your account, make payments, or set up a direct debit via the Pay section of this portal.\n\nIs there anything specific about your council tax I can help with?`,
  default: [
    `Thanks for getting in touch. Could you give me a little more detail so I can point you to the right service?`,
    `I'd be happy to help with that. For the most accurate information, could you tell me a little more about what you need?`,
    `I can help you with council services, parking permits, bin collections, roadworks, and more. What would you like assistance with today?`,
  ],
}

const getResponse = (intent, conversationState) => {
  if (intent === 'confirm' && conversationState === 'permit_offered') {
    return { type: 'payment' }
  }
  if (typeof RESPONSES[intent] === 'function') {
    return { type: 'text', text: RESPONSES[intent]() }
  }
  const arr = RESPONSES[intent] || RESPONSES.default
  return { type: 'text', text: arr[Math.floor(Math.random() * arr.length)] }
}

// ── Inline payment form ────────────────────────────────────────────────────

function InlinePaymentForm({ onSuccess, onCancel }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handlePay = async () => {
    if (!stripe || !elements) return
    setProcessing(true)
    setError(null)
    const { error: submitErr } = await elements.submit()
    if (submitErr) { setError(submitErr.message); setProcessing(false); return }
    const { error: confirmErr } = await stripe.confirmPayment({ elements, redirect: 'if_required' })
    if (confirmErr) { setError(confirmErr.message); setProcessing(false) }
    else onSuccess()
  }

  return (
    <div className={styles.inlinePayment}>
      <div className={styles.inlinePaymentHeader}>
        <div className={styles.inlinePaymentTitle}>Permit Renewal — £{RENEWAL_AMOUNT.toFixed(2)}</div>
        <div className={styles.inlinePaymentSub}>{parkingPermit.permitNumber} · {resident.address.line1}</div>
      </div>
      <div className={styles.inlinePaymentElement}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      {error && <div className={styles.inlinePaymentError}>{error}</div>}
      <div className={styles.inlinePaymentActions}>
        <button className={styles.inlineCancelBtn} onClick={onCancel} disabled={processing}>Cancel</button>
        <button className={styles.inlinePayBtn} onClick={handlePay} disabled={!stripe || processing}>
          {processing ? <><span className={styles.miniSpinner} />Processing…</> : `Pay £${RENEWAL_AMOUNT.toFixed(2)}`}
        </button>
      </div>
      <p className={styles.inlineTestNote}>Test: 4242 4242 4242 4242 · any future date · any CVC</p>
    </div>
  )
}

function InlinePaymentCard({ onSuccess, onCancel }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: RENEWAL_AMOUNT, permitNumber: parkingPermit.permitNumber }),
    })
      .then(r => r.json())
      .then(d => setClientSecret(d.clientSecret))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className={styles.inlineLoading}><span className={styles.miniSpinner} /> Loading payment…</div>

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: { colorPrimary: '#2d4a3e', borderRadius: '6px', fontFamily: 'Inter, system-ui, sans-serif' },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <InlinePaymentForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  )
}

// ── Avatar ──────────────────────────────────────────────────────────────────

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
      <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(50,4)" fill="#4a9c22"/>
      <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(24,2) rotate(-50)" fill="#3a7c1a"/>
      <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(76,2) rotate(50)" fill="#4a9c22"/>
    </svg>
  </div>
)

// ── Message renderer ────────────────────────────────────────────────────────

function MessageBubble({ msg, onPaymentSuccess, onPaymentCancel }) {
  if (msg.type === 'payment') {
    return (
      <div className={`${styles.message} ${styles.agentMessage}`}>
        <AgentAvatar />
        <InlinePaymentCard onSuccess={onPaymentSuccess} onCancel={onPaymentCancel} />
      </div>
    )
  }

  if (msg.type === 'payment_success') {
    return (
      <div className={`${styles.message} ${styles.agentMessage}`}>
        <AgentAvatar />
        <div className={`${styles.bubble} ${styles.agentBubble} ${styles.successBubble}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="#4a7c59"/>
            <path d="M5 8l2.5 2.5L11 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {msg.text}
        </div>
      </div>
    )
  }

  // Render basic markdown bold (**text**)
  const renderText = (text) => text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g)
    return (
      <span key={i}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    )
  })

  return (
    <div className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.agentMessage}`}>
      {msg.role === 'agent' && <AgentAvatar />}
      <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.agentBubble}`}>
        {renderText(msg.text)}
      </div>
    </div>
  )
}

// ── Main widget ─────────────────────────────────────────────────────────────

const WELCOME = {
  id: 'welcome', role: 'agent', type: 'text',
  text: `Hello ${resident.name.split(' ')[0]}! I'm the Hamberly digital assistant. I can help you with your parking permit, bin collections, local roadworks, council tax, and more. What can I help you with today?`,
}

export default function ChatWidget() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [conversationState, setConversationState] = useState('idle')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const addMessage = (msg) => setMessages(prev => [...prev, { id: Date.now() + Math.random(), ...msg }])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || typing) return
    setInput('')

    addMessage({ role: 'user', type: 'text', text })

    const intent = detectIntent(text)
    const response = getResponse(intent, conversationState)

    setTyping(true)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))
    setTyping(false)

    if (response.type === 'payment') {
      addMessage({ role: 'agent', type: 'text', text: `Great — I'll open the payment form for you now. Please complete the details below.` })
      await new Promise(r => setTimeout(r, 400))
      addMessage({ role: 'agent', type: 'payment' })
      setConversationState('payment')
    } else {
      addMessage({ role: 'agent', type: 'text', text: response.text })
      if (intent === 'permit') setConversationState('permit_offered')
      else if (intent !== 'confirm') setConversationState('idle')
    }

    inputRef.current?.focus()
  }

  const handlePaymentSuccess = () => {
    setMessages(prev => prev.filter(m => m.type !== 'payment'))
    addMessage({
      role: 'agent', type: 'payment_success',
      text: `Payment confirmed ✓ Your permit ${parkingPermit.permitNumber} has been renewed until 31 March 2028. A confirmation will be sent to your registered email address.`,
    })
    setConversationState('idle')
  }

  const handlePaymentCancel = () => {
    setMessages(prev => prev.filter(m => m.type !== 'payment'))
    addMessage({ role: 'agent', type: 'text', text: `No problem — your payment has been cancelled. Is there anything else I can help you with?` })
    setConversationState('idle')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <section className={`${styles.widget} ${collapsed ? styles.collapsed : ''}`} aria-label="Hamberly digital assistant">
      <div className={styles.widgetHeader}>
        <div className={styles.widgetHeaderLeft}>
          <div className={styles.onlineDot} aria-hidden="true" />
          <div>
            <div className={styles.widgetTitle}>Hamberly Assistant</div>
            <div className={styles.widgetSubtitle}>Powered by Salesforce Einstein</div>
          </div>
        </div>
        <button className={styles.collapseBtn} onClick={() => setCollapsed(c => !c)} aria-label={collapsed ? 'Expand' : 'Collapse'}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {!collapsed && (
        <>
          <div className={styles.thread} role="log" aria-live="polite">
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentCancel={handlePaymentCancel}
              />
            ))}
            {typing && (
              <div className={`${styles.message} ${styles.agentMessage}`}>
                <AgentAvatar />
                <div className={`${styles.bubble} ${styles.agentBubble} ${styles.loadingBubble}`}>
                  <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className={styles.inputArea}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your Hamberly services…"
              rows={1}
              aria-label="Chat message"
              disabled={typing}
            />
            <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim() || typing} aria-label="Send">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 9l13-6.5L9 9l6 6.5L2 9zm0 0h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </section>
  )
}
