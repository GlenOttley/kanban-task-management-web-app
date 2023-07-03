import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Column, Task } from 'types'

function updateStatus(data: {
  boardId: string
  prevColumnId: string
  newColumnId: string
  taskId: string
  status: string
}) {
  const { boardId, prevColumnId, newColumnId, taskId, status } = data
  return axios.patch(`/api/tasks/${taskId}/update-status`, {
    boardId,
    prevColumnId,
    newColumnId,
    status,
  })
}

export default function updateStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStatus,
    onMutate: async (updatedSubtask) => {
      await queryClient.cancelQueries(['board', updatedSubtask.boardId])
      const previousBoardData: Board | undefined = queryClient.getQueryData([
        'board',
        updatedSubtask.boardId,
      ])
      queryClient.setQueryData(['board', previousBoardData?._id], (oldQueryData: any) => {
        const columnToUpdate = oldQueryData.columns.find(
          (column: Column) => column._id === updatedSubtask.prevColumnId
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
