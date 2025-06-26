import { IMongoDoc } from '../../common/interface/mongo-doc.interface'
import * as emailSchemas from '../../utils/email/schemas/email-schema'

export interface IOtpInputs {
  email: string
  type: keyof typeof emailSchemas
}
export interface IOtp extends IMongoDoc, IOtpInputs {
  otpCode: string
}
