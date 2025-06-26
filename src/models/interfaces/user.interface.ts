import { IMongoDoc } from '../../common/interface/mongo-doc.interface'

export interface IUserInputs {
  fullName: string
  email: string
  password: string
  birthDate: Date
  confirmPassword: string
  otpCode: string
}

export interface IUser
  extends IMongoDoc,
    Omit<IUserInputs, 'confirmPassword' | 'otpCode'> {
  age: number
  changedCredentialsAt: Date
}
