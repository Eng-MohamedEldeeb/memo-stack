import { compareSync, hashSync } from 'bcrypt'
import { ICompareValuesArgs } from './interface/security.interface'

export const hashValue = (
  value: string,
  saltRounds = Number(process.env.SALT),
): string => {
  return hashSync(value, saltRounds)
}

export const compareValues = ({
  value,
  hashedValue,
}: ICompareValuesArgs): boolean => {
  return compareSync(value, hashedValue)
}
