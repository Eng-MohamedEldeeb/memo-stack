import { IOtp } from './../../models/interfaces/otp.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TOtp } from '../../models/interfaces/types/document.type'
import { OtpModel } from '../../models/Otp/Otp.model'

class OtpRepository extends DataBaseService<IOtp, TOtp> {
  constructor(protected readonly otpModel: Model<TOtp> = OtpModel) {
    super(otpModel)
  }
}

export default new OtpRepository()
