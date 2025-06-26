import { Schema, SchemaTypes } from 'mongoose'
import { ILabel } from '../interfaces/label.interface'
import noteRepository from '../../common/repositories/note.repository'

export const labelSchema = new Schema<ILabel>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name is required'],
      unique: [true, 'name must be unique'],
    },
    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'createdBy field is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

labelSchema.virtual('notes', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'label',
})

labelSchema.post('findOneAndDelete', async function (res: ILabel) {
  await noteRepository.updateMany({
    filter: {
      label: res._id,
    },
    data: { $unset: { label: 1 } },
  })
})
