import { model, models } from 'mongoose'
import { otpSchema } from './Otp.schema'

export const OtpModel = models.Otp ?? model('Otp', otpSchema)
