import cookieParser from 'cookie-parser';
import express from 'express';

import passport from './config/passport.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Error handling
app.use(errorHandler);

export default app;
