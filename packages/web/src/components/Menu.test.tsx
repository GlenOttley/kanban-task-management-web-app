import React from 'react'
import Menu from './Menu'
import { render, screen } from '../utils/customRender'
import userEvent from '@testing-library/user-event'
import nock from 'nock'
import axios from 'axios'
import { boardData } from 'data'

const baseURL = 'http://localhost:5000'
axios.defaults.adapter = 'http'
axios.defaults.baseURL = baseURL

describe('Menu', () => {
  const mockedBoards = nock(baseURL).get('/api/boards').reply(200, boardData)

  const platformLaunch = nock(baseURL)
    .get(`/api/boards/${boardData[0]._id}`)
    .reply(200, boardData[0])

  const marketingPlan = nock(baseURL)
    .get(`/api/boards/${boardData[1]._id}`)
    .reply(200, boardData[1])

  const roadmap = nock(baseURL)
    .get(`/api/boards/${boardData[2]._id}`)
    .reply(200, boardData[2])

  it('renders with the default board name', async () => {
    render(<Menu />)
    await screen.findByText(boardData[0].name)
  })

  it('displays a list of boards on click', async () => {
    render(<Menu />)
    const menuButton = screen.getByRole('button')
    await userEvent.click(menuButton)
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
  })

  it('displays a list of boards on enter key', async () => {
    render(<Menu />)
    const menuButton = screen.getByRole('button')
    menuButton.focus()
    await userEvent.keyboard('{enter}')
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
  })

  it('changes the selected board on click', async () => {
    render(<Menu />)
    const menuButton = screen.getByRole('button')
    await userEvent.click(menuButton)
    const itemToSelect = screen.getByRole('menuitem', { name: boardData[1].name })
    await userEvent.click(itemToSelect)
    const updatedMenuButton = await screen.findByRole('button', {
      name: boardData[1].name,
    })
    expect(updatedMenuButton).toBeInTheDocument()
  })

  it('changes the selected board on enter key', async () => {
    render(<Menu />)
    const menuButton = screen.getByRole('button')
    await userEvent.click(menuButton)
    await userEvent.keyboard('{arrowDown}')
    await userEvent.keyboard('{enter}')
    const updatedMenuButton = await screen.findByRole('button', {
      name: boardData[1].name,
    })
    expect(updatedMenuButton).toBeInTheDocument()
  })

  it('opens the create new board form on click', async () => {
    render(<Menu />)
    const menuButton = screen.getByRole('button')
    await userEvent.click(menuButton)
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
    const menuButton = screen.getByRole('button')
    menuButton.focus()
    await userEvent.keyboard('{enter}')
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
