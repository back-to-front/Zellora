import Answer from '../models/answer.model.js';
import Question from '../models/question.model.js';

// @desc    Create a new answer for a question
// @route   POST /api/questions/:questionId/answers
// @access  Private
export const createAnswer = async (req, res) => {
  try {
    const { body } = req.body;
    const questionId = req.params.questionId;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Create the answer
    const answer = await Answer.create({
      body,
      user: req.user._id,
      question: questionId,
    });

    // Add answer to the question's answers array
    question.answers.push(answer._id);
    await question.save();

    // Populate user data
    const populatedAnswer = await Answer.findById(answer._id).populate(
      'user',
      'username'
    );

    res.status(201).json(populatedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all answers for a question
// @route   GET /api/questions/:questionId/answers
// @access  Public
export const getAnswers = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answers = await Answer.find({ question: questionId })
      .populate('user', 'username')
      .sort({ isAccepted: -1, createdAt: -1 });

    res.json(answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get an answer by ID
// @route   GET /api/answers/:id
// @access  Public
export const getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate(
      'user',
      'username'
    );

    if (answer) {
      res.json(answer);
    } else {
      res.status(404).json({ message: 'Answer not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Answer not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Update an answer
// @route   PUT /api/answers/:id
// @access  Private
export const updateAnswer = async (req, res) => {
  try {
    const { body } = req.body;

    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if the user is the owner of the answer
    if (answer.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    answer.body = body || answer.body;

    const updatedAnswer = await answer.save();
    res.json(updatedAnswer);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Answer not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Delete an answer
// @route   DELETE /api/answers/:id
// @access  Private
export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if the user is the owner of the answer or an admin
    if (
      answer.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Remove answer from question's answers array
    const question = await Question.findById(answer.question);
    if (question) {
      question.answers = question.answers.filter(
        (answerId) => answerId.toString() !== req.params.id.toString()
      );
      await question.save();
    }

    // Delete the answer
    await Answer.deleteOne({ _id: req.params.id });

    res.json({ message: 'Answer removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Answer not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Mark an answer as accepted
// @route   PUT /api/answers/:id/accept
// @access  Private
export const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Get the question to check if the current user is the question owner
    const question = await Question.findById(answer.question);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Only the question owner can accept an answer
    if (question.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'Only question owner can accept answers' });
    }

    // Unmark all other answers as accepted
    await Answer.updateMany({ question: question._id }, { isAccepted: false });

    // Mark this answer as accepted (or toggle if already accepted)
    answer.isAccepted = !answer.isAccepted;
    await answer.save();

    res.json({ isAccepted: answer.isAccepted });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Answer not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Vote on an answer
// @route   PUT /api/answers/:id/vote
// @access  Private
export const voteAnswer = async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'

    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const userId = req.user._id;
    const upvoteIndex = answer.votes.upvotes.findIndex(
      (id) => id.toString() === userId.toString()
    );
    const downvoteIndex = answer.votes.downvotes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    // Handle upvote
    if (voteType === 'upvote') {
      // If already upvoted, remove upvote (toggle)
      if (upvoteIndex !== -1) {
        answer.votes.upvotes.splice(upvoteIndex, 1);
      } else {
        // Add upvote and remove downvote if exists
        answer.votes.upvotes.push(userId);
        if (downvoteIndex !== -1) {
          answer.votes.downvotes.splice(downvoteIndex, 1);
        }
      }
    }

    // Handle downvote
    if (voteType === 'downvote') {
      // If already downvoted, remove downvote (toggle)
      if (downvoteIndex !== -1) {
        answer.votes.downvotes.splice(downvoteIndex, 1);
      } else {
        // Add downvote and remove upvote if exists
        answer.votes.downvotes.push(userId);
        if (upvoteIndex !== -1) {
          answer.votes.upvotes.splice(upvoteIndex, 1);
        }
      }
    }

    await answer.save();

    res.json({
      upvotes: answer.votes.upvotes.length,
      downvotes: answer.votes.downvotes.length,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Answer not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
