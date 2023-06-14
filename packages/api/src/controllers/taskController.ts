import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { taskModel as Task } from '../models/boardModel'

// @desc Toggle a subtask complete
// @route PATCH /api/task/:id
// @access Private

const toggleComplete = asyncHandler(async (req: Request, res: Response) => {
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

export { toggleComplete }
