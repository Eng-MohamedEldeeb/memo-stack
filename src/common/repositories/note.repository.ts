import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TNote } from '../../models/interfaces/types/document.type'
import { NoteModel } from '../../models/Note/Note.model'
import { INote } from '../../models/interfaces/note.interface'

class NoteRepository extends DataBaseService<INote, TNote> {
  constructor(protected readonly noteModel: Model<TNote> = NoteModel) {
    super(noteModel)
  }
}

export default new NoteRepository()
