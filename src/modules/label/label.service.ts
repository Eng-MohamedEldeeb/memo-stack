import { Types } from 'mongoose'
import labelRepository from '../../common/repositories/label.repository'
import { ICreateLabelDto, IRenameLabelDto } from './dto/label.dto'
import { throwError } from '../../utils/handlers/error-message.handler'
import { TLabel } from '../../models/interfaces/types/document.type'
import { CacheService } from '../../cache/cache.service'

class LabelService {
  private readonly labelRepository: typeof labelRepository = labelRepository
  private readonly CacheService = CacheService

  readonly getAll = async (createdBy: Types.ObjectId, query: string) => {
    const isCached: { value: Array<TLabel> } | null =
      await this.CacheService.get(`${createdBy.toString()}:labels:all`)

    if (!query && isCached) {
      return isCached.value
    }

    const labels = await this.labelRepository.find({
      filter: {
        createdBy,
        ...(query && {
          $or: [
            { name: { $regex: query.trim() } },
            { 'notes.$.title': { $regex: query.trim() } },
          ],
        }),
      },
      options: { lean: true },
      populate: [{ path: 'notes' }],
    })

    if (!query && labels.length)
      await this.CacheService.set({
        key: `${createdBy.toString()}:labels:all`,
        value: labels,
        expiresAfter: 900,
      })

    return labels
  }

  readonly getSingle = async (labelId: Types.ObjectId) => {
    const labelExists = await this.labelRepository.findOne({
      filter: {
        _id: labelId,
      },
      options: { lean: true },
      populate: [{ path: 'notes' }],
    })

    if (!labelExists)
      return throwError({
        msg: "label doesn't exists or in-valid id",
        status: 404,
      })
    const notesArray = labelExists.notes

    return {
      ...labelExists,
      notes: {
        pin: notesArray.filter(note => Boolean(note.pinnedAt)),
        archive: notesArray.filter(note => Boolean(note.archivedAt)),
        other: notesArray.filter(note =>
          Boolean(!note.pinnedAt && !note.archivedAt),
        ),
        count: notesArray.length,
      },
    }
  }

  readonly create = async (
    createLabelDto: ICreateLabelDto,
    createdBy: Types.ObjectId,
  ) => {
    const labelExists = await this.labelRepository.findOne({
      filter: {
        name: { $regex: createLabelDto.name, $options: 'i' },
        createdBy,
      },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (labelExists)
      return throwError({ msg: 'label already exists', status: 409 })

    const label = await this.labelRepository.create({
      ...createLabelDto,
      createdBy,
    })

    await this.CacheService.add({
      key: `${createdBy}:labels:all`,
      value: label.populate([{ path: 'notes' }]),
    })

    return label
  }

  readonly rename = async (
    createdBy: Types.ObjectId,
    labelId: Types.ObjectId,
    renameLabelDto: IRenameLabelDto,
  ) => {
    const labelsExists = await this.labelRepository.findOne({
      filter: {
        _id: labelId,
        createdBy,
      },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (!labelsExists)
      return throwError({
        msg: "label doesn't exists or in-valid id",
        status: 404,
      })

    const isUpdated = await this.labelRepository.findByIdAndUpdate({
      _id: labelId,
      data: renameLabelDto,
      options: {
        lean: true,
        new: true,
      },
    })

    if (!isUpdated)
      return throwError({
        msg: "in-valid mongoId or label doesn't exists",
        status: 404,
      })

    await this.CacheService.update({
      key: `${isUpdated.createdBy}:labels:all`,
      obj: isUpdated,
      identifier: '_id',
    })

    return isUpdated
  }

  readonly delete = async (labelId: Types.ObjectId) => {
    const isDeleted = await this.labelRepository.findByIdAndDelete({
      _id: labelId,
    })

    if (!isDeleted)
      return throwError({
        msg: "label doesn't exists or in-valid id",
        status: 400,
      })

    await this.CacheService.remove({
      key: `${isDeleted.createdBy}:labels:all`,
      value: isDeleted._id,
      identifier: '_id',
    })
  }
}

export default new LabelService()
