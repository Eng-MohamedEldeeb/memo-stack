import { FilterQuery, Types } from 'mongoose'
import noteRepository from '../../common/repositories/note.repository'
import { ICreateNoteDto, IDeleteNoteDto, IUpdateNoteDto } from './dto/note.dto'
import { ICloudFiles } from '../../common/upload/interface/cloud-response.interface'
import { throwError } from '../../utils/handlers/error-message.handler'
import { TNote } from '../../models/interfaces/types/document.type'
import { CacheService } from '../../cache/cache.service'
import { LabelingType } from '../../models/interfaces/enums/note.enum'
import { NoteFactory } from './factory/note-factory'

class NoteService {
  private readonly noteRepository: typeof noteRepository = noteRepository
  private readonly NoteFactory = NoteFactory
  private readonly CacheService = CacheService

  readonly getSingle = async (noteId: Types.ObjectId) => {
    const note = await this.noteRepository.findOne({
      filter: {
        _id: noteId,
        archivedAt: { $exists: false },
        trashedAt: { $exists: false },
      },
      options: { lean: true },
    })

    return note ? note : throwError({ msg: 'in-valid id', status: 400 })
  }

  readonly getAllArchived = async (createdBy: Types.ObjectId) => {
    let archivedNotes: TNote[] = []

    const isCached: Array<TNote> | null = await this.CacheService.get(
      `${createdBy.toString()}:notes:archived`,
    )

    if (isCached) {
      archivedNotes = isCached
    }

    archivedNotes = await this.noteRepository.find({
      filter: {
        createdBy,
        archivedAt: { $exists: true },
        trashedAt: { $exists: false },
      },
      options: { sort: { createdAt: -1 } },
    })

    if (!isCached && archivedNotes.length)
      await this.CacheService.set({
        key: `${createdBy.toString()}:notes:archived`,
        value: archivedNotes,
        expiresAfter: 900,
      })

    return {
      archivedNotes,
      count: archivedNotes.length,
    }
  }

  readonly getAllTrashed = async (createdBy: Types.ObjectId) => {
    let trashedNotes: TNote[] = []

    const isCached: Array<TNote> | null = await this.CacheService.get(
      `${createdBy.toString()}:notes:trashed`,
    )

    if (isCached) {
      trashedNotes = isCached
    }

    trashedNotes = await this.noteRepository.find({
      filter: { createdBy, trashedAt: { $exists: true } },
      options: { sort: { createdAt: -1 } },
    })

    if (!isCached && trashedNotes.length)
      await this.CacheService.set({
        key: `${createdBy.toString()}:notes:trashed`,
        value: trashedNotes,
        expiresAfter: 900,
      })

    return {
      trashedNotes,
      count: trashedNotes.length,
    }
  }

  readonly getAll = async (createdBy: Types.ObjectId, query: string) => {
    const isCached: { value: Array<TNote> } | null =
      await this.CacheService.get(`${createdBy.toString()}:notes:all`)

    if (isCached)
      return {
        pin: isCached.value.filter(note => Boolean(note.pinnedAt)),
        other: isCached.value.filter(note => !Boolean(note.pinnedAt)),
        count: isCached.value.length,
      }

    let search: Array<FilterQuery<TNote>> | null = null

    if (query) {
      search = [
        { title: { $regex: query.trim() } },
        { body: { $regex: query.trim() } },
        { 'tasks.name': { $regex: query.trim() } },
      ]
    }

    const notes = await this.noteRepository.find({
      filter: {
        createdBy,
        archivedAt: { $exists: false },
        trashedAt: { $exists: false },
        ...(search && { $or: search }),
      },
      options: { sort: { createdAt: -1 } },
    })

    if (!search && notes.length)
      await this.CacheService.set({
        key: `${createdBy.toString()}:notes:all`,
        value: notes,
        expiresAfter: 900,
      })

    return {
      pin: notes.filter(note => Boolean(note.pinnedAt)),
      other: notes.filter(note => !Boolean(note.pinnedAt)),
      count: notes.length,
    }
  }

