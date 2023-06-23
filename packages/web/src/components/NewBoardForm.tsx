import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useContext,
  useEffect,
} from 'react'
import { AppContext } from '../Context'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import IconCross from '../images/icon-cross.svg'
import useCreateBoard from '../hooks/useCreateBoard'
import useBoards from '../hooks/useBoards'

interface Column {
  name: string
}

interface Inputs {
  name: string
  columns: Column[]
}

const NewBoardForm = (): JSX.Element | null => {
  const {
    setSelectedBoardId,
    setToastDetails,
    newBoardFormOpen,
    setNewBoardFormOpen,
    setSidebarOpen,
  } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setFocus,
  } = useForm<Inputs>({
    defaultValues: {
      columns: [{ name: 'Todo' }, { name: 'Doing' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: 'columns',
    control,
    rules: {
      required: "Can't be empty",
    },
  })

  const { isLoading, isError, isSuccess, mutate, data: response } = useCreateBoard()
  const { refetch } = useBoards()

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    mutate(formData)
  }

  const [formFeedback, setFormFeedback] = useState<string>('')
  const formFeedbackRef = useRef<HTMLDivElement | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (isSuccess) {
      setSelectedBoardId(response.data._id)
      refetch()
      setToastDetails({ status: 'success', message: 'Board created' })
      setNewBoardFormOpen(false)
    }
  }, [isSuccess])

  useEffect(() => {
    setFocus('name')
    setSidebarOpen(false)
  }, [])

  if (newBoardFormOpen) {
    return (
      <div className='w-full p-6 rounded-md dark:bg-grey-dark'>
        <form onSubmit={handleSubmit(onSubmit)} role='form'>
          <legend className='mb-6 heading-lg dark:text-white'>Add New Board</legend>

          <fieldset className='mb-3'>
            <div className='relative flex flex-col gap-2 mb-3'>
              <label
                htmlFor='boardName'
                className='body-md text-grey-medium dark:text-white'
              >
                Board Name
              </label>
              {errors.name && (
                <span
                  className='absolute right-0 pr-4 top-8 body-lg text-red'
                  id='boardNameError'
                >
                  Can't be empty
                </span>
              )}
              <input
                type='text'
                id='boardName'
                placeholder='e.g. Web Design'
                aria-describedby='boardNameError'
                className={`px-4 py-2 bg-transparent border border-opacity-25 rounded-sm text-white border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25 dark:placeholder:text-white  
                ${errors.name && 'error border-red !border-opacity-100'}`}
                {...register('name', { required: true })}
                // ref={boardNameInputRef}
                onKeyDown={(e) => {
                  if (e.shiftKey && e.key === 'Tab') {
                    e.preventDefault()
                    submitButtonRef.current?.focus()
                  }
                }}
              />
            </div>
          </fieldset>

          <fieldset className='flex flex-col'>
            <legend className='pb-2 body-md text-grey-medium dark:text-white'>
              Board Columns
            </legend>
            {fields.map((column, index) => (
              <React.Fragment key={index}>
                <div className='flex flex-col gap-3 mb-3 '>
                  <div className='relative flex'>
                    {errors?.columns?.[index] && (
                      <span
                        className='absolute right-0 pr-11 top-2 body-lg text-red'
                        id={`boardNameError-${index}`}
                      >
                        Can't be empty
                      </span>
                    )}
                    <input
                      key={index}
                      type='text'
                      id={column.id}
                      aria-label='Column name'
                      aria-describedby={`boardNameError-${index}`}
                      className={`w-full text-white px-4 py-2 bg-transparent border border-opacity-25 rounded-sm border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25 
                      ${
                        errors?.columns?.[index] && 'error border-red !border-opacity-100'
                      }`}
                      {...register(`columns.${index}.name`, { required: true })}
                    />
                    <button
                      type='button'
                      className='p-3 -mr-3'
                      aria-label={`Remove ${column.name} column`}
                      onClick={() => {
                        remove(index)
                        setFormFeedback(`${column.name} column removed`)
                      }}
                    >
                      <img src={IconCross} alt='Remove item' />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
            <button
              type='button'
              disabled={isLoading}
              className='w-full mb-6 btn btn-sm btn-secondary'
              aria-label='Add new column'
              onClick={() => {
                append({ name: '' })
              }}
            >
              <span aria-hidden='true'>+</span> Add New Column
            </button>
          </fieldset>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full mb-6 btn btn-sm btn-primary'
            ref={submitButtonRef}
            onKeyDown={(e) => {
              if (!e.shiftKey && e.key === 'Tab') {
                e.preventDefault()
                setFocus('name')
              }
            }}
          >
            {isLoading ? '...Please Wait' : 'Create New Board'}
          </button>

          <div
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
            className='sr-only'
            ref={formFeedbackRef}
          >
            {formFeedback}
          </div>
        </form>
      </div>
    )
  } else {
    return null
  }
}

export default NewBoardForm
