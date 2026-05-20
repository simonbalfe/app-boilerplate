import { config } from '@repo/config'
import { db } from '@repo/db'
import { schema } from '@repo/db/schema'
import { resend } from '@repo/email'
import { sendWelcomeEmail } from '@repo/email'
import EmailVerification from '@repo/email/templates/email-verification'
import PasswordResetEmail from '@repo/email/templates/password-reset'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { jwt, openAPI } from 'better-auth/plugins'

console.log('[AUTH SERVER] BetterAuth config:', {
  baseURL: config.APP_URL,
  trustedOrigins: [config.APP_URL],
  BETTER_AUTH_SECRET: config.BETTER_AUTH_SECRET
    ? `${config.BETTER_AUTH_SECRET.slice(0, 4)}***`
    : '(empty)',
  GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID
    ? `${config.GOOGLE_CLIENT_ID.slice(0, 8)}***`
    : '(empty)',
  GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET ? '***set***' : '(empty)',
  RESEND_FROM: config.RESEND_FROM || '(empty)',
  RESEND_API_KEY: config.RESEND_API_KEY ? `${config.RESEND_API_KEY.slice(0, 4)}***` : '(empty)',
})

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  baseURL: config.APP_URL,
  trustedOrigins: [config.APP_URL],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      const fromEmail = config.RESEND_FROM
      if (!fromEmail) {
        console.error('RESEND_FROM email not configured')
        return
      }
      try {
        await resend.emails.send({
          from: fromEmail,
          to: user.email,
          subject: 'Reset your password',
          react: PasswordResetEmail({
            name: user.name,
            resetUrl: url,
          }),
        })
      } catch (error) {
        console.error('Error sending password reset email:', error)
        throw error
      }
    },
    onPasswordReset: async ({ user }) => {
      await Promise.resolve()
      console.log(`Password reset successful for user: ${user.email}`)
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const fromEmail = config.RESEND_FROM

      if (!fromEmail) {
        console.error('RESEND_FROM email not configured')
        return
      }

      try {
        await resend.emails.send({
          from: fromEmail,
          to: user.email,
          subject: 'Verify your email address',
          react: EmailVerification({
            name: user.name,
            verificationUrl: url,
          }),
        })
      } catch (error) {
        console.error('Error sending verification email:', error)
        throw error
      }
    },
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      prompt: 'select_account consent',
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [jwt(), openAPI()],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            if (user.emailVerified) {
              await sendWelcomeEmail(user.email, user.name)
              console.log(`Welcome email sent to: ${user.email}`)
            } else {
              console.log(`Skipping welcome email for unverified user: ${user.email}`)
            }
          } catch (error) {
            console.error('Error in user creation hook:', error)
          }
        },
      },
      update: {
        after: async (user) => {
          try {
            if (user.emailVerified) {
              await sendWelcomeEmail(user.email, user.name)
              console.log(`Welcome email sent after verification to: ${user.email}`)
            }
          } catch (error) {
            console.error('Error in user update hook:', error)
          }
        },
      },
    },
  },
})
