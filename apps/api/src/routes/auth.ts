import { auth } from '@repo/auth'
import { Hono } from 'hono'

export const authRoutes = new Hono()

authRoutes.all('/auth/*', async (c) => {
  return auth.handler(c.req.raw)
})
