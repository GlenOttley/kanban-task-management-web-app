import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../Context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Board } from '@kanban/types'

interface FormData {
  name: string
  columns: {
    name: string
  }[]
}

const createBoard = (formData: FormData) => {
  return axios.post('/api/boards', formData)
}

export default function useCreateBoard() {
  const { setToastDetails } = useContext(AppContext)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBoard,
    onMutate: async (newBoard: FormData) => {
      await queryClient.cancelQueries(['boards'])
      const previousBoardsData: Board | undefined = queryClient.getQueryData(['boards'])
      queryClient.setQueryData(['boards'], (oldQueryData: any) => {
        return { ...oldQueryData, newBoard }
      })

      return { previousBoardsData }
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData(['board'], context?.previousBoardsData)
      console.log(_error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['board'])
    },
    onSuccess: () => {
      setToastDetails({ status: 'success', message: 'Board created successfully' })
    },
  })
}
