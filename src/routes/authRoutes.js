import express from 'express';
import {
  changePassword,
  login,
  logout,
  signUp,
} from '../controllers/authController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';
import {
  validateChangePasswordInput,
  validateLoginInput,
  validateSignUpInput,
} from '../middleware/validations.js';

const router = express.Router();

router.post('/login', validateLoginInput, login);
router.post('/sign-up', validateSignUpInput, signUp);
router.post('/logout', logout);
router.post(
  '/change-password',
  authenticateJWT,
  validateChangePasswordInput,
  changePassword,
);

export default router;
