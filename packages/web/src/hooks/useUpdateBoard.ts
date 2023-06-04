import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { Board } from 'packages/types/src'

const updateBoard = (formData: Board) => {
  return axios.patch(`/api/boards/${formData._id}`, formData)
}

export default function useUpdateBoard() {
  return useMutation({ mutationFn: updateBoard })
}
