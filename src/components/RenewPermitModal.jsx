import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import styles from './RenewPermitModal.module.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const PERMIT_OPTIONS = [
  {
    id: '6m',
    label: '6 months',
    amount: 120.00,
    newExpiry: '30 September 2027',
    description: 'Valid for 6 months from renewal',
  },
  {
    id: '12m',
    label: '12 months',
    amount: 240.00,
    newExpiry: '31 March 2028',
    description: 'Best value — save vs two 6-month renewals',
    recommended: true,
  },
]

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#eef4f0"/>
    <circle cx="24" cy="24" r="18" fill="#4a7c59"/>
    <path d="M15 24l7 7 11-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function PaymentForm({ amount, onSuccess, onCancel }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) { setError(submitError.message); setProcessing(false); return }

    const { error: confirmError } = await stripe.confirmPayment({ elements, redirect: 'if_required' })
    if (confirmError) { setError(confirmError.message); setProcessing(false) }
    else onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.paymentElement}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      {error && (
        <div className={styles.error} role="alert">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 4v3M7 9v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}
      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={processing}>
          Back
        </button>
        <button type="submit" className={styles.payBtn} disabled={!stripe || processing}>
          {processing ? <><span className={styles.spinner} aria-hidden="true" />Processing…</> : `Pay £${amount.toFixed(2)}`}
        </button>
      </div>
      <p className={styles.testNote}>Test card: 4242 4242 4242 4242 · Any future date · Any CVC</p>
    </form>
  )
}

export default function RenewPermitModal({ permit, onClose }) {
  const [step, setStep] = useState('select') // 'select' | 'payment' | 'success'
  const [selectedOption, setSelectedOption] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const handleSelectOption = async (option) => {
    setSelectedOption(option)
    setLoading(true)
    setFetchError(null)

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: option.amount, permitNumber: permit?.permitNumber }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const stripeOptions = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: { colorPrimary: '#2d4a3e', colorBackground: '#ffffff', borderRadius: '6px', fontFamily: 'Inter, system-ui, sans-serif' },
    },
  } : null

  return (
    <div className={styles.backdrop} onClick={handleBackdrop} role="dialog" aria-modal="true" aria-labelledby="modal-heading">
      <div className={styles.modal}>

        {/* ── Step: Success ── */}
        {step === 'success' && (
          <div className={styles.success}>
            <CheckIcon />
            <h2 className={styles.successHeading}>Payment successful</h2>
            <p className={styles.successBody}>
              Your parking permit has been renewed. A confirmation will be sent to your registered email address.
            </p>
            <div className={styles.successDetails}>
              <div className={styles.successRow}>
                <span>Permit number</span>
                <strong>{permit?.permitNumber}</strong>
              </div>
              <div className={styles.successRow}>
                <span>Duration</span>
                <strong>{selectedOption?.label}</strong>
              </div>
              <div className={styles.successRow}>
                <span>Amount paid</span>
                <strong>£{selectedOption?.amount.toFixed(2)}</strong>
              </div>
              <div className={styles.successRow}>
                <span>New expiry</span>
                <strong>{selectedOption?.newExpiry}</strong>
              </div>
            </div>
            <button className={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        )}

        {/* ── Step: Duration selection ── */}
        {step === 'select' && (
          <>
            <div className={styles.modalHeader}>
              <div>
                <h2 id="modal-heading" className={styles.modalTitle}>Renew Parking Permit</h2>
                <p className={styles.modalSubtitle}>{permit?.permitNumber} — {permit?.address}</p>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className={styles.selectBody}>
              <p className={styles.selectPrompt}>Choose your renewal duration:</p>
              <div className={styles.optionTiles}>
                {PERMIT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    className={`${styles.optionTile} ${option.recommended ? styles.optionRecommended : ''}`}
                    onClick={() => handleSelectOption(option)}
                    disabled={loading}
                  >
                    {option.recommended && <span className={styles.recommendedBadge}>Best value</span>}
                    <div className={styles.optionDuration}>{option.label}</div>
                    <div className={styles.optionAmount}>£{option.amount.toFixed(2)}</div>
                    <div className={styles.optionExpiry}>Expires {option.newExpiry}</div>
                    <div className={styles.optionDescription}>{option.description}</div>
                  </button>
                ))}
              </div>
              {fetchError && (
                <div className={styles.error} role="alert">Failed to initialise payment: {fetchError}</div>
              )}
              {loading && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner} />
                  <span>Preparing payment…</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Step: Payment ── */}
        {step === 'payment' && clientSecret && stripeOptions && (
          <>
            <div className={styles.modalHeader}>
              <div>
                <h2 id="modal-heading" className={styles.modalTitle}>Complete Payment</h2>
                <p className={styles.modalSubtitle}>{selectedOption?.label} renewal — {permit?.permitNumber}</p>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>{selectedOption?.label} resident permit renewal</span>
                <span>£{selectedOption?.amount.toFixed(2)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>£{selectedOption?.amount.toFixed(2)}</span>
              </div>
            </div>

            <Elements stripe={stripePromise} options={stripeOptions}>
              <PaymentForm
                amount={selectedOption?.amount}
                onSuccess={() => setStep('success')}
                onCancel={() => { setStep('select'); setClientSecret(null) }}
              />
            </Elements>
          </>
        )}

      </div>
    </div>
  )
}
