import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    votes: {
      upvotes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      downvotes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual for vote count
answerSchema.virtual('voteCount').get(function () {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
