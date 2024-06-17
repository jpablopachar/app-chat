import { Router } from 'express'
import {
  checkEmail,
  checkPassword,
  logout,
  register,
  searchUser,
  updateUserDetails,
  userDetails
} from '../controller/userController.js'

export const router = Router()

router.post('/register', register)
router.post('/email', checkEmail)
router.post('/password', checkPassword)
router.get('/user-details', userDetails)
router.get('/logout', logout)
router.post('/update-user', updateUserDetails)
router.post('/search-user', searchUser)
