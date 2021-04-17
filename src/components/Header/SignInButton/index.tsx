import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export function SignInButton() {
  const isUserLoggedIn = true

  return (
    <button type="button" className={styles.signInButton}>
      <FaGithub color={isUserLoggedIn ? "#04d361" : "#eba417"} />
      {isUserLoggedIn ? 'Yara Polana' : 'Sign In with Github'}
      {isUserLoggedIn && (
        <FiX color="737380" className={styles.closeIcon} />
      )}
    </button>
  )
}
