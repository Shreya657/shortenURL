import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorMiddleware from './middlewares/error.middleware.js'
const app=express()

// const allowedOrigins = (process.env.CORS_ORIGIN || '')
//   .split(',')
//   .map(o => o.trim())      // removes invisible spaces/newlines
//   .filter(o => o !== "");
// app.use(cors({
//   origin: function (origin, callback) {
//     if (origin === "http://localhost:5173" || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CORS_ORIGIN 
].filter(Boolean); 

// .filter(Boolean): if process.env.CORS_ORIGIN is undefined (like when working locally), this removes the null/undefined from the array.

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


import linkRouter from './routes/links.route.js'

app.use("/",linkRouter)
app.use(errorMiddleware)






export {app}
