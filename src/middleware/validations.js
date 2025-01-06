import { body, validationResult } from 'express-validator';

import { AppError } from '../utils/appError.js';

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  next(new AppError('Validation failed', 400, errors.array()));
};

const baseCredentials = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    ),
];

export const validateLoginInput = validate(baseCredentials);

export const validateSignUpInput = validate([
  ...baseCredentials,
  body('name').notEmpty().withMessage('Name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('birthdate')
    .optional()
    .isDate()
    .withMessage('Invalid date for birthdate (YYYY-MM-DD)'),
]);

export const validateChangePasswordInput = validate([
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Current password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    ),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'New password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    ),
]);
