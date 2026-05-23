import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { globalErrorHandler } from './middleware/error.middleware';
import { AppError } from './utils/AppError';
import authRouter from './routes/auth.routes'; // <-- Check this import path
import leadRouter from './routes/lead.routes';

dotenv.config();
const app: Application = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check point
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API Gateway operational.' });
});

// ====== CRITICAL: MIDDLEWARE ROUTE MOUNT POINTS ======
app.use('/api/v1/auth', authRouter);  // <-- Ensure this says exactly '/api/v1/auth'
app.use('/api/v1/leads', leadRouter);

// Express v5 Catch-All
app.all('*all', (req: Request, res: Response, next) => {
  next(new AppError(`Cannot find requested route profile: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;