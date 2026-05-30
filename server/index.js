import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from "cors"
import cookieparser from 'cookie-parser'
// const app = express()
import authroute from './routers/authroute.js'
import messageroute from './routers/messageroute.js'
import { io,server,app } from './LIB/socketserver.js'
import postrouter from './routers/postrouter.js'
import friendRoute from './routers/friendroute.js'

const rawOrigins = [
    process.env.frontend_url,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
];
// Normalize origins by removing trailing slashes and filtering out falsy values
const allowedOrigins = rawOrigins.filter(Boolean).map(o => o.replace(/\/$/, ''));

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieparser())

mongoose.connect(process.env.db_url)
.then(()=>{
    const isAtlas = process.env.db_url?.includes('mongodb+srv');
    console.log(`DB connected successfully to: ${isAtlas ? 'MongoDB Atlas' : 'Local/Other Instance'}`);
})
.catch((error)=>{
    console.error('Database connection error:', error.message)
});

app.use('/auth',authroute)
app.use('/message',messageroute)
app.use('/post',postrouter)
app.use('/friend', friendRoute)

const users = new Map();

io.on("connection", (socket) => {
    socket.on("joinRoom", (userId) => {
        if (userId) users.set(userId, socket.id);
    });

    socket.on("sendMessage", (message) => {
        if (!message.receiverId) return;
        const receiverSocketId = users.get(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", message); // Send message
        }
    });

    socket.on("disconnect", () => {
        for (const [userId, socketId] of users.entries()) {
            if (socketId === socket.id) {
                users.delete(userId);
                break;
            }
        }
    });
});
const PORT = process.env.PORT || process.env.port || 1001

server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
