import supertest from 'supertest'
import createServer from '../utils/server'
import { Board } from 'types'
import { matchers } from 'jest-json-schema'
import { createGenerator } from 'ts-json-schema-generator'
import path from 'path'

const app = createServer()

const schemaGeneratorConfig = {
  path: path.resolve(process.cwd(), '../../types/src/index.ts'),
  tsconfig: path.resolve(process.cwd(), './tsconfig.json'),
  type: 'Board',
}

const boardSchema = createGenerator(schemaGeneratorConfig).createSchema(
  schemaGeneratorConfig.type
)
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
  test('returned value satisfies boardSchema', async () => {
    const response = await supertest(app).get('/api/boards')
    response.body.forEach((board: Board) => {
      expect(board).toMatchSchema(boardSchema)
    })
  })
})
