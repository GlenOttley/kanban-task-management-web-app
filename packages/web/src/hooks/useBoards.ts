import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Board } from 'types'

export default function useBoards() {
  return useQuery<Board[], Error>(['boards'], () =>
    axios.get('api/boards').then((res) => res.data)
  )
}
