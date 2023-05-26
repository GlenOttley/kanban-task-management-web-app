import React, { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useBoards from './useBoards'
import nock from 'nock'
import axios from 'axios'
import { boardData } from 'data'

const queryClient = new QueryClient()

interface WrapperProps {
  children: ReactNode
}

const wrapper = ({ children }: WrapperProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

const baseURL = 'http://localhost:5000'
axios.defaults.adapter = 'http'
axios.defaults.baseURL = baseURL

describe('useBoards', () => {
  const mockedBoards = nock(baseURL).get('/api/boards').reply(200, boardData)

  const { result } = renderHook(() => useBoards(), { wrapper })

  it('returns all boards', async () => {
    await waitFor(() =>
      expect(result.current.data && result.current.data).toHaveLength(boardData.length)
    )
    mockedBoards.done()
  })

  it('returns boards with correct properties', async () => {
    await waitFor(() =>
      expect(result.current.data && result.current.data[0].name).toBe(boardData[0].name)
    )
    mockedBoards.done()
  })
})
