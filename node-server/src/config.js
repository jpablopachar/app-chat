import dotenv from 'dotenv'

dotenv.config()

// eslint-disable-next-line no-undef
export const PORT = process.env.PORT || 3000
export const MONGODB_URI = process.env.MONGODB_URI
export const MONGODB_DB = process.env.MONGODB_DB
export const JWT_SECRET = process.env.JWT_SECRET
