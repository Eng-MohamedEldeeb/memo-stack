import { NextFunction, Request, Response } from 'express'
import { IRequest } from '../interface/IRequest.interface'
import { CloudUploader } from '../upload/cloud.service'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

type AsyncFunction<P = any, Q = any> = (
  req: IRequest<P, Q>,
  res: Response,
  next: NextFunction,
) => Promise<void> | void

export const asyncHandler = <P = any, Q = any>(fn: AsyncFunction<P, Q>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      return await fn(req as IRequest<P, Q>, res, next)
    } catch (error) {
      const fileRequest = req as IRequest

      if (fileRequest.cloudFiles && fileRequest.cloudFiles.paths.length) {
        for (const file of fileRequest.cloudFiles.paths) {
          await CloudUploader.delete(file.public_id)
        }
        await CloudUploader.deleteFolder(
          `${process.env.APP_NAME}/${fileRequest.cloudFiles.folderId}`,
        )
      }

      if (error instanceof TokenExpiredError)
        return next({ msg: 'Token is expired', status: 400 })

      if (error instanceof JsonWebTokenError)
        return next({ msg: 'in-valid token', status: 400 })

      if (error instanceof Error) return next(error)

      return next(error)
    }
  }
}
