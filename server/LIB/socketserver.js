import {Server} from 'socket.io'
import express from 'express'
import http from 'http'
import cors from 'cors'
const app = express()

const server =  http.createServer(app)

const rawOrigins = [
  process.env.frontend_url,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
];

const allowedOrigins = rawOrigins.filter(Boolean).map((o) => o.replace(/\/$/, ''));

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by Socket.IO CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


export {io,app,server};