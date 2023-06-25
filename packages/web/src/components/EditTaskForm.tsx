import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useContext,
  useEffect,
} from 'react'
import { AppContext } from '../Context'
import { useForm, SubmitHandler, useFieldArray, FormProvider } from 'react-hook-form'
import IconCross from '../images/icon-cross.svg'
import useEditTask from '../hooks/useEditTask'
import { Subtask } from 'packages/types/src'
import StatusMenuEdit from './StatusMenuEdit'

interface Inputs {
  _id: string
  title: string
  description: string
  subtasks: Partial<Subtask>[]
  status: string
  column: string
  prevColumn: string
}

const EditTaskForm = (): JSX.Element => {
  const { selectedTask } = useContext(AppContext)
  const { mutate } = useEditTask()

  const [formFeedback, setFormFeedback] = useState<string>('')

  const formFeedbackRef = useRef<HTMLDivElement | null>(null)
  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  const methods = useForm<Inputs>({
    defaultValues: {
      _id: selectedTask._id,
      title: selectedTask.title,
      description: selectedTask.description,
      status: selectedTask.status,
      subtasks: selectedTask.subtasks,
      column: selectedTask.column,
      prevColumn: selectedTask.column,
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
    fields: subtasks,
    append,
    remove,
  } = useFieldArray({
    name: 'subtasks',
    control,
    rules: {
      required: "Can't be empty",
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    mutate(formData)
  }

  return (
    <div className='w-full p-6 bg-white rounded-md dark:bg-grey-dark'>
      <form onSubmit={handleSubmit(onSubmit)} role='form'>
        <FormProvider {...methods}>
          <legend className='mb-6 heading-lg dark:text-white'>Edit Task</legend>
          <fieldset className='mb-3'>
            <div className='relative flex flex-col gap-2 mb-6'>
              <label htmlFor='title' className='body-md text-grey-medium dark:text-white'>
                Title
              </label>
              {errors.title && (
                <span
                  className='absolute right-0 pr-4 top-8 body-lg text-red'
                  id='titleError'
                >
                  Can't be empty
                </span>
              )}
              <input
                type='text'
                id='title'
                placeholder='e.g. Take coffee break'
                aria-describedby='titleError'
                className={`px-4 py-2 bg-transparent border border-opacity-25 rounded-sm dark:text-white border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25 dark:placeholder:text-white
                  ${errors.title && 'error border-red !border-opacity-100'}`}
                {...register('title', { required: true })}
                // onKeyDown={(e) => {
                //   if (e.shiftKey && e.key === 'Tab') {
                //     e.preventDefault()
                //     submitButtonRef.current?.focus()
                //   }
                // }}
              />
            </div>
            <div className='relative flex flex-col gap-2 mb-3'>
              <label
                htmlFor='description'
                className='body-md text-grey-medium dark:text-white'
              >
                Description
              </label>
              {/* {errors.description && (
                <span
                  className='absolute right-0 pr-4 top-8 body-lg text-red'
                  id='descriptionError'
                >
                  Can't be empty
                </span>
              )} */}
              <textarea
                id='description'
                placeholder='e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.'
                aria-describedby='descriptionError'
                rows={3}
                className={`px-4 py-2 bg-transparent border border-opacity-25 rounded-sm dark:text-white border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25 dark:placeholder:text-white
                  ${errors.description && 'error border-red !border-opacity-100'}`}
                {...register('description', { required: false })}
                // onKeyDown={(e) => {
                //   if (e.shiftKey && e.key === 'Tab') {
                //     e.preventDefault()
                //     submitButtonRef.current?.focus()
                //   }
                // }}
              />
            </div>
          </fieldset>
          <fieldset className='flex flex-col'>
            <legend className='pb-2 body-md text-grey-medium dark:text-white'>
              Subtasks
            </legend>
            {subtasks.map((subtask, index) => (
              <React.Fragment key={index}>
                <div className='flex flex-col gap-3 mb-3 '>
                  <div className='relative flex'>
                    {errors?.subtasks?.[index] && (
                      <span
                        className='absolute right-0 pr-11 top-2 body-lg text-red'
                        id={`subtaskError-${index}`}
                      >
                        Can't be empty
                      </span>
                    )}
                    <input
                      key={index}
                      type='text'
                      id={subtask.id}
                      aria-label='Subtask title'
                      aria-describedby={`boardNameError-${index}`}
                      className={`w-full dark:text-white px-4 py-2 bg-transparent border border-opacity-25 rounded-sm border-grey-medium body-lg placeholder:body-lg placeholder:text-black placeholder:opacity-25
                        ${
                          errors?.subtasks?.[index] &&
                          'error border-red !border-opacity-100'
                        }`}
                      {...register(`subtasks.${index}.title`, { required: true })}
                    />
                    <button
                      type='button'
                      className='p-3 -mr-3'
                      aria-label={`Remove ${subtask.title} subtask`}
                      onClick={() => {
                        remove(index)
                        setFormFeedback(`${subtask.title} subtask removed`)
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
              aria-label='Add new subtask'
              onClick={() => {
                append({ title: '', isCompleted: false })
              }}
            >
              <span aria-hidden='true'>+</span> Add New Subtask
            </button>
          </fieldset>
          <fieldset className='mb-3'>
            <div className='relative flex flex-col gap-2 mb-3'>
              <StatusMenuEdit nextItemRef={submitButtonRef} />
            </div>
          </fieldset>
          <button
            type='submit'
            // disabled={isLoading}
            className='w-full mb-6 btn btn-sm btn-primary'
            ref={submitButtonRef}
            onKeyDown={(e) => {
              if (!e.shiftKey && e.key === 'Tab') {
                e.preventDefault()
                setFocus('title')
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

export default EditTaskForm
