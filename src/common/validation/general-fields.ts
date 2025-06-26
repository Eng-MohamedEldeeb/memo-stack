import joi from 'joi'
import { isValidMongoId, isValidToken, optionalMongoId } from './is-valid'
import { ITaskInputs } from '../../models/interfaces/note.interface'

const file = joi.object<Express.Multer.File>().keys({
  fieldname: joi.string(),
  originalname: joi.string(),
  encoding: joi.string(),
  mimetype: joi.string(),
  destination: joi.string(),
  filename: joi.string(),
  path: joi.string(),
  size: joi.number(),
})

export const generalFields = {
  mongoId: joi.string().custom(isValidMongoId),
  optionalMongoId: joi.string().custom(optionalMongoId),

  headers: joi
    .object()
    .keys({
      authorization: joi.string().custom(isValidToken).messages({
        'string.hex': 'Bearer token is required',
      }),
    })
    .unknown(true),

  file,

  files: joi.array().items(file).min(1).max(10),

  fullName: joi.string().trim().messages({
    'string.empty': "fullName can't be empty",
  }),
  email: joi.string().email().trim().lowercase().messages({
    'string.empty': "email can't be empty",
    'string.email': 'in-valid email',
  }),
  password: joi.string().trim().messages({
    'string.empty': "password can't be empty",
  }),
  birthDate: joi.date().less('now').messages({
    'string.empty': "birthDate can't be empty",
    'date.base': 'enter a valid birthDate',
  }),
  otpCode: joi.string().length(4).messages({
    'string.empty': "otpCode can't be empty",
  }),

  title: joi.string().trim().messages({
    'string.empty': "title can't be empty",
  }),
  body: joi.string().trim().messages({
    'string.empty': "body can't be empty",
  }),

  name: joi.string().trim().messages({
    'string.empty': "name can't be empty",
  }),

  tasks: joi
    .array()
    .items(
      joi
        .object<ITaskInputs>()
        .keys({
          name: joi.string().trim().messages({
            'string.empty': "name can't be empty",
          }),
          completed: joi.boolean(),
        })
        .messages({
          'object.unknown':
            '[name, completedAt] are the only allowed keys for task object',
        }),
    )
    .messages({
      'array.base':
        'tasks array must be array of objects that contains [name, completedAt] keys only',
    }),
}
