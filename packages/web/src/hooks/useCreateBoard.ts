import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { Board } from 'packages/types/src'

const createBoard = (formData: any) => {
  return axios.post('/api/boards', formData)
}

export default function useCreateBoard() {
  return useMutation({ mutationFn: createBoard })
}
