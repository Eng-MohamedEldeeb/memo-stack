import { Types } from 'mongoose'
import noteRepository from '../../../common/repositories/note.repository'
import { ITask } from '../../../models/interfaces/note.interface'
import { throwError } from '../../../utils/handlers/error-message.handler'

export class NoteFactory {
  protected static readonly noteRepository = noteRepository

  static readonly manageTasks = async (
    noteId: Types.ObjectId,
    newTasks: ITask[],
  ): Promise<ITask[]> => {
    const noteExists = await this.noteRepository.findOne({
      filter: {
        _id: noteId,
        archivedAt: { $exists: false },
        trashedAt: { $exists: false },
      },
      options: { lean: true },
    })

    if (!noteExists)
      return throwError({
        msg: "in-valid mongoId or note doesn't exists",
        status: 404,
      })

    if (noteExists.trashedAt)
      return throwError({
        msg: "Can't edit trashed note: you need to restore it first",
        status: 400,
      })

    const noteTasks = noteExists.tasks

    for (const newTask of newTasks) {
      if (!newTask._id) {
        if (!newTask.name) {
          return throwError({ msg: 'task should have name', status: 404 })
        }

        noteTasks.push(newTask)
        continue
      }

      if (newTask._id && !noteTasks.length) {
        return throwError({ msg: "task doesn't exists", status: 404 })
      }

      for (const oldTaskIndex in noteTasks) {
        const equaledIds = noteTasks[oldTaskIndex]._id?.equals(newTask._id)

        if (equaledIds) {
          if (Object.keys(newTask).includes('completed')) {
            if (!newTask.completed) {
              noteTasks.splice(+oldTaskIndex, 1, {
                _id: noteTasks[oldTaskIndex]._id,
                name: newTask.name || noteTasks[oldTaskIndex].name,
              })
              break
            }

            noteTasks[oldTaskIndex].completed = newTask.completed
            break
          }

          if (Object.keys(newTask).includes('name')) {
            if (!newTask.name.length) {
              noteTasks.splice(+oldTaskIndex, 1)
              break
            }

            noteTasks[oldTaskIndex].name = newTask.name
            break
          }
          break
        }

        if (!equaledIds && +oldTaskIndex >= noteTasks.length - 1) {
          return throwError({ msg: 'taskId is in-valid', status: 400 })
        }
      }
    }

    return noteTasks
  }
}
