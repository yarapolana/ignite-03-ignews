import Link from 'next/link'
import { ActiveLink } from './ActiveLink'
import { SignInButton } from './SignInButton'
import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <img src="/images/logo.svg" alt="IG News" />
          </a>
        </Link>
        <nav>
          <ActiveLink href="/">Home</ActiveLink>
          <ActiveLink href="/posts">Posts</ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}
