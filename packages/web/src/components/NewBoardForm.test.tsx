import React from 'react'
import NewBoardForm from './NewBoardForm'
import Modal from './Modal'
import { render, screen } from '../utils/customRender'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

describe('Menu', () => {
  it('Should display error message if no board name is provided', async () => {
    const newBoardOpen = true
    const setNewBoardOpen = vi.fn(() => !newBoardOpen)
    render(
      <Modal open={newBoardOpen} setOpen={setNewBoardOpen}>
        <NewBoardForm setNewBoardOpen={setNewBoardOpen} />
      </Modal>
    )
    const submitButton = screen.getByRole('button', { name: /create new board/i })
    await userEvent.click(submitButton)
    const errorMessage = screen.getByText(/can't be empty/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('Should display error message if no column name is provided', async () => {
    const newBoardOpen = true
    const setNewBoardOpen = vi.fn(() => !newBoardOpen)
    render(
      <Modal open={newBoardOpen} setOpen={setNewBoardOpen}>
        <NewBoardForm setNewBoardOpen={setNewBoardOpen} />
      </Modal>
    )
    const nameField = screen.getByRole('textbox', { name: /board name/i })
    await userEvent.type(nameField, 'My new kanban board')
    const columnField = screen.getAllByRole('textbox', { name: /column name/i })
    await userEvent.clear(columnField[0])
    const submitButton = screen.getByRole('button', { name: /create new board/i })
    await userEvent.click(submitButton)
    const errorMessage = screen.getByText(/can't be empty/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('Should add a new column field if new column button is clicked', async () => {
    const newBoardOpen = true
    const setNewBoardOpen = vi.fn(() => !newBoardOpen)
    render(
      <Modal open={newBoardOpen} setOpen={setNewBoardOpen}>
        <NewBoardForm setNewBoardOpen={setNewBoardOpen} />
      </Modal>
    )
    const initialColumnFields = screen.getAllByRole('textbox', { name: /column name/i })
    const addColumnButton = screen.getByRole('button', { name: /add new column/i })
    await userEvent.click(addColumnButton)
    const updatedColumnFields = screen.getAllByRole('textbox', { name: /column name/i })
    expect(updatedColumnFields).toHaveLength(initialColumnFields.length + 1)
  })

  it('Should remove column field if remove column button is clicked', async () => {
    const newBoardOpen = true
    const setNewBoardOpen = vi.fn(() => !newBoardOpen)
    render(
      <Modal open={newBoardOpen} setOpen={setNewBoardOpen}>
        <NewBoardForm setNewBoardOpen={setNewBoardOpen} />
      </Modal>
    )
    const initialColumnFields = screen.getAllByRole('textbox', { name: /column name/i })
    const removeColumnButton = screen.getAllByLabelText(/remove .* column/i)
    await userEvent.click(removeColumnButton[0])
    const updatedColumnFields = screen.getAllByRole('textbox', { name: /column name/i })
    expect(updatedColumnFields).toHaveLength(initialColumnFields.length - 1)
  })

  // TODO fix and add more tests for 'board created'
  // it('Should create a new board', async () => {
  //   let newBoardOpen = true
  //   const setNewBoardOpen = vi.fn(() => (newBoardOpen = false))
  //   render(
  //     <Modal open={newBoardOpen} setOpen={setNewBoardOpen}>
  //       <NewBoardForm setNewBoardOpen={setNewBoardOpen} />
  //     </Modal>
  //   )
  //   const nameField = screen.getByRole('textbox', { name: /board name/i })
  //   await userEvent.type(nameField, 'My amazing kanban board')
  //   const submitButton = screen.getByRole('button', { name: /create new board/i })
  //   await userEvent.click(submitButton)
  //   expect(setNewBoardOpen).toHaveBeenCalledTimes(1)
  // })
})
