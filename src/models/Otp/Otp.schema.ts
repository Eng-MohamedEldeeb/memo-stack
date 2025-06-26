import { Schema } from 'mongoose'
import { IOtp } from '../interfaces/otp.interface'
import { OtpType } from '../interfaces/enums/otp.enum'
import { generateCode } from '../../utils/randomstring/generate-code.function'
import { hashValue } from '../../utils/security/hash/security.service'
import { EmailService } from '../../utils/email/email.service'
import * as emailSchemas from '../../utils/email/schemas/email-schema'
import { EmailSchemas } from '../../utils/email/event/interface/send-args.interface'

export const otpSchema = new Schema<IOtp>(
  {
    otpCode: { type: String },
    email: {
      type: String,
      trim: true,
      required: [true, 'email is required'],
      unique: [true, "can't request another otpCode at the moment"],
    },
    type: {
      type: String,
      enum: Object.keys(emailSchemas),
      default: OtpType.confirm,
    },
  },
  { timestamps: true },
)

otpSchema.index({ createdAt: 1 }, { expires: '1m' })

otpSchema.pre('save', function (next) {
  const email: string = this.email
  const type: EmailSchemas = this.type
  const otpCode = generateCode({ length: 4, charset: 'numeric' })

  console.log({ otpCode })

  const hashedCode = hashValue(otpCode)
  this.otpCode = hashedCode
  EmailService.send({ schema: type, otpCode, to: email })
  return next()
})
