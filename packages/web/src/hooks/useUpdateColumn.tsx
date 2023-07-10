import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../Context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Task } from '@kanban/types'

interface MutationData {
  boardId: string
  columnId: string
  tasks: string[]
  prevColumnId?: string
  taskToRemove?: string
  status?: string
}

async function editColumn(data: MutationData) {
  const { boardId, columnId, tasks, prevColumnId, taskToRemove, status } = data
  return axios.patch(`/api/boards/${boardId}/update-column`, {
    columnId,
    tasks,
    prevColumnId,
    taskToRemove,
    status,
  })
}

export default function editTaskMutation() {
  const { setToastDetails } = useContext(AppContext)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editColumn,
    // onMutate: async (updatedColumn) => {
    //   await queryClient.cancelQueries(['board', updatedColumn._id])
    //   const previousBoardData: Board | undefined = queryClient.getQueryData([
    //     'board',
    //     updatedColumn._id,
    //   ])

    //   queryClient.setQueryData(['board', previousBoardData?._id], (oldQueryData: any) => {
    //     return { ...oldQueryData, name: updatedColumn.name, columns: updatedColumn.columns }
    //   })

    //   return { previousBoardData }
    // },
    // onError: (_error, _hero, context) => {
    //   queryClient.setQueryData(['board'], context?.previousBoardData)
    //   console.log(_error)
    // },
    // onSettled: () => {
    //   queryClient.invalidateQueries(['board'])
    // },
    // onSuccess: () => {
    //   setToastDetails({ status: 'success', message: 'Board updated successfully' })
    // },
  })
}
