import express from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
} from '../controllers/question.controller.js';
import { createAnswer, getAnswers } from '../controllers/answer.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getQuestions).post(protect, createQuestion);

router
  .route('/:id')
  .get(getQuestionById)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

router.put('/:id/vote', protect, voteQuestion);

// Answer routes
router
  .route('/:questionId/answers')
  .get(getAnswers)
  .post(protect, createAnswer);

export default router;
