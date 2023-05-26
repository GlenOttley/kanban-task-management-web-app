import React from 'react'
import renderWithContext from '../utils/customRender'
import Menu from './Menu'
import { screen } from '@testing-library/react'
import nock from 'nock'
import axios from 'axios'
import { boardData } from 'data'

const baseURL = 'http://localhost:5000'
axios.defaults.adapter = 'http'
axios.defaults.baseURL = baseURL

describe('Menu', () => {
  const mockedBoards = nock(baseURL).get('/api/boards').reply(200, boardData)

  const mockedBoard = nock(baseURL)
    .get('/api/boards/646bed58f3f236e423e58f30')
    .reply(200, boardData[0])

  it('renders successfully', () => {
    renderWithContext(<Menu />, {
      providerProps: {
        selectedBoardId: '646bed58f3f236e423e58f30',
        setSelectedBoardId: () => {},
      },
    })
  })
})
