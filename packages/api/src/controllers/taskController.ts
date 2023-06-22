import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Task from '../models/taskModel'

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
      res.status(404)
      throw new Error('Subtask not found')
    }
  } else {
    res.status(404)
    throw new Error('Task not found')
  }
})

// @desc Update a tasks status
// @route PATCH /api/task/:id/update-status
// @access Private
const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.id
  const { status, column } = req.body
  const task = await Task.findById(taskId)
  if (task) {
    task.status = status
    task.column = column
    await task.save()
    res.status(200).json(`Task id: ${taskId} has new status: ${status}`)
  } else {
    res.status(404)
    throw new Error('Task not found')
  }
})

export { toggleSubtaskComplete, updateTaskStatus }
