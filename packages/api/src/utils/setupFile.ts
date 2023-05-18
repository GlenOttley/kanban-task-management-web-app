import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Board from '../models/boardModel'

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

// beforeEach(async () => {
//   await Board.deleteMany()
// })

afterAll(async () => {
  await mongoose.disconnect()
  await mongoose.connection.close()
})
