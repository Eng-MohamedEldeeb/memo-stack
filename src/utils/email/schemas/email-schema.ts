import { IEmailServiceArgs } from './interface/email-args.interface'
import { IEmailSchemaArgs } from './interface/email-schema.interface'

export const confirm = ({
  to,
  otpCode,
}: IEmailSchemaArgs): IEmailServiceArgs => {
  return {
    from: `"Keep Notes" <${process.env.EMAIL}>`,
    to,
    subject: 'Confirm E-mail',
    html: `
          <div style="text-align: center;">
              <h1>Welcome to our Keep Notes Application</h1>
              <h3>First we need you to confirm your e-mail by using the following code</h3>
              <h2>${otpCode}</h2>
          </div>
    `,
  }
}

export const forgot = ({
  to,
  otpCode,
}: IEmailSchemaArgs): IEmailServiceArgs => {
  return {
    from: `"Keep Notes" <${process.env.EMAIL}>`,
    to,
    subject: 'Verify E-mail',
    html: `
          <div style="text-align: center;">
              <h1>Hello</h1>
              <h3>First we need you to confirm your e-mail by using the following code</h3>
              <h2>${otpCode}</h2>
          </div>
    `,
  }
}

export const verifyDeleting = ({
  to,
  otpCode,
}: IEmailSchemaArgs): IEmailServiceArgs => {
  return {
    from: `"Keep Notes" <${process.env.EMAIL}>`,
    to,
    subject: 'Verify E-mail',
    html: `
          <div style="text-align: center;">
              <h1>Hello</h1>
              <h3>First we need you to confirm your e-mail by using the following code</h3>
              <h2>${otpCode}</h2>
          </div>
    `,
  }
}
