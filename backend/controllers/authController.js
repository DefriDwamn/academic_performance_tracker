import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import { generateToken, generateRefreshToken } from "../utils/generateToken.js"
import jwt from "jsonwebtoken"

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    // If user is a student, get student details
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    }

    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.json({
      user: userData,
      token,
      refreshToken,
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body

  if (!token) {
    res.status(401)
    throw new Error("No refresh token provided")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const newToken = generateToken(decoded.id)

    res.json({ token: newToken })
  } catch (error) {
    res.status(401)
    throw new Error("Invalid refresh token")
  }
})

// @desc    Validate token and get user data
// @route   GET /api/auth/validate
// @access  Private
const validateToken = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('studentId', 'firstName lastName email')

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const response = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      student: user.studentId || null
    }

    res.json(response)
  } catch (error) {
    res.status(401)
    throw new Error('Not authorized')
  }
})

export { loginUser, refreshToken, validateToken }
