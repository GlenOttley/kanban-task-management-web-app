import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../Context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board } from '@kanban/types'

function deleteBoard(boardId: string) {
  return axios.delete(`/api/boards/${boardId}`)
}

export default function deleteBoardMutation() {
  const queryClient = useQueryClient()
  const { selectedBoardId, setToastDetails } = useContext(AppContext)

  return useMutation({
    mutationFn: deleteBoard,
    onMutate: async (deletedBoardId) => {
      await queryClient.cancelQueries(['board', selectedBoardId])
      const previousBoardsData: Board[] | undefined = queryClient.getQueryData(['boards'])
      queryClient.setQueryData(['boards'], (oldQueryData: Board[] | undefined) => {
        oldQueryData?.filter((board: Board) => board._id !== deletedBoardId)
        return oldQueryData
      })

      return { previousBoardsData }
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData(['board'], context?.previousBoardsData)
      setToastDetails({
        status: 'warning',
        message: 'Something went wrong, please refresh the page and try again',
      })
    },
    onSettled: () => {
      setToastDetails({ status: 'success', message: 'Board deleted successfully' })
      queryClient.invalidateQueries(['boards'])
    },
  })
}
