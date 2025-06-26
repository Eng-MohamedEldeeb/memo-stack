import multer, { diskStorage, Multer } from 'multer'
import { fileFilter } from './validation/file-filter'
import { AcceptedFiles } from './validation/types/file-filter.types'

export const fileReader = (...acceptedFiles: AcceptedFiles[]): Multer => {
  return multer({
    fileFilter: fileFilter(acceptedFiles),
    storage: diskStorage({}),
  })
}
