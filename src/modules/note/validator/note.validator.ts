import joi from 'joi'
import {
  ICreateNoteDto,
  IDeleteNoteDto,
  ILabelDto,
  INoteIdDto,
  IUpdateNoteDto,
  IUpdateTaskDto,
} from '../dto/note.dto'
import { generalFields } from '../../../common/validation/general-fields'
import {
  DeletingType,
  LabelingType,
} from '../../../models/interfaces/enums/note.enum'

export const getAllSchema = {
  body: joi.object().keys({}),
  query: joi.object().keys({
    search: joi.string().trim(),
  }),
  headers: generalFields.headers.required().messages({
    'string.hex': 'Bearer token is required',
  }),
}

export const getSingleSchema = {
  body: joi.object().keys({}),
  params: joi.object<INoteIdDto>().keys({
    id: generalFields.mongoId.required().messages({
      'any.required': 'note id is required',
      'string.hex': 'id is an in-valid MongoId',
    }),
  }),
  headers: generalFields.headers.required().messages({
    'string.hex': 'Bearer token is required',
  }),
}

export const getArchivedSchema = {
  body: joi.object().keys({}),
  headers: generalFields.headers.required().messages({
    'string.hex': 'Bearer token is required',
  }),
}

export const createSchema = {
  body: joi
    .object<ICreateNoteDto>()
    .keys({
      title: generalFields.title.required(),
      body: generalFields.body,
      tasks: generalFields.tasks,
      label: generalFields.mongoId,
    })
    .required()
    .messages({
      'any.required': 'createNote body is required',
    }),
  headers: generalFields.headers.required().messages({
    'string.hex': 'Bearer token is required',
  }),
}

export const editSchema = {
  body: joi
    .object<IUpdateNoteDto>()
    .keys({
      title: generalFields.title,
      body: generalFields.body,
      tasks: joi
        .array<IUpdateTaskDto>()
        .items(
          joi.object<IUpdateTaskDto>().keys({
            _id: generalFields.mongoId.messages({
              'string.hex': 'task id is an in-valid MongoId',
            }),
            name: generalFields.name.min(0),
            completed: joi.boolean(),
          }),
        )
        .messages({
          'array.base':
            'tasks array must be array of objects that contains [id, name, completed] keys only',
        }),
      label: generalFields.optionalMongoId,
    })
    .required()
    .messages({
      'any.required': 'editNote body is required',
    }),
  params: joi.object<INoteIdDto>().keys({
    id: generalFields.mongoId.required().messages({
      'any.required': 'note id is required',
      'string.hex': 'note id is an in-valid MongoId',
    }),
  }),
  headers: generalFields.headers.required().messages({
    'string.hex': 'Bearer token is required',
  }),
}

export const addAttachmentsSchema = {
  body: joi.object({}),
  files: generalFields.files.required().messages({
    'any.required': 'note attachments array is required',
    'array.min': 'attachments must at least have one image',
    'array.max': "attachments can't have more then 10 items",
  }),
  headers: generalFields.headers.required().messages({
    'string.hex': 'Bearer token is required',
  }),
}

export const labelSchema = {
  body: joi.object({}),
  params: joi.object<Pick<ILabelDto, 'id'>>().keys({
    id: generalFields.mongoId.required().messages({
      'any.required': 'note id is required',
      'string.hex': 'note id is an in-valid MongoId',
    }),
  }),
  query: joi.object<Omit<ILabelDto, 'id'>>().keys({
    action: joi
      .string()
      .valid(...Object.values(LabelingType))
      .required(),
    labelId: generalFields.mongoId.required(),
  }),
  headers: generalFields.headers.required().messages({
    'string.hex': 'Bearer token is required',
  }),
}

export const deleteNoteSchema = {
  body: joi.object().keys({}),
  query: joi.object<IDeleteNoteDto>().keys({
    action: joi
      .string()
      .valid(...Object.values(DeletingType))
      .required(),
    id: generalFields.mongoId.required(),
  }),
  headers: generalFields.headers.required().messages({
    'string.hex': 'Bearer token is required',
  }),
}

export const pinSchema = {
  body: joi.object().keys({}),
  params: joi.object().keys({
    id: generalFields.mongoId.required(),
  }),
  headers: generalFields.headers.required().messages({
    'string.hex': 'Bearer token is required',
  }),
}
