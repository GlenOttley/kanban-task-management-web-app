import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../Context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Column, Task } from 'types'

function updateStatus(data: {
  taskId: string
  status: string
  column: string
  prevColumn: string
}) {
  const { taskId, status, column } = data
  return axios.patch(`/api/tasks/${taskId}/update-status`, {
    status,
    column,
  })
}

export default function toggleCompleteMutation() {
  const { selectedBoardId } = useContext(AppContext)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStatus,
    onMutate: async (updatedSubtask) => {
      await queryClient.cancelQueries(['board'], { exact: false })
      const previousBoardData: Board | undefined = queryClient.getQueryData([
        'board',
        selectedBoardId,
      ])
      queryClient.setQueryData(['board', previousBoardData?._id], (oldQueryData: any) => {
        const columnToUpdate = oldQueryData.columns.find(
          (column: Column) => column._id === updatedSubtask.prevColumn
        )
        const taskToUpdate = columnToUpdate.tasks.find(
          (task: Task) => task._id === updatedSubtask.taskId
        )

        taskToUpdate.status = status

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
