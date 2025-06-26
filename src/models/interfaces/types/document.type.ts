import { Document, HydratedDocument } from 'mongoose'
import { IUser } from '../user.interface'
import { INote } from '../note.interface'
import { ILabel } from '../label.interface'
import { IOtp } from '../otp.interface'

export type TUser = HydratedDocument<IUser> & Document

export type TNote = HydratedDocument<INote> & Document

export type TLabel = HydratedDocument<ILabel> & Document

export type TOtp = HydratedDocument<IOtp> & Document
