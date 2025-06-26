import { IUser } from './../../models/interfaces/user.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TUser } from '../../models/interfaces/types/document.type'
import { UserModel } from '../../models/User/User.model'

class UserRepository extends DataBaseService<IUser, TUser> {
  constructor(protected readonly userModel: Model<TUser> = UserModel) {
    super(userModel)
  }
}

export default new UserRepository()
