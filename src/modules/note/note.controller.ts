import { asyncHandler } from '../../common/decorators/async-handler.decorator'
import {
  DeletingType,
  LabelingType,
} from '../../models/interfaces/enums/note.enum'
import { successResponse } from '../../utils/handlers/success-response.handler'
import {
  ICreateNoteDto,
  IDeleteNoteDto,
  IGetNotesQueryDto,
  ILabelDto,
  INoteIdDto,
  IUpdateNoteDto,
} from './dto/note.dto'
import noteService from './note.service'

export class NoteController {
  private static readonly noteService: typeof noteService = noteService

  static readonly getAll = asyncHandler<null, IGetNotesQueryDto>(
    async (req, res) => {
      const userId = req.tokenPayload._id
      const { search } = req.query
      return successResponse(res, {
        msg: 'done',
        status: 200,
        data: await this.noteService.getAll(userId, search),
      })
    },
  )

  static readonly getAllArchived = asyncHandler<INoteIdDto>(
    async (req, res) => {
      const userId = req.tokenPayload._id
      return successResponse(res, {
        msg: 'done',
        status: 200,
        data: await this.noteService.getAllArchived(userId),
      })
    },
  )

  static readonly getAllTrashed = asyncHandler<INoteIdDto>(async (req, res) => {
    const userId = req.tokenPayload._id
    return successResponse(res, {
      msg: 'done',
      status: 200,
      data: await this.noteService.getAllTrashed(userId),
    })
  })

  static readonly getSingle = asyncHandler<INoteIdDto>(async (req, res) => {
    const { id } = req.params
    return successResponse(res, {
      msg: 'done',
      status: 200,
      data: await this.noteService.getSingle(id),
    })
  })

  static readonly create = asyncHandler(async (req, res) => {
    const createNoteDto: ICreateNoteDto = req.body
    const createdBy = req.tokenPayload._id
    return successResponse(res, {
      msg: 'note created successfully',
      data: await this.noteService.create(createNoteDto, createdBy),
    })
  })

  static readonly pin = asyncHandler<INoteIdDto>(async (req, res) => {
    const { _id: noteId } = req.note
    return successResponse(res, {
      msg: 'note has been pinned successfully',
      status: 200,
      data: await this.noteService.pin(noteId),
    })
  })

  static readonly addAttachments = asyncHandler<INoteIdDto>(
    async (req, res) => {
      const { id } = req.params
      const cloudFiles = req.cloudFiles
      return successResponse(res, {
        msg: 'attachments has been uploaded successfully',
        status: 200,
        data: await this.noteService.addAttachments(id, cloudFiles),
      })
    },
  )

  static readonly label = asyncHandler<
    INoteIdDto,
    Pick<ILabelDto, 'action' | 'labelId'>
  >(async (req, res) => {
    const { id: noteId } = req.params
    const { action, labelId } = req.query

    await this.noteService.labelNote(noteId, labelId, action)

    return successResponse(res, {
      msg: `Label has been  ${action == LabelingType.add ? 'added to' : 'removed from'} note successfully`,
      status: 200,
    })
  })

  static readonly edit = asyncHandler<INoteIdDto>(async (req, res) => {
    const updateNoteDto: IUpdateNoteDto = req.body
    const { _id: noteId } = req.note
    return successResponse(res, {
      msg: 'note has been updated successfully',
      status: 200,
      data: await this.noteService.edit(updateNoteDto, noteId),
    })
  })

  static readonly archive = asyncHandler<INoteIdDto>(async (req, res) => {
    const { _id: noteId } = req.note
    await this.noteService.archive(noteId)
    return successResponse(res, {
      msg: 'note has been archived successfully',
      status: 200,
    })
  })

  static readonly restore = asyncHandler<INoteIdDto>(async (req, res) => {
    const { _id: noteId } = req.note
    await this.noteService.restore(noteId)
    return successResponse(res, {
      msg: 'note has been restored successfully',
      status: 200,
    })
  })

  static readonly delete = asyncHandler<INoteIdDto>(async (req, res) => {
    const query: IDeleteNoteDto = req.query
    await this.noteService.delete(query)
    return successResponse(res, {
      msg: `note has been ${query.action == DeletingType.trash ? 'moved to trash' : 'deleted forever'} successfully`,
      status: 200,
    })
  })
}
