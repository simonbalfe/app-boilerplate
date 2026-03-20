import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { requireAuth } from '../middleware/auth'
import { createCheckoutSession, handleCheckoutSuccess } from '../services/checkout'

export const checkoutRoutes = new Hono()

checkoutRoutes.post(
  '/checkout/session',
  describeRoute({
    tags: ['Billing'],
    summary: 'Create checkout session',
    description: 'Creates a Stripe checkout session for the authenticated user',
    responses: {
      200: { description: 'Checkout session ID' },
      400: { description: 'Invalid request' },
      401: { description: 'Unauthorized' },
      500: { description: 'Server error' },
    },
  }),
  requireAuth,
  async (c) => {
    const body = await c.req.json()
    const { userId, email, line_item } = body

    if (!userId) {
      return c.json({ success: false, error: 'User ID is required' }, 400)
    }

    const session = c.get('session')
    if (session.user.id !== userId) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    try {
      const sessionId = await createCheckoutSession(userId, email, line_item)
      return c.json({ success: true, sessionId })
    } catch (error) {
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred',
        },
        500,
      )
    }
  },
)

checkoutRoutes.get(
  '/checkout/success',
  describeRoute({
    tags: ['Billing'],
    summary: 'Handle checkout success',
    description: 'Processes a successful Stripe checkout and redirects the user',
    responses: {
      302: { description: 'Redirect after successful checkout' },
    },
  }),
  requireAuth,
  async (c) => {
    const session = c.get('session')
    const destination = await handleCheckoutSuccess(session.user.id)
    return c.redirect(destination === 'dashboard' ? '/dashboard' : '/')
  },
)
