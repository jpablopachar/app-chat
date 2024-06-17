import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { PORT } from './config.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`)
})
