import supertest from 'supertest'
import createServer from '../utils/server'
import { Board, Task } from '@kanban/types'
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
      tasks: [],
    },
    {
      _id: generateId(),
      name: 'In Progress',
      tasks: [],
    },
    {
      _id: generateId(),
      name: 'Done',
      tasks: [],
    },
  ],
}

const task1: Task = {
  _id: '64a46035246a7d639dc87001',
  title: 'Complete Project Proposal',
  description: 'Write a detailed project proposal for the new client',
  status: dummyBoard.columns[0].name,
  columnId: dummyBoard.columns[0]._id,
  subtasks: [
    {
      _id: generateId(),
      title: 'Research client requirements',
      isCompleted: true,
    },
    {
      _id: generateId(),
      title: 'Create project timeline',
      isCompleted: false,
    },
    {
      _id: generateId(),
      title: 'Gather necessary resources',
      isCompleted: false,
    },
  ],
}

const task2: Task = {
  _id: '64a46035246a7d639dc87005',
  title: 'Implement Backend API',
  description: 'Develop the backend API for the web application',
  status: dummyBoard.columns[0].name,
  columnId: dummyBoard.columns[0]._id,
  subtasks: [
    {
      _id: generateId(),
      title: 'Define API endpoints',
      isCompleted: false,
    },
    {
      _id: generateId(),
      title: 'Implement authentication system',
      isCompleted: true,
    },
    {
      _id: generateId(),
      title: 'Write unit tests',
      isCompleted: true,
    },
  ],
}

const task3: Task = {
  _id: '64a46035246a7d639dc87006',
  title: 'Test Application',
  description: 'Perform comprehensive testing of the application',
  status: dummyBoard.columns[1].name,
  columnId: dummyBoard.columns[1]._id,
  subtasks: [
    {
      _id: 'subtask7',
      title: 'Unit testing',
      isCompleted: false,
    },
    {
      _id: 'subtask8',
      title: 'Integration testing',
      isCompleted: false,
    },
    {
      _id: 'subtask9',
      title: 'UI testing',
      isCompleted: false,
    },
  ],
}

dummyBoard.columns[0].tasks.push(task1)
dummyBoard.columns[0].tasks.push(task2)
dummyBoard.columns[1].tasks.push(task3)

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

describe('PATCH /api/boards/:id', () => {
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
    expect(body.columns[0].name).toBe(board.columns[0].name)
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
    const fakeBoardId = generateId()
    const response = await supertest(app)
      .patch(`/api/boards/${fakeBoardId}`)
      .send({ name: board.name, columns: board.columns })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe(`Board with ID: ${fakeBoardId} not found`)
  })
})

describe('PATCH /boards/:id/update-column', () => {
  let board: Board

  beforeEach(async () => {
    board = await createBoard(dummyBoard)
  })

  afterEach(async () => {
    await deleteBoard(board._id)
  })

  test('reorders tasks to the order that they are passed in', async () => {
    const { body } = await supertest(app)
      .patch(`/api/boards/${board._id}/update-column`)
      .send({
        columnId: board.columns[0]._id,
        tasks: [task2._id, task1._id],
      })
    expect(body.updatedBoard.columns[0].tasks[0]).toBe(task2._id)
    expect(body.updatedBoard.columns[0].tasks[1]).toBe(task1._id)
  })

  test('removes task from previous column and updates the selected column', async () => {
    const { body } = await supertest(app)
      .patch(`/api/boards/${board._id}/update-column`)
      .send({
        columnId: board.columns[0]._id,
        prevColumnId: task3.columnId,
        tasks: [task1._id, task2._id, task3._id],
        taskToRemove: task3._id,
      })
    expect(body.updatedBoard.columns[0].tasks[2]).toBe(task3._id)
    expect(body.prevBoard.columns[1].tasks).toHaveLength(0)
  })
})
