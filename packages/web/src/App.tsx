import React from 'react'

const App = (): JSX.Element => {
  return (
    <div className='bg-red-50 sm:bg-red-100 md:bg-red-200 lg:bg-red-300 xl:bg-red-400'>
      <button className='btn btn-lg btn-primary'>Button Primary (L)</button>
      <button className='btn btn-sm btn-primary'>Button Primary (S)</button>
      <button className='btn btn-sm btn-secondary'>Button Secondary</button>
      <button className='btn btn-sm btn-desctructive'>Button Destructive</button>
    </div>
  )
}

export default App
