import { model, models } from 'mongoose'
import { noteSchema } from './Note.schema'

export const NoteModel = models.Note ?? model('Note', noteSchema)
