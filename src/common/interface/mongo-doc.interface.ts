import { Types } from 'mongoose'

export interface IMongoDoc {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  __v: number
}
