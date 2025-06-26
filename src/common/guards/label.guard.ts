import { ILabelId } from '../../modules/label/dto/label.dto'
import { ILabelDto } from '../../modules/note/dto/note.dto'
import { throwError } from '../../utils/handlers/error-message.handler'
import { IRequest } from '../interface/IRequest.interface'
import labelRepository from '../repositories/label.repository'
import { GuardActivator } from './can-activate.guard'

class LabelGuard implements GuardActivator {
  private readonly labelRepository = labelRepository

  async canActivate(req: IRequest<ILabelId, Pick<ILabelDto, 'labelId'>>) {
    const { _id: createdBy } = req.tokenPayload
    const { id, labelId } = { ...req.params, ...req.query }

    const labelExists = await this.labelRepository.findOne({
      filter: { createdBy, $or: [{ _id: labelId }, { _id: id }] },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (!labelExists)
      return throwError({
        msg: 'label was not found',
        status: 404,
      })

    req.label = labelExists

    return true
  }
}

export default new LabelGuard()
