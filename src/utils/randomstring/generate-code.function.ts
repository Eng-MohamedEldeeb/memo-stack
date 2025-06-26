import { generate, GenerateOptions } from 'randomstring'

export const generateCode = ({
  length,
  charset,
}: Pick<GenerateOptions, 'length' | 'charset'>): string => {
  return generate({ length, charset })
}