  readonly create = async (data: ICreateNoteDto, createdBy: Types.ObjectId) => {
    const { title, body, label, tasks } = data
    const note = await this.noteRepository.create({
      title,
      body,
      label,
      tasks,
      createdBy,
    })

    await this.CacheService.add({
      key: `${createdBy}:notes:all`,
      value: note,
    })

    return note
  }

  protected readonly unPin = async (
    noteId: Types.ObjectId,
  ): Promise<TNote | null> => {
    const isUnPinned = await this.noteRepository.findOneAndUpdate({
      filter: {
        _id: noteId,
        trashedAt: { $exists: false },
      },
      data: { $unset: { pinnedAt: 1 } },
      options: { new: true, lean: true },
    })

    if (isUnPinned)
      await this.CacheService.remove({
        key: `${isUnPinned.createdBy}:notes:all`,
        value: isUnPinned._id,
        identifier: '_id',
      })

    return isUnPinned
  }

  readonly pinNote = async (noteId: Types.ObjectId): Promise<TNote | null> => {
    const isPinned = await this.noteRepository.findOneAndUpdate({
      filter: {
        _id: noteId,
        trashedAt: { $exists: false },
      },
      data: { pinnedAt: Date.now(), $unset: { archivedAt: 1 } },
      options: { new: true, lean: true },
    })

    if (isPinned)
      await this.CacheService.update({
        key: `${isPinned.createdBy}:notes:all`,
        obj: isPinned,
        identifier: '_id',
      })

    return isPinned
  }

  readonly pin = async (noteId: Types.ObjectId) => {
    const isExistedNote = await this.noteRepository.findOne({
      filter: {
        _id: noteId,
        trashedAt: { $exists: false },
      },
      projection: { pinnedAt: 1 },
      options: { new: true, lean: true },
    })

    if (!isExistedNote)
      return throwError({
        msg: 'in-valid noteId or not existed',
        status: 400,
      })

    if (isExistedNote.pinnedAt) {
      const isUnPinned = await this.unPin(noteId)
      return isUnPinned
        ? isUnPinned
        : throwError({
            msg: 'in-valid noteId or not existed',
            status: 400,
          })
    }

    const isPinned = await this.pinNote(noteId)

    return isPinned
      ? isPinned
      : throwError({
          msg: 'in-valid noteId or not existed',
          status: 400,
        })
  }

  readonly addAttachments = async (
    noteId: Types.ObjectId,
    cloudFiles: ICloudFiles,
  ) => {
    const oldAttachments = await this.noteRepository.findOne({
      filter: {
        _id: noteId,
        archivedAt: { $exists: false },
        trashedAt: { $exists: false },
      },
      projection: {
        attachments: 1,
      },
      options: { new: true, lean: true },
    })

    if (!oldAttachments)
      return throwError({
        msg: "in-valid mongoId or note doesn't exists",
        status: 404,
      })

    if (oldAttachments.attachments && oldAttachments.attachments.folderId) {
      const isUpdated = await this.noteRepository.findOneAndUpdate({
        filter: {
          _id: noteId,
          archivedAt: { $exists: false },
          trashedAt: { $exists: false },
        },
        data: {
          $addToSet: {
            'attachments.paths': { $each: cloudFiles.paths },
          },
        },
        options: {
          new: true,
          lean: true,
        },
      })

      if (!isUpdated)
        return throwError({
          msg: "in-valid mongoId or note doesn't exists",
          status: 404,
        })

      await this.CacheService.update({
        key: `${isUpdated.createdBy}:notes:all`,
        obj: isUpdated,
        identifier: '_id',
      })

      return isUpdated
    }

    const isUpdated = await this.noteRepository.findOneAndUpdate({
      filter: {
        _id: noteId,
        archivedAt: { $exists: false },
        trashedAt: { $exists: false },
      },
      data: {
        'attachments.folderId': cloudFiles.folderId,
        $addToSet: {
          'attachments.paths': { $each: cloudFiles.paths },
        },
      },
      options: {
        new: true,
        lean: true,
      },
    })

    if (!isUpdated)
      return throwError({
        msg: "in-valid mongoId or note doesn't exists",
        status: 404,
      })

    await this.CacheService.update({
      key: `${isUpdated.createdBy}:notes:all`,
      obj: isUpdated,
      identifier: '_id',
    })

    return isUpdated
  }

