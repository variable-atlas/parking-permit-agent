import { parkingPermit } from '../data/residentData'
import styles from './ParkingPermitCard.module.css'

const formatDate = (isoDate) => {
  if (!isoDate) return '—'
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const daysUntilExpiry = (isoDate) => {
  if (!isoDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(isoDate + 'T00:00:00')
  return Math.round((expiry - today) / 86400000)
}

const fromSalesforce = (record) => ({
  permitNumber: record.Name,
  status: record.Active__c ? 'active' : 'inactive',
  address: record.Address__c || '—',
  paid: record.Paid__c,
  startDate: record.Permit_Start_Date__c || null,
  expiryDate: record.Permit_End_Date__c || null,
  value: record.Permit_Value__c != null
    ? `£${Number(record.Permit_Value__c).toFixed(2)}`
    : null,
})

const fromFakeData = (data) => ({
  permitNumber: data.permitNumber,
  status: data.status,
  address: data.registeredAddress,
  paid: true,
  startDate: data.issueDate,
  expiryDate: data.expiryDate,
  value: null,
})

export default function ParkingPermitCard({ sfData, loading }) {
  const raw = sfData ? fromSalesforce(sfData) : fromFakeData(parkingPermit)
  const { permitNumber, status, address, paid, startDate, expiryDate, value } = raw
  const days = daysUntilExpiry(expiryDate)
  const expiryWarning = days !== null && days <= 90

  return (
    <article className={styles.card} aria-labelledby="permit-heading">
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M7 8h2.5c1 0 1.5.5 1.5 1.5S10.5 11 9.5 11H7V8zm0 3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M13 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 id="permit-heading" className={styles.cardTitle}>Parking Permit</h2>
        {loading ? (
          <span className={styles.loadingBadge}>Loading…</span>
        ) : (
          <span className={`${styles.statusBadge} ${status === 'active' ? styles.active : styles.inactive}`}>
            {status === 'active' ? 'Active' : 'Inactive'}
          </span>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.permitNumber}>
          <span className={styles.permitLabel}>Permit number</span>
          <span className={styles.permitValue}>{permitNumber}</span>
        </div>

        <dl className={styles.grid}>
          <div className={styles.field}>
            <dt>Registered address</dt>
            <dd>{address}</dd>
          </div>
          <div className={styles.field}>
            <dt>Start date</dt>
            <dd>{formatDate(startDate)}</dd>
          </div>
          {value && (
            <div className={styles.field}>
              <dt>Permit value</dt>
              <dd>{value}</dd>
            </div>
          )}
          <div className={styles.field}>
            <dt>Payment status</dt>
            <dd>
              <span className={paid ? styles.paidBadge : styles.unpaidBadge}>
                {paid ? 'Paid' : 'Unpaid'}
              </span>
            </dd>
          </div>
        </dl>

        {expiryDate && (
          <div className={`${styles.expiry} ${expiryWarning ? styles.expiryWarning : ''}`}>
            <div className={styles.expiryLeft}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div className={styles.expiryLabel}>Permit expires</div>
                <div className={styles.expiryDate}>{formatDate(expiryDate)}</div>
              </div>
            </div>
            {days !== null && (
              expiryWarning ? (
                <span className={styles.expiryBadge}>Renew now</span>
              ) : (
                <span className={styles.expiryDays}>{Math.round(days / 30)} months remaining</span>
              )
            )}
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <a href="/" className={styles.footerLink}>Renew permit</a>
        <a href="/" className={styles.footerLink}>View permit history</a>
      </div>
    </article>
  )
}
