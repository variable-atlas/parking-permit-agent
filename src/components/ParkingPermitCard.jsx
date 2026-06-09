import { parkingPermit } from '../data/residentData'
import styles from './ParkingPermitCard.module.css'

const formatDate = (isoDate) => {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const daysUntilExpiry = (isoDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(isoDate + 'T00:00:00')
  return Math.round((expiry - today) / 86400000)
}

export default function ParkingPermitCard() {
  const { permitNumber, type, zone, status, issueDate, expiryDate, registeredAddress, vehicle } = parkingPermit
  const days = daysUntilExpiry(expiryDate)
  const expiryWarning = days <= 90

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
        <span className={`${styles.statusBadge} ${status === 'active' ? styles.active : styles.inactive}`}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.permitNumber}>
          <span className={styles.permitLabel}>Permit number</span>
          <span className={styles.permitValue}>{permitNumber}</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <dt>Type</dt>
            <dd>{type}</dd>
          </div>
          <div className={styles.field}>
            <dt>Zone</dt>
            <dd>{zone}</dd>
          </div>
          <div className={styles.field}>
            <dt>Vehicle</dt>
            <dd>{vehicle.colour} {vehicle.make} {vehicle.model}</dd>
          </div>
          <div className={styles.field}>
            <dt>Registration</dt>
            <dd>
              <span className={styles.plate}>{vehicle.registration}</span>
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Registered address</dt>
            <dd>{registeredAddress}</dd>
          </div>
          <div className={styles.field}>
            <dt>Issue date</dt>
            <dd>{formatDate(issueDate)}</dd>
          </div>
        </div>

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
          {expiryWarning ? (
            <span className={styles.expiryBadge}>Renew now</span>
          ) : (
            <span className={styles.expiryDays}>{Math.round(days / 30)} months remaining</span>
          )}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <a href="/" className={styles.footerLink}>Renew permit</a>
        <a href="/" className={styles.footerLink}>Update vehicle details</a>
        <a href="/" className={styles.footerLink}>View permit history</a>
      </div>
    </article>
  )
}
