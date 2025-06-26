import { JwtPayload, SignOptions } from 'jsonwebtoken'
import { Types } from 'mongoose'

export interface IPayload extends JwtPayload {
  _id: Types.ObjectId
}

export interface IJwtArgs {
  payload: {
    _id: Types.ObjectId
  }
  secretKey?: string
  options?: SignOptions
}
