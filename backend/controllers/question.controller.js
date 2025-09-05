import Question from '../models/question.model.js';
import Answer from '../models/answer.model.js';

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private
export const createQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    const question = await Question.create({
      title,
      body,
      user: req.user._id,
      tags: tags || [],
    });

    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
export const getQuestions = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const count = await Question.countDocuments({});
    const questions = await Question.find({})
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      questions,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a question by ID
// @route   GET /api/questions/:id
// @access  Public
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('user', 'username')
      .populate({
        path: 'answers',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Question not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private
export const updateQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if the user is the owner of the question
    if (question.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    question.title = title || question.title;
    question.body = body || question.body;
    question.tags = tags || question.tags;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Question not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if the user is the owner of the question or an admin
    if (
      question.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete all answers associated with the question
    await Answer.deleteMany({ question: req.params.id });

    // Delete the question
    await Question.deleteOne({ _id: req.params.id });

    res.json({ message: 'Question removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Question not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Vote on a question
// @route   PUT /api/questions/:id/vote
// @access  Private
export const voteQuestion = async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const userId = req.user._id;
    const upvoteIndex = question.votes.upvotes.findIndex(
      (id) => id.toString() === userId.toString()
    );
    const downvoteIndex = question.votes.downvotes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    // Handle upvote
    if (voteType === 'upvote') {
      // If already upvoted, remove upvote (toggle)
      if (upvoteIndex !== -1) {
        question.votes.upvotes.splice(upvoteIndex, 1);
      } else {
        // Add upvote and remove downvote if exists
        question.votes.upvotes.push(userId);
        if (downvoteIndex !== -1) {
          question.votes.downvotes.splice(downvoteIndex, 1);
        }
      }
    }

    // Handle downvote
    if (voteType === 'downvote') {
      // If already downvoted, remove downvote (toggle)
      if (downvoteIndex !== -1) {
        question.votes.downvotes.splice(downvoteIndex, 1);
      } else {
        // Add downvote and remove upvote if exists
        question.votes.downvotes.push(userId);
        if (upvoteIndex !== -1) {
          question.votes.upvotes.splice(upvoteIndex, 1);
        }
      }
    }

    await question.save();

    res.json({
      upvotes: question.votes.upvotes.length,
      downvotes: question.votes.downvotes.length,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Question not found' });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};
