const mongoose = require('mongoose');

const detectedItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Dal (Toor Dal)"
    preparation: { type: String, default: '' }, // e.g. "Stewed", "Baked"
    quantity: { type: String, default: '' }, // e.g. "1 cup", "1 medium"
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    cholesterol: { type: Number, default: 0 },
  },
  { _id: false }
);

const mealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Evening Snack', 'Dinner', 'Other'],
      default: 'Other',
    },
    detectedItems: [detectedItemSchema],
    totals: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
      sugar: { type: Number, default: 0 },
      sodium: { type: Number, default: 0 },
      cholesterol: { type: Number, default: 0 },
    },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

mealSchema.index({ user: 1, loggedAt: -1 });

module.exports = mongoose.model('Meal', mealSchema);
