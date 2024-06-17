import { connect } from 'mongoose'
import { MONGODB_URI } from '../config.js'

export const connectDB = async () => {
  try {
    const connection = await connect(MONGODB_URI)

    console.log(`Db connected on: ${connection.connection.host}:${connection.connection.port}`)
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}
