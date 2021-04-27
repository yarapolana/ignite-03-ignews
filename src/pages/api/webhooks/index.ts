import { NextApiRequest, NextApiResponse } from 'next'

import { Readable } from 'stream'
import Stripe from 'stripe'

import { stripe } from '../../../services/stripe'
import { saveSubscription } from '../_lib/manage-subscription'
import { RELEVANT_EVENTS, SUBSCRIPTION_EVENTS } from './constants'

const buffer = async (readable: Readable) => {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }

  const bufferedReq = await buffer(req)
  const secret = req.headers['stripe-signature']

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      bufferedReq,
      secret,
      process.env.STRIPE_WEBHOOK_KEY
    )
  } catch (err) {
    // TODO add sentry
    return res.status(400).send(`Webhook error: ${err.message}`)
  }

  const eventType = event.type

  if (!RELEVANT_EVENTS.has(eventType)) {
    return res.json({ received: true })
  }

  try {
    switch (eventType) {
      case SUBSCRIPTION_EVENTS.updated:
      case SUBSCRIPTION_EVENTS.deleted: {
        const subscription = event.data.object as Stripe.Subscription

        await saveSubscription(
          {
            subscriptionId: subscription.id,
            customerId: subscription.customer.toString()
          },
          false
        )
        break
      }
      case 'checkout.session.completed': {
        const { subscription, customer } = event.data
          .object as Stripe.Checkout.Session

        await saveSubscription(
          {
            subscriptionId: subscription.toString(),
            customerId: customer.toString()
          },
          true
        )
        break
      }
      default:
        throw new Error('Unhandled event.')
    }
  } catch {
    return res.json({ error: 'Webhook handler failed.' })
  }

  return res.send('Subscription Completed')
}

export const config = {
  api: {
    bodyParser: false
  }
}
