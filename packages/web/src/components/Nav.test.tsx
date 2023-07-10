import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '../utils/customRender'
import Nav from './Nav'
import nock from 'nock'
import axios from 'axios'
import { boardData } from 'data'

const baseURL = 'http://localhost:5000'
axios.defaults.adapter = 'http'
axios.defaults.baseURL = baseURL

describe('Nav', () => {
  const mockedBoards = nock(baseURL).get('/api/boards').reply(200, boardData)

  const platformLaunch = nock(baseURL)
    .get(`/api/boards/${boardData[0]._id}`)
    .reply(200, boardData[0])
    .persist()

  const marketingPlan = nock(baseURL)
    .get(`/api/boards/${boardData[1]._id}`)
    .reply(200, boardData[1])
    .persist()

  it('renders with the default board name', async () => {
    render(<Nav />)
    await screen.findByRole('button', { name: boardData[0].name })
  })

  it('displays menu component on click', async () => {
    render(<Nav />)
    const menuButton = screen.getByRole('button', { name: boardData[0].name })
    await userEvent.click(menuButton)
    screen.getByRole('menu')
  })

  it('displays menu component on enter key', async () => {
    render(<Nav />)
    const menuButton = screen.getByRole('button', { name: boardData[0].name })
    menuButton.focus()
    await userEvent.keyboard('{enter}')
    screen.getByRole('menu')
  })

  it('displays the updated board name on click', async () => {
    render(<Nav />)
    const menuButton = screen.getByRole('button', { name: boardData[0].name })
    await userEvent.click(menuButton)
    const itemToSelect = screen.getByRole('menuitem', { name: boardData[1].name })
    await userEvent.click(itemToSelect)
    await screen.findByRole('button', {
      name: boardData[1].name,
    })
  })

  it('changes the selected board on enter key', async () => {
    render(<Nav />)
    const menuButton = screen.getByRole('button', { name: boardData[0].name })
    await userEvent.click(menuButton)
    await userEvent.keyboard('{arrowDown}')
    await userEvent.keyboard('{enter}')
    await screen.findByRole('button', {
      name: boardData[1].name,
    })
  })
})
