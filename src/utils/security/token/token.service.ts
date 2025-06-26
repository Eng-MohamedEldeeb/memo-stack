import { sign, verify } from 'jsonwebtoken'
import { IJwtArgs, IPayload } from './interface/token.interface'

export const signToken = ({
  payload,
  secretKey = process.env.JWT_SECRET as string,
  options = { expiresIn: '7d' },
}: IJwtArgs): string => {
  return sign(payload, secretKey, options)
}

export const verifyToken = (
  token: string,
  secretKey = process.env.JWT_SECRET as string,
): IPayload => {
  return verify(token, secretKey) as IPayload
}
