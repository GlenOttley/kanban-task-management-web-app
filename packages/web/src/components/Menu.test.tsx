import React from 'react'
import Menu from './Menu'
import { render, screen } from '../utils/customRender'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

describe('Menu', () => {
  it('renders a list of boards', async () => {
    render(<Menu />)
    const menuItems = await screen.findAllByRole('menuitem')
    expect(menuItems.length).toBeGreaterThanOrEqual(3)
  })

  it('closes the containing modal on click', async () => {
    const setModalOpen = vi.fn()
    render(<Menu setModalOpen={setModalOpen} />)
    const menuItems = await screen.findAllByRole('menuitem')
    await userEvent.click(menuItems[0])
    expect(setModalOpen).toHaveBeenCalledWith(false)
  })

  it('opens the create new board form on click', async () => {
    render(<Menu />)
    const newBoardButton = await screen.findByRole('button', {
      name: /create new board/i,
    })
    await userEvent.click(newBoardButton)
    const form = screen.getByRole('form')
    const formHeading = screen.getByText(/add new board/i)
    expect(form && formHeading).toBeInTheDocument()
  })

  it('opens the create new board form on enter key', async () => {
    render(<Menu />)
    const newBoardButton = await screen.findByRole('button', {
      name: /create new board/i,
    })
    newBoardButton.focus()
    await userEvent.keyboard('{enter}')
    const form = screen.getByRole('form')
    const formHeading = screen.getByText(/add new board/i)
    expect(form && formHeading).toBeInTheDocument()
  })
})
