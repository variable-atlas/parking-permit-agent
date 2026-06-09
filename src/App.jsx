import Header from './components/Header'
import BinCollectionCard from './components/BinCollectionCard'
import ParkingPermitCard from './components/ParkingPermitCard'
import RoadworksCard from './components/RoadworksCard'
import { resident } from './data/residentData'
import styles from './App.module.css'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function App() {
  const { name, address, accountNumber } = resident

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main} id="main-content">
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeInner}>
            <div className={styles.welcomeText}>
              <div className={styles.greeting}>{getGreeting()}</div>
              <h1 className={styles.residentName}>{name}</h1>
              <p className={styles.residentAddress}>
                {address.line1}, {address.town}, {address.postcode}
              </p>
            </div>
            <div className={styles.accountMeta}>
              <div className={styles.accountLabel}>Account reference</div>
              <div className={styles.accountNumber}>{accountNumber}</div>
              <a href="/" className={styles.accountLink}>Manage account settings</a>
            </div>
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.alertBanner} role="region" aria-label="Important notices">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>
              <strong>Bank holiday collections:</strong> Collections scheduled for Monday 25 August will move to Tuesday 26 August.
            </span>
          </div>

          <section aria-label="Your services">
            <h2 className={styles.sectionHeading}>Your services</h2>
            <p className={styles.sectionSubheading}>
              Services and information personalised for {address.line1}, {address.postcode}
            </p>
            <div className={styles.cardsGrid}>
              <BinCollectionCard />
              <ParkingPermitCard />
              <RoadworksCard />
            </div>
          </section>

          <section className={styles.quickLinksSection} aria-labelledby="quick-links-heading">
            <h2 id="quick-links-heading" className={styles.sectionHeading}>Other council services</h2>
            <div className={styles.quickLinks}>
              {[
                { label: 'Pay council tax', href: '/', icon: '£' },
                { label: 'Apply for housing benefit', href: '/', icon: '⌂' },
                { label: 'Report fly-tipping', href: '/', icon: '!' },
                { label: 'Planning applications', href: '/', icon: '⊞' },
                { label: 'Electoral registration', href: '/', icon: '✓' },
                { label: 'Business rates', href: '/', icon: '≡' },
              ].map(({ label, href, icon }) => (
                <a key={label} href={href} className={styles.quickLink}>
                  <span className={styles.quickLinkIcon} aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                  <svg className={styles.arrow} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div>
              <div className={styles.footerCouncil}>South Thornbury District Council</div>
              <div className={styles.footerAddress}>Council Offices, High Street, Thornbury, BS35 1HF</div>
              <div className={styles.footerAddress}>Tel: 01454 862 000 &nbsp;|&nbsp; enquiries@sthornbury.gov.uk</div>
            </div>
            <div className={styles.footerLinks}>
              <a href="/">Accessibility statement</a>
              <a href="/">Privacy policy</a>
              <a href="/">Cookie policy</a>
              <a href="/">Terms of use</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 South Thornbury District Council. All rights reserved.</span>
            <span>Registered in England. Company no. 00987654</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
