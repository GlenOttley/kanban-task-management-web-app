import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../Context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Column, Subtask } from 'types'

interface FormData {
  title: string
  description?: string
  status: string
  subtasks?: Partial<Subtask>[]
  column: string
}

const createTask = (formData: FormData) => {
  return axios.post('/api/tasks', formData)
}

export default function useCreateTask() {
  const { selectedBoardId } = useContext(AppContext)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries(['board', selectedBoardId])
      const previousBoardData: Board | undefined = queryClient.getQueryData([
        'board',
        selectedBoardId,
      ])
      queryClient.setQueryData(['board', previousBoardData?._id], (oldQueryData: any) => {
        const columnToUpdate = oldQueryData.columns.find(
          (column: Column) => column._id === newTask.column
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
