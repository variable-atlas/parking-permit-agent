import { useState, useEffect } from 'react'
import Header from './components/Header'
import BinCollectionCard from './components/BinCollectionCard'
import ParkingPermitCard from './components/ParkingPermitCard'
import RoadworksCard from './components/RoadworksCard'
import { resident } from './data/residentData'
import { initiateLogin, handleCallback, getStoredAuth, logout } from './services/salesforceAuth'
import { fetchParkingPermit } from './services/salesforceService'
import styles from './App.module.css'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// auth states: 'checking' | 'unauthenticated' | 'authenticated' | 'error'

export default function App() {
  const { name, address, accountNumber } = resident
  const [authState, setAuthState] = useState('checking')
  const [authError, setAuthError] = useState(null)
  const [sfPermit, setSfPermit] = useState(null)
  const [permitLoading, setPermitLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      // We're back from Salesforce — exchange the code for a token
      window.history.replaceState({}, '', window.location.pathname)
      handleCallback(code)
        .then(() => setAuthState('authenticated'))
        .catch((err) => {
          setAuthError(err.message)
          setAuthState('error')
        })
    } else if (getStoredAuth()) {
      setAuthState('authenticated')
    } else {
      setAuthState('unauthenticated')
    }
  }, [])

  useEffect(() => {
    if (authState !== 'authenticated') return
    setPermitLoading(true)
    fetchParkingPermit()
      .then((record) => setSfPermit(record))
      .catch((err) => {
        if (err.message === 'Session expired') setAuthState('unauthenticated')
        // If the custom object doesn't exist yet, silently fall back to fake data
        console.warn('Salesforce permit fetch failed, using demo data:', err.message)
      })
      .finally(() => setPermitLoading(false))
  }, [authState])

  const handleLogout = () => {
    logout()
    setAuthState('unauthenticated')
    setSfPermit(null)
  }

  if (authState === 'checking') {
    return (
      <div className={styles.layout}>
        <Header />
        <div className={styles.loadingScreen}>
          <div className={styles.spinner} aria-label="Loading" />
          <p>Connecting to your account…</p>
        </div>
      </div>
    )
  }

  if (authState === 'unauthenticated' || authState === 'error') {
    return (
      <div className={styles.layout}>
        <Header />
        <main className={styles.loginScreen}>
          <div className={styles.loginCard}>
            <div className={styles.loginCouncilName}>South Thornbury District Council</div>
            <h1 className={styles.loginHeading}>Sign in to your account</h1>
            <p className={styles.loginBody}>
              Access your personalised council services including bin collections,
              parking permits, and local information.
            </p>
            {authError && (
              <div className={styles.loginError} role="alert">
                <strong>Sign in failed:</strong> {authError}
              </div>
            )}
            <button className={styles.loginButton} onClick={initiateLogin}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 1.5a7.5 7.5 0 100 15A7.5 7.5 0 009 1.5zm0 3a2.25 2.25 0 110 4.5A2.25 2.25 0 019 4.5zm0 10.5a5.25 5.25 0 01-4.5-2.55c.023-1.5 3-2.325 4.5-2.325 1.492 0 4.477.825 4.5 2.325A5.25 5.25 0 019 15z" fill="currentColor"/>
              </svg>
              Sign in with Salesforce
            </button>
            <p className={styles.loginNote}>
              You will be redirected to the South Thornbury secure sign-in page.
            </p>
          </div>
        </main>
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBottom}>
              <span>© 2026 South Thornbury District Council. All rights reserved.</span>
              <span>Registered in England. Company no. 00987654</span>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      <Header onLogout={handleLogout} />

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
              <button onClick={handleLogout} className={styles.accountLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Sign out
              </button>
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

          {sfPermit && (
            <div className={styles.sfBanner} role="status">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Parking permit data loaded live from Salesforce
            </div>
          )}

          <section aria-label="Your services">
            <h2 className={styles.sectionHeading}>Your services</h2>
            <p className={styles.sectionSubheading}>
              Services and information personalised for {address.line1}, {address.postcode}
            </p>
            <div className={styles.cardsGrid}>
              <BinCollectionCard />
              <ParkingPermitCard sfData={sfPermit} loading={permitLoading} />
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
