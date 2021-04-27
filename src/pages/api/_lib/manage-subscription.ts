import { query as q } from 'faunadb'

import { fauna } from '../../../services/fauna'
import { stripe } from '../../../services/stripe'

type Subscription = {
  subscriptionId: string
  customerId: string
}

type UserRef = {
  id: string
}

export const saveSubscription = async (
  { subscriptionId, customerId }: Subscription,
  isCreatingSubscription: boolean
) => {
  const userRef = await fauna.query<UserRef>(
    q.Select(
      'ref',
      q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId))
    )
  )
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // const [userRef, subscription] = await Promise.all([
  //   userRefPromise,
  //   subscriptionPromise
  // ])

  const subscriptionData = {
    id: subscription.id,
    user: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  if (isCreatingSubscription) {
    await fauna.query(
      q.Create(q.Collection('subscriptions'), {
        data: subscriptionData
      })
    )
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('subscription_by_id'), subscriptionId))
        ),
        { data: subscriptionData }
      )
    )
  }
}
