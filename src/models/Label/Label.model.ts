import { model, models } from 'mongoose'
import { labelSchema } from './Label.schema'

export const LabelModel = models.Label ?? model('Label', labelSchema)
