import { asyncHandler } from '../../common/decorators/async-handler.decorator'
import { successResponse } from '../../utils/handlers/success-response.handler'
import {
  ICreateLabelDto,
  IDeleteLabelDto,
  IGetLabelsQueryDto,
  ILabelId,
  IRenameLabelDto,
} from './dto/label.dto'
import labelService from './label.service'

export class LabelController {
  static readonly getAll = asyncHandler<any, IGetLabelsQueryDto>(
    async (req, res) => {
      const userId = req.tokenPayload._id
      const { search } = req.query
      return successResponse(res, {
        msg: 'done',
        status: 200,
        data: await labelService.getAll(userId, search),
      })
    },
  )

  static readonly getSingle = asyncHandler<ILabelId>(async (req, res) => {
    const { id } = req.params
    return successResponse(res, {
      msg: 'done',
      status: 200,
      data: await labelService.getSingle(id),
    })
  })

  static readonly create = asyncHandler(async (req, res) => {
    const createdBy = req.tokenPayload._id
    const createLabelDto: ICreateLabelDto = req.body
    return successResponse(res, {
      msg: 'label has been created successfully',
      data: await labelService.create(createLabelDto, createdBy),
    })
  })

  static readonly rename = asyncHandler<ILabelId>(async (req, res) => {
    const userId = req.tokenPayload._id
    const { id } = req.params
    const renameLabelDto: IRenameLabelDto = req.body
    return successResponse(res, {
      msg: 'label has been renamed successfully',
      status: 200,
      data: await labelService.rename(userId, id, renameLabelDto),
    })
  })

  static readonly delete = asyncHandler<IDeleteLabelDto>(async (req, res) => {
    const { id } = req.params
    await labelService.delete(id)
    return successResponse(res, {
      msg: 'label has been Deleted successfully',
      status: 200,
    })
  })
}
