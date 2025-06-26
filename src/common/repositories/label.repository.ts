import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TLabel } from '../../models/interfaces/types/document.type'
import { LabelModel } from '../../models/Label/Label.model'
import { ILabel } from '../../models/interfaces/label.interface'

class LabelRepository extends DataBaseService<ILabel, TLabel> {
  constructor(protected readonly labelModel: Model<TLabel> = LabelModel) {
    super(labelModel)
  }
}

export default new LabelRepository()
