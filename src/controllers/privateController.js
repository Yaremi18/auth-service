import User from '../models/User.js';

const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}, { password: 0 }).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      data: {
        list: users,
        totalRecords: totalUsers,
        totalPages,
      },
    });
  } catch {
    next('An error ocurred while fetching users', 500);
  }
};

export { getUsers };
