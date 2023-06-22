import React, { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useToggleComplete from './useToggleComplete'
import nock from 'nock'
import axios from 'axios'
import { Board } from 'packages/types/src'

const mockedBoard: Board = {
  _id: '1',
  name: 'Test board',
  columns: [
    {
      _id: '1',
      name: 'Test column',
      tasks: [
        {
          _id: '1',
          title: 'Test task',
          description: '',
          status: 'Todo',
          column: '1',
          subtasks: [
            {
              _id: '1',
              title: 'Test subtask',
              isCompleted: true,
            },
          ],
        },
      ],
    },
  ],
}

interface WrapperProps {
  children: ReactNode
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        initialData: {
          ['boards']: [mockedBoard],
          ['board']: mockedBoard,
        },
      },
    },
  })
  console.log(queryClient.getQueryData(['board', '1']))
  return ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useToggleComplete', () => {
  it('calls the mutation function', async () => {
    const { result } = renderHook(() => useToggleComplete(), { wrapper: createWrapper() })
    // console.log(queryClient.getDefaultOptions().queries?.initialData)
    const baseURL = 'http://localhost:5000'
    axios.defaults.adapter = 'http'
    axios.defaults.baseURL = baseURL
    const nockRequest = nock(baseURL).patch('/api/tasks/1').reply(200, {})

    act(() => {
      result.current.mutate({
        taskId: '1',
        subtaskId: '1',
        columnId: '1',
      })
    })

    // await waitFor(() => expect(result.current.isSuccess).toBe(true))
    // await waitFor(() => console.log(nockRequest.isDone()))
  })
})
