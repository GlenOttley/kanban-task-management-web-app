import React from 'react'
import { render, screen } from '../utils/customRender'
import TaskDetail from './TaskDetail'

const task = {
  _id: '1',
  title: 'Build UI for onboarding flow',
  description: '',
  status: 'Todo',
  column: '647dd8ac93050499e86addc9',
  subtasks: [
    {
      _id: '1',
      title: 'Sign up page',
      isCompleted: true,
    },
    {
      _id: '2',
      title: 'Sign in page',
      isCompleted: false,
    },
    {
      _id: '3',
      title: 'Welcome page',
      isCompleted: false,
    },
  ],
}

describe('TaskDetail', () => {
  it('displays a list of subtasks', async () => {
    render(<TaskDetail task={task} />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
  })
})
