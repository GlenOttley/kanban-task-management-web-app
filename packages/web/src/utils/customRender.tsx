import React, { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Context from '../Context'

const queryClient = new QueryClient()

const renderWithContext = (ui: ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Context>{ui}</Context>
    </QueryClientProvider>
  )
}

export default renderWithContext
