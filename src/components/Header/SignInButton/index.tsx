import { signIn, signOut, useSession } from 'next-auth/client'

import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export function SignInButton() {
  const [session] = useSession()

  function handlePressButton() {
    session ? signOut() : signIn('github')
  }

  return (
    <button
      type="button"
      onClick={handlePressButton}
      className={styles.signInButton}
    >
      <FaGithub color={session ? '#04d361' : '#eba417'} />
      {session ? session.user.name : 'Sign In with Github'}
      {session && <FiX color="737380" className={styles.closeIcon} />}
    </button>
  )
}
