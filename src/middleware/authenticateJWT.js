import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError.js';

const authenticateJWT = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) throw new AppError('Invalid or expired token', 403);
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};

export default authenticateJWT;
