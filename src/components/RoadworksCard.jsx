import { roadworks } from '../data/residentData'
import styles from './RoadworksCard.module.css'

const formatDate = (isoDate) => {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })
}

const statusConfig = {
  upcoming: { label: 'Upcoming', className: 'upcoming' },
  active: { label: 'In progress', className: 'active' },
  completed: { label: 'Completed', className: 'completed' },
}

const daysUntil = (isoDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(isoDate + 'T00:00:00')
  return Math.round((d - today) / 86400000)
}

export default function RoadworksCard() {
  return (
    <article className={styles.card} aria-labelledby="roadworks-heading">
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 16L10 4l7 12H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            <path d="M10 9v3M10 14v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 id="roadworks-heading" className={styles.cardTitle}>Roadworks Near You</h2>
        <span className={styles.countBadge}>
          {roadworks.length} planned
        </span>
      </div>

      <div className={styles.cardBody}>
        {roadworks.length === 0 ? (
          <div className={styles.empty}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke="#d4d7dc" strokeWidth="1.5"/>
              <path d="M11 16l4 4 6-7" stroke="#d4d7dc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>No roadworks are currently planned for your area.</p>
          </div>
        ) : (
          roadworks.map((work) => {
            const days = daysUntil(work.startDate)
            const config = statusConfig[work.status] || statusConfig.upcoming

            return (
              <div key={work.id} className={styles.workItem}>
                <div className={styles.workHeader}>
                  <div className={styles.workMeta}>
                    <span className={`${styles.statusDot} ${styles[config.className]}`} aria-hidden="true" />
                    <span className={`${styles.statusLabel} ${styles[config.className]}`}>{config.label}</span>
                    <span className={styles.refNumber}>{work.id}</span>
                  </div>
                  {days > 0 && days <= 14 && (
                    <span className={styles.timingBadge}>
                      Starts in {days} day{days !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className={styles.workPromoter}>{work.promoter}</div>
                <div className={styles.workDescription}>{work.description}</div>

                <dl className={styles.workDetails}>
                  <div className={styles.detailRow}>
                    <dt>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M7 1.5A3.5 3.5 0 017 8.5c-2 0-4-2-4-3.5A3.5 3.5 0 017 1.5z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                        <circle cx="7" cy="5" r="1" fill="currentColor"/>
                        <path d="M2 12.5c1-2 6-2 10 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      Location
                    </dt>
                    <dd>{work.location}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M1.5 6h11M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      Dates
                    </dt>
                    <dd>{formatDate(work.startDate)} – {formatDate(work.endDate)}</dd>
                  </div>
                </dl>

                <div className={styles.impactBox}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={styles.impactIcon}>
                    <path d="M7 1.5L12.5 12H1.5L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
                    <path d="M7 5.5v3M7 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span>{work.impact}</span>
                </div>

                <div className={styles.contact}>
                  <strong>Enquiries:</strong> {work.contact}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className={styles.cardFooter}>
        <a href="/" className={styles.footerLink}>View all roadworks in South Thornbury</a>
        <a href="/" className={styles.footerLink}>Report a roads issue</a>
      </div>
    </article>
  )
}
