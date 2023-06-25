import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Column, Task, Subtask } from 'types'

interface FormData {
  _id: string
  title: string
  description?: string
  status: string
  subtasks: Partial<Subtask>[]
  column: string
  prevColumn: string
}

export default function editTaskMutation() {
  async function editTask(data: FormData) {
    const { _id, title, description, status, subtasks, column } = data
    return axios.patch(`/api/tasks/${_id}`, {
      title,
      description,
      status,
      subtasks,
      column,
    })
  }
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editTask,
  })
}
