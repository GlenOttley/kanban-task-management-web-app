import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Board } from 'types'

export default function useBoard(boardId: string) {
  return useQuery<Board, Error>(['board', boardId], () =>
    axios.get(`api/boards/${boardId}`).then((res) => res.data)
  )
}
