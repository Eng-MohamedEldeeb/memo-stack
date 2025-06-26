import { ArraySchema, ObjectSchema } from 'joi'
import { asyncHandler } from '../common/decorators/async-handler.decorator'
import { Request } from 'express'
import { throwError } from '../utils/handlers/error-message.handler'

export const validate = (
  schema: Record<string, ObjectSchema | ArraySchema>,
) => {
  return asyncHandler(async (req, res, next) => {
    const errors = []

    for (const key of Object.keys(schema)) {
      const { error } = schema[key].validate(req[key as keyof Request], {
        abortEarly: false,
        allowUnknown: false,
      })

      if (error) {
        errors.push({
          key,
          detail: error.details.map(e => ({
            message: e.message,
            path: e.path,
            type: e.type,
          })),
        })
      }
    }

    if (errors.length)
      return throwError({
        msg: 'validation error',
        details: errors,
        status: 400,
      })

    return next()
  })
}
