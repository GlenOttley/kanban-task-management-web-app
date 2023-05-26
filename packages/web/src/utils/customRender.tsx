import React, { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { AppContext, type Context } from '../App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface ExtendedRenderOptions {
  providerProps: Context
}

const queryClient = new QueryClient()

const renderWithContext = (
  ui: ReactElement,
  { providerProps, ...renderOptions }: ExtendedRenderOptions
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>
    </QueryClientProvider>
  )
}

export default renderWithContext
