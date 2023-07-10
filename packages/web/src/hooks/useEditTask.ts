import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../Context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Column, Task, Subtask } from '@kanban/types'

interface FormData {
  _id: string
  title: string
  description?: string
  status: string
  subtasks: Partial<Subtask>[]
  column: string
  prevColumn: string
}

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

export default function editTaskMutation() {
  const { selectedBoardId } = useContext(AppContext)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries(['board', selectedBoardId])
      const previousBoardData: Board | undefined = queryClient.getQueryData([
        'board',
        selectedBoardId,
      ])
      queryClient.setQueryData(['board', previousBoardData?._id], (oldQueryData: any) => {
        const columnToUpdate = oldQueryData.columns.find(
          (column: Column) => column._id === updatedTask.prevColumn
        )
        let taskToUpdate = columnToUpdate.tasks.find(
          (task: Task) => task._id === updatedTask._id
        )

        taskToUpdate = updatedTask

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
