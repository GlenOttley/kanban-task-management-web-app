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
    onMutate: async (updatedSubtask) => {
      await queryClient.cancelQueries(['board'], { exact: false })
      const previousBoardData: Board | undefined = queryClient.getQueryData(['board'], {
        exact: false,
      })
      queryClient.setQueryData(['board', previousBoardData?._id], (oldQueryData: any) => {
        const columnToUpdate = oldQueryData.columns.find(
          (column: Column) => column._id === updatedSubtask.columnId
        )
        const taskToUpdate = columnToUpdate.tasks.find(
          (task: Task) => task._id === updatedSubtask.taskId
        )
        const subtaskToUpdate = taskToUpdate.subtasks.find(
          (subtask: Subtask) => subtask._id === updatedSubtask.subtaskId
        )

        subtaskToUpdate.isCompleted = !subtaskToUpdate.isCompleted

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
