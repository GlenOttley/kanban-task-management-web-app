import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Column, Task, Subtask } from '@kanban/types'

interface FormData {
  boardId: string
  title: string
  description?: string
  status: string
  subtasks?: Partial<Subtask>[]
  columnId: string
}

const createTask = (formData: FormData) => {
  return axios.post('/api/tasks', formData)
}

export default function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries(['board', newTask.boardId])
      const previousBoardData: Board | undefined = queryClient.getQueryData([
        'board',
        newTask.boardId,
      ])
      queryClient.setQueryData(['board', previousBoardData?._id], (oldQueryData: any) => {
        const columnToUpdate = oldQueryData.columns.find(
          (column: Column) => column._id === newTask.columnId
        )
        columnToUpdate.tasks = [
          ...columnToUpdate.tasks,
          { ...newTask, _id: columnToUpdate.tasks.length + 1 },
        ]

        return oldQueryData
      })
      return { previousBoardData }
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData(['board'], context?.previousBoardData)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['board'])
    },
  })
}
