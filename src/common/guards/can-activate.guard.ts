import { IRequest } from '../interface/IRequest.interface'

export abstract class GuardActivator {
  abstract canActivate(req: IRequest): Promise<Boolean> | Boolean
}
