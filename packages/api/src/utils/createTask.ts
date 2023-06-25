import { Task } from 'types'
import TaskModel from '../models/taskModel'

export async function createTask(task: Task) {
  return TaskModel.create(task)
}
