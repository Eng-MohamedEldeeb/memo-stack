import { Types } from 'mongoose'
import { ILabelInputs } from '../../../models/interfaces/label.interface'

export interface ILabelId {
  id: Types.ObjectId
}

export interface IGetLabelsQueryDto {
  search: string
}

export interface ICreateLabelDto extends ILabelInputs {}

export interface IRenameLabelDto extends ILabelInputs {}

export interface IDeleteLabelDto extends ILabelId {}
