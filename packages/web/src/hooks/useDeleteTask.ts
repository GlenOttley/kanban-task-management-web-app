import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../Context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Column, Task } from '@kanban/types'

function deleteTask(task: Task) {
  return axios.delete(`/api/tasks/${task._id}`)
}

export default function deleteTaskMutation() {
  const queryClient = useQueryClient()
  const { selectedBoardId, setToastDetails } = useContext(AppContext)

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (deletedTask) => {
      await queryClient.cancelQueries(['board', selectedBoardId])
      const previousBoardData: Board | undefined = queryClient.getQueryData([
        'board',
        selectedBoardId,
      ])
      queryClient.setQueryData(['board', previousBoardData?._id], (oldQueryData: any) => {
        const columnToUpdate = oldQueryData.columns.find(
          (column: Column) => column._id === deletedTask.columnId
        )
        columnToUpdate.tasks = columnToUpdate.tasks.filter(
          (task: Task) => task._id !== deletedTask._id
        )
        return oldQueryData
      })

      return { previousBoardData }
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData(['board'], context?.previousBoardData)
      setToastDetails({
        status: 'warning',
        message: 'Something went wrong, please refresh the page and try again',
      })
    },
    onSettled: () => {
      setToastDetails({ status: 'success', message: 'Task deleted successfully' })
      queryClient.invalidateQueries(['board'])
    },
  })
}
