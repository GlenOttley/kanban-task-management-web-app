import React, { useState } from 'react'

const Demo = () => {
  const [selectedBoardId, setSelectedBoardId] = useState('initialId')

  return (
    <>
      <h1>{selectedBoardId}</h1>
      <button onClick={() => setSelectedBoardId('abc123')}>Click here</button>
    </>
  )
}

export default Demo
