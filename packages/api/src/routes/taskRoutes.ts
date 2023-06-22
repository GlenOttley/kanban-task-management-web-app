import { Router } from 'express'
import {
  toggleSubtaskComplete,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController'

const router = Router()

router.patch('/:id/toggle-subtask', toggleSubtaskComplete)
router.patch('/:id/update-status', updateTaskStatus)
router.delete('/:id', deleteTask)

export default router
