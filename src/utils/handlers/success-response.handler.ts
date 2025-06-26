import { Response } from 'express'

export const successResponse = (
  res: Response,
  { msg, status, data }: { msg?: string; status?: number; data?: object },
) => {
  res.status(status ?? 201).json({
    success: true,
    msg: msg ?? 'done',
    ...(data && { data }),
  })
}
