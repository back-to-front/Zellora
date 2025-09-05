import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
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
  },
  { timestamps: true }
);

// Virtual for vote count
questionSchema.virtual('voteCount').get(function () {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
