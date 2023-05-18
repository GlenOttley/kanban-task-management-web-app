import express, { Application } from 'express'
import boardRoutes from '../routes/boardRoutes'
import cors from 'cors'

function createServer() {
  const app: Application = express()

  // app.use(cors({ origin: 'http://localhost:3000' }))
  app.use(express.json())

  // routes
  app.use('/api/boards', boardRoutes)

  return app
}

export default createServer
