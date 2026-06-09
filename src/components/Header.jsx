import styles from './Header.module.css'

const TreeLogo = () => (
  <svg width="44" height="44" viewBox="0 0 100 108" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Roots */}
    <path d="M49 92 Q38 97 24 104" stroke="#1a0c05" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 95 Q45 101 41 108" stroke="#1a0c05" strokeWidth="2" strokeLinecap="round"/>
    <path d="M50 95 Q55 101 59 108" stroke="#1a0c05" strokeWidth="2" strokeLinecap="round"/>
    <path d="M51 92 Q62 97 76 104" stroke="#1a0c05" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 94 Q50 99 50 106" stroke="#1a0c05" strokeWidth="2" strokeLinecap="round"/>

    {/* Trunk — two offset strokes for twisted look */}
    <path d="M44 92 C43 78 43 64 45 52 C47 44 48 38 50 30" stroke="#2c1810" strokeWidth="9" strokeLinecap="round"/>
    <path d="M56 92 C57 78 57 64 55 52 C53 44 52 38 50 30" stroke="#4a2818" strokeWidth="6" strokeLinecap="round"/>
    <path d="M50 90 C50 76 50 62 50 52 C50 44 50 38 50 30" stroke="#6b3820" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>

    {/* Left main branch */}
    <path d="M46 62 C37 57 26 50 16 43" stroke="#2c1810" strokeWidth="4.5" strokeLinecap="round"/>
    {/* Left upper sub-branch */}
    <path d="M30 52 C22 45 14 38 6 30" stroke="#2c1810" strokeWidth="3" strokeLinecap="round"/>
    {/* Left lower sub-branch */}
    <path d="M22 48 C15 46 7 44 2 39" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Left tip */}
    <path d="M16 43 C10 36 6 28 4 20" stroke="#2c1810" strokeWidth="2" strokeLinecap="round"/>

    {/* Right main branch */}
    <path d="M54 62 C63 57 74 50 84 43" stroke="#2c1810" strokeWidth="4.5" strokeLinecap="round"/>
    {/* Right upper sub-branch */}
    <path d="M70 52 C78 45 86 38 94 30" stroke="#2c1810" strokeWidth="3" strokeLinecap="round"/>
    {/* Right lower sub-branch */}
    <path d="M78 48 C85 46 93 44 98 39" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Right tip */}
    <path d="M84 43 C90 36 94 28 96 20" stroke="#2c1810" strokeWidth="2" strokeLinecap="round"/>

    {/* Top centre branch */}
    <path d="M50 30 C50 22 50 14 50 6" stroke="#2c1810" strokeWidth="3" strokeLinecap="round"/>
    {/* Top left */}
    <path d="M50 20 C43 14 34 9 26 4" stroke="#2c1810" strokeWidth="2" strokeLinecap="round"/>
    {/* Top right */}
    <path d="M50 20 C57 14 66 9 74 4" stroke="#2c1810" strokeWidth="2" strokeLinecap="round"/>

    {/* ── LEAVES ── each is a pointed-oval path, positioned + rotated */}

    {/* Top centre */}
    <path d="M0-7 C3-7 5-3 5 0 C5 4 3 7 0 7 C-3 7-5 4-5 0 C-5-3-3-7 0-7Z" transform="translate(50,4) rotate(0)"   fill="#3a7c1a"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(45,8) rotate(-25)"  fill="#5ab832"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(55,8) rotate(25)"   fill="#4a9c22"/>

    {/* Top-left branch */}
    <path d="M0-7 C3-7 5-3 5 0 C5 4 3 7 0 7 C-3 7-5 4-5 0 C-5-3-3-7 0-7Z" transform="translate(24,2) rotate(-50)"  fill="#4a9c22"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(29,6) rotate(-30)"  fill="#3a7c1a"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(20,7) rotate(-65)"  fill="#5ab832"/>

    {/* Top-right branch */}
    <path d="M0-7 C3-7 5-3 5 0 C5 4 3 7 0 7 C-3 7-5 4-5 0 C-5-3-3-7 0-7Z" transform="translate(76,2) rotate(50)"   fill="#4a9c22"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(71,6) rotate(30)"   fill="#3a7c1a"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(80,7) rotate(65)"   fill="#5ab832"/>

    {/* Left upper sub-branch */}
    <path d="M0-7 C3-7 5-3 5 0 C5 4 3 7 0 7 C-3 7-5 4-5 0 C-5-3-3-7 0-7Z" transform="translate(4,28) rotate(-80)"  fill="#3a7c1a"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(9,34) rotate(-55)"  fill="#5ab832"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(4,40) rotate(-90)"  fill="#4a9c22"/>

    {/* Left lower sub-branch */}
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(2,37) rotate(-95)"  fill="#3a7c1a"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(8,44) rotate(-75)"  fill="#4a9c22"/>

    {/* Left tip */}
    <path d="M0-7 C3-7 5-3 5 0 C5 4 3 7 0 7 C-3 7-5 4-5 0 C-5-3-3-7 0-7Z" transform="translate(3,19) rotate(-85)"  fill="#5ab832"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(8,25) rotate(-60)"  fill="#3a7c1a"/>

    {/* Right upper sub-branch */}
    <path d="M0-7 C3-7 5-3 5 0 C5 4 3 7 0 7 C-3 7-5 4-5 0 C-5-3-3-7 0-7Z" transform="translate(96,28) rotate(80)"  fill="#3a7c1a"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(91,34) rotate(55)"  fill="#5ab832"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(96,40) rotate(90)"  fill="#4a9c22"/>

    {/* Right lower sub-branch */}
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(98,37) rotate(95)"  fill="#3a7c1a"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(92,44) rotate(75)"  fill="#4a9c22"/>

    {/* Right tip */}
    <path d="M0-7 C3-7 5-3 5 0 C5 4 3 7 0 7 C-3 7-5 4-5 0 C-5-3-3-7 0-7Z" transform="translate(97,19) rotate(85)"  fill="#5ab832"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(92,25) rotate(60)"  fill="#3a7c1a"/>

    {/* Mid left branch leaves */}
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(26,50) rotate(-25)" fill="#4a9c22"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(18,44) rotate(-15)" fill="#3a7c1a"/>

    {/* Mid right branch leaves */}
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(74,50) rotate(25)"  fill="#4a9c22"/>
    <path d="M0-6 C3-6 4-3 4 0 C4 3 3 6 0 6 C-3 6-4 3-4 0 C-4-3-3-6 0-6Z" transform="translate(82,44) rotate(15)"  fill="#3a7c1a"/>
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
