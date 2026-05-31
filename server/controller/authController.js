import bcrypt from 'bcrypt'
import crypto from 'crypto'

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
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

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
      message: 'Registration successful',
      token,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: 'internal server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, username } = req.body || {};
    
    // Allow login via 'email' or 'username' field (flexible for frontend)
    const loginInput = email || username;

    if (!loginInput || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const identifier = String(loginInput).trim().toLowerCase();

    // Search for user by email OR fullname
    const user = await users.findOne({
      $or: [
        { email: identifier },
        { fullname: identifier }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Safety check for password field
    if (!user.password) {
      console.error('Password hash missing in DB for user:', user.email);
      return res.status(500).json({ message: 'Account configuration error. Please contact support.' });
    }

    const isPasswordCorrect = await bcrypt.compare(String(password), user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

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
      message: 'Login successful',
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
    res.status(200).json({ message: 'Logout successful' })
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

const sendResetLink = async ({ email, resetToken, res, fullname }) => {
    const frontendBase = process.env.frontend_url || 'http://localhost:3000'
    const link = `${frontendBase}/reset-password/${resetToken}?fullname=${encodeURIComponent(fullname || '')}`

    try {
        // Directly return the link for frontend display, bypassing email providers entirely.
        return res.status(200).json({ 
            message: 'Reset link generated successfully.', 
            resetLink: link, 
            fullname, 
            emailSent: false 
        });
    } catch (err) {
        console.error("Error generating reset link:", err.message);
        return res.status(500).json({ message: 'Internal server error' });
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

    return sendResetLink({ email, resetToken, res, fullname: user.fullname })
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

    // Generate a login token so the user is logged in automatically after reset
    const loginToken = generatetoken(user._id, res)

    return res.status(200).json({ 
      message: 'Password reset successful',
      user_data: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilepic: user.profilepic,
      },
      token: loginToken
    })
  } catch (error) {
    console.log('error in resetPassword', error.message)
    return res.status(500).json({ message: 'internal server error' })
  }
}
