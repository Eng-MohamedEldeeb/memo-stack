import { IEmailSchemaArgs } from '../../schemas/interface/email-schema.interface'
import * as emailSchemaTypes from '../../schemas/email-schema'

export type EmailSchemas = keyof typeof emailSchemaTypes

export interface ISendArgs extends IEmailSchemaArgs {
  schema: EmailSchemas
}
