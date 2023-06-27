import supertest from 'supertest'
import createServer from '../utils/server'
import { Task } from 'types'
import { SavedTaskDocument } from '../models/taskModel'
import { createTask, deleteTask } from '../utils/taskUtils'
import { Types } from 'mongoose'

const app = createServer()

function generateId() {
  return new Types.ObjectId().toString()
}

const dummyTask: Task = {
  _id: generateId(),
  title: 'Dummy Task',
  description: 'This is a dummy task',
  status: 'In Progress',
  subtasks: [
    {
      _id: generateId(),
      title: 'Subtask 1',
      isCompleted: false,
    },
    {
      _id: generateId(),
      title: 'Subtask 2',
      isCompleted: true,
    },
  ],
  column: generateId(),
}

const dummyTaskWithoutIds = {
  _id: generateId(),
  title: 'Dummy Task',
  description: 'This is a dummy task',
  status: 'In Progress',
  subtasks: [
    {
      title: 'Subtask 1',
      isCompleted: false,
    },
    {
      title: 'Subtask 2',
      isCompleted: true,
    },
  ],
  column: generateId(),
}

describe('PATCH /tasks/:id', () => {
  let task: SavedTaskDocument

  beforeEach(async () => {
    task = await createTask(dummyTask)
  })

  afterEach(async () => {
    await deleteTask(task._id)
  })

  test('returns the task unchanged if none of the fields are changed', async () => {
    const { body } = await supertest(app).patch(`/api/tasks/${task._id}`).send(dummyTask)
    expect(body.title).toBe(task.title)
    expect(body.description).toBe(task.description)
    expect(body.status).toBe(task.status)
    expect(body.column).toBe(task.column.toString())
    expect(body.subtasks).toHaveLength(task.subtasks!.length)
  })

  test('updates the task title', async () => {
    const updatedTitle = 'Updated Task Title'
    const { body } = await supertest(app)
      .patch(`/api/tasks/${task._id}`)
      .send({ ...dummyTask, title: updatedTitle })
    expect(body.title).toBe(updatedTitle)
  })

  test('updates the task description', async () => {
    const updatedDescription = 'Updated Task Description'
    const { body } = await supertest(app)
      .patch(`/api/tasks/${task._id}`)
      .send({ ...dummyTask, description: updatedDescription })
    expect(body.description).toBe(updatedDescription)
  })

  test('updates the task status', async () => {
    const updatedStatus = 'Completed'
    const { body } = await supertest(app)
      .patch(`/api/tasks/${task._id}`)
      .send({ ...dummyTask, status: updatedStatus })
    expect(body.status).toBe(updatedStatus)
  })

  test('updates the task subtasks', async () => {
    const updatedSubtasks = [
      { _id: generateId(), title: 'Updated Subtask 1', isCompleted: true },
      { _id: generateId(), title: 'Updated Subtask 2', isCompleted: false },
    ]
    const { body } = await supertest(app)
      .patch(`/api/tasks/${task._id}`)
      .send({ ...dummyTask, subtasks: updatedSubtasks })
    expect(body.subtasks).toHaveLength(updatedSubtasks.length)
    expect(body.subtasks).toEqual(expect.arrayContaining(updatedSubtasks))
  })

  test('updates the task column', async () => {
    const updatedColumn = generateId()
    const { body } = await supertest(app)
      .patch(`/api/tasks/${task._id}`)
      .send({ ...dummyTask, column: updatedColumn })
    expect(body.column).toBe(updatedColumn)
  })

  test('returns 404 if the task is not found', async () => {
    const nonExistingTaskId = generateId()
    const response = await supertest(app)
      .patch(`/api/tasks/${nonExistingTaskId}`)
      .send(dummyTask)
    expect(response.status).toBe(404)
  })
})

describe('POST /api/tasks', () => {
  afterEach(async () => {
    await deleteTask(dummyTaskWithoutIds._id)
  })

  test('returns 201 Created status', async () => {
    const response = await supertest(app).post('/api/tasks').send(dummyTaskWithoutIds)
    expect(response.status).toBe(201)
  })

  test('returns new Task with posted values', async () => {
    const { body } = await supertest(app).post('/api/tasks').send(dummyTaskWithoutIds)
    expect(body.title).toBe(dummyTaskWithoutIds.title)
    expect(body.description).toBe(dummyTaskWithoutIds.description)
    expect(body.status).toBe(dummyTaskWithoutIds.status)
    expect(body.subtasks[0]).toMatchObject(dummyTaskWithoutIds.subtasks[0])
  })

  test('generates subtask ids', async () => {
    const { body } = await supertest(app).post('/api/tasks').send(dummyTaskWithoutIds)
    expect(body.subtasks[0]._id).toBeTruthy()
    expect(body.subtasks[1]._id).toBeTruthy()
  })

  test('returns 409 Conflict stats code if task._id already exists', async () => {
    await supertest(app).post('/api/tasks').send(dummyTaskWithoutIds)
    const response = await supertest(app).post('/api/tasks').send(dummyTaskWithoutIds)
    expect(response.status).toBe(409)
  })
})
