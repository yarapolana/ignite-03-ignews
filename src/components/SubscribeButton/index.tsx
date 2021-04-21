import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeClient } from '../../services/stripe-client'
import styles from './styles.module.scss'

export function SubscribeButton() {
  const [session] = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
    }

    // @ts-ignore
    if (session?.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const {
        data: { sessionId }
      } = await api.post<{ sessionId: string }>('/subscribe')

      const stripe = await getStripeClient()

      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSubscribe}
      className={styles.subscribeButton}
    >
      Subscribe
    </button>
  )
}
