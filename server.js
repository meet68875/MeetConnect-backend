import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet'; // ✅ import helmet
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ✅ Security headers
app.use(helmet()); // adds security headers automatically

// Middleware
app.use(express.json());

// ✅ Multiple origins support (if needed)
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ✅ (Optional) Log incoming headers to inspect
app.use((req, res, next) => {
  console.log('Incoming request headers:', req.headers);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/interviews', interviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
