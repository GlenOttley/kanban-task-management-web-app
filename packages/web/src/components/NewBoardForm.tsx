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

interface ComponentProps {
  setNewBoardOpen: Dispatch<SetStateAction<boolean>>
}
interface Column {
  name: string
}

interface Inputs {
  name: string
  columns: Column[]
}

const NewBoardForm = ({ setNewBoardOpen }: ComponentProps): JSX.Element => {
  const { setSelectedBoardId, setToastDetails } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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

  useEffect(() => {
    if (isSuccess) {
      setSelectedBoardId(response.data._id)
      refetch()
      setToastDetails({ status: 'success', message: 'Board created' })
      setNewBoardOpen(false)
    }
  }, [isSuccess])

  return (
    <div className='w-full p-6 rounded-md'>
      <form onSubmit={handleSubmit(onSubmit)} role='form'>
        <legend className='mb-6 heading-lg'>Add New Board</legend>

        <fieldset className='mb-3'>
          <div className='relative flex flex-col gap-2 mb-3'>
            <label htmlFor='boardName' className='body-sm text-grey-medium'>
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
              className={`px-4 py-2 border border-opacity-25 rounded-sm border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25 
              ${errors.name && 'error border-red !border-opacity-100'}`}
              {...register('name', { required: true })}
            />
          </div>
        </fieldset>

        <fieldset className='flex flex-col'>
          <legend className='pb-2 body-sm text-grey-medium'>Board Columns</legend>
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
                    className={`w-full px-4 py-2 border border-opacity-25 rounded-sm border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25 
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
}

export default NewBoardForm
