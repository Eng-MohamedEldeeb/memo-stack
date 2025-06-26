export interface IEmailServiceArgs {
  from: string
  to: string
  subject: string
  text?: string
  html?: string
}
