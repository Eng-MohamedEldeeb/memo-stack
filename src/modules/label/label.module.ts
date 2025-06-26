import { Router } from 'express'
import { applyGuardsActivator } from '../../common/decorators/apply-activators.decorator'
import isAuthenticatedGuard from '../../common/guards/is-authenticated.guard'
import isAuthorizedGuard from '../../common/guards/is-authorized.guard'
import { LabelController } from './label.controller'
import { validate } from '../../middlewares/validation.middleware'
import * as validators from './validator/label.validator'
import labelGuard from '../../common/guards/label.guard'

const router: Router = Router()

router.get(
  '/',
  validate(validators.getAllSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  LabelController.getAll,
)

router.get(
  '/:id',
  validate(validators.getSingleSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  LabelController.getSingle,
)

router.post(
  '/',
  validate(validators.createSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  LabelController.create,
)

router.patch(
  '/:id',
  validate(validators.renameSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard, labelGuard),
  LabelController.rename,
)

router.delete(
  '/:id',
  validate(validators.renameSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard, labelGuard),
  LabelController.delete,
)

export default router
