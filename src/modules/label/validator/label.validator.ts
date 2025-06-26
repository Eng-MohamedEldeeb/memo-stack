import joi from 'joi'
import { ICreateLabelDto, ILabelId, IRenameLabelDto } from '../dto/label.dto'
import { generalFields } from '../../../common/validation/general-fields'

export const getAllSchema = {
  body: joi.object().keys({}),
  query: joi.object().keys({
    search: joi.string(),
  }),
  headers: generalFields.headers.required(),
}

export const getSingleSchema = {
  body: joi.object<ILabelId>().keys({
    id: generalFields.mongoId.required(),
  }),
  headers: generalFields.headers.required(),
}

export const createSchema = {
  body: joi.object<ICreateLabelDto>().keys({
    name: generalFields.name.required(),
  }),
  headers: generalFields.headers.required(),
}

export const renameSchema = {
  body: joi
    .object<Pick<IRenameLabelDto, 'name'>>()
    .keys({ name: generalFields.name.required() }),
  params: joi.object<ILabelId>().keys({
    id: generalFields.mongoId.required(),
  }),
  headers: generalFields.headers.required(),
}

export const deleteSchema = {
  body: joi.object().keys({}),
  params: joi.object<ILabelId>().keys({
    id: generalFields.mongoId.required(),
  }),
  headers: generalFields.headers.required(),
}
