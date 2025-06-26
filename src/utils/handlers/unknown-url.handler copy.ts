import { NextFunction, Request, Response } from 'express'

export const unknownURL = (req: Request, res: Response, _: NextFunction) => {
  res.status(404).json({ error: `Unknown URL [${req.originalUrl}]` })
}