  readonly labelNote = async (
    noteId: Types.ObjectId,
    labelId: Types.ObjectId,
    action: LabelingType,
  ) => {
    const isLabeled = await this.noteRepository.findOneAndUpdate({
      filter: {
        _id: noteId,
        archivedAt: { $exists: false },
        trashedAt: { $exists: false },
      },
      data: {
        ...(action == LabelingType.add
          ? { label: labelId }
          : { $unset: { label: 1 } }),
      },
      options: {
        new: true,
        lean: true,
      },
    })

    if (!isLabeled)
      return throwError({
        msg: "in-valid mongoId or note doesn't exists",
        status: 404,
      })

    if (isLabeled.archivedAt)
      await this.CacheService.update({
        key: `${isLabeled.createdBy}:notes:archived`,
        identifier: '_id',
        obj: isLabeled,
      })

    await this.CacheService.update({
      key: `${isLabeled.createdBy}:notes:all`,
      obj: isLabeled,
      identifier: '_id',
    })

    return isLabeled
  }

  readonly removeLabel = async (
    noteId: Types.ObjectId,
    labelId: Types.ObjectId,
  ) => {
    const isLabeled = await this.noteRepository.findOneAndUpdate({
      filter: {
        _id: noteId,
        archivedAt: { $exists: false },
        trashedAt: { $exists: false },
      },
      data: {
        label: labelId,
      },
      options: {
        new: true,
        lean: true,
      },
    })

    if (!isLabeled)
      return throwError({
        msg: "in-valid mongoId or note doesn't exists",
        status: 404,
      })

    if (isLabeled.archivedAt)
      await this.CacheService.update({
        key: `${isLabeled.createdBy}:notes:archived`,
        identifier: '_id',
        obj: isLabeled,
      })

    await this.CacheService.update({
      key: `${isLabeled.createdBy}:notes:all`,
      obj: isLabeled,
      identifier: '_id',
    })

    return isLabeled
  }

  readonly edit = async (data: IUpdateNoteDto, noteId: Types.ObjectId) => {
    const { tasks: newTasks, label, ...restUpdateNoteDto } = data

    if (!newTasks || (newTasks && !newTasks.length)) {
      const isUpdated = await this.noteRepository.findOneAndUpdate({
        filter: {
          _id: noteId,
          trashedAt: { $exists: false },
        },
        data: {
          ...restUpdateNoteDto,
          ...(!label ? { $unset: { label: 1 } } : { label }),
        },
        options: { lean: true, new: true },
      })

      if (!isUpdated)
        return throwError({
          msg: "in-valid mongoId or note doesn't exists",
          status: 404,
        })

      await this.CacheService.update({
        key: `${isUpdated.createdBy}:notes:all`,
        obj: isUpdated,
        identifier: '_id',
      })

      return isUpdated
    }

    const managedTasks = await this.NoteFactory.manageTasks(noteId, newTasks)

    const isUpdated = await this.noteRepository.findOneAndUpdate({
      filter: {
        _id: noteId,
        trashedAt: { $exists: false },
      },
      data: {
        ...restUpdateNoteDto,
        $set: { tasks: managedTasks },
        ...(!label ? { $unset: { label: 1 } } : { label }),
      },
      options: {
        lean: true,
        new: true,
      },
    })

    if (!isUpdated)
      return throwError({
        msg: "in-valid mongoId or note doesn't exists",
        status: 404,
      })

    await this.CacheService.update({
      key: `${isUpdated.createdBy}:notes:all`,
      obj: isUpdated,
      identifier: '_id',
    })

    return isUpdated
  }

