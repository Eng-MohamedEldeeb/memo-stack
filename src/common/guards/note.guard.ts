import { INoteIdDto } from '../../modules/note/dto/note.dto'
import { throwError } from '../../utils/handlers/error-message.handler'
import { IRequest } from '../interface/IRequest.interface'
import noteRepository from '../repositories/note.repository'
import { GuardActivator } from './can-activate.guard'

class NoteGuard implements GuardActivator {
  private readonly noteRepository = noteRepository

  async canActivate(req: IRequest<INoteIdDto, INoteIdDto>) {
    const { _id: createdBy } = req.tokenPayload
    const { id: noteId } = { ...req.params, ...req.query }

    const noteExists = await this.noteRepository.findOne({
      filter: { createdBy, _id: noteId },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (!noteExists)
      return throwError({
        msg: 'note was not found',
        status: 404,
      })

    req.note = noteExists

    return true
  }
}

export default new NoteGuard()
