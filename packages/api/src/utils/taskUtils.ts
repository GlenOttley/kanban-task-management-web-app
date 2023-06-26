import { Task } from 'types'
import TaskModel from '../models/taskModel'

export async function createTask(task: Task) {
  return TaskModel.create(task)
}

export async function deleteTask(id: string) {
  return TaskModel.findByIdAndDelete(id)
}
