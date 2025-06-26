import { Model, PipelineStage, RootFilterQuery } from 'mongoose'
import {
  IFind,
  IFindById,
  IFindByIdAndDelete,
  IFindByIdAndUpdate,
  IFindOne,
  IFindOneAndDelete,
  IFindOneAndUpdate,
  IUpdateMany,
} from '../../db/interface/db-service.interface'

export abstract class DataBaseService<Inputs, TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  readonly create = async (data: Partial<TDocument>): Promise<TDocument> => {
    return await this.model.create(data)
  }
  readonly aggregate = async (pipeline: PipelineStage[]) => {
    return await this.model.aggregate(pipeline)
  }
  readonly find = async ({
    filter = {},
    projection = {},
    options = {},
    populate = [],
  }: IFind<Inputs> = {}): Promise<TDocument[] | []> => {
    return await this.model.find(filter, projection, options).populate(populate)
  }
  readonly findOne = async ({
    filter = {},
    projection = {},
    options = {},
    populate = [],
  }: IFindOne<TDocument>): Promise<TDocument | null> => {
    return await this.model
      .findOne(filter, projection, options)
      .populate(populate)
  }
  readonly findOneAndUpdate = async ({
    filter,
    data,
    options = {},
  }: IFindOneAndUpdate<TDocument>): Promise<TDocument | null> => {
    return await this.model.findOneAndUpdate(filter, data, options)
  }
  readonly findOneAndDelete = async ({
    filter,
    options = {},
  }: IFindOneAndDelete<Inputs>): Promise<TDocument | null> => {
    return await this.model.findOneAndDelete(filter, options)
  }
  readonly findById = async ({
    _id,
    projection = {},
    options = {},
    populate = [],
  }: IFindById<Inputs>): Promise<TDocument | null> => {
    return await this.model
      .findById(_id, projection, options)
      .populate(populate || [])
  }
  readonly findByIdAndUpdate = async ({
    _id,
    data,
    options = {},
  }: IFindByIdAndUpdate<TDocument>): Promise<TDocument | null> => {
    return await this.model.findByIdAndUpdate(_id, data, options)
  }
  readonly findByIdAndDelete = async ({
    _id,
    options = {},
  }: IFindByIdAndDelete<Inputs>): Promise<TDocument | null> => {
    return await this.model.findByIdAndDelete(_id, options)
  }

  readonly deleteMany = async (filter: RootFilterQuery<Inputs>) => {
    return await this.model.deleteMany(filter)
  }

  readonly updateMany = async ({ filter, data }: IUpdateMany<TDocument>) => {
    return await this.model.updateMany(filter, data)
  }
}
