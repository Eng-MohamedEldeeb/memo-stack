import { Express, json } from 'express'
import { dbConnection } from './db/db-connection.service'
import { unknownURL } from './utils/handlers/unknown-url.handler copy'
import { globalError } from './utils/handlers/global-error.handler'

import authModule from './modules/auth/auth.module'
import noteModule from './modules/note/note.module'
import labelModule from './modules/label/label.module'

import cors from 'cors'
import helmet from 'helmet'
import { helmetOptions } from './utils/security/helmet/helmet-config'

export const bootstrap = async (app: Express): Promise<void> => {
  dbConnection()

  app.use(json())
  app.use(cors({ origin: process.env.ORIGIN }))
  app.use(helmet(helmetOptions))

  app.use('/auth', authModule)
  app.use('/note', noteModule)
  app.use('/label', labelModule)

  app.use(/(.*)/, unknownURL)

  app.use(globalError)
}
