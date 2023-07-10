import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Board } from '@kanban/types'

const fetchBoards = () => {
  return axios.get('api/boards').then((res) => res.data)
}

export default function useBoards() {
  return useQuery<Board[], Error>(['boards'], fetchBoards)
}
