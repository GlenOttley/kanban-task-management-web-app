import React, { Dispatch, SetStateAction, useEffect } from 'react'

interface ComponentProps {
  selectedBoardId: string
  setSelectedBoardId: Dispatch<SetStateAction<string>>
}

const Demo = ({ selectedBoardId, setSelectedBoardId }: ComponentProps) => {
  useEffect(() => {
    console.log('component rendered')
  }, [selectedBoardId])

  return (
    <>
      <h1>{selectedBoardId}</h1>
      <button onClick={() => setSelectedBoardId('abc123')}>Click here</button>
    </>
  )
}

export default Demo
