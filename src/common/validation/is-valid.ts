import { CustomValidator, ErrorReport } from 'joi'
import { Types } from 'mongoose'

export const isValidMongoId: CustomValidator = (
  v: string,
  helpers,
): true | ErrorReport => {
  return Types.ObjectId.isValid(v)
    ? true
    : helpers.error('string.hex', { key: 'id' }, { path: ['id'] })
}

export const optionalMongoId: CustomValidator = (v: string, helpers) => {
  return v ? isValidMongoId(v, helpers) : true
}

export const isValidToken: CustomValidator = function (
  authorization,
  helpers,
): true | ErrorReport {
  if (!authorization)
    return helpers.error(
      'any.required',
      { key: 'authorization' },
      { path: ['authorization'] },
    )

  if (authorization.split(' ')[0] != 'Bearer')
    return helpers.error(
      'string.hex',
      { key: 'authorization' },
      { path: ['authorization'] },
    )

  return true
}
