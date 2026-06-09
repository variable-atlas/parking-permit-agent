import { binCollections } from '../data/residentData'
import styles from './BinCollectionCard.module.css'

const formatDate = (isoDate) => {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const daysUntil = (isoDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(isoDate + 'T00:00:00')
  return Math.round((target - today) / 86400000)
}

const CollectionRow = ({ bin, colour, icon }) => {
  const days = daysUntil(bin.nextCollection)
  const urgencyClass = days <= 1 ? styles.urgent : days <= 3 ? styles.soon : ''

  return (
    <div className={styles.row}>
      <div className={styles.rowLeft}>
        <span className={styles.binIcon} style={{ backgroundColor: colour }} aria-hidden="true">
          {icon}
        </span>
        <div>
          <div className={styles.binLabel}>{bin.label}</div>
          <div className={styles.binDate}>{formatDate(bin.nextCollection)}</div>
        </div>
      </div>
      <span className={`${styles.badge} ${urgencyClass}`}>
        {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days`}
      </span>
    </div>
  )
}

export default function BinCollectionCard() {
  const { generalWaste, recycling, gardenWaste } = binCollections

  return (
    <article className={styles.card} aria-labelledby="bins-heading">
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 2h8l1 3H5L6 2zm-3 3h14v2H3V5zm2 2v9a1 1 0 001 1h8a1 1 0 001-1V7H5zm3 2h4v6H8V9z" fill="currentColor" />
          </svg>
        </div>
        <h2 id="bins-heading" className={styles.cardTitle}>Bin Collections</h2>
      </div>
      <div className={styles.cardBody}>
        <CollectionRow
          bin={generalWaste}
          colour="#2d3748"
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="1" fill="white" fillOpacity="0.8"/></svg>
          }
        />
        <CollectionRow
          bin={recycling}
          colour="#1565c0"
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2l2 3H5l2-3zm-4 4h8l-1 5H4L3 6z" fill="white" fillOpacity="0.8"/></svg>
          }
        />
        <CollectionRow
          bin={gardenWaste}
          colour="#2e7d32"
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2c1.5 1.5 2 3 1 5 1.5-.5 3-2 3-4C9.5 2 8 2 7 2zm-1 5C4.5 5.5 3 4 3 2c-1 2 0 4 1.5 4.5C3 8 2 9.5 2 11h5c0-1.5-.5-3-1-4z" fill="white" fillOpacity="0.8"/></svg>
          }
        />
        <div className={styles.gardenNote}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={styles.infoIcon}>
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 7v5M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {gardenWaste.note}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <a href="/" className={styles.footerLink}>View full collection calendar</a>
        <a href="/" className={styles.footerLink}>Report a missed collection</a>
      </div>
    </article>
  )
}
