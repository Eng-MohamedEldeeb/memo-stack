import { asyncHandler } from '../common/decorators/async-handler.decorator'
import { CloudUploader } from '../common/upload/cloud.service'
import { INoteIdDto } from '../modules/note/dto/note.dto'

export const uploadAttachments = (folderName: string) => {
  return asyncHandler<INoteIdDto>(async (req, res, next) => {
    if (req.files && !req.files.length) {
      return next()
    }

    const folderId = req.params.id.toString()

    req.cloudFiles = { folderId, paths: [] }

    for (const file of req.files as Express.Multer.File[]) {
      const { public_id, secure_url } = await CloudUploader.upload({
        path: file.path,
        folderName: `${process.env.APP_NAME}/${folderId}/${folderName}`,
      })
      req.cloudFiles.paths.push({ public_id, secure_url })
    }

    return next()
  })
}
