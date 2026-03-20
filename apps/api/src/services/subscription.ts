import { STRIPE_CACHE_KV, STRIPE_CUSTOMER_ID_KV } from '@repo/stripe'

export async function getSubscriptionStatus(userId: string) {
  const stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(userId)

  if (!stripeCustomerId) {
    return { isSubscribed: false, tier: 'Free' as const }
  }

  const stripeSub = await STRIPE_CACHE_KV.get(stripeCustomerId as string)
  const isSubscribed = stripeSub?.status === 'active' || stripeSub?.status === 'trialing'

  return {
    isSubscribed,
    tier: isSubscribed ? ('Pro' as const) : ('Free' as const),
  }
}
