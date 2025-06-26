import { throwError } from '../../utils/handlers/error-message.handler'
import { IRequest } from '../interface/IRequest.interface'
import userRepository from '../repositories/user.repository'
import { GuardActivator } from './can-activate.guard'

class IsAuthorizedGuard implements GuardActivator {
  private readonly userRepository = userRepository

  async canActivate(req: IRequest) {
    const { _id, iat } = req.tokenPayload

    const userExists = await this.userRepository.findById({
      _id,
      projection: { _id: 1, changedCredentialsAt: 1 },
      options: { lean: true },
    })

    if (!userExists)
      return throwError({ msg: 'un-authenticated user', status: 403 })

    if (
      iat &&
      iat < Math.ceil(userExists.changedCredentialsAt?.getTime() / 1000)
    )
      return throwError({ msg: 're-login is required', status: 403 })

    req.user = userExists

    return true
  }
}

export default new IsAuthorizedGuard()
