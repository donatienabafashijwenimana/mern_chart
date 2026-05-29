import bcrypt from 'bcrypt'

import users from '../model/usermodel.js'
import { generatetoken } from '../LIB/utlis.js'
import cloudinary from '../LIB/cloudinary.js'

export const register = async(req,res)=>{
    const {email,fullname,password} = req.body
    try{
        if (!email || !fullname || !password) {
            return res.status(400).json({message:'all fields are required'})
        }
        const user_uname_exist =  await users.findOne({fullname})
        const user_email_exist =  await users.findOne({email})
        if (user_uname_exist) return res.status(400).json({message:'username already exist'})
        if (user_email_exist) return res.status(400).json({message:'email already exist'})
        if (password.length < 6) return res.status(400).json({message:'un match password length'})
        
        const salt = await bcrypt.genSalt(10)
        const passwordhash= await bcrypt.hash(password,salt)

        const newuser = new users({
            fullname:fullname,
            email:email,
            password:passwordhash
        })
        if (newuser){
            await newuser.save()
            const token = generatetoken(newuser._id,res)
            res.status(200).json({
                user_data: {
                    _id: newuser._id,
                    fullname: newuser.fullname,
                    email : newuser.email,
                    profilepic: newuser.profilepic,
                },
                message:'registartion success fully',
                token
            })
        }else{
            res.status(400).json({message:'registartion failed'})
        }
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
    }
}

export const login = async(req,res)=>{
    const {username , password} = req.body
    
    try {
        const user = await users.findOne({fullname:username})

        if (!user) return  res.status(400).json({message:'incorect username'})
            
        const ispassword = await bcrypt.compare(password,user.password)
        if (!ispassword) return res.status(400).json({message:"incorect password"})
        const token = generatetoken(user._id,res)
        
        res.status(200).json({
            user_data:{
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                profilepic:user.profilepic,
            },
            message:'login successfull',
            token: token
        })
    } catch (error) {
        console.log('error in login controller',error.message)
        res.status(500).json({message:'internal server error'})
    }
}
export const logout = (req,res)=>{
   try {
     res.cookie("token","",({maxAge:0}))
     res.status(200).json({message:'logout successfully'})
   } catch (error) {
     console.log('error in logout controller',error.message)
   }
}

export const updateprofile = async(req,res)=>{
    try {
        const {profilepic, fullname, email, password} = req.body
        const userid = req.user._id
        const updateData = {}

        if (fullname) updateData.fullname = fullname
        if (email) updateData.email = email
        if (password) {
            if (password.length < 6) return res.status(400).json({message:'password must be at least 6 characters'})
            const salt = await bcrypt.genSalt(10)
            updateData.password = await bcrypt.hash(password, salt)
        }
        if (profilepic) {
            const uploadresponse = await cloudinary.uploader.upload(profilepic)
            updateData.profilepic = uploadresponse.secure_url
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({message:'no profile data provided'})
        }

        const updateduser = await users.findByIdAndUpdate(userid,updateData,{new:true}).select('-password')
        res.status(200).json({user_data:updateduser,message:'data updated'})

    } catch (error) { 
        console.log(error)
        res.status(500).json({message:'profile not updated'})
    }
}

export const checkauth = async(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
    }
}
