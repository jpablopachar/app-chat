import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { PORT } from './config.js'
import { connectDB } from './config/db.js'
import { router } from './routes/index.js'
import { app, server } from './socket/index.js'

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors())
app.use('/api', router)

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server on port: ${PORT}`)
  })
})
