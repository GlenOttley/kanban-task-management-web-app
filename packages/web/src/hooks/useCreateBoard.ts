import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

const createBoard = (boardData: any) => {
  return axios.post('/api/boards', boardData)
}

export default function useCreateBoard() {
  return useMutation(createBoard)
}
