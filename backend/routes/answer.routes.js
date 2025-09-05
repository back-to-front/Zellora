import express from 'express';
import {
  getAnswerById,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  voteAnswer,
} from '../controllers/answer.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router
  .route('/:id')
  .get(getAnswerById)
  .put(protect, updateAnswer)
  .delete(protect, deleteAnswer);

router.put('/:id/accept', protect, acceptAnswer);
router.put('/:id/vote', protect, voteAnswer);

export default router;
