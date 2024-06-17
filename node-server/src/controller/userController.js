import { compare, genSalt, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'
import { getUserDetailsFromToken } from '../helpers/getUserDetailsFromToken.js'
import User from '../models/user.js'

export const register = async (req, res) => {
  try {
    const { name, email, password, image } = req.body

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Missing fields to send', error: true })
    }

    const checkEmail = await User.findOne({ email })

    if (checkEmail) {
      return res
        .status(400)
        .json({ message: 'Email already exists', error: true })
    }

    const salt = await genSalt(10)
    const hashPassword = await hash(password, salt)

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      image
    })

    const userSaved = await newUser.save()

    return res.status(201).json({
      message: 'User created successfully',
      data: userSaved,
      success: true
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true })
  }
}

export const userDetails = async (req, res) => {
  try {
    const token = req.cookies.token || ''

    const user = await getUserDetailsFromToken(token)

    return res
      .status(200)
      .json({ message: 'User details', data: user, success: true })
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true })
  }
}

export const updateUserDetails = async (req, res) => {
  try {
    const token = req.cookies.token || ''

    const user = await getUserDetailsFromToken(token)

    const { name, image } = req.body

    await User.updateOne({ _id: user._id }, { name, image })

    const userInformation = await User.findById(user._id).select('-password')

    return res.status(200).json({
      message: 'User update successfully',
      data: userInformation,
      success: true
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true })
  }
}

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body

    const checkEmail = await User.findOne({ email }).select('-password')

    if (!checkEmail) { return res.status(400).json({ message: 'Email not found', error: true }) }

    return res
      .status(200)
      .json({ message: 'Email found', data: checkEmail, success: true })
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true })
  }
}

export const checkPassword = async (req, res) => {
  try {
    const { password, userId } = req.body

    const user = await User.findById(userId)

    const verifyPassword = await compare(password, user.password)

    if (!verifyPassword) {
      return res
        .status(400)
        .json({ message: 'Password incorrect', error: true })
    }

    const token = await sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d'
    })

    return res
      .cookie('token', token, { http: true, secure: true })
      .status(200)
      .json({
        message: 'Login successfully',
        token,
        success: true
      })
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true })
  }
}

export const searchUser = async (req, res) => {
  try {
    const { search } = req.body

    const query = new RegExp(search, 'i', 'g')

    const users = await User.find({
      $or: [{ name: query }, { email: query }]
    }).select('-password')

    return res
      .status(200)
      .json({ message: 'Users found', data: users, success: true })
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true })
  }
}

/**
 * Logs out a user by clearing the token cookie and returns a success message.
 * @param req - Contains information about the request made by the client, such as headers, parameters, body, and more.
 * @param res - Set a cookie named 'token' with an empty value,
 * @returns Response with a status code of 200 (OK) and a JSON
 * object containing a message indicating successful logout and a boolean flag `success` set to true.
 */
export const logout = async (req, res) => {
  try {
    const cookieOptions = {
      http: true,
      secure: true
    }

    return res.cookie('token', '', cookieOptions).status(200).json({
      message: 'Logout successfully',
      success: true
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true })
  }
}
