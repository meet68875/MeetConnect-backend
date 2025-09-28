import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';

dotenv.config();

const dummyUsersPath = path.resolve('scripts', 'dummyUsers.json');

console.log('Resolved Path:', dummyUsersPath);

let dummyUsers = [];
try {
    dummyUsers = JSON.parse(fs.readFileSync(dummyUsersPath, 'utf-8'));
} catch (error) {
    console.error('Error reading dummyUsers.json:', error);
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

const addUsers = async () => {
    try {
        await User.deleteMany();
        console.log('Existing users deleted.');

        const users = await User.insertMany(dummyUsers);
        console.log(`${users.length} users added to the database.`);
    } catch (error) {
        console.error('Error adding users:', error);
    }
};

const main = async () => {
    await connectDB();
    await addUsers();
    mongoose.connection.close();
};

// Run the script
main();