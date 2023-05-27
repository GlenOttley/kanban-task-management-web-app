import React from 'react'
import Menu from './Menu'
import { screen, waitFor, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import nock from 'nock'
import axios from 'axios'
import { boardData } from 'data'
import renderWithContext from '../utils/customRender'

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
    renderWithContext(<Menu />)
    await screen.findByText(boardData[0].name)
  })

  it('displays a list of boards on click', async () => {
    renderWithContext(<Menu />)
    const menuButton = screen.getByRole('button')
    await userEvent.click(menuButton)
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
  })

  it('displays a list of boards on enter key', async () => {
    renderWithContext(<Menu />)
    const menuButton = screen.getByRole('button')
    menuButton.focus()
    await userEvent.keyboard('{enter}')
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
  })

  it('changes the selected board on click', async () => {
    renderWithContext(<Menu />)
    const menuButton = screen.getByRole('button')
    await userEvent.click(menuButton)
    const itemToSelect = screen.getByRole('menuitem', { name: boardData[1].name })
    expect(itemToSelect).toBeInTheDocument()
    await userEvent.click(itemToSelect)
    await screen.findByRole('button', { name: boardData[1].name })
  })

  it('changes the selected board on enter key', async () => {
    renderWithContext(<Menu />)
    const menuButton = screen.getByRole('button')
    await userEvent.click(menuButton)
    await userEvent.keyboard('{arrowDown}')
    await userEvent.keyboard('{enter}')
    await screen.findByRole('button', { name: boardData[1].name })
  })
})
