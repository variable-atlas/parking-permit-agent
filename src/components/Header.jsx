import styles from './Header.module.css'

const TreeLogo = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="44" height="44" rx="6" fill="white" fillOpacity="0.12" />
    {/* Canopy layers */}
    <ellipse cx="22" cy="17" rx="10" ry="9" fill="#4caf6e" />
    <ellipse cx="22" cy="14" rx="8" ry="7" fill="#5dbf7f" />
    <ellipse cx="17" cy="19" rx="6" ry="5.5" fill="#4caf6e" />
    <ellipse cx="27" cy="19" rx="6" ry="5.5" fill="#4caf6e" />
    <ellipse cx="22" cy="20" rx="7" ry="6" fill="#5dbf7f" />
    {/* Trunk */}
    <rect x="19.5" y="26" width="5" height="10" rx="2" fill="#a0785a" />
    {/* Ground line */}
    <rect x="13" y="35" width="18" height="2" rx="1" fill="white" fillOpacity="0.3" />
  </svg>
)

export default function Header({ onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <span>Hamberly County Council — My Hamberly resident portal</span>
      </div>
      <div className={styles.inner}>
        <a href="/" className={styles.logoLink} aria-label="Hamberly County Council – home">
          <TreeLogo />
          <div className={styles.logoText}>
            <span className={styles.councilName}>Hamberly</span>
            <span className={styles.councilSub}>County Council</span>
          </div>
        </a>
        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            <li><a href="/" className={styles.navLink} aria-current="page">My Account</a></li>
            <li><a href="/" className={styles.navLink}>Hamberly News</a></li>
            <li><a href="/" className={styles.navLink}>Services</a></li>
            <li><a href="/" className={styles.navLink}>Pay</a></li>
            <li><a href="/" className={styles.navLink}>Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
