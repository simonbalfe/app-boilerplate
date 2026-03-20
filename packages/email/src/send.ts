import { config } from '@repo/config'
import WelcomeEmail from '../templates/welcome'
import { resend } from './index'

export async function sendWelcomeEmail(email: string, name: string) {
  if (!config.RESEND_FROM) {
    throw new Error('RESEND_FROM is required')
  }

  return resend.emails.send({
    from: config.RESEND_FROM,
    to: email,
    subject: 'Welcome to Our Platform',
    react: WelcomeEmail({ name }),
  })
}
