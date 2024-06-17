import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { PORT } from './config.js'
import { connectDB } from './config/db.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`)
})
