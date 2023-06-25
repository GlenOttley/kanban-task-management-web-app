import TaskModel from '../models/taskModel'

export async function deleteTask(id: string) {
  return TaskModel.findByIdAndDelete(id)
}
