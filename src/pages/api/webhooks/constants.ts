export const SUBSCRIPTION_EVENTS = {
  updated: 'customer.subscription.updated',
  deleted: 'customer.subscription.deleted'
}

export const RELEVANT_EVENTS = new Set([
  'checkout.session.completed',
  SUBSCRIPTION_EVENTS.updated,
  SUBSCRIPTION_EVENTS.deleted
])
