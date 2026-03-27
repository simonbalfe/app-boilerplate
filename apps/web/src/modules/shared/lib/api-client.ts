import type { AppRouter } from '@repo/api'
import { hc } from 'hono/client'

export type Client = ReturnType<typeof hc<AppRouter>>

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppRouter>(...args)

export const api = hcWithType('/')
