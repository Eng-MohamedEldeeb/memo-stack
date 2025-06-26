import { createClient } from 'redis'

export const client = async () => {
  return createClient()
    .on('error', error => {
      throw error
    })
    .connect()
}
