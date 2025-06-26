import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../middlewares/validation.middleware'
import * as validators from './validator/auth.validator'
import { applyRateLimiter } from '../../common/decorators/rate-limiter.decorator'

const router: Router = Router()

router.post(
  '/confirm-email',
  applyRateLimiter(),
  validate(validators.confirmEmailSchema),
  AuthController.confirmEmail,
)

router.post(
  '/register',
  applyRateLimiter(),
  validate(validators.registerSchema),
  AuthController.register,
)

router.post(
  '/login',
  applyRateLimiter(),
  validate(validators.loginSchema),
  AuthController.login,
)

router.post(
  '/forgot-password',
  applyRateLimiter(),
  validate(validators.forgotPasswordSchema),
  AuthController.forgotPassword,
)

router.patch(
  '/reset-password',
  applyRateLimiter(),
  validate(validators.resetPasswordSchema),
  AuthController.resetPassword,
)

router.delete(
  '/delete-account',
  applyRateLimiter(),
  validate(validators.deleteAccountSchema),
  AuthController.deleteAccount,
)

router.delete(
  '/confirm-deleting',
  applyRateLimiter(),
  validate(validators.confirmDeleteSchema),
  AuthController.confirmDeleting,
)

export default router
