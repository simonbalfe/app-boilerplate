import { config } from '@repo/config'
import { processEvent } from '@repo/stripe'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import Stripe from 'stripe'

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil' as Stripe.LatestApiVersion,
})

export const webhookRoutes = new Hono()

webhookRoutes.post(
  '/webhooks/stripe',
  describeRoute({
    tags: ['Webhooks'],
    summary: 'Stripe webhook',
    description: 'Receives and processes Stripe webhook events',
    responses: {
      200: { description: 'Event received' },
      400: { description: 'Missing signature' },
    },
  }),
  async (c) => {
    const body = await c.req.text()
    const signature = c.req.header('stripe-signature')

    if (!signature) {
      return c.json({}, 400)
    }

    const processingPromise = (async () => {
      const event = stripe.webhooks.constructEvent(body, signature, config.STRIPE_WEBHOOK_SECRET)
      return processEvent(event)
    })()

    processingPromise.catch((e: unknown) => console.error('Stripe webhook error:', e))

    return c.json({ received: true })
  },
)
