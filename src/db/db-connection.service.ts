import { connect, Mongoose } from 'mongoose'

export const dbConnection = async (): Promise<Mongoose | void> => {
  try {
    return await connect(String(process.env.DB_URI)).then(() =>
      console.log('DB Connection established'),
    )
  } catch (error) {
    if (error instanceof Error)
      console.error({ msg: 'DB connection error', error })
    console.error({ msg: 'DB connection error', error })
  }
}
