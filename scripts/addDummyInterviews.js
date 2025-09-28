import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Interview from '../models/Interview.js';
import User from '../models/User.js';

dotenv.config();

const dummyInterviewsPath = path.resolve('scripts', 'dummyInterviews.json');

console.log('Resolved Path:', dummyInterviewsPath);

let dummyInterviews = [];
try {
  dummyInterviews = JSON.parse(fs.readFileSync(dummyInterviewsPath, 'utf-8'));
} catch (error) {
  console.error('Error reading dummyInterviews.json:', error);
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const addInterviews = async () => {
  try {
    // 1. Delete existing interviews
    await Interview.deleteMany();
    console.log('Existing interviews deleted.');

    const interviewsToAdd = [];
    for (const interview of dummyInterviews) {
      // 2. Find the user by the name provided in the dummy data
      const user = await User.findOne({ username: interview.username });

      if (user) {
        // 3. Create a new interview object with the user's _id and new fields
        const newInterview = {
          user: user._id,
          position: interview.position, // New field
          company: interview.company,   // New field
          interviewType: interview.interviewType,
          date: interview.date,
          interviewer: interview.interviewer,
          location: interview.location, // New field
          notes: interview.notes,     // New field
          status: interview.status,
          feedback: interview.feedback,
          score: interview.score,
          result: interview.result,
        };
        interviewsToAdd.push(newInterview);
      } else {
        console.warn(`User with name '${interview.username}' not found. Skipping interview.`);
      }
    }

    // 4. Insert the new interviews into the database
    const interviews = await Interview.insertMany(interviewsToAdd);
    console.log(`${interviews.length} interviews added to the database.`);

    // 5. Update the User documents to include the new interview IDs
    for (const interview of interviews) {
      await User.findByIdAndUpdate(
        interview.user,
        { $push: { interviews: interview._id } },
        { new: true }
      );
    }
    console.log('User documents updated with new interview references.');

  } catch (error) {
    console.error('Error adding interviews:', error);
  }
};

const main = async () => {
  await connectDB();
  await addInterviews();
  mongoose.connection.close();
};

main();