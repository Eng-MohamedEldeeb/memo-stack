import { Request } from 'express'
import { IUser } from '../../models/interfaces/user.interface'
import { ICloudFiles } from '../upload/interface/cloud-response.interface'
import { IPayload } from '../../utils/security/token/interface/token.interface'
import { INote } from '../../models/interfaces/note.interface'
import { ILabel } from '../../models/interfaces/label.interface'

export interface IRequest<P = any, Q = any> extends Request<P, any, any, Q> {
  tokenPayload: IPayload
  user: IUser
  note: INote
  label: ILabel
  cloudFiles: ICloudFiles
}
