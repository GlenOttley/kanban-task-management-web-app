import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../Context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board, Task } from 'types'

interface FormData {
  _id: string
  name: string
  columns: {
    _id?: string
    name: string
    tasks: Task[]
  }[]
}

async function editBoard(data: FormData) {
  const { _id, name, columns } = data
  return axios.patch(`/api/boards/${_id}`, {
    name,
    columns,
  })
}

export default function editTaskMutation() {
  const { setToastDetails } = useContext(AppContext)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editBoard,
    onMutate: async (updatedBoard) => {
      await queryClient.cancelQueries(['board', updatedBoard._id])
      const previousBoardData: Board | undefined = queryClient.getQueryData([
        'board',
        updatedBoard._id,
      ])

      queryClient.setQueryData(['board', previousBoardData?._id], (oldQueryData: any) => {
        return { ...oldQueryData, name: updatedBoard.name, columns: updatedBoard.columns }
      })

      return { previousBoardData }
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData(['board'], context?.previousBoardData)
      console.log(_error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['board'])
    },
    onSuccess: () => {
      setToastDetails({ status: 'success', message: 'Board updated successfully' })
    },
  })
}
