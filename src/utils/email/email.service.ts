import { ISendArgs } from './event/interface/send-args.interface'
import emailEvent from './event/send-email.event'

export class EmailService {
  private static readonly emailEvent = emailEvent

  static readonly send = ({ schema, to, otpCode, userName }: ISendArgs) => {
    return this.emailEvent.emit('send', { schema, to, otpCode, userName })
  }
}
