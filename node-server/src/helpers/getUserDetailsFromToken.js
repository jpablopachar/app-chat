import jsonwebtoken from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'
import User from '../models/user.js'

export const getUserDetailsFromToken = async (token) => {
  if (!token) return { message: 'Session out', logout: true }

  const decode = await jsonwebtoken.verify(token, JWT_SECRET)

  const user = await User.findById(decode.id).select('-password')

  return user
}
