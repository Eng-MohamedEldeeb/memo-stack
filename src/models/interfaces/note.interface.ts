import { Types } from 'mongoose'
import { IMongoDoc } from '../../common/interface/mongo-doc.interface'
import { ILabel } from './label.interface'
import { IUser } from './user.interface'
import { ICloudFiles } from '../../common/upload/interface/cloud-response.interface'

export interface ITaskInputs {
  name: string
  completed?: boolean
}

export interface ITask extends ITaskInputs {
  _id?: Types.ObjectId
  completedAt?: Date
  createdAt?: Date
}

export interface INoteInputs {
  title: string
  body: string
  tasks: ITask[]
  label: Types.ObjectId | ILabel
}

export interface INote extends IMongoDoc, INoteInputs {
  createdBy: Types.ObjectId | IUser
  attachments: ICloudFiles
  archivedAt?: Date
  pinnedAt: Date
  trashedAt?: Date
}
