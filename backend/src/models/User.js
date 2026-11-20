const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatarUrl: { type: String, default: '' },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    heightCm: { type: Number },
    weightKg: { type: Number },
    goal: {
      type: String,
      enum: ['Lose Weight', 'Maintain Weight', 'Gain Weight', ''],
      default: '',
    },
    dailyTargets: {
      calories: { type: Number, default: 2000 },
      protein: { type: Number, default: 80 },
      carbs: { type: Number, default: 250 },
      fat: { type: Number, default: 60 },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
