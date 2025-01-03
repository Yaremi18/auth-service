import User from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { createJWT } from '../utils/jwt.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = createJWT(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    user.password = undefined;

    res.status(200).json({
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signUp = async (req, res, next) => {
  try {
    const { email, password, name, lastName, birthday } = req.body;

    const user = new User({
      email,
      password,
      name,
      lastName,
      birthday,
    });

    const createdUser = await user.save();

    createdUser.password = undefined;

    res.status(201).json({
      data: {
        user: createdUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('jwt');
  res.json({
    message: 'Logout successful',
  });
};

export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new AppError('Invalid current password', 400);
    }

    if (currentPassword === newPassword) {
      throw new AppError(
        'The new password cannot be the same as the current password',
      );
    }

    user.password = newPassword;
    await user.save();
    user.password = undefined;

    res.json({
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
