import {Server} from 'socket.io'
import express from 'express'
import http from 'http'
import cors from 'cors'
const app = express()

const server =  http.createServer(app)

const io = new Server(server,{
    cors:{
       origin: process.env.frontend_url || 'http://localhost:3000',
       methods: ['GET','POST'],
       credentials: true
    }
})

export {io,app,server};