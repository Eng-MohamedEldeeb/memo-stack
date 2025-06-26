import { model, models } from 'mongoose'
import { userSchema } from './User.schema'

export const UserModel = models.User ?? model('User', userSchema)
