import { config } from '@repo/config'
import { STRIPE_CUSTOMER_ID_KV, stripe, syncStripeDataToKV } from '@repo/stripe'

interface LineItem {
  price: string
  quantity: number
}

export async function createCheckoutSession(userId: string, email: string, lineItem: LineItem) {
  let stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(userId)

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    })
    await STRIPE_CUSTOMER_ID_KV.set(userId, customer.id)
    stripeCustomerId = customer.id
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId as string,
    payment_method_types: ['card'],
    line_items: [
      {
        price: lineItem.price,
        quantity: lineItem.quantity,
      },
    ],
    mode: 'subscription',
    success_url: `${config.APP_URL}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.APP_URL}/`,
    subscription_data: {
      metadata: { userId },
    },
  })

  return checkoutSession.id
}

export async function handleCheckoutSuccess(userId: string): Promise<'dashboard' | 'home'> {
  const stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(userId)

  if (!stripeCustomerId) {
    return 'home'
  }

  await syncStripeDataToKV(stripeCustomerId as string)
  return 'dashboard'
}
