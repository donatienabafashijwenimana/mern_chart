import express from 'express'
import users from '../model/usermodel.js'
import cloudinary from '../LIB/cloudinary.js'
import messagemodel from '../model/messagemodel.js'
import Friendship from '../model/friendshipmodel.js'


export const get_user_for_sideber= async(req,res)=>{
   try {
    
    const loggedin_userid = req.user._id

    const findmyfriendship = await Friendship.find({
      $or:[
        {requester: loggedin_userid},
        {recipient: loggedin_userid}
    ],status:'accepted'
      })
    const friendsid = findmyfriendship.map(f=> 
      f.requester.toString()===loggedin_userid.toString()
      ? f.recipient
      :f.requester
    )
    

    const filtered_users = await users.find({
      _id:{$in:friendsid}
    }).select('-password')

    res.status(200).json(filtered_users)  
} catch (error) {
    console.log(error.message)
    res.status(500).json({message:'internal server errror'})
    
   }
}

export const getLastMessage = async (req, res) => {
  try {
      const { id: userToChat } = req.params;
      const myid = req.user._id;
      
      const lastMessage = await messagemodel.findOne({
          $or: [
              { senderId: myid, receiverId: userToChat },
              { receiverId: myid, senderId: userToChat }
          ]
      }).sort({ createdAt: -1 }).limit(1);

      res.status(200).json(lastMessage || { text: "No messages yet" });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Internal server error' });
  }
};

export const getmessages = async(req,res)=>{
    try {
        const {id:userToChart}= req.params 
        const myid = req.user._id

        const messages = await messagemodel.find({
            $or:[
              {senderId:myid,receiverId:userToChart},
              {receiverId:myid,senderId:userToChart}  
            ]
        }) 
        res.status(200).json(messages)
        
        await messagemodel.updateMany({senderId:userToChart,receiverId:myid},
          {$set:{statusread:"read"}})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:'internal server error'})
    }
}

export const sendmessage = async(req,res)=>{
    try {
      const {Text,image} = req.body 
      const {id:receiverid} = req.params
      const senderid = req.user._id
      let imageurl= null;
      if(image){
        try {
           const uploadresponse = await cloudinary.uploader.upload(image)
           imageurl = uploadresponse.secure_url
        } catch (error) {
          console.log(error.message)
          return res.status(400).json({message:'upload image error'})
          
        }
       
      }
      const newmessage = new messagemodel({
        senderId:senderid,
        receiverId:receiverid,
        text:Text,
        images:imageurl
      })
      await newmessage.save()
      res.status(201).json(newmessage)
    } catch (error) {
        console.log(error.message)
        res.status(500).json('internal server error')
    }
}

export const updatereadmessage = async(req,res)=>{
  try {
    const {senderid} = req.params
    const {_id} = req.user
    const data = await messagemodel.updateMany({senderId:senderid,receiverId:_id},
                                               {$set:{statusread:"read"}})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }
}

export const statusmessage = async(req,res)=>{
  try {
    const{_id}= req.user
    const data = await messagemodel.distinct('senderId',{receiverId:_id,statusread:'unread'})
    res.status(200).json({unreadnumber:data.length})
    // console.log(data)
  } catch (error) {
    console.log(error)
  }
}

export const statusmessagetoeachuser= async(req,res)=>{
  try {
    const {userid}= req.params
    const {_id}= req.user
    const data = await messagemodel.find({senderId:userid,receiverId:_id,statusread:'unread'})

    res.status(200).json({no_messagetoeachuser:data.length})

  } catch (error) {
    console.log(error)
  }
}