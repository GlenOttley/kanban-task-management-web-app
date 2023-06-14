import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Column, Task, Subtask } from 'types'

function toggleComplete(data: { taskId: string; subtaskId: string; columnId: string }) {
  const { taskId, subtaskId } = data
  return axios.patch(`/api/tasks/${taskId}`, {
    subtaskId,
  })
}

export default function toggleCompleteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleComplete,
    onMutate: async (data) => {
      await queryClient.cancelQueries(['board'], { exact: false })
      const previousBoardData: Board | undefined = queryClient.getQueryData(['board'], {
        exact: false,
      })
      queryClient.setQueryData(
        ['board', previousBoardData?._id],
        (oldQueryData: any) => {}
      )
    },
  })
}
