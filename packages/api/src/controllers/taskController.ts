import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { taskModel as Task, columnModel as Column } from '../models/boardModel'
import { Column as IColumn } from 'packages/types/src'

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

interface DBColumn extends Omit<IColumn, 'tasks'> {
  tasks: string[]
}

const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.id
  const task = await Task.findById(taskId)
  const newColumn: DBColumn | null = await Column.findById(req.body.column)

  if (task && newColumn) {
    const originalColumnId = task.column
    const originalColumn = await Column.findById(originalColumnId)
    const newColumnId = req.body.column
    task.status = req.body.status
    task.column = newColumnId
    await task.save()

    if (originalColumn)
      originalColumn.tasks = originalColumn.tasks?.filter((task) => task._id !== taskId)
    if (newColumn) newColumn.tasks?.push(taskId)

    res.status(200).json(`Task id: ${req.params.id} has new status: ${req.body.status}`)
  } else {
    res.status(404)
    throw new Error('Task not found')
  }
})

export { toggleSubtaskComplete, updateTaskStatus }
