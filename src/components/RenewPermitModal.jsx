import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import styles from './RenewPermitModal.module.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const RENEWAL_AMOUNT = 65.00

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#eef4f0"/>
    <circle cx="24" cy="24" r="18" fill="#4a7c59"/>
    <path d="M15 24l7 7 11-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function PaymentForm({ permitNumber, onSuccess, onCancel }) {
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
    if (submitError) {
      setError(submitError.message)
      setProcessing(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message)
      setProcessing(false)
    } else {
      onSuccess()
    }
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
          Cancel
        </button>
        <button type="submit" className={styles.payBtn} disabled={!stripe || processing}>
          {processing ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Processing…
            </>
          ) : (
            `Pay £${RENEWAL_AMOUNT.toFixed(2)}`
          )}
        </button>
      </div>

      <p className={styles.testNote}>
        Test card: 4242 4242 4242 4242 · Any future date · Any CVC
      </p>
    </form>
  )
}

export default function RenewPermitModal({ permit, onClose }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [succeeded, setSucceeded] = useState(false)

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: RENEWAL_AMOUNT, permitNumber: permit?.permitNumber }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setClientSecret(data.clientSecret)
      })
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const stripeOptions = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2d4a3e',
        colorBackground: '#ffffff',
        borderRadius: '6px',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
  } : null

  return (
    <div className={styles.backdrop} onClick={handleBackdrop} role="dialog" aria-modal="true" aria-labelledby="modal-heading">
      <div className={styles.modal}>

        {succeeded ? (
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
                <span>Amount paid</span>
                <strong>£{RENEWAL_AMOUNT.toFixed(2)}</strong>
              </div>
              <div className={styles.successRow}>
                <span>New expiry</span>
                <strong>31 March 2028</strong>
              </div>
            </div>
            <button className={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        ) : (
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

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Annual resident permit renewal</span>
                <span>£{RENEWAL_AMOUNT.toFixed(2)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>£{RENEWAL_AMOUNT.toFixed(2)}</span>
              </div>
            </div>

            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.spinner} aria-label="Loading payment form" />
                <span>Loading payment form…</span>
              </div>
            )}

            {fetchError && (
              <div className={styles.error} role="alert">
                Failed to initialise payment: {fetchError}
              </div>
            )}

            {clientSecret && stripeOptions && (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <PaymentForm
                  permitNumber={permit?.permitNumber}
                  onSuccess={() => setSucceeded(true)}
                  onCancel={onClose}
                />
              </Elements>
            )}
          </>
        )}
      </div>
    </div>
  )
}
