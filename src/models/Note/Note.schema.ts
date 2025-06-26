import { Schema, SchemaTypes } from 'mongoose'
import { INote, ITask } from '../interfaces/note.interface'
import { TNote } from '../interfaces/types/document.type'
import { CloudUploader } from '../../common/upload/cloud.service'

export const noteSchema = new Schema<INote>(
  {
    attachments: {
      type: {
        folderId: String,
        paths: [{ secure_url: String, public_id: String }],
      },
    },

    title: { type: String, required: [true, 'title is required'], trim: true },
    body: { type: String, trim: true },
    label: { type: SchemaTypes.ObjectId, ref: 'Label' },

    tasks: {
      type: [
        {
          name: String,
          completed: Boolean,
          completedAt: {
            type: Date,
            default: function (this: ITask) {
              return this.completed && Date.now()
            },
          },
          createdAt: { type: Date, default: Date.now() },
        },
      ],
    },

    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'createdBy field is required'],
    },

    archivedAt: { type: Date },

    pinnedAt: { type: Date },

    trashedAt: { type: Date },
  },
  { timestamps: true },
)

noteSchema.index({ trashedAt: 1 }, { expires: 60 * 60 })

noteSchema.post('findOneAndDelete', async function (res, next) {
  const noteDoc: TNote = res

  if (noteDoc.attachments && noteDoc.attachments.paths?.length) {
    for (const file of noteDoc.attachments.paths) {
      await CloudUploader.delete(file.public_id)
    }
    await CloudUploader.deleteFolder(
      `${process.env.APP_NAME}/${noteDoc.attachments.folderId}`,
    )
  }
})
