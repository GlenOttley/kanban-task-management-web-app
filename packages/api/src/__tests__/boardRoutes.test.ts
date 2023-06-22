import supertest from 'supertest'
import createServer from '../utils/server'
import { Board } from 'types'
import { matchers } from 'jest-json-schema'
import { createGenerator } from 'ts-json-schema-generator'
import path from 'path'
import { testBoard } from 'data'
import { createBoard } from '../utils/createBoard'

const app = createServer()

// const schemaGeneratorConfig = {
//   path: path.resolve(process.cwd(), '../../types/src/index.ts'),
//   tsconfig: path.resolve(process.cwd(), './tsconfig.json'),
//   type: 'Board',
// }

// const boardSchema = createGenerator(schemaGeneratorConfig).createSchema(
//   schemaGeneratorConfig.type
// )
// const schemaGeneratorOutputPath = path.resolve(process.cwd(), '../types/src/schemas.ts')
// const schemaString = JSON.stringify(schema, null, 2)
// fs.writeFile(schemaGeneratorOutputPath, schemaString, (err) => {
//   if (err) throw err
// })

expect.extend(matchers)

describe('GET /boards', () => {
  test('returns 200:OK status', async () => {
    await supertest(app).get('/api/boards').expect(200)
  })
  // test('returns one board', async () => {
  //   const board = await createBoard(testBoard)
  //   const { body } = await supertest(app).get('/api/boards')
  //   expect(body).toHaveLength(1)
  // })
  // test('returned value satisfies boardSchema', async () => {
  //   const board = await createBoard(testBoard)
  //   const { body } = await supertest(app).get('/api/boards')
  //   body.forEach((board: Board) => {
  //     expect(board).toMatchSchema(boardSchema)
  //   })
  // })
})

// describe('GET /boards:id', () => {
//   test('returns 200:OK status', async () => {
//     const board = await createBoard(testBoard)
//     const { body } = await supertest(app).get('/api/boards')
//     await supertest(app).get(`/api/boards/${body[0]._id}`).expect(200)
//   })
//   test('returns correct board', async () => {
//     const board = await createBoard(testBoard)
//     const { body } = await supertest(app).get('/api/boards')
//     const { body: returnedBoard } = await supertest(app).get(`/api/boards/${body[0]._id}`)
//     expect(returnedBoard.name).toMatch(testBoard.name)
//   })
// })

// describe('POST /boards', () => {
//   test('returns 201:Created status', async () => {
//     await supertest(app).post('/api/boards').send(testBoard).expect(201)
//   })
//   test('returns successfully created board', async () => {
//     const { body } = await supertest(app).post('/api/boards').send(testBoard)
//     expect(body).toMatchSchema(boardSchema)
//   })
// })
