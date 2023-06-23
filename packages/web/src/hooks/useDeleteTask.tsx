import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../Context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Column, Task } from 'types'

function deleteTask(task: Task) {
  return axios.delete(`/api/tasks/${task._id}`)
}

export default function deleteTaskMutation() {
  const queryClient = useQueryClient()
  const { selectedBoardId } = useContext(AppContext)

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (deletedTask) => {
      await queryClient.cancelQueries(['board', selectedBoardId])

      const previousBoardData: Board | undefined = queryClient.getQueryData([
        'board',
        selectedBoardId,
      ])

      const updatedBoardData = {
        ...previousBoardData,
        columns: previousBoardData?.columns?.map((column: Column) => {
          if (column._id === deletedTask.column) {
            const updatedTasks = column?.tasks?.filter(
              (task) => task._id !== deletedTask._id
            )
            return {
              ...column,
              tasks: updatedTasks,
            }
          }
          return column
        }),
      }

      queryClient.setQueryData(['board', previousBoardData?._id], updatedBoardData)
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
