import { GuardActivator } from '../guards/can-activate.guard'
import { asyncHandler } from './async-handler.decorator'

export const applyGuardsActivator = (...activators: GuardActivator[]) => {
  return asyncHandler(async (req, _, next) => {
    for (const activator of activators) {
      await activator.canActivate(req)
    }
    return next()
  })
}
