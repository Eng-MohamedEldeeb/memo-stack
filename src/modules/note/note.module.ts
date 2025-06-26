import { Router } from 'express'
import { validate } from '../../middlewares/validation.middleware'
import * as validators from './validator/note.validator'
import { NoteController } from './note.controller'
import { fileReader } from '../../utils/multer/file-reader'
import { uploadAttachments } from '../../middlewares/upload-attachments.middleware'
import { applyGuardsActivator } from '../../common/decorators/apply-activators.decorator'
import isAuthenticatedGuard from '../../common/guards/is-authenticated.guard'
import isAuthorizedGuard from '../../common/guards/is-authorized.guard'
import noteGuard from '../../common/guards/note.guard'
import labelGuard from '../../common/guards/label.guard'

const router: Router = Router()

router.get(
  '/',
  validate(validators.getAllSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  NoteController.getAll,
)

router.get(
  '/archived',
  validate(validators.getArchivedSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  NoteController.getAllArchived,
)

router.get(
  '/trashed',
  validate(validators.getArchivedSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  NoteController.getAllTrashed,
)

router.get(
  '/:id',
  validate(validators.getSingleSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  NoteController.getSingle,
)

router.post(
  '/',
  validate(validators.createSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard),
  NoteController.create,
)

router.post(
  '/attachments/:id',
  fileReader('image/jpg', 'image/jpeg').array('attachments', 10),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard, noteGuard),
  validate(validators.addAttachmentsSchema),
  uploadAttachments('note'),
  NoteController.addAttachments,
)

router.post(
  '/pin/:id',
  validate(validators.pinSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard, noteGuard),
  NoteController.pin,
)

router.patch(
  '/edit/:id',
  validate(validators.editSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard, noteGuard),
  NoteController.edit,
)

router.patch(
  '/archive/:id',
  validate(validators.getArchivedSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard, noteGuard),
  NoteController.archive,
)

router.patch(
  '/restore/:id',
  validate(validators.getSingleSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard, noteGuard),
  NoteController.restore,
)

router.patch(
  '/label/:id',
  validate(validators.labelSchema),
  applyGuardsActivator(
    isAuthenticatedGuard,
    isAuthorizedGuard,
    noteGuard,
    labelGuard,
  ),
  NoteController.label,
)

router.delete(
  '/',
  validate(validators.deleteNoteSchema),
  applyGuardsActivator(isAuthenticatedGuard, isAuthorizedGuard, noteGuard),
  NoteController.delete,
)

export default router
