import { Task, Subtask } from '@kanban/types'
import TaskModel from '../models/taskModel'

interface SubtaskPartial extends Partial<Subtask> {
  _id?: string
  title?: string
  isCompleted?: boolean
}

interface TaskPartial extends Omit<Partial<Task>, 'subtasks'> {
  _id?: string
  title?: string
  description?: string
  status?: string
  subtasks?: SubtaskPartial[]
}

export async function createTask(task: TaskPartial) {
  return TaskModel.create(task)
}

export async function deleteTask(id: string) {
  return TaskModel.findByIdAndDelete(id)
}

export async function deleteAllTasks() {
  return TaskModel.deleteMany()
}
