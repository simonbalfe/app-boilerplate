import { auth } from '@repo/auth'
import { Hono } from 'hono'

export const authRoutes = new Hono().all('/auth/*', async (c) => {
  return auth.handler(c.req.raw)
})
