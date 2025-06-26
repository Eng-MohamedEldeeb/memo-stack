import { GuardActivator } from './can-activate.guard'
import { verifyToken } from '../../utils/security/token/token.service'
import { throwError } from '../../utils/handlers/error-message.handler'
import { IRequest } from '../interface/IRequest.interface'

class IsAuthenticatedGuard implements GuardActivator {
  canActivate(req: IRequest) {
    const { authorization } = req.headers

    if (!authorization) return throwError({ msg: 'missing token', status: 400 })

    const [bearer, token] = authorization.split(' ')

    if (!bearer || !token)
      return throwError({ msg: 'missing token', status: 400 })

    const tokenPayload = verifyToken(token)

    req.tokenPayload = tokenPayload

    return true
  }
}

export default new IsAuthenticatedGuard()
