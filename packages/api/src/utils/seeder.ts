import dotenv from 'dotenv'
import { boardData } from 'data'
import connectDB from './db'
import path from 'path'
import Board from '../models/boardModel'

const serverRoot = path.resolve()

// dev
dotenv.config({ path: path.join(serverRoot, '.env') })

connectDB()

const importData = async () => {
  try {
    await Board.deleteMany()
    await Board.insertMany(boardData)

    console.log('Data imported!')

    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Board.deleteMany()

    console.log('Data destroyed!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
