import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Board } from 'types'

const fetchBoard = (boardId: string) => {
  return axios.get(`api/boards/${boardId}`).then((res) => res.data)
}

export default function useBoard(boardId: string) {
  return useQuery<Board, Error>(['board', boardId], () => fetchBoard(boardId))
}
