import React from 'react'

interface ComponentProps {
  name: string
  label: string
  placeholder?: string
}

const Input = ({ name, label, placeholder }: ComponentProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={name} className='body-md text-grey-medium'>
        {label}
      </label>
      <input
        type='text'
        id={name}
        name={name}
        placeholder={placeholder}
        className='px-4 py-2 border border-opacity-25 rounded-sm border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25'
      />
    </div>
  )
}

export default Input
