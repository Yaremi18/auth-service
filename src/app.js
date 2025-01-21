import cookieParser from 'cookie-parser';
import express from 'express';

import passport from './config/passport.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import privateRoutes from './routes/privateRoutes.js';

const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/private', privateRoutes);

// Error handling
app.use(errorHandler);

export default app;
