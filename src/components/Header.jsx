import styles from './Header.module.css'

const CouncilLogo = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="44" height="44" rx="4" fill="white" fillOpacity="0.12" />
    <path d="M22 8L26.5 16H17.5L22 8Z" fill="white" />
    <rect x="13" y="18" width="18" height="2" rx="1" fill="white" />
    <rect x="15" y="22" width="4" height="10" rx="1" fill="white" />
    <rect x="20" y="22" width="4" height="10" rx="1" fill="white" />
    <rect x="25" y="22" width="4" height="10" rx="1" fill="white" />
    <rect x="12" y="32" width="20" height="2" rx="1" fill="white" />
  </svg>
)

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <span>South Thornbury District Council</span>
      </div>
      <div className={styles.inner}>
        <a href="/" className={styles.logoLink} aria-label="South Thornbury District Council – home">
          <CouncilLogo />
          <div className={styles.logoText}>
            <span className={styles.councilName}>South Thornbury</span>
            <span className={styles.councilSub}>District Council</span>
          </div>
        </a>
        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            <li><a href="/" className={styles.navLink} aria-current="page">My Account</a></li>
            <li><a href="/" className={styles.navLink}>Services</a></li>
            <li><a href="/" className={styles.navLink}>Pay</a></li>
            <li><a href="/" className={styles.navLink}>Report</a></li>
            <li><a href="/" className={styles.navLink}>Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
