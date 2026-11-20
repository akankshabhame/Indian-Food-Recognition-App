const User = require('../models/User');

// @route PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const updates = (({ name, avatarUrl, age, gender, heightCm, weightKg, goal, dailyTargets }) => ({
      name,
      avatarUrl,
      age,
      gender,
      heightCm,
      weightKg,
      goal,
      dailyTargets,
    }))(req.body);

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile };
