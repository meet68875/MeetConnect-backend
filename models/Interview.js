import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    interviewType: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    interviewer: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    notes: String,
    feedback: String,
    score: Number,
    result: String,
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Canceled'],
      default: 'Upcoming',
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;