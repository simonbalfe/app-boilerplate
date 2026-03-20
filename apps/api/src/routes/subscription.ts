import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { optionalAuth } from '../middleware/auth'
import { getSubscriptionStatus } from '../services/subscription'

export const subscriptionRoutes = new Hono()

subscriptionRoutes.get(
  '/subscription/check',
  describeRoute({
    tags: ['Subscription'],
    summary: 'Check subscription status',
    description: 'Returns whether the current user has an active subscription',
    responses: {
      200: { description: 'Subscription status' },
    },
  }),
  optionalAuth,
  async (c) => {
    const session = c.get('session')

    if (!session?.user) {
      return c.json({ isSubscribed: false, tier: 'Free' })
    }

    const status = await getSubscriptionStatus(session.user.id)
    return c.json(status)
  },
)
