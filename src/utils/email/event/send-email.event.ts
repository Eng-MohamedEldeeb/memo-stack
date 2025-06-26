import { EventEmitter } from 'node:events'
import { transporter } from '../config/email-transporter'
import * as emailSchemas from './../schemas/email-schema'
import { ISendArgs } from './interface/send-args.interface'

const emailEvent = new EventEmitter()

emailEvent.on('send', async ({ schema, to, otpCode, userName }: ISendArgs) => {
  try {
    await transporter.sendMail(emailSchemas[schema]({ to, otpCode, userName }))
  } catch (error) {
    if (error instanceof Error)
      console.error({
        msg: 'Email Service Error',
        error: error.message,
      })
    console.error({
      msg: 'Email Service Error',
      error,
    })
  }
})

export default emailEvent
