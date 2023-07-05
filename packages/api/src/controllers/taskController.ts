import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Task, { SavedTaskDocument } from '../models/taskModel'
import Board from '../models/boardModel'

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
const getTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)

    if (task) {
      res.status(200).json(task)
    } else {
      res.status(404).json({ error: `Task with ID: ${req.params.id} not found` })
    }
  } catch (error) {
    res.json(error)
  }
})

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { boardId, columnId } = req.body
    const task: SavedTaskDocument = new Task(req.body)
    const createdTask = await task.save()
    await Board.updateOne(
      {
        _id: boardId,
        'columns._id': columnId,
      },
      { $push: { 'columns.$.tasks': task._id } }
    )
    res.status(201).json(createdTask)
  } catch (error) {
    res.json(error)
  }
})

// @desc Toggle a subtask complete
// @route PATCH /api/task/:id/toggle-subtask
// @access Private
const toggleSubtaskComplete = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id)
  if (task) {
    const subtask = task.subtasks?.find(
      (subtask) => subtask._id.toString() === req.body.subtaskId
    )
    if (subtask) {
      subtask.isCompleted = !subtask.isCompleted
      await task.save()
      res
        .status(200)
        .json(
          `Subtask id: ${subtask._id} has been marked ${
            subtask.isCompleted ? 'complete' : 'incomplete'
          }`
        )
    } else {
      res.status(404).json({ error: 'Subtask not found' })
    }
  } else {
    res.status(404).json({ error: 'Task not found' })
  }
})

// @desc Update a tasks status
// @route PATCH /api/task/:id/update-status
// @access Private
const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.id
  const { boardId, prevColumnId, newColumnId, status } = req.body
  try {
    const task = await Task.findById(taskId)
    if (task) {
      task.status = status
      task.columnId = newColumnId
      await task.save()
      await Board.updateOne(
        {
          _id: boardId,
          'columns._id': prevColumnId,
        },
        { $pull: { 'columns.$.tasks': taskId } }
      )
      await Board.updateOne(
        {
          _id: boardId,
          'columns._id': newColumnId,
        },
        { $push: { 'columns.$.tasks': taskId } }
      )
      res.status(200).json(task)
    } else {
      res.status(404).json({ error: 'Task not found' })
    }
  } catch (error) {
    res.json(error)
  }
})

// @desc Delete a task
// @route DELETE /api/task/:id
// @access Private
const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.id
  const task = await Task.findById(taskId)
  if (task) {
    await Task.findByIdAndDelete(taskId)
    res.status(200).json(`Task id: ${taskId} has been deleted`)
  } else {
    res.status(404).json({ error: 'Task not found' })
  }
})

// @desc    Edit a task
// @route   PATCH /api/tasks/:id
// @access  Private
const editTask = asyncHandler(async (req: Request, res: Response) => {
  const requestBody: SavedTaskDocument = req.body
  const { description, status, title, subtasks, columnId } = requestBody

  const task = await Task.findById(req.params.id)

  if (task) {
    task.title = title
    task.description = description
    task.subtasks = subtasks
    task.status = status
    task.columnId = columnId

    await task.save()
    res.status(200).json(task)
  } else {
    res.status(404).json({ error: 'Task not found' })
  }
})

export {
  getTask,
  toggleSubtaskComplete,
  updateTaskStatus,
  deleteTask,
  editTask,
  createTask,
}