  readonly archive = async (noteId: Types.ObjectId) => {
    const isArchived = await this.noteRepository.findOneAndUpdate({
      filter: {
        _id: noteId,
        archivedAt: { $exists: false },
        trashedAt: { $exists: false },
      },
      data: { archivedAt: Date.now(), $unset: { pinnedAt: 1 } },
      options: { new: true, lean: true },
    })

    if (!isArchived)
      return throwError({
        msg: "in-valid id or note doesn't exists",
        status: 404,
      })

    await this.CacheService.remove({
      key: `${isArchived.createdBy}:notes:all`,
      identifier: '_id',
      value: isArchived._id,
    })

    await this.CacheService.add({
      key: `${isArchived.createdBy}:notes:archived`,
      value: isArchived,
    })

    return isArchived
  }

  protected readonly deletePermanently = async (
    noteId: Types.ObjectId,
  ): Promise<TNote | null> => {
    const isDeleted = await this.noteRepository.findOneAndDelete({
      filter: {
        _id: noteId,
      },
    })

    if (!isDeleted) return null

    await this.CacheService.remove({
      key: `${isDeleted.createdBy}:notes:all`,
      identifier: '_id',
      value: isDeleted._id,
    })

    return isDeleted
  }

  protected readonly trash = async (
    noteId: Types.ObjectId,
  ): Promise<TNote | null> => {
    const isTrashed = await this.noteRepository.findOneAndUpdate({
      filter: {
        _id: noteId,
        trashedAt: { $exists: false },
      },
      data: { trashedAt: Date.now() },
    })

    if (!isTrashed) return null

    await this.CacheService.remove({
      key: `${isTrashed.createdBy}:notes:all`,
      identifier: '_id',
      value: isTrashed._id,
    })
    await this.CacheService.add({
      key: `${isTrashed.createdBy}:notes:trashed`,
      value: isTrashed,
    })

    return isTrashed
  }

  readonly restore = async (noteId: Types.ObjectId) => {
    const isRestored = await this.noteRepository.findOneAndUpdate({
      filter: {
        _id: noteId,
        $or: [
          { archivedAt: { $exists: true } },
          { trashedAt: { $exists: true } },
        ],
      },
      data: { $unset: { archivedAt: 1, trashedAt: 1 } },
      options: { lean: true },
    })

    if (!isRestored) return throwError({ msg: 'in-valid id', status: 400 })

    if (isRestored.trashedAt) {
      await this.CacheService.remove({
        key: `${isRestored.createdBy}:notes:trashed`,
        identifier: '_id',
        value: isRestored._id,
      })
      delete isRestored.trashedAt
    }

    if (isRestored.archivedAt) {
      await this.CacheService.remove({
        key: `${isRestored.createdBy}:notes:archived`,
        identifier: '_id',
        value: isRestored._id,
      })
      delete isRestored.archivedAt
    }

    await this.CacheService.add({
      key: `${isRestored.createdBy}:notes:all`,
      value: isRestored,
    })

    return isRestored
  }

  readonly delete = async (deleteNoteDto: IDeleteNoteDto) => {
    const { id, action } = deleteNoteDto

    if (action == 'trash') {
      const isTrashed = await this.trash(id)
      return isTrashed
        ? {
            action,
            data: isTrashed,
          }
        : throwError({ msg: 'in-valid noteId', status: 400 })
    }

    const isDeleted = await this.deletePermanently(id)
    return isDeleted
      ? {
          action,
          data: isDeleted,
        }
      : throwError({ msg: 'in-valid noteId', status: 400 })
  }
}

export default new NoteService()
