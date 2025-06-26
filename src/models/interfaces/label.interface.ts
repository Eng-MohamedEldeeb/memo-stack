import { Types } from 'mongoose'
import { IMongoDoc } from '../../common/interface/mongo-doc.interface'
import { INote } from './note.interface'

export interface ILabelInputs {
  name: string
}

export interface ILabel extends IMongoDoc, ILabelInputs {
  createdBy: Types.ObjectId
  notes: INote[]
}
