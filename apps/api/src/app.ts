import { auth } from '@repo/auth'
import { config } from '@repo/config'
import { Scalar } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { openAPIRouteHandler } from 'hono-openapi'
import { authRoutes } from './routes/auth'
import { checkoutRoutes } from './routes/checkout'
import { serverInfoRoutes } from './routes/server-info'
import { subscriptionRoutes } from './routes/subscription'
import { todoRoutes } from './routes/todos'
import { userRoutes } from './routes/users'
import { webhookRoutes } from './routes/webhooks'

interface OpenAPISchema {
  paths?: Record<string, unknown>
  components?: {
    schemas?: Record<string, unknown>
    [key: string]: unknown
  }
  [key: string]: unknown
}

export const app = new Hono().basePath('/api')

app.use('*', async (c, next) => {
  await next()
  console.log(`[HONO] ${c.req.method} ${c.req.path} -> ${c.res.status}`)
})

app.route('/', authRoutes)
app.route('/', checkoutRoutes)
app.route('/', subscriptionRoutes)
app.route('/', todoRoutes)
app.route('/', userRoutes)
app.route('/', webhookRoutes)
app.route('/', serverInfoRoutes)

app.get('/app-openapi', async (c) => {
  const handler = openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'API',
        version: '1.0.0',
      },
      servers: [
        {
          url: config.APP_URL,
          description: 'API server',
        },
      ],
    },
  })
  return handler(c, async () => {})
})

app.get('/openapi', async (c) => {
  const authSchema = (await auth.api.generateOpenAPISchema()) as OpenAPISchema
  const appResponse = await Promise.resolve(app.request('/api/app-openapi'))
  const appSchema = (await appResponse.json()) as OpenAPISchema

  const mergedSchema = {
    ...appSchema,
    paths: {
      ...appSchema.paths,
      ...authSchema.paths,
    },
    components: {
      ...(appSchema.components ?? {}),
      schemas: {
        ...(appSchema.components?.schemas ?? {}),
        ...(authSchema.components?.schemas ?? {}),
      },
    },
  }

  return c.json(mergedSchema)
})

app.get(
  '/docs',
  Scalar({
    theme: 'saturn',
    url: '/api/openapi',
  }),
)

export type AppRouter = typeof app
