import { connect } from 'mongoose'
import { MONGODB_URI } from '../config.js'

/**
 * Connects to a MongoDB database using the provided URI and logs a
 * success message or exits the process with an error message if
 * there is an issue.
 */
export const connectDB = async () => {
  try {
    await connect(MONGODB_URI)

    console.log('Db connected')
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}
