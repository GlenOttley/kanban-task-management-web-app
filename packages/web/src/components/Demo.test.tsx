import React from 'react'
import renderWithContext from '../utils/customRender'
import { render, screen, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import Demo from './Demo'
import userEvent from '@testing-library/user-event'
import { AppContext } from '../App'

describe('Demo', () => {
  const mockSetSelectedBoardId = vi.fn()
  const selectedBoardId = 'initialId'

  it('updates the DOM with new state after calling setState', async () => {
    // renderWithContext(<Demo />, {
    //   providerProps: {
    //     selectedBoardId,
    //     setSelectedBoardId: mockSetSelectedBoardId,
    //   },
    // })
    render(<Demo />)

    const button = screen.getByRole('button')
    const heading = screen.getByRole('heading')

    expect(heading).toHaveTextContent('initialId')

    await userEvent.click(button)

    expect(heading).toHaveTextContent('abc123')
    // expect(mockSetSelectedBoardId).toHaveBeenCalledWith('abc123')
  })
})
