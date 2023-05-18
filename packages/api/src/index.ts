import createServer from './utils/server'
import dotenv from 'dotenv'
import path from 'path'
import connectDB from './utils/db'

const serverRoot = path.resolve()

console.log(path.resolve(process.cwd(), './tsconfig.json'))

// dev
dotenv.config({ path: path.join(serverRoot, '.env') })

export const app = createServer()

const PORT = process.env.PORT || 666

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB()
})
