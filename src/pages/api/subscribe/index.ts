import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'

import { fauna } from '../../../services/fauna'
import { stripe } from '../../../services/stripe'

type FaunaUser = {
  ref: {
    id: string
  }
  data: {
    email: string
    stripe_customer_id?: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  } else {
    const session = await getSession({ req })

    const user = await fauna.query<FaunaUser>(
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email)))
    )

    let stripeCustomerId = user.data.stripe_customer_id

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        name: session.user.name,
        email: session.user.email
      })

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id
          }
        })
      )

      stripeCustomerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${process.env.APP_URL}/posts`,
      cancel_url: `${process.env.APP_URL}`
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  }
}
