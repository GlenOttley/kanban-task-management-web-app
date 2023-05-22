import React from 'react'
import useBoards from '../hooks/useBoards'

const Boards = () => {
  const { status, data: boards, error } = useBoards()

  console.log(boards)

  return (
    <>
      {status === 'loading' ? (
        <span>Loading...</span>
      ) : status === 'error' ? (
        <span>Error: {error?.message}</span>
      ) : (
        <>
          <div>
            {boards?.map((board) => (
              <div key={board._id}>{board.name}</div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default Boards
