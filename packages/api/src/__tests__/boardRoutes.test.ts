import supertest from 'supertest'
import createServer from '../utils/server'
import { Board } from 'types'
import { createBoard, deleteBoard } from '../utils/boardUtils'
import { Types } from 'mongoose'
import { SavedBoardDocument } from '../models/boardModel'

const app = createServer()

function generateId() {
  return new Types.ObjectId().toString()
}

// Dummy board object
const dummyBoard: Board = {
  _id: generateId(),
  name: 'Dummy Board',
  columns: [
    {
      _id: generateId(),
      name: 'To Do',
    },
    {
      _id: generateId(),
      name: 'In Progress',
    },
    {
      _id: generateId(),
      name: 'Done',
    },
  ],
}

describe('GET /boards', () => {
  test('returns 200:OK status', async () => {
    await supertest(app).get('/api/boards').expect(200)
  })
})

describe('DELETE /api/boards/:id', () => {
  let board: SavedBoardDocument

  beforeEach(async () => {
    board = await createBoard(dummyBoard)
  })

  afterEach(async () => {
    await deleteBoard(board._id)
  })

  test('if board exists, returns 200 OK status', async () => {
    const { status } = await supertest(app).delete(`/api/boards/${board._id}`)
    expect(status).toBe(200)
  })

  test('if board exists, returns success message', async () => {
    const { body } = await supertest(app).delete(`/api/boards/${board._id}`)
    expect(body).toBe(`Board id: ${board._id} has been deleted`)
  })

  test('if board does not exist, returns 404 Error status', async () => {
    const { status } = await supertest(app).delete('/api/boards/123')
    expect(status).toBe(404)
  })

  test('if board does not exist, returns error message', async () => {
    const { body } = await supertest(app).delete('/api/boards/123')
    expect(body.error).toMatch(/Board not found/i)
  })
})

describe('PATCH /boards/:id', () => {
  let board: Board

  beforeEach(async () => {
    board = await createBoard(dummyBoard)
  })

  afterEach(async () => {
    await deleteBoard(board._id)
  })

  test('returns the board unchanged if none of the fields are changed', async () => {
    const { body } = await supertest(app)
      .patch(`/api/boards/${board._id}`)
      .send(dummyBoard)
    expect(body._id).toBe(board._id.toString())
    expect(body.name).toBe(board.name)
    expect(body.columns).toHaveLength(board.columns?.length ?? 0)
    expect(JSON.stringify(body.columns[0])).toMatch(
      new RegExp(JSON.stringify(board.columns?.[0]))
    )
  })

  test('updates the board name', async () => {
    const updatedName = 'Updated Board Name'
    const { body } = await supertest(app)
      .patch(`/api/boards/${board._id}`)
      .send({ name: updatedName, columns: board.columns })
    expect(body.name).toBe(updatedName)
  })

  test('updates only the first column name', async () => {
    const updatedColumns = dummyBoard?.columns?.map((column, index) => {
      if (index === 0) {
        return { ...column, name: 'Updated Column Name' }
      }
      return column
    })

    const { body } = await supertest(app)
      .patch(`/api/boards/${board._id}`)
      .send({ name: board.name, columns: updatedColumns })

    expect(body.columns[0].name).toBe(updatedColumns?.[0].name)
    expect(body.columns[1].name).toBe(board.columns?.[1].name)
    expect(body.columns[2].name).toBe(board.columns?.[2].name)
  })

  test('removes one column from the column array', async () => {
    dummyBoard.columns?.shift()

    const { body } = await supertest(app)
      .patch(`/api/boards/${board._id}`)
      .send({ name: board.name, columns: dummyBoard.columns })

    expect(body.columns).toHaveLength(2)
  })

  test('board does not exist', async () => {
    const fakeBoardId = '123'
    const response = await supertest(app)
      .patch(`/api/boards/${fakeBoardId}`)
      .send({ name: board.name, columns: board.columns })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe(`Board with ID: ${fakeBoardId} not found`)
  })
})
