import bcrypt from 'bcrypt'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

import users from '../model/usermodel.js'
import { generatetoken } from '../LIB/utlis.js'
import cloudinary from '../LIB/cloudinary.js'

export const register = async (req, res) => {
  const { email, fullname, password } = req.body
  try {
    if (!email || !fullname || !password) {
      return res.status(400).json({ message: 'all fields are required' })
    }
    const user_uname_exist = await users.findOne({ fullname })
    const user_email_exist = await users.findOne({ email })
    if (user_uname_exist) return res.status(400).json({ message: 'username already exist' })
    if (user_email_exist) return res.status(400).json({ message: 'email already exist' })
    if (password.length < 6) return res.status(400).json({ message: 'un match password length' })

    const salt = await bcrypt.genSalt(10)
    const passwordhash = await bcrypt.hash(password, salt)

    const newuser = new users({
      fullname,
      email,
      password: passwordhash,
    })

    if (!newuser) return res.status(400).json({ message: 'registartion failed' })

    await newuser.save()

    const token = generatetoken(newuser._id, res)
    return res.status(200).json({
      user_data: {
        _id: newuser._id,
        fullname: newuser.fullname,
        email: newuser.email,
        profilepic: newuser.profilepic,
      },
      message: 'registartion success fully',
      token,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: 'internal server error' })
  }
}

export const login = async (req, res) => {
  const { email, password} = req.body
  // Coerce to string to prevent crashes if input is not a string
  const identifier = String(email).toLowerCase()

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Username and password are required' })
  }

  try {
    const user = await users.findOne({ email: identifier })

    if (!user) return res.status(400).json({ message: 'Incorrect email/username or password' })

    if (!user.password) {
        console.error('Password hash missing for user:', user.email);
        return res.status(500).json({ message: 'internal server error' });
    }

    let ispassword
    try {
      ispassword = await bcrypt.compare(String(password), user.password)
    } catch (bcryptErr) {
      console.error('Bcrypt compare error (login):', bcryptErr?.stack || bcryptErr)
      return res.status(500).json({ message: 'Internal server error (password compare)' })
    }

    if (!ispassword) return res.status(400).json({ message: 'Incorrect email/username or password' })

    let token
    try {
      token = generatetoken(user._id, res)
    } catch (tokenErr) {
      console.error('Token generation error (login):', tokenErr?.stack || tokenErr)
      return res.status(500).json({ message: 'Internal server error (token generation)' })
    }

    return res.status(200).json({
      user_data: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilepic: user.profilepic,
      },
      message: 'login successfull',
      token,
    })
  } catch (error) {
    // This will now print the exact line causing the crash in your server terminal/logs
    console.error('Login controller error stack:', error.stack || error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const logout = (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 0 })
    res.status(200).json({ message: 'logout successfully' })
  } catch (error) {
    console.log('error in logout controller', error.message)
    res.status(500).json({ message: 'internal server error' })
  }
}

export const updateprofile = async (req, res) => {
  try {
    const { profilepic, fullname, email, password } = req.body
    const userid = req.user._id
    const updateData = {}

    if (fullname) updateData.fullname = fullname
    if (email) updateData.email = email
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'password must be at least 6 characters' })
      }
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(password, salt)
    }
    if (profilepic) {
      const uploadresponse = await cloudinary.uploader.upload(profilepic)
      updateData.profilepic = uploadresponse.secure_url
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'no profile data provided' })
    }

    const updateduser = await users
      .findByIdAndUpdate(userid, updateData, { new: true })
      .select('-password')

    return res.status(200).json({ user_data: updateduser, message: 'data updated' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'profile not updated' })
  }
}

export const checkauth = async (req, res) => {
  try {
    return res.status(200).json(req.user)
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: 'internal server error' })
  }
}

const sendResetLink = async ({ email, resetToken, res }) => {
  const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3000'
  const link = `${frontendBase}/reset-password/${resetToken}`

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS not set. Falling back to JSON response for reset link.");
    return res.status(200).json({ message: 'Development mode: Link generated', resetLink: link });
  }

  // Setup Nodemailer (You would need to add these to your .env)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click here to reset: ${link}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return res.status(200).json({ message: 'Reset link sent to your email' })
  } catch (err) {
    console.error("Nodemailer error:", err.message);
    return res.status(500).json({ message: "Failed to send email", link: link }); // Send link in body for debugging
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'email is required' })

    const user = await users.findOne({ email })

    // Avoid leaking existence
    if (!user) return res.status(200).json({ message: 'If the email exists, a reset link will be sent' })

    // Clear any previous reset token to avoid confusion
    user.resetPasswordTokenHash = ''
    user.resetPasswordExpires = null

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    user.resetPasswordTokenHash = resetTokenHash
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000 // 15 minutes
    await user.save()

    return sendResetLink({ email, resetToken, res })
  } catch (error) {
    console.log('error in forgotPassword', error.message)
    return res.status(500).json({ message: 'internal server error' })
  }
}


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!token) return res.status(400).json({ message: 'token is required' })
    if (!password) return res.status(400).json({ message: 'password is required' })
    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters' })
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Support both: raw token -> sha256 match, and already-hashed token -> direct match
    const user = await users.findOne({
      resetPasswordExpires: { $gt: Date.now() },
      $or: [
        { resetPasswordTokenHash: resetTokenHash },
        { resetPasswordTokenHash: token },
      ],
    })

    if (!user) return res.status(400).json({ message: 'invalid or expired reset token' })


    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    user.resetPasswordTokenHash = ''
    user.resetPasswordExpires = null
    await user.save()

    return res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    console.log('error in resetPassword', error.message)
    return res.status(500).json({ message: 'internal server error' })
  }
}
