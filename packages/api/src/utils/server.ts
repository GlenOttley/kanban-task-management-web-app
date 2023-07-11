import express, { Application, Request, Response } from 'express'
import boardRoutes from '../routes/boardRoutes'
import taskRoutes from '../routes/taskRoutes'
import path from 'path'

function createServer() {
  const serverRoot = path.resolve()
  const app: Application = express()

  // app.use(cors({ origin: 'http://localhost:3000' }))
  app.use(express.json())

  // routes
  app.use('/api/boards', boardRoutes)
  app.use('/api/tasks', taskRoutes)

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(serverRoot, 'packages/web/dist')))
    app.get('*', (req: Request, res: Response) =>
      res.sendFile(path.resolve(serverRoot, 'packages', 'web', 'dist', 'index.html'))
    )
  } else {
    app.get('/', (req: Request, res: Response) => {
      res.json('API is running...')
    })
  }

  return app
}

export default createServer
