import rateLimit, { Options } from 'express-rate-limit'

type RateLimiterOptions = Pick<
  Options,
  | 'windowMs'
  | 'statusCode'
  | 'limit'
  | 'message'
  | 'skipFailedRequests'
  | 'skipSuccessfulRequests'
  | 'handler'
  | 'legacyHeaders'
  | 'standardHeaders'
>

export const applyRateLimiter = (options?: RateLimiterOptions) => {
  return rateLimit({
    ...options,
    windowMs: options?.windowMs ?? 600000,
    limit: options?.limit ?? 10,
    message: options?.message ?? {
      success: false,
      error: {
        msg: 'request limit reached',
      },
    },
    legacyHeaders: options?.legacyHeaders ?? true,
    standardHeaders: options?.standardHeaders ?? 'draft-8',
  })
}
