import express from 'express'
import mongose from 'mongoose'
import cors from "cors"
import dotenv from 'dotenv'
import cookieparser from 'cookie-parser'
// const app = express()
import authroute from './routers/authroute.js'
import messageroute from './routers/messageroute.js'
import { io,server,app } from './LIB/socketserver.js'
import postrouter from './routers/postrouter.js'
import friendRoute from './routers/friendroute.js'

import { Socket } from 'socket.io'

dotenv.config()

app.use(cors({
    origin: process.env.frontend_url|| '*',
    credentials:true
}))
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieparser())

mongose.connect(process.env.db_url,{})
.then(()=>{
    console.log('db connected')
})
.catch((error)=>{
    console.log(error.message)
});

app.use('/auth',authroute)
app.use('/message',messageroute)
app.use('/post',postrouter)
app.use('/friend', friendRoute)

const users = {};

io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    socket.on("joinRoom", (userId) => {
        users[userId] = socket.id;
        // console.log(`${userId} joined with socket ID: ${socket.id}`);
    });

    socket.on("sendMessage", (message) => {
        const receiverSocketId = users[message.receiverId]; // Get receiver's socket
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", message); // Send message
        }
    });

    socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
            }
        }
    });
});

server.listen(process.env.port || 1001,()=>{
    console.log('server is run')
})