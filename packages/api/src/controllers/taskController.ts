import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Task, { SavedTaskDocument } from '../models/taskModel'

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
  const { status, column } = req.body
  const task = await Task.findById(taskId)
  if (task) {
    task.status = status
    task.column = column
    await task.save()
    res.status(200).json(`Task id: ${taskId} has new status: ${status}`)
  } else {
    res.status(404).json({ error: 'Task not found' })
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
  const { description, status, title, subtasks, column } = requestBody

  const task = await Task.findById(req.params.id)

  if (task) {
    task.title = title
    task.description = description
    task.subtasks = subtasks
    task.status = status
    task.column = column

    await task.save()
    res.status(200).json(task)
  } else {
    res.status(404).json({ error: 'Task not found' })
  }
})

export { toggleSubtaskComplete, updateTaskStatus, deleteTask, editTask }
