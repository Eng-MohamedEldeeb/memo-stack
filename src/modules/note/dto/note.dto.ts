import { Types } from 'mongoose'
import { INoteInputs, ITask } from '../../../models/interfaces/note.interface'
import { ICloud } from '../../../common/upload/interface/cloud-response.interface'
import {
  DeletingType,
  LabelingType,
} from '../../../models/interfaces/enums/note.enum'
import { ILabelId } from '../../label/dto/label.dto'

export interface IGetNotesQueryDto {
  search: string
}

export interface INoteIdDto {
  id: Types.ObjectId
}

export interface ICreateNoteDto extends Omit<INoteInputs, 'pinnedAt'> {}

export interface IAddAttachmentsDto extends INoteIdDto {
  cloudFiles: ICloud
}

export interface ILabelDto extends INoteIdDto {
  action: LabelingType
  labelId: Types.ObjectId
}

export interface IUpdateNoteDto
  extends Omit<Partial<INoteInputs>, 'pinnedAt'> {}

export interface IUpdateTaskDto
  extends Pick<ITask, '_id' | 'name' | 'completed'> {}

export interface IDeleteNoteDto {
  action: DeletingType
  id: Types.ObjectId
}
