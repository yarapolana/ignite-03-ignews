import { loadStripe } from '@stripe/stripe-js'

export const getStripeClient = async () => {
  return await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
}
// export const getStripeClient = () =>
//   loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
