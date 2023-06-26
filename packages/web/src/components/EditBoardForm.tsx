import React, { useRef, useState, useContext, useEffect } from 'react'
import { AppContext } from '../Context'
import { useForm, SubmitHandler, useFieldArray, FormProvider } from 'react-hook-form'
import IconCross from '../images/icon-cross.svg'
import useEditBoard from '../hooks/useEditBoard'
import useBoard from '../hooks/useBoard'

interface Inputs {
  _id: string
  name: string
  columns: { _id?: string; name: string }[]
}

const EditBoardForm = (): JSX.Element => {
  const { selectedBoardId, setEditBoardFormOpen } = useContext(AppContext)
  const { data: selectedBoard } = useBoard(selectedBoardId)
  const { mutate, isSuccess, isLoading } = useEditBoard()

  const [formFeedback, setFormFeedback] = useState<string>('')

  const formFeedbackRef = useRef<HTMLDivElement | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  const methods = useForm<Inputs>({
    defaultValues: {
      _id: selectedBoard?._id,
      name: selectedBoard?.name,
      columns: selectedBoard?.columns,
    },
    mode: 'onSubmit',
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
  } = methods

  const {
    fields: columns,
    append,
    remove,
  } = useFieldArray({
    name: 'columns',
    control,
    rules: {
      required: "Can't be empty",
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    mutate(formData)
  }

  useEffect(() => {
    if (isSuccess) {
      setEditBoardFormOpen(false)
    }
  }, [isSuccess])

  useEffect(() => {
    setFocus('name')
  }, [])

  return (
    <div className='w-full p-6 bg-white rounded-md dark:bg-grey-dark'>
      <form onSubmit={handleSubmit(onSubmit)} role='form'>
        <FormProvider {...methods}>
          <legend className='mb-6 heading-lg dark:text-white'>Edit Board</legend>
          <fieldset className='mb-3'>
            <div className='relative flex flex-col gap-2 mb-6'>
              <label htmlFor='name' className='body-md text-grey-medium dark:text-white'>
                Name
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
                id='name'
                placeholder='e.g. Web Design'
                aria-describedby='boardNameError'
                className={`px-4 py-2 bg-transparent border border-opacity-25 rounded-sm dark:text-white border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25 dark:placeholder:text-white
                  ${errors.name && 'error border-red !border-opacity-100'}`}
                {...register('name', { required: true })}
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
            {columns.map((column, index) => (
              <React.Fragment key={index}>
                <div className='flex flex-col gap-3 mb-3 '>
                  <div className='relative flex'>
                    {errors?.columns?.[index] && (
                      <span
                        className='absolute right-0 pr-11 top-2 body-lg text-red'
                        id={`columnNameError-${index}`}
                      >
                        Can't be empty
                      </span>
                    )}
                    <input
                      key={index}
                      type='text'
                      id={column.id}
                      aria-label='Column name'
                      aria-describedby={`columnNameError-${index}`}
                      placeholder='e.g. Todo'
                      className={`w-full dark:text-white px-4 py-2 bg-transparent border border-opacity-25 rounded-sm border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25
                        ${
                          errors?.columns?.[index] &&
                          'error border-red !border-opacity-100'
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
              // disabled={isLoading}
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
            Save Changes
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
        </FormProvider>
      </form>
    </div>
  )
}

export default EditBoardForm
